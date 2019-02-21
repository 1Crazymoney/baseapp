// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { fetchError, fetchSuccess } from '../../../public/alert';
import { apiKeys2FAModal, apiKeyUpdate, ApiKeyUpdateFetch } from '../actions';

const updateOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* apiKeyUpdateSaga(action: ApiKeyUpdateFetch) {
    try {
        const {totp_code} = action.payload;
        const {kid, state} = action.payload.apiKey;
        const updatedApiKey = yield call(API.put(updateOptions), `/resource/api_keys/${kid}`, {totp_code, state});
        yield put(apiKeyUpdate(updatedApiKey));
        yield put(fetchSuccess('success.api_keys.updated'));
    } catch (error) {
        yield put(fetchError(error));
    } finally {
        yield put(apiKeys2FAModal({active: false}));
    }
}