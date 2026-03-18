import { Resend } from 'resend';

// Lazily instantiated so env vars are only read at runtime, not at build time
function getResend() {
    return new Resend(process.env.RESEND_API_KEY);
}

const FROM_ADDRESS = 'Covermatt <admin@covermatt.co.ke>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ─── Shared HTML wrapper ────────────────────────────────────────────────────
function emailWrapper(content: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Covermatt</title>
    </head>
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#059669 0%,#10b981 100%);padding:32px 40px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">Covermatt</h1>
                  <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">Premium Car Seat Covers · covermatt.co.ke</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;">
                    © ${new Date().getFullYear()} Covermatt. All rights reserved.<br/>
                    <a href="${APP_URL}" style="color:#10b981;text-decoration:none;">covermatt.co.ke</a>
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
    return `<a href="${href}" style="display:inline-block;margin-top:24px;padding:14px 32px;background:linear-gradient(135deg,#059669,#10b981);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;letter-spacing:0.3px;">${label}</a>`;
}

// ─── 1. Welcome / Registration Email ────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string) {
    return getResend().emails.send({
        from: FROM_ADDRESS,
        to,
        subject: 'Welcome to Covermatt 🎉',
        html: emailWrapper(`
            <h2 style="margin:0 0 12px;color:#111827;font-size:24px;font-weight:700;">Welcome aboard, ${name}! 🎉</h2>
            <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
                We're so glad you joined Covermatt — Kenya's home for <strong>premium car seat covers</strong> that combine style, durability, and comfort.
            </p>
            <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Explore our full catalogue and find the perfect fit for your vehicle. Your next great drive starts here.
            </p>
            ${ctaButton(`${APP_URL}`, 'Shop Now')}
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;"/>
            <p style="color:#9ca3af;font-size:13px;margin:0;">
                If you didn't create this account, you can safely ignore this email.
            </p>
        `),
    });
}

// ─── 2. Email Verification ───────────────────────────────────────────────────
export async function sendVerificationEmail(to: string, verificationToken: string) {
    const verificationUrl = `${APP_URL}/verify-email?token=${verificationToken}`;
    return getResend().emails.send({
        from: FROM_ADDRESS,
        to,
        subject: 'Verify your Covermatt account',
        html: emailWrapper(`
            <h2 style="margin:0 0 12px;color:#111827;font-size:24px;font-weight:700;">Verify your email address</h2>
            <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
                Thanks for signing up! Please confirm your email address to activate your Covermatt account.
            </p>
            <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 8px;">
                This link will expire in <strong>24 hours</strong>.
            </p>
            ${ctaButton(verificationUrl, 'Verify Email')}
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;"/>
            <p style="color:#9ca3af;font-size:13px;margin:0;">
                If you did not create this account, you can safely ignore this email.
            </p>
        `),
    });
}

// ─── 3. Password Reset ───────────────────────────────────────────────────────
export async function sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;
    return getResend().emails.send({
        from: FROM_ADDRESS,
        to,
        subject: 'Reset your Covermatt password',
        html: emailWrapper(`
            <h2 style="margin:0 0 12px;color:#111827;font-size:24px;font-weight:700;">Reset your password</h2>
            <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
                We received a request to reset the password for your Covermatt account. Click the button below to choose a new password.
            </p>
            <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 8px;">
                This link will expire in <strong>1 hour</strong>.
            </p>
            ${ctaButton(resetUrl, 'Reset Password')}
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;"/>
            <p style="color:#9ca3af;font-size:13px;margin:0;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
            </p>
        `),
    });
}

// ─── 4. Order Confirmation (Customer) ───────────────────────────────────────
export async function sendOrderConfirmationEmail(to: string, order: {
    id: string;
    customer: { name: string; email: string; phone: string };
    address: string;
    items: Array<{ name: string; quantity: number; price: number; image?: string }>;
    total: number;
    paymentMethod: string;
}) {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding:10px 0;color:#374151;font-size:14px;border-bottom:1px solid #f3f4f6;">${item.name}</td>
            <td style="padding:10px 0;color:#374151;font-size:14px;border-bottom:1px solid #f3f4f6;text-align:center;">${item.quantity}</td>
            <td style="padding:10px 0;color:#374151;font-size:14px;border-bottom:1px solid #f3f4f6;text-align:right;">KSh ${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
    `).join('');

    const shortId = order.id.slice(-8).toUpperCase();

    return getResend().emails.send({
        from: FROM_ADDRESS,
        to,
        subject: `Order Confirmed — #${shortId}`,
        html: emailWrapper(`
            <h2 style="margin:0 0 6px;color:#111827;font-size:24px;font-weight:700;">Order Confirmed! 🛒</h2>
            <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Order #${shortId}</p>
            <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Hi <strong>${order.customer.name}</strong>, thank you for your order. We've received it and will begin processing it shortly. You'll get another update when it ships.
            </p>

            <!-- Order summary -->
            <div style="background:#f9fafb;border-radius:10px;padding:20px;margin-bottom:24px;">
              <h3 style="margin:0 0 16px;color:#111827;font-size:15px;font-weight:600;">Order Summary</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th style="text-align:left;padding-bottom:8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
                    <th style="text-align:center;padding-bottom:8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
                    <th style="text-align:right;padding-bottom:8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding-top:12px;color:#111827;font-size:15px;font-weight:700;">Total</td>
                    <td style="padding-top:12px;color:#059669;font-size:16px;font-weight:700;text-align:right;">KSh ${order.total.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Delivery details -->
            <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
              <p style="margin:0 0 6px;color:#065f46;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Delivery Address</p>
              <p style="margin:0;color:#374151;font-size:14px;">${order.address}</p>
            </div>

            <p style="color:#6b7280;font-size:13px;margin:0;">
                Payment method: <strong>${order.paymentMethod}</strong>
            </p>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;"/>
            <p style="color:#9ca3af;font-size:13px;margin:0;">
                Questions? Reply to this email or visit <a href="${APP_URL}/support" style="color:#10b981;text-decoration:none;">our support page</a>.
            </p>
        `),
    });
}

// ─── 5. New Order Alert (Admin) ──────────────────────────────────────────────
export async function sendAdminNewOrderAlert(adminEmail: string, order: {
    id: string;
    customer: { name: string; email: string; phone: string };
    address: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    paymentMethod: string;
}) {
    const shortId = order.id.slice(-8).toUpperCase();
    const itemsHtml = order.items.map(item =>
        `<li style="margin-bottom:4px;color:#374151;font-size:14px;">${item.name} × ${item.quantity} — KSh ${(item.price * item.quantity).toLocaleString()}</li>`
    ).join('');

    return getResend().emails.send({
        from: FROM_ADDRESS,
        to: adminEmail,
        subject: `🛍️ New Order #${shortId} — KSh ${order.total.toLocaleString()}`,
        html: emailWrapper(`
            <h2 style="margin:0 0 6px;color:#111827;font-size:22px;font-weight:700;">New Order Received</h2>
            <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Order ID: <strong>#${shortId}</strong></p>

            <div style="background:#f9fafb;border-radius:10px;padding:20px;margin-bottom:20px;">
              <h3 style="margin:0 0 12px;color:#374151;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Customer</h3>
              <p style="margin:0 0 4px;color:#111827;font-size:15px;font-weight:600;">${order.customer.name}</p>
              <p style="margin:0 0 4px;color:#6b7280;font-size:14px;">${order.customer.email}</p>
              <p style="margin:0;color:#6b7280;font-size:14px;">${order.customer.phone}</p>
            </div>

            <div style="background:#f9fafb;border-radius:10px;padding:20px;margin-bottom:20px;">
              <h3 style="margin:0 0 12px;color:#374151;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Items Ordered</h3>
              <ul style="margin:0;padding-left:18px;">${itemsHtml}</ul>
              <p style="margin:16px 0 0;color:#059669;font-size:16px;font-weight:700;">Total: KSh ${order.total.toLocaleString()}</p>
            </div>

            <div style="background:#f9fafb;border-radius:10px;padding:20px;margin-bottom:24px;">
              <h3 style="margin:0 0 8px;color:#374151;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Delivery</h3>
              <p style="margin:0;color:#374151;font-size:14px;">${order.address}</p>
              <p style="margin:8px 0 0;color:#6b7280;font-size:13px;">Payment: ${order.paymentMethod}</p>
            </div>

            ${ctaButton(`${APP_URL}/admin`, 'View in Admin Dashboard')}
        `),
    });
}
