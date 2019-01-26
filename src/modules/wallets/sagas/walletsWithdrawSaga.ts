// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../';
import { API, RequestOptions } from '../../../api';
import {
    walletsWithdrawCcyData,
    walletsWithdrawCcyError,
    WalletsWithdrawCcyFetch,
} from '../actions';

const walletsWithdrawCcyOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* walletsWithdrawCcySaga(action: WalletsWithdrawCcyFetch) {
    try {
        yield call(API.post(walletsWithdrawCcyOptions), '/account/withdraws', action.payload);
        yield put(walletsWithdrawCcyData());
    } catch (error) {
        yield put(walletsWithdrawCcyError(error));
        yield put(handleError(error.code));
    }
}
