import { BUSINESS } from '../data/products';

/**
 * Automatic order emails via Web3Forms (https://web3forms.com)
 *
 * Setup (one time):
 * 1. Sign up at web3forms.com with {BUSINESS.email}
 * 2. Copy your Access Key
 * 3. Create .env.local in project root:
 *    REACT_APP_WEB3FORMS_ACCESS_KEY=your_key_here
 * 4. Run npm run build && npm run deploy
 */
/** Public client-side key from https://web3forms.com (also in .env.local) */
const WEB3FORMS_KEY_FALLBACK = 'ad497560-bcfa-430b-af36-5869618c0043';

export const WEB3FORMS_ACCESS_KEY =
  process.env.REACT_APP_WEB3FORMS_ACCESS_KEY?.trim() || WEB3FORMS_KEY_FALLBACK;

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export function isOrderEmailConfigured() {
  return WEB3FORMS_ACCESS_KEY.length > 0;
}

export const ORDER_INBOX = BUSINESS.email;
