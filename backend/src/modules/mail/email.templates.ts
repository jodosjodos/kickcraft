import type { Order } from '../orders/order.entity';

const PRIMARY = '#e07b39';
const DARK = '#111111';
const GRAY = '#6b7280';
const LIGHT_BG = '#f9f9f9';
const BORDER = '#e5e7eb';

function base(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${LIGHT_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${LIGHT_BG};padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border:1px solid ${BORDER};">

          <!-- Header -->
          <tr>
            <td style="background-color:${DARK};padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:900;letter-spacing:0.08em;color:#ffffff;text-transform:uppercase;">KICK</span><span style="font-size:22px;font-weight:900;letter-spacing:0.08em;color:${PRIMARY};text-transform:uppercase;">CRAFT</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Orange accent bar -->
          <tr>
            <td style="height:4px;background-color:${PRIMARY};"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid ${BORDER};background-color:${LIGHT_BG};">
              <p style="margin:0;font-size:12px;color:${GRAY};line-height:1.6;">
                This email was sent by Kickcraft · Kigali, Rwanda<br/>
                If you did not request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
    <tr>
      <td style="background-color:${PRIMARY};border-radius:2px;">
        <a href="${href}" style="display:inline-block;padding:14px 32px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#ffffff;text-decoration:none;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function fallbackLink(href: string): string {
  return `<p style="margin:20px 0 0;font-size:12px;color:${GRAY};">Or paste this link in your browser:<br/>
    <a href="${href}" style="color:${PRIMARY};word-break:break-all;">${href}</a>
  </p>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 8px;font-size:26px;font-weight:900;letter-spacing:-0.02em;color:${DARK};text-transform:uppercase;">${text}</h1>`;
}

function subtext(text: string): string {
  return `<p style="margin:0 0 0;font-size:15px;color:${GRAY};line-height:1.6;">${text}</p>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 16px;font-size:13px;font-weight:600;color:${DARK};border-bottom:1px solid ${BORDER};width:140px;">${label}</td>
    <td style="padding:10px 16px;font-size:13px;color:${GRAY};border-bottom:1px solid ${BORDER};">${value}</td>
  </tr>`;
}

// ─── Auth Templates ───────────────────────────────────────────────────────────

export function verificationTemplate(link: string): string {
  const body = `
    ${heading('Verify Your Email')}
    ${subtext("You're almost there. Click the button below to verify your email address and activate your Kickcraft account.")}
    ${ctaButton(link, 'Verify Email')}
    ${fallbackLink(link)}
  `;
  return base('Verify your Kickcraft email', body);
}

export function welcomeTemplate(name: string): string {
  const firstName = name.split(' ')[0];
  const body = `
    ${heading(`Welcome, ${firstName}`)}
    ${subtext('Your Kickcraft account is active. Browse the freshest kicks in Kigali — from hype drops to everyday classics.')}
    ${ctaButton('https://kickcraft.com', 'Start Shopping')}
    <p style="margin:24px 0 0;font-size:13px;color:${GRAY};line-height:1.6;">
      Pay securely with MTN MoMo · Fast delivery across Kigali
    </p>
  `;
  return base('Welcome to Kickcraft', body);
}

export function passwordResetTemplate(link: string): string {
  const body = `
    ${heading('Reset Password')}
    ${subtext('We received a request to reset your password. Click the button below — this link expires in <strong style="color:${DARK};">1 hour</strong>.')}
    ${ctaButton(link, 'Reset Password')}
    ${fallbackLink(link)}
    <p style="margin:24px 0 0;font-size:13px;color:${GRAY};">If you didn't request this, your account is safe — just ignore this email.</p>
  `;
  return base('Reset your Kickcraft password', body);
}

export function passwordChangeConfirmTemplate(
  link: string,
  name: string,
): string {
  const firstName = name.split(' ')[0];
  const body = `
    ${heading('Confirm Password Change')}
    ${subtext(`Hi ${firstName}, someone requested to change the password on your account. Click the button below to confirm — this link expires in <strong style="color:${DARK};">1 hour</strong>.`)}
    ${ctaButton(link, 'Confirm Change')}
    ${fallbackLink(link)}
    <p style="margin:24px 0 0;font-size:13px;color:${GRAY};">Didn't request this? Your password is still the same. Consider reviewing your account security.</p>
  `;
  return base('Confirm your password change', body);
}

export function passwordChangedTemplate(name: string): string {
  const firstName = name.split(' ')[0];
  const body = `
    ${heading('Password Changed')}
    ${subtext(`Hi ${firstName}, your Kickcraft password was successfully changed.`)}
    <table cellpadding="0" cellspacing="0" style="margin:24px 0 0;width:100%;">
      <tr>
        <td style="background-color:${LIGHT_BG};border:1px solid ${BORDER};padding:16px 20px;">
          <p style="margin:0;font-size:13px;color:${DARK};font-weight:600;">Not you?</p>
          <p style="margin:6px 0 0;font-size:13px;color:${GRAY};">If you didn't make this change, reset your password immediately and contact support.</p>
        </td>
      </tr>
    </table>
  `;
  return base('Your password was changed', body);
}

// ─── Order Templates ──────────────────────────────────────────────────────────

export function orderOutForDeliveryTemplate(
  orderToken: string,
  agentName: string,
  agentPhone: string,
): string {
  const body = `
    ${heading('Your Order Is On Its Way!')}
    ${subtext(`Great news — your order <strong style="color:${DARK};">${orderToken}</strong> has been picked up and is headed to you now.`)}

    <table cellpadding="0" cellspacing="0" style="margin:28px 0 0;width:100%;border:1px solid ${BORDER};">
      <tr>
        <td colspan="2" style="padding:12px 16px;background-color:${DARK};font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#ffffff;">
          Delivery Agent
        </td>
      </tr>
      ${infoRow('Name', agentName)}
      ${infoRow('Phone', agentPhone)}
    </table>

    <p style="margin:24px 0 0;font-size:13px;color:${GRAY};line-height:1.6;">
      Your agent will collect the remaining payment on delivery. Have your MTN MoMo ready.<br/><br/>
      You can reach your agent directly on the phone number above if needed.
    </p>
  `;
  return base(`Your order ${orderToken} is on its way!`, body);
}

export function agentAssignmentTemplate(order: Order): string {
  const amount = ((order.total - order.subtotal / 2) / 100).toFixed(0);
  const body = `
    ${heading('New Delivery Assigned')}
    ${subtext(`You have a new delivery to complete. See the details below.`)}

    <table cellpadding="0" cellspacing="0" style="margin:28px 0 0;width:100%;border:1px solid ${BORDER};">
      <tr>
        <td colspan="2" style="padding:12px 16px;background-color:${DARK};font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#ffffff;">
          Order Details
        </td>
      </tr>
      ${infoRow('Order', order.orderToken)}
      ${infoRow('Customer Phone', order.phone)}
      ${infoRow('Address', order.deliveryAddress ?? 'See admin for details')}
      ${infoRow('Collect on Delivery', `${Number(amount).toLocaleString()} RWF`)}
    </table>

    <p style="margin:24px 0 0;font-size:13px;color:${GRAY};line-height:1.6;">
      Contact the customer to confirm delivery time before heading out.<br/>
      Log into the admin portal to update the order status once delivered.
    </p>
  `;
  return base(`New delivery assigned — ${order.orderToken}`, body);
}
