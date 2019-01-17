// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import {
    FEES_FETCH,
    ORDER_CANCEL_FETCH,
    ORDER_EXECUTE_FETCH,
    ORDERS_FETCH,
    USER_ORDERS_FETCH,
} from '../constants';
import { feesFetchSaga } from './feesFetchSaga';
import { ordersCancelSaga } from './ordersCancelSaga';
import { ordersExecuteSaga } from './ordersExecuteSaga';
import { ordersFetchSaga } from './ordersFetchSaga';
import { userOrdersFetchSaga } from './userOrdersFetchSaga';

export function* rootOrdersSaga() {
    yield takeLatest(ORDERS_FETCH, ordersFetchSaga);
    yield takeLatest(ORDER_CANCEL_FETCH, ordersCancelSaga);
    yield takeLatest(ORDER_EXECUTE_FETCH, ordersExecuteSaga);
    yield takeLatest(FEES_FETCH, feesFetchSaga);
    yield takeLatest(USER_ORDERS_FETCH, userOrdersFetchSaga);
}
