const MAILTO_SAFE_LENGTH = 1900;

function formatCartItem(item, index) {
  const optionLines = (item.optionLines || [])
    .map(({ label, value }) => `    ${label}: ${value}`)
    .join('\n');

  return [
    `${index + 1}. ${item.name}`,
    `    Quantity: ${item.quantity}`,
    `    Colour: ${item.colorName}`,
    optionLines || null,
    item.personalisation ? `    Personalisation: ${item.personalisation}` : null,
    `    Price: R${item.price * item.quantity}`,
    '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildOrderEmailBody(cart, orderNote = '') {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const lines = [
    'Hello Hope in Hearts,',
    '',
    'I would like to place an order:',
    '',
    ...cart.map((item, i) => formatCartItem(item, i)),
    `Estimated total: R${total}`,
    '',
    orderNote.trim() ? `Additional notes: ${orderNote.trim()}` : null,
    '',
    'Thank you!',
  ].filter(Boolean);

  return lines.join('\n');
}

export function buildMailtoUrl(email, cart, orderNote = '') {
  const body = buildOrderEmailBody(cart, orderNote);
  const subject = 'Hope in Hearts — Order Request';
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Opens the device email client with the order pre-filled.
 * Returns whether the mailto link was triggered.
 */
export function openOrderEmail(email, cart, orderNote = '') {
  if (!cart.length) {
    return { opened: false, error: 'empty_cart' };
  }

  let url = buildMailtoUrl(email, cart, orderNote);
  let truncated = false;

  if (url.length > MAILTO_SAFE_LENGTH) {
    truncated = true;
    const shortNote = orderNote.trim()
      ? `${orderNote.trim().slice(0, 80)}… (see shortened list)`
      : '';
    const compactBody = [
      'Hello Hope in Hearts,',
      '',
      'I would like to place an order (summary):',
      '',
      ...cart.map(
        (item, i) =>
          `${i + 1}. ${item.name} ×${item.quantity} — ${item.colorName} — R${item.price * item.quantity}`
      ),
      '',
      `Estimated total: R${cart.reduce((s, i) => s + i.price * i.quantity, 0)}`,
      shortNote ? `Notes: ${shortNote}` : null,
      '',
      'Please contact me for full item details.',
      '',
      'Thank you!',
    ]
      .filter(Boolean)
      .join('\n');

    url = `mailto:${email}?subject=${encodeURIComponent('Hope in Hearts — Order Request')}&body=${encodeURIComponent(compactBody)}`;
  }

  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    return { opened: true, truncated };
  } catch {
    try {
      window.location.href = url;
      return { opened: true, truncated };
    } catch {
      return { opened: false, error: 'mailto_blocked' };
    }
  }
}
