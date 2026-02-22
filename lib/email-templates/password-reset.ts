const translations: Record<
  string,
  {
    subject: string;
    heading: string;
    greeting: string;
    body: string;
    cta: string;
    expiry: string;
    ignore: string;
    footer: string;
  }
> = {
  en: {
    subject: "Reset your Lordaeron password",
    heading: "Password Reset",
    greeting: "Hello,",
    body: "You requested a password reset for your Lordaeron account. Click the button below to choose a new password.",
    cta: "Reset Password",
    expiry: "This link will expire in 1 hour.",
    ignore:
      "If you did not request this, you can safely ignore this email. Your password will not be changed.",
    footer: "This email was sent by Lordaeron. Do not reply to this email.",
  },
  fr: {
    subject: "Réinitialiser votre mot de passe Lordaeron",
    heading: "Réinitialisation du mot de passe",
    greeting: "Bonjour,",
    body: "Vous avez demandé une réinitialisation de mot de passe pour votre compte Lordaeron. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.",
    cta: "Réinitialiser le mot de passe",
    expiry: "Ce lien expirera dans 1 heure.",
    ignore:
      "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité. Votre mot de passe ne sera pas modifié.",
    footer:
      "Cet e-mail a été envoyé par Lordaeron. Ne répondez pas à cet e-mail.",
  },
  es: {
    subject: "Restablecer tu contraseña de Lordaeron",
    heading: "Restablecimiento de contraseña",
    greeting: "Hola,",
    body: "Solicitaste un restablecimiento de contraseña para tu cuenta de Lordaeron. Haz clic en el botón de abajo para elegir una nueva contraseña.",
    cta: "Restablecer contraseña",
    expiry: "Este enlace expirará en 1 hora.",
    ignore:
      "Si no solicitaste esto, puedes ignorar este correo de forma segura. Tu contraseña no será cambiada.",
    footer:
      "Este correo fue enviado por Lordaeron. No respondas a este correo.",
  },
  de: {
    subject: "Lordaeron-Passwort zurücksetzen",
    heading: "Passwort zurücksetzen",
    greeting: "Hallo,",
    body: "Du hast eine Passwortzurücksetzung für dein Lordaeron-Konto angefordert. Klicke auf den Button unten, um ein neues Passwort zu wählen.",
    cta: "Passwort zurücksetzen",
    expiry: "Dieser Link läuft in 1 Stunde ab.",
    ignore:
      "Wenn du dies nicht angefordert hast, kannst du diese E-Mail ignorieren. Dein Passwort wird nicht geändert.",
    footer:
      "Diese E-Mail wurde von Lordaeron gesendet. Antworte nicht auf diese E-Mail.",
  },
  it: {
    subject: "Reimposta la tua password di Lordaeron",
    heading: "Reimpostazione password",
    greeting: "Ciao,",
    body: "Hai richiesto un ripristino della password per il tuo account Lordaeron. Clicca il pulsante qui sotto per scegliere una nuova password.",
    cta: "Reimposta password",
    expiry: "Questo link scadrà tra 1 ora.",
    ignore:
      "Se non hai richiesto questo, puoi ignorare questa email in sicurezza. La tua password non verrà modificata.",
    footer:
      "Questa email è stata inviata da Lordaeron. Non rispondere a questa email.",
  },
};

export function getPasswordResetEmail(
  locale: string,
  resetUrl: string,
): { subject: string; html: string } {
  const t = translations[locale] || translations.en;

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#050810;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050810;padding:40px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
      <!-- Header -->
      <tr><td style="text-align:center;padding:32px 0 24px;">
        <h1 style="margin:0;font-size:28px;font-weight:900;letter-spacing:4px;color:#c79c3e;">LORDAERON</h1>
      </td></tr>
      <!-- Card -->
      <tr><td style="background-color:#0a0e14;border:1px solid rgba(199,156,62,0.2);border-radius:12px;padding:40px 32px;">
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#e2d5b5;">${t.heading}</h2>
        <div style="width:48px;height:2px;background:linear-gradient(90deg,#c79c3e,#e8c767);margin:0 0 24px;border-radius:1px;"></div>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#b0aaa0;">${t.greeting}</p>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#b0aaa0;">${t.body}</p>
        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0 0 28px;">
          <a href="${resetUrl}" target="_blank" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#c79c3e,#e8c767);color:#0a0e14;font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;letter-spacing:0.5px;">${t.cta}</a>
        </td></tr></table>
        <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#706a60;">${t.expiry}</p>
        <p style="margin:0 0 20px;font-size:13px;line-height:1.5;color:#706a60;">${t.ignore}</p>
        <!-- Fallback link -->
        <div style="border-top:1px solid rgba(199,156,62,0.1);padding-top:16px;">
          <p style="margin:0;font-size:12px;color:#555;word-break:break-all;">
            <a href="${resetUrl}" style="color:#6cb4ee;text-decoration:none;">${resetUrl}</a>
          </p>
        </div>
      </td></tr>
      <!-- Footer -->
      <tr><td style="text-align:center;padding:24px 0 0;">
        <p style="margin:0;font-size:12px;color:#444;">${t.footer}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  return { subject: t.subject, html };
}
