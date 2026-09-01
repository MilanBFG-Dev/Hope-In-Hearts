import {
  WEB3FORMS_ACCESS_KEY,
  WEB3FORMS_ENDPOINT,
  isOrderEmailConfigured,
  ORDER_INBOX,
} from '../config/emailService';
import { COLLECT_LOCATION, COURIER_FEE } from '../data/products';
import { getCartItemLineTotal, getCartTotal, getDeliveryFee, getOrderTotal } from './cartPricing';

export function generateOrderReference() {
  const stamp = Date.now().toString(36).toUpperCase();
  return `HIH-${stamp}`;
}

function formatMoney(amount) {
  return `R${amount.toLocaleString('en-ZA')}`;
}

function formatOrderDate() {
  return new Date().toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatItemPriceLine(item) {
  if (item.pricePerLetter) {
    const total = getCartItemLineTotal(item);
    const letterCount = item.letterCount || 0;
    const extraCount = item.extraBlocks?.length || 0;
    const parts = [];
    if (letterCount > 0) {
      parts.push(
        `${letterCount} letter${letterCount !== 1 ? 's' : ''} × R${item.pricePerLetter}`
      );
    }
    if (extraCount > 0) {
      parts.push(
        `${extraCount} extra block${extraCount !== 1 ? 's' : ''} × R${item.pricePerLetter}`
      );
    }
    const qtyLabel = item.quantity > 1 ? ` × ${item.quantity} set${item.quantity !== 1 ? 's' : ''}` : '';
    return `${formatMoney(total)}${parts.length ? ` (${parts.join(' + ')}${qtyLabel})` : ''}`;
  }
  if (item.priceOnRequest) return 'Price on request';
  return formatMoney(getCartItemLineTotal(item));
}

function formatItemBlock(item, index) {
  const opts = (item.optionLines || []).map(({ label, value }) => `${label}: ${value}`);
  const priceLine = formatItemPriceLine(item);
  const lines = [`${index + 1}) ${item.name} — ${priceLine}`];

  if (item.letterColors?.length) {
    lines.push(`   Name: "${item.personalisation || '—'}"`);
    lines.push(
      `   Letter colours: ${item.letterColors
        .map(({ letter, colorName }) => `${letter}=${colorName}`)
        .join(', ')}`
    );
  } else {
    lines.push(`   ${item.colorName}${opts.length ? ' | ' + opts.join(' | ') : ''}`);
  }

  if (item.extraBlocks?.length) {
    lines.push(
      `   Extra blocks: ${item.extraBlocks
        .map((block) => {
          const motif =
            block.motif === 'Other' && block.otherNote?.trim()
              ? `Other (${block.otherNote.trim()})`
              : block.motif;
          return `${motif}=${block.colorName}`;
        })
        .join(', ')}`
    );
  }

  if (opts.length && item.letterColors?.length) {
    lines.push(`   ${opts.join(' | ')}`);
  }

  if (item.personalisation && !item.letterColors?.length) {
    lines.push(`   Text: "${item.personalisation}"`);
  }

  return lines.join('\n');
}

function formatFulfillmentBlock(fulfillment = {}) {
  if (fulfillment.method === 'delivery') {
    return [
      'COLLECTION / DELIVERY',
      'Method: Courier delivery',
      `Courier fee: R${COURIER_FEE}`,
      `Street: ${fulfillment.streetAddress?.trim() || '—'}`,
      fulfillment.suburb?.trim() ? `Suburb: ${fulfillment.suburb.trim()}` : null,
      `City: ${fulfillment.city?.trim() || '—'}`,
      `Province: ${fulfillment.province?.trim() || '—'}`,
      `Postal code: ${fulfillment.postalCode?.trim() || '—'}`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  return [
    'COLLECTION / DELIVERY',
    'Method: Collect',
    `Location: ${COLLECT_LOCATION}`,
    'Customer will collect in person.',
  ].join('\n');
}

/**
 * Short plain-text email for the shop owner — easy to scan on phone.
 */
export function buildOrderEmailContent(cart, orderNote = '', customer = {}, orderRef) {
  const ref = orderRef || generateOrderReference();
  const subtotal = getCartTotal(cart);
  const deliveryFee = getDeliveryFee(customer.fulfillment?.method);
  const total = getOrderTotal(cart, customer.fulfillment?.method);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const dateStr = formatOrderDate();
  const phone = customer.phone?.trim() || '—';

  const body = [
    `NEW ORDER — ${ref}`,
    dateStr,
    '',
    'CUSTOMER',
    `Name:  ${customer.name || '—'}`,
    `Email: ${customer.email || '—'}`,
    `Phone: ${phone}`,
    '',
    formatFulfillmentBlock(customer.fulfillment),
    '',
    'ITEMS',
    ...cart.map((item, i) => formatItemBlock(item, i)),
    '',
    `SUBTOTAL: ${formatMoney(subtotal)}`,
    deliveryFee > 0 ? `COURIER: ${formatMoney(deliveryFee)}` : 'COURIER: R0 (collect)',
    `TOTAL: ${formatMoney(total)} (${itemCount} item${itemCount !== 1 ? 's' : ''})`,
    orderNote.trim() ? `\nNOTES\n${orderNote.trim()}` : null,
    '',
    '—',
    customer.fulfillment?.method === 'delivery'
      ? 'Reply to customer to confirm payment and courier delivery.'
      : 'Reply to customer to confirm payment and collection time.',
  ]
    .filter((line) => line !== null)
    .join('\n');

  const subject = `Order ${ref} — ${customer.name || 'Customer'} — ${formatMoney(total)}`;

  return { subject, body, orderRef: ref, total, itemCount };
}

/**
 * Sends the order automatically to the Hope in Hearts inbox (no mail app).
 */
export async function sendOrderEmail(cart, orderNote, customer) {
  if (!cart.length) {
    return { sent: false, error: 'empty_cart' };
  }

  if (!isOrderEmailConfigured()) {
    return {
      sent: false,
      error: 'not_configured',
      message:
        'Order email is not configured yet. Add REACT_APP_WEB3FORMS_ACCESS_KEY to .env.local and rebuild.',
    };
  }

  const content = buildOrderEmailContent(cart, orderNote, customer);

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: content.subject,
        from_name: customer.name,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '—',
        replyto: customer.email,
        message: content.body,
        botcheck: false,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        sent: false,
        error: 'send_failed',
        message: data.message || 'Could not send your order. Please try again.',
        orderRef: content.orderRef,
      };
    }

    return {
      sent: true,
      orderRef: content.orderRef,
      recipientEmail: ORDER_INBOX,
      itemCount: content.itemCount,
      total: content.total,
    };
  } catch {
    return {
      sent: false,
      error: 'network_error',
      message: 'Network error — check your connection and try again.',
      orderRef: content.orderRef,
    };
  }
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
