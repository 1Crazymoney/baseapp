import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../../';
import { setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { pushAlertError } from '../actions';

const debug = false;

describe('Error handler', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;

    afterEach(() => {
        mockAxios.reset();
    });

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });

    describe('Fetch handle error', () => {
        const errorCodeAccountNotActive = {code: 401, message: ['Your account is not active']};

        const expectedErrorActionUnauthorized = {
            type: 'alert/ERROR_FETCH',
            error: errorCodeAccountNotActive,
        };

        const expectedUserAlert = {
            type: 'profile/RESET_USER',
        };

        it('should handle error', async () => {
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedErrorActionUnauthorized);
                        expect(actions[1]).toEqual(expectedUserAlert);
                        resolve();
                    }
                });
            });
            store.dispatch(pushAlertError(errorCodeAccountNotActive));
            return promise;
        });
    });
});
