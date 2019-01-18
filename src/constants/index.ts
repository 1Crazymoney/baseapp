export const PG_TITLE_PREFIX = 'Cryptobase';
// import { ANGULAR_APP_URL } from '../api';

export const pgRoutes = (isLoggedIn: boolean): string[][] => {
    const routes = [
        ['Trade', '/trade'],
        ['Wallets', '/wallets'],
        ['Buy/Sell', '/exchange'],
        ['Open orders', '/orders'],
        ['History', '/history'],

    ];
    const routesUnloggedIn = [
        ['Sign In', '/signin'],
        ['Trade', '/trade'],
    ];
    return isLoggedIn ? routes : routesUnloggedIn;
};
