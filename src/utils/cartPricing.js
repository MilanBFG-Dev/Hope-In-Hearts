export const PRICE_PER_LETTER = 50;
export const COURIER_FEE = 95;

export function getItemUnitCount(item) {
  return (item.letterCount || 0) + (item.extraBlocks?.length || 0);
}

export function getCartItemLineTotal(item) {
  if (item.pricePerLetter) {
    const units = getItemUnitCount(item);
    return item.pricePerLetter * Math.max(units, 0) * item.quantity;
  }
  if (item.priceOnRequest) return 0;
  return item.price * item.quantity;
}

export function formatCartItemPrice(item) {
  if (item.pricePerLetter) {
    const letterCount = item.letterCount || 0;
    const extraCount = item.extraBlocks?.length || 0;
    const total = getCartItemLineTotal(item);
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
    if (item.quantity > 1) parts.push(`× ${item.quantity} sets`);
    return { total: `R${total}`, detail: parts.join(' + ') || null };
  }
  if (item.priceOnRequest) {
    return { total: 'Price on request', detail: null };
  }
  const total = getCartItemLineTotal(item);
  return {
    total: `R${total}`,
    detail: item.quantity > 1 ? `R${item.price} each` : null,
  };
}

export function getCartTotal(cart) {
  return cart.reduce((sum, item) => sum + getCartItemLineTotal(item), 0);
}

export function getDeliveryFee(method) {
  return method === 'delivery' ? COURIER_FEE : 0;
}

export function getOrderTotal(cart, method) {
  return getCartTotal(cart) + getDeliveryFee(method);
}
