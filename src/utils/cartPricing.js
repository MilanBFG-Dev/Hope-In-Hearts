export const PRICE_PER_LETTER = 50;

export function getCartItemLineTotal(item) {
  if (item.pricePerLetter && item.letterCount > 0) {
    return item.pricePerLetter * item.letterCount * item.quantity;
  }
  if (item.priceOnRequest) return 0;
  return item.price * item.quantity;
}

export function formatCartItemPrice(item) {
  if (item.pricePerLetter && item.letterCount > 0) {
    const total = getCartItemLineTotal(item);
    const sets =
      item.quantity > 1
        ? `${item.letterCount} letters × R${item.pricePerLetter} × ${item.quantity}`
        : `${item.letterCount} letter${item.letterCount !== 1 ? 's' : ''} × R${item.pricePerLetter}`;
    return { total: `R${total}`, detail: sets };
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

export function getPerLetterLineTotal(pricePerLetter, letterCount, quantity = 1) {
  return pricePerLetter * letterCount * quantity;
}
