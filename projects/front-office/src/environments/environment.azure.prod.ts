import { theme } from '../themes/default/default.prod';

export const environment = {
    production: true,
    API_URL: 'https://ems-safe.who.int/api',
    SUBSCRIPTION_API_URL: 'wss://ems-safe.who.int/api',
    clientId: '8e237c86-3d84-4dda-b38d-b92031d77af1',
    authority: 'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590',
    redirectUrl: 'https://ems-safe.who.int',
    postLogoutRedirectUri: 'https://ems-safe.who.int/auth',
    frontOfficeUri: 'https://ems-safe.who.int/',
    backOfficeUri: 'https://ems-safe.who.int/backoffice/',
    module: 'frontoffice',
    theme
};
