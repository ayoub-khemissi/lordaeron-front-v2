# Installation Guide — Ubuntu 24.04 LTS

Complete guide to deploy the Lordaeron website on a fresh Ubuntu 24.04 server.

## Prerequisites

- Ubuntu 24.04 LTS (server or desktop)
- A running [TrinityCore](https://www.trinitycore.org/) 3.3.5a server (auth + characters databases)
- A domain name pointed to your server (optional, for production)

## 1. System packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential cron
```

## 2. Node.js (v20 LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v20.x.x
```

## 3. pnpm

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm -v
```

## 4. MySQL 8

Skip this step if your TrinityCore server already provides a MySQL instance you can reach from this machine.

```bash
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
```

### Create the website database and user

```bash
sudo mysql
```

```sql
CREATE DATABASE lordaeron_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'lordaeron'@'localhost' IDENTIFIED BY '<STRONG_PASSWORD>';

-- Website database (full access)
GRANT ALL PRIVILEGES ON lordaeron_website.* TO 'lordaeron'@'localhost';

-- TrinityCore auth database (SELECT for login, INSERT for registration, UPDATE for password reset/change)
GRANT SELECT, INSERT, UPDATE ON auth.* TO 'lordaeron'@'localhost';

-- TrinityCore characters database (SELECT for character lists, DELETE for shop refunds)
GRANT SELECT, DELETE ON characters.* TO 'lordaeron'@'localhost';

FLUSH PRIVILEGES;
EXIT;
```

> Adjust database names (`auth`, `characters`) if your TrinityCore setup uses different names.

## 5. Clone the repository

```bash
cd /opt
sudo mkdir lordaeron && sudo chown $USER:$USER lordaeron
git clone <REPO_URL> /opt/lordaeron/front
cd /opt/lordaeron/front
```

## 6. Install dependencies

```bash
pnpm install
```

## 7. Environment variables

```bash
cp .env.example .env.local   # or create manually
nano .env.local
```

Fill in all required values:

```env
# ── App ──
NEXT_PUBLIC_BASE_URL=https://www.lordaeron.eu

# ── Auth database (TrinityCore) ──
DB_AUTH_HOST=localhost
DB_AUTH_PORT=3306
DB_AUTH_USER=lordaeron
DB_AUTH_PASSWORD=<PASSWORD>
DB_AUTH_NAME=auth

# ── Characters database (TrinityCore) ──
DB_CHARACTERS_HOST=localhost
DB_CHARACTERS_PORT=3306
DB_CHARACTERS_USER=lordaeron
DB_CHARACTERS_PASSWORD=<PASSWORD>
DB_CHARACTERS_NAME=characters

# ── Website database ──
DB_WEBSITE_HOST=localhost
DB_WEBSITE_PORT=3306
DB_WEBSITE_USER=lordaeron
DB_WEBSITE_PASSWORD=<PASSWORD>
DB_WEBSITE_NAME=lordaeron_website

# ── WoW SOAP (for in-game deliveries) ──
SOAP_HOST=127.0.0.1
SOAP_PORT=7878
SOAP_USERNAME=<GM_ACCOUNT>
SOAP_PASSWORD=<GM_PASSWORD>

# ── JWT ──
JWT_SECRET=<RANDOM_64_CHAR_STRING>

# ── Cron ──
CRON_SECRET=<RANDOM_TOKEN>

# ── SMTP (emails) ──
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<SMTP_USER>
SMTP_PASSWORD=<SMTP_PASSWORD>
SMTP_FROM=Lordaeron <no-reply@lordaeron.eu>

# ── Stripe (payments) ──
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Generate a secure JWT secret:

```bash
openssl rand -hex 32
```

## 8. Initialize the website database

Import the schema into the `lordaeron_website` database:

```bash
mysql -u lordaeron -p lordaeron_website < sql/schema.sql
```

### Import shop data

The shop SQL files contain `DROP TABLE` statements that conflict with foreign keys created by the schema. Disable FK checks during import:

```bash
mysql -u lordaeron -p lordaeron_website -e "SET FOREIGN_KEY_CHECKS=0; SOURCE sql/shop_items.sql; SET FOREIGN_KEY_CHECKS=1;"
mysql -u lordaeron -p lordaeron_website -e "SET FOREIGN_KEY_CHECKS=0; SOURCE sql/shop_sets.sql; SET FOREIGN_KEY_CHECKS=1;"
mysql -u lordaeron -p lordaeron_website -e "SET FOREIGN_KEY_CHECKS=0; SOURCE sql/shop_set_items.sql; SET FOREIGN_KEY_CHECKS=1;"
```

### Seed data

The `sql/seed.sql` file contains entries for **two** databases:

1. **`lordaeron_website`** — admin account for the shop back-office
2. **`auth`** (TrinityCore) — SOAP account used for in-game deliveries

Import them separately:

```bash
# Admin account → lordaeron_website
mysql -u lordaeron -p lordaeron_website < sql/seed.sql   # only the INSERT into shop_admins will apply

# SOAP account → auth (requires a user with write access to auth)
mysql -u trinity -p auth -e "SOURCE sql/seed.sql;"       # only the INSERT into account/account_access will apply
```

> Alternatively, run the relevant `INSERT` statements from `sql/seed.sql` manually against each database.

## 9. Build and start

```bash
pnpm build
pnpm start
```

The app listens on `http://localhost:3000` by default.

## 10. Process manager (PM2)

Keep the app running after SSH disconnect and auto-restart on crash/reboot.

```bash
sudo npm install -g pm2

cd /opt/lordaeron/front
pm2 start pnpm --name lordaeron -- start
pm2 save
pm2 startup   # follow the printed command to enable on boot
```

Useful commands:

```bash
pm2 logs lordaeron      # live logs
pm2 restart lordaeron    # restart
pm2 stop lordaeron       # stop
pm2 monit                # dashboard
```

## 11. Reverse proxy (Nginx)

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

Create the site config:

```bash
sudo nano /etc/nginx/sites-available/lordaeron
```

```nginx
server {
    listen 80;
    server_name www.lordaeron.eu lordaeron.eu;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/lordaeron /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 12. SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d lordaeron.eu -d www.lordaeron.eu
```

Certbot auto-renews via systemd timer. Verify:

```bash
sudo certbot renew --dry-run
```

## 13. Cron jobs

See [COMMAND_SCHEDULER.md](./COMMAND_SCHEDULER.md) for full details.

Quick setup:

```bash
# Create log directory
sudo mkdir -p /var/log/lordaeron
sudo chown $USER:$USER /var/log/lordaeron

# Enable cron
sudo systemctl enable cron && sudo systemctl start cron

# Edit crontab
crontab -e
```

Add:

```cron
# Retry pending SOAP deliveries every 5 minutes
*/5 * * * * curl -sf -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/shop/cron/retry-deliveries >> /var/log/lordaeron/retry-deliveries.log 2>&1

# Rotate daily shop highlights at midnight
0 0 * * * curl -sf -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/shop/cron/rotate-highlights >> /var/log/lordaeron/rotate-highlights.log 2>&1
```

## 14. Stripe webhook (production)

Register your webhook endpoint in the [Stripe Dashboard](https://dashboard.stripe.com/webhooks):

- **URL**: `https://www.lordaeron.eu/api/stripe/webhook`
- **Events**: `checkout.session.completed`

Copy the signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local` and restart the app.

## 15. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

> Do **not** expose port 3000 directly. Nginx handles all public traffic.

## 16. Updates

```bash
cd /opt/lordaeron/front
git pull
pnpm install
pnpm build
pm2 restart lordaeron
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| `ECONNREFUSED` on DB | Check MySQL is running: `sudo systemctl status mysql` |
| SOAP delivery fails | Verify worldserver is running and SOAP is enabled in `worldserver.conf` (`SOAP.Enabled = 1`) |
| 502 Bad Gateway | App crashed — check `pm2 logs lordaeron` |
| Cron not firing | Verify with `crontab -l` and check `/var/log/lordaeron/` |
| Stripe webhook 400 | Ensure `STRIPE_WEBHOOK_SECRET` matches the Stripe dashboard signing secret |
