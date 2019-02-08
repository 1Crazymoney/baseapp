import { combineReducers } from 'redux';
// tslint:disable-next-line no-submodule-imports
import { all, call } from 'redux-saga/effects';
import { appReducer, AppState } from './app';
import { rootAuthSaga } from './auth';
import { rootSendEmailSaga } from './contact';
import { rootHandleErrorSaga } from './error';
import { rootHistorySaga } from './history';
import { rootSendDocumentsSaga } from './kyc/documents';
import { rootSendIdentitySaga } from './kyc/identity';
import { rootLabelSaga } from './kyc/label';
import { rootSendCodeSaga } from './kyc/phone';
import { rootMarketsSaga } from './markets';
import { rootOrderBookSaga } from './orderBook';
import { rootOrdersSaga } from './orders';
import { rootPasswordSaga } from './password';
import { rootProfileSaga } from './profile';
import { rootRecentTradesSaga } from './recentTrades';
import { rootUserActivitySaga } from './userActivity';
import { rootWalletsSaga } from './wallets';

export * from './auth';
export * from './contact';
export * from './wallets';
export * from './profile';
export * from './markets';
export * from './orderBook';
export * from './orders';
export * from './password';
export * from './userActivity';

export * from './i18n';
export * from './history';
export * from './kyc';

export * from './error';

export interface RootState {
    app: AppState;
}

export const rootReducer = combineReducers({
    app: appReducer,
});

export function* rootSaga() {
    yield all([
        call(rootAuthSaga),
        call(rootMarketsSaga),
        call(rootOrdersSaga),
        call(rootProfileSaga),
        call(rootWalletsSaga),
        call(rootPasswordSaga),
        call(rootSendCodeSaga),
        call(rootSendIdentitySaga),
        call(rootSendDocumentsSaga),
        call(rootSendEmailSaga),
        call(rootRecentTradesSaga),
        call(rootOrderBookSaga),
        call(rootHandleErrorSaga),
        call(rootHistorySaga),
        call(rootUserActivitySaga),
        call(rootLabelSaga),
    ]);
}
