import { BUSINESS } from '../data/products';

const MAILTO_SAFE_LENGTH = 1900;
const BUSINESS_NAME = BUSINESS.name;
const BUSINESS_WEBSITE = BUSINESS.website;

export function generateOrderReference() {
  const stamp = Date.now().toString(36).toUpperCase();
  return `HIH-${stamp}`;
}

function formatMoney(amount) {
  return `R${amount.toLocaleString('en-ZA')}`;
}

function formatOrderDate() {
  return new Date().toLocaleString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildItemLines(item, index) {
  const optionLines = (item.optionLines || []).map(
    ({ label, value }) => `    • ${label}: ${value}`
  );

  return [
    `[${index + 1}] ${item.name.toUpperCase()}`,
    `    Quantity:        ${item.quantity}`,
    `    Colour:          ${item.colorName}`,
    ...optionLines,
    item.personalisation
      ? `    Personalisation: "${item.personalisation}"`
      : null,
    `    Line total:      ${formatMoney(item.price * item.quantity)}`,
    '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildOrderEmailContent(cart, orderNote = '', customer = {}, orderRef) {
  const ref = orderRef || generateOrderReference();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const dateStr = formatOrderDate();

  const divider = '─'.repeat(42);
  const headerRule = '═'.repeat(42);

  const plainText = [
    headerRule,
    `  ${BUSINESS_NAME.toUpperCase()}`,
    '  NEW ORDER REQUEST',
    headerRule,
    '',
    `Order reference:  ${ref}`,
    `Date submitted:   ${dateStr}`,
    '',
    divider,
    '  CUSTOMER DETAILS',
    divider,
    `  Name:             ${customer.name || '—'}`,
    `  Email:            ${customer.email || '—'}`,
    `  Phone / WhatsApp: ${customer.phone || 'Not provided'}`,
    '',
    divider,
    '  ORDER ITEMS',
    divider,
    '',
    ...cart.map((item, i) => buildItemLines(item, i)),
    divider,
    '  ORDER SUMMARY',
    divider,
    `  Total items:      ${itemCount}`,
    `  Estimated total:  ${formatMoney(total)} (ZAR)`,
    '',
    orderNote.trim()
      ? [
          divider,
          '  ADDITIONAL NOTES',
          divider,
          `  ${orderNote.trim().replace(/\n/g, '\n  ')}`,
          '',
        ].join('\n')
      : null,
    divider,
    '',
    '  Payment and delivery will be confirmed by reply email.',
    '  Lead time is typically 7–10 working days for personalised items.',
    '',
    `  Thank you for choosing ${BUSINESS_NAME}.`,
    `  ${BUSINESS_WEBSITE}`,
    headerRule,
  ]
    .filter(Boolean)
    .join('\n');

  const htmlItems = cart
    .map((item, i) => {
      const options = (item.optionLines || [])
        .map(
          ({ label, value }) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#8b7575;font-size:13px;">${label}</td><td style="padding:4px 0;font-size:13px;color:#3d3232;">${value}</td></tr>`
        )
        .join('');

      return `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border:1px solid #f5e0e3;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#fff9f5;padding:14px 16px;border-bottom:1px solid #f5e0e3;">
              <strong style="font-size:15px;color:#3d3232;">${i + 1}. ${item.name}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 16px;background:#ffffff;">
              <table cellpadding="0" cellspacing="0">
                <tr><td style="padding:4px 12px 4px 0;color:#8b7575;font-size:13px;">Quantity</td><td style="padding:4px 0;font-size:13px;color:#3d3232;">${item.quantity}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#8b7575;font-size:13px;">Colour</td><td style="padding:4px 0;font-size:13px;color:#3d3232;">${item.colorName}</td></tr>
                ${options}
                ${
                  item.personalisation
                    ? `<tr><td style="padding:4px 12px 4px 0;color:#8b7575;font-size:13px;">Personalisation</td><td style="padding:4px 0;font-size:13px;color:#3d3232;font-style:italic;">"${item.personalisation}"</td></tr>`
                    : ''
                }
                <tr><td style="padding:8px 12px 4px 0;color:#8b7575;font-size:13px;font-weight:600;">Line total</td><td style="padding:8px 0 4px;font-size:14px;color:#c97b80;font-weight:700;">${formatMoney(item.price * item.quantity)}</td></tr>
              </table>
            </td>
          </tr>
        </table>`;
    })
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fff9f5;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff9f5;padding:24px 12px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(92,74,74,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#3d3232 0%,#5a4545 100%);padding:28px 32px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#f5e0e3;">${BUSINESS_NAME}</p>
            <h1 style="margin:0;font-size:22px;font-weight:600;color:#ffffff;font-family:Georgia,serif;">New Order Request</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#fff9f5;border-radius:10px;">
              <tr><td style="padding:16px 18px;">
                <p style="margin:0 0 6px;font-size:12px;color:#8b7575;text-transform:uppercase;letter-spacing:0.08em;">Order reference</p>
                <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#3d3232;">${ref}</p>
                <p style="margin:0;font-size:13px;color:#8b7575;">${dateStr}</p>
              </td></tr>
            </table>

            <h2 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#8b7575;font-family:sans-serif;">Customer details</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td style="padding:6px 0;font-size:14px;color:#3d3232;"><strong>Name:</strong> ${customer.name || '—'}</td></tr>
              <tr><td style="padding:6px 0;font-size:14px;color:#3d3232;"><strong>Email:</strong> <a href="mailto:${customer.email}" style="color:#c97b80;">${customer.email || '—'}</a></td></tr>
              <tr><td style="padding:6px 0;font-size:14px;color:#3d3232;"><strong>Phone:</strong> ${customer.phone || 'Not provided'}</td></tr>
            </table>

            <h2 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#8b7575;font-family:sans-serif;">Order items</h2>
            ${htmlItems}

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff9f5;border-radius:10px;margin-bottom:24px;">
              <tr><td style="padding:18px 20px;">
                <table width="100%"><tr>
                  <td style="font-size:14px;color:#8b7575;">Total items</td>
                  <td align="right" style="font-size:14px;color:#3d3232;font-weight:600;">${itemCount}</td>
                </tr><tr>
                  <td style="padding-top:10px;font-size:15px;color:#3d3232;font-weight:700;">Estimated total</td>
                  <td align="right" style="padding-top:10px;font-size:18px;color:#c97b80;font-weight:700;">${formatMoney(total)}</td>
                </tr></table>
              </td></tr>
            </table>

            ${
              orderNote.trim()
                ? `<h2 style="margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#8b7575;font-family:sans-serif;">Additional notes</h2>
                   <p style="margin:0 0 24px;padding:14px 16px;background:#fff9f5;border-radius:10px;font-size:14px;line-height:1.6;color:#5c4a4a;">${orderNote.trim().replace(/\n/g, '<br>')}</p>`
                : ''
            }

            <p style="margin:0;font-size:13px;line-height:1.6;color:#8b7575;text-align:center;">
              Payment and delivery will be confirmed by reply email.<br>
              Thank you for your order.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f5e0e3;padding:16px 32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;color:#8b7575;">Handmade in Cape Town, South Africa</p>
            <p style="margin:0;font-size:11px;"><a href="${BUSINESS_WEBSITE}" style="color:#c97b80;text-decoration:none;">${BUSINESS_WEBSITE}</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  const subject = `${BUSINESS_NAME} — Order ${ref}`;

  return { subject, plainText, html, orderRef: ref, total, itemCount };
}

function buildMailtoUrl(recipientEmail, content) {
  const params = new URLSearchParams({
    subject: content.subject,
    body: content.plainText,
  });
  return `mailto:${recipientEmail}?${params.toString()}`;
}

function openMailtoClient(url) {
  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return true;
  } catch {
    try {
      window.location.href = url;
      return true;
    } catch {
      return false;
    }
  }
}

async function sendViaWeb3Forms(content, customer) {
  const accessKey = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return null;

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      subject: content.subject,
      from_name: customer.name,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      message: content.html,
      replyto: customer.email,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Could not send order email.');
  }

  return { method: 'web3forms' };
}

/**
 * Sends order to the business inbox, or opens the customer's email app as fallback.
 */
export async function sendOrderEmail(recipientEmail, cart, orderNote, customer) {
  if (!cart.length) {
    return { sent: false, error: 'empty_cart' };
  }

  const content = buildOrderEmailContent(cart, orderNote, customer);

  try {
    const web3Result = await sendViaWeb3Forms(content, customer);
    if (web3Result) {
      return {
        sent: true,
        method: 'web3forms',
        orderRef: content.orderRef,
        recipientEmail,
        itemCount: content.itemCount,
        total: content.total,
      };
    }
  } catch {
    /* fall through to mailto */
  }

  let url = buildMailtoUrl(recipientEmail, content);
  let truncated = false;

  if (url.length > MAILTO_SAFE_LENGTH) {
    truncated = true;
    const compact = buildOrderEmailContent(
      cart,
      orderNote
        ? `${orderNote.slice(0, 120)}…`
        : 'See item summary — contact customer for full details.',
      customer,
      content.orderRef
    );
    url = buildMailtoUrl(recipientEmail, {
      ...compact,
      plainText: [
        compact.plainText.split('ORDER ITEMS')[0],
        'ORDER ITEMS',
        '─'.repeat(42),
        ...cart.map(
          (item, i) =>
            `[${i + 1}] ${item.name} ×${item.quantity} — ${item.colorName} — ${formatMoney(item.price * item.quantity)}`
        ),
        '',
        `Estimated total: ${formatMoney(content.total)}`,
        '',
        'Full details available on request.',
      ].join('\n'),
    });
  }

  const opened = openMailtoClient(url);

  return {
    sent: opened,
    method: 'mailto',
    orderRef: content.orderRef,
    recipientEmail,
    itemCount: content.itemCount,
    total: content.total,
    truncated,
    error: opened ? null : 'mailto_blocked',
  };
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
