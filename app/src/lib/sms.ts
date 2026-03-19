/**
 * SMS utility using Africa's Talking
 * Credentials: AT_API_KEY and AT_USERNAME in .env.local
 */

// Africa's Talking SDK uses CommonJS — import accordingly
const AfricasTalking = require('africastalking');

function getAT() {
    const apiKey = process.env.AT_API_KEY;
    const username = process.env.AT_USERNAME;

    if (!apiKey || !username) {
        throw new Error('Africa\'s Talking credentials are not configured (AT_API_KEY, AT_USERNAME)');
    }

    return AfricasTalking({ apiKey, username });
}

/**
 * Format a Kenyan phone number to international format (+254...)
 */
function formatKenyanPhone(phone: string): string {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    if (cleaned.startsWith('+254')) return cleaned;
    if (cleaned.startsWith('254')) return `+${cleaned}`;
    if (cleaned.startsWith('0')) return `+254${cleaned.substring(1)}`;
    return `+254${cleaned}`;
}

/**
 * Send an SMS order confirmation to the customer after a successful order.
 */
export async function sendOrderSMS(phone: string, orderId: string, total: number): Promise<void> {
    const shortId = orderId.slice(-8).toUpperCase();
    const formattedPhone = formatKenyanPhone(phone);

    const message =
        `Covermatt: Order confirmed! ✅\n` +
        `Order ID: #${shortId}\n` +
        `Total: KSh ${total.toLocaleString()}\n` +
        `We'll notify you when it ships. Thank you! 🛒`;

    const at = getAT();
    await at.SMS.send({
        to: [formattedPhone],
        message,
        from: 'Covermatt', // Sender ID (must be approved in production)
    });

    console.log(`Order SMS sent to ${formattedPhone} for order #${shortId}`);
}
