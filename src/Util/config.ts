
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  ENDPOINTS: {
    AUTH: '/auth',
    MEDIA: '/file',
    PRODUCTS: '/product',
    PRICETABLE: '/pricetable',
    TEMPLATE: '/template',
    PLAYLIST: '/playlist',
    MIDIA: '/media',
    USER: '/user',
    DEVICESESSION: '/device-session',
    PRICETABLELAYOUT: '/priceTableLayout'
  }
} as const;

const APP_FEATURES = {
  MAX_FILE_SIZE: 100,
  MAX_FILES: 10,
  MAX_STRING_LENGHT: 50,
  MIN_STRING_LENGHT: 3,
  MAX_SECONDS: 60,
  MIN_SECONDS: 5,
  MAX_PLAYLIST_ITEMS: 10,
} as const;

// App-wide configuration
const APP_CONFIG = {
  NAME: 'Vitrine Digital',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'pt-br',
  DATE_FORMAT: 'DD-MM-YYYY',
  TIME_FORMAT: 'HH:mm:ss',
} as const;




// Social media links
const CONTACT_LINKS = {
  EMAIL: 'https://facebook.com/yourapp',
  WHATSAPP: 'https://twitter.com/yourapp',
} as const;

// Export configuration
export const config = {
  API: API_CONFIG,
  APP: APP_CONFIG,
  FEATURE: APP_FEATURES,
  CONTACT: CONTACT_LINKS,
} as const;

// Type export for TypeScript usage
export type Config = typeof config;

// Default export
export default config;
