# Command Scheduler (Cron Jobs)

Scheduled tasks for the Lordaeron website, configured via **crontab** on Ubuntu.

## Prerequisites

```bash
sudo apt install curl cron
sudo systemctl enable cron
sudo systemctl start cron
```

## Environment

| Variable | Description |
|---|---|
| `CRON_SECRET` | Bearer token defined in `.env.local` |
| `APP_URL` | Base URL of the running Next.js app |

## Jobs

### Retry Pending Deliveries

Retries SOAP delivery for purchases stuck in `pending_delivery` status (server was offline at purchase time).

| | |
|---|---|
| **Endpoint** | `GET /api/shop/cron/retry-deliveries` |
| **Auth** | `Authorization: Bearer <CRON_SECRET>` |
| **Frequency** | Every 5 minutes |
| **Log** | `/var/log/lordaeron/retry-deliveries.log` |

### Rotate Daily Highlights

Picks 1 random active item from each of the 7 categories (bags, heirlooms, transmog, mounts, tabards, pets, toys) and assigns a random discount (10%, 20%, or 30%). Resets previous highlights first.

| | |
|---|---|
| **Endpoint** | `GET /api/shop/cron/rotate-highlights` |
| **Auth** | `Authorization: Bearer <CRON_SECRET>` |
| **Frequency** | Daily at midnight |
| **Log** | `/var/log/lordaeron/rotate-highlights.log` |

## Setup

### 1. Create log directory

```bash
sudo mkdir -p /var/log/lordaeron
sudo chown $USER:$USER /var/log/lordaeron
```

### 2. Edit crontab

```bash
crontab -e
```

Add the following lines:

```cron
# ── Lordaeron Website Cron Jobs ──

# Retry pending deliveries every 5 minutes
*/5 * * * * curl -sf -H "Authorization: Bearer dev-cron-secret-2024" http://localhost:3000/api/shop/cron/retry-deliveries >> /var/log/lordaeron/retry-deliveries.log 2>&1

# Rotate daily highlights at midnight
0 0 * * * curl -sf -H "Authorization: Bearer dev-cron-secret-2024" http://localhost:3000/api/shop/cron/rotate-highlights >> /var/log/lordaeron/rotate-highlights.log 2>&1
```

> Replace `dev-cron-secret-2024` with your production `CRON_SECRET` and `localhost:3000` with your production URL.

### 3. Verify

```bash
# Check crontab is registered
crontab -l

# Manual test
curl -s -H "Authorization: Bearer dev-cron-secret-2024" http://localhost:3000/api/shop/cron/retry-deliveries

# Expected response:
# {"processed":0,"succeeded":0,"failed":0}

# Watch logs
tail -f /var/log/lordaeron/retry-deliveries.log
```

### 4. Log rotation (optional)

```bash
sudo tee /etc/logrotate.d/lordaeron <<EOF
/var/log/lordaeron/*.log {
    weekly
    rotate 4
    compress
    missingok
    notifempty
}
EOF
```
