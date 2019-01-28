import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '..';
import {
    mockNetworkError,
    setupMockAxios,
    setupMockStore,
} from '../../helpers/jest';
import {
    orderCancelFetch,
    orderExecuteFetch,
    ordersCancelAllFetch,
    userOrdersAllFetch,
    userOrdersFetch,
} from './';
import { OrderExecution } from './actions';
import {
    ORDER_CANCEL_DATA,
    ORDER_CANCEL_ERROR,
    ORDER_CANCEL_FETCH,
    ORDER_EXECUTE_DATA,
    ORDER_EXECUTE_ERROR,
    ORDER_EXECUTE_FETCH,
    ORDERS_CANCEL_ALL_DATA,
    ORDERS_CANCEL_ALL_ERROR,
    ORDERS_CANCEL_ALL_FETCH,
    USER_ORDERS_ALL_DATA,
    USER_ORDERS_ALL_ERROR,
    USER_ORDERS_ALL_FETCH,
    USER_ORDERS_DATA,
    USER_ORDERS_ERROR,
    USER_ORDERS_FETCH,
} from './constants';
import { OrderStatus } from './types';

// tslint:disable no-any no-magic-numbers no-console
const debug = false;

describe('Orders', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;

    const market = {
        id: 'bchbtc',
        name: 'BCH/BTC',
        ask_unit: 'bch',
        bid_unit: 'btc',
        ask_fee: '0.0015',
        bid_fee: '0.0015',
        min_ask_price: '0.0',
        max_bid_price: '0.0',
        min_ask_amount: '0.0',
        min_bid_amount: '0.0',
        ask_precision: 4,
        bid_precision: 4,
    };

    const wait: OrderStatus = 'wait';

    const cancelOrders = [
        {
            id: 204099,
            side: 'buy',
            ord_type: 'limit',
            price: '0.001',
            avg_price: '0.0',
            state: 'cancel',
            market: 'bchbtc',
            created_at: '2018-12-20T15:38:38+01:00',
            volume: '0.1',
            remaining_volume: '0.1',
            executed_volume: '0.0',
            trades_count: 0,
        },
    ];

    const waitOrders = [
        {
            id: 204099,
            side: 'buy',
            ord_type: 'limit',
            price: '0.001',
            avg_price: '0.0',
            state: wait,
            market: 'bchbtc',
            created_at: '2018-12-21T15:38:38+01:00',
            volume: '0.1',
            remaining_volume: '0.1',
            executed_volume: '0.0',
            trades_count: 0,
        },
    ];

    const doneOrders = [
        {
            id: 204099,
            side: 'buy',
            ord_type: 'limit',
            price: '0.001',
            avg_price: '0.0',
            state: 'done',
            market: 'bchbtc',
            created_at: '2018-12-22T15:38:38+01:00',
            volume: '0.1',
            remaining_volume: '0.1',
            executed_volume: '0.0',
            trades_count: 0,
        },
    ];

    const orderCancel = {
        id: 'bchbtc',
    };

    const executedOrder = {
        id: 204099,
        side: 'buy',
        ord_type: 'limit',
        price: '0.001',
        avg_price: '0.0',
        state: 'done',
        market: 'bchbtc',
        created_at: '2018-12-22T15:38:38+01:00',
        volume: '0.1',
        remaining_volume: '0.1',
        executed_volume: '0.0',
        trades_count: 0,
    };

    const orderCancelError = {
        error: {
            code: 500,
            message: 'Cannot cancel order',
        },
    };

    const unverifiedAccountResponse = {
        error: {
            code: 2000,
            message: 'Please, pass the corresponding verification steps to enable trading.',
        },
    };

    const orderExecuteError = {
        error: {
            code: 500,
            message: 'Cannot execute order',
        },
    };

    const userOrdersError = {
        error: {
            code: 500,
            message: 'Cannot fetch orders',
        },
    };

    const mockAllOrders = () => {
        mockAxios.onGet('/api/v2/peatio/market/orders').reply(200, cancelOrders.concat(doneOrders).concat(waitOrders));
    };

    const mockOrders = () => {
        mockAxios.onGet('/api/v2/peatio/market/orders?market=bchbtc&state=wait').reply(200, cancelOrders.concat(doneOrders).concat(waitOrders));
    };

    const mockUserOrders = () => {
        mockAxios.onGet('/api/v2/peatio/market/orders?market=bchbtc&state=wait')
            .reply(200, cancelOrders.concat(waitOrders).concat(doneOrders));
    };

    const mockUserOrdersError = () => {
        mockAxios.onGet('/api/v2/peatio/market/orders?market=bchbtc&state=wait').reply(500, userOrdersError);
    };

    const mockAllOrdersLowLevel = () => {
        mockAxios.onGet('/api/v2/peatio/market/orders').reply(401, unverifiedAccountResponse);
    };

    const mockOrdersLowLevel = () => {
        mockAxios.onGet('/api/v2/peatio/market/orders?market=bchbtc&state=wait').reply(401, unverifiedAccountResponse);
    };

    const mockOrderCancel = () => {
        mockAxios.onPost('/api/v2/peatio/market/orders/bchbtc/cancel').reply(200, orderCancel);
    };

    const mockOrderCancelAll = () => {
        mockAxios.onPost('/api/v2/peatio/market/orders/cancel').reply(200, orderCancel);
    };

    const mockOrderCancelError = () => {
        mockAxios.onPost('/api/v2/peatio/market/orders/bchbtc/cancel').reply(500, orderCancelError);
    };

    const mockOrderCancelAllError = () => {
        mockAxios.onPost('/api/v2/peatio/market/orders/cancel').reply(500, orderCancelError);
    };

    const mockOrderExecute = () => {
        mockAxios.onPost('/api/v2/peatio/market/orders').reply(200, executedOrder);
    };

    const mockOrderExecuteError = () => {
        mockAxios.onPost('/api/v2/peatio/market/orders').reply(500, orderExecuteError);
    };

    afterEach(() => {
        mockAxios.reset();
    });

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });

    describe('user with correct level', () => {
        const expectedOrderFetch = {
            type: USER_ORDERS_FETCH,
            payload: {
                market: [market],
                state: wait,
            },
        };

        const expectedOrderAllFetch = {
            type: USER_ORDERS_ALL_FETCH,
        };

        const expectedOrderData = {
            type: USER_ORDERS_DATA,
            payload: {
                wait: waitOrders,
                cancel: cancelOrders,
                done: doneOrders,
            },
        };

        const expectedOrderAllData = {
            type: USER_ORDERS_ALL_DATA,
            payload: {
                wait: waitOrders,
                cancel: cancelOrders,
                done: doneOrders,
            },
        };

        it('should fetch orders', async () => {
            mockOrders();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();

                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderFetch);
                        expect(actions[1]).toEqual(expectedOrderData);
                        resolve();
                    }
                });
            });
            store.dispatch(userOrdersFetch({market: [market], state: wait}));
            return promise;
        });

        it('should fetch all orders', async () => {
            mockAllOrders();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();

                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderAllFetch);
                        expect(actions[1]).toEqual(expectedOrderAllData);
                        resolve();
                    }
                });
            });
            store.dispatch(userOrdersAllFetch());
            return promise;
        });
    });

    describe('user with low verification level', () => {
        const expectedOrderFetch = {
            type: USER_ORDERS_FETCH,
            payload: {
                market: [market],
                state: wait,
            },
        };

        const expectedOrderAllFetch = {
            type: USER_ORDERS_ALL_FETCH,
        };

        const expectedOrderError = {
            type: USER_ORDERS_ERROR,
            payload: {
                code: 401,
                message: 'Please, pass the corresponding verification steps to enable trading.',
            },
        };

        const expectedOrderAllError = {
            type: USER_ORDERS_ALL_ERROR,
            payload: {
                code: 401,
                message: 'Please, pass the corresponding verification steps to enable trading.',
            },
        };

        it('should trigger an error', async () => {
            mockOrdersLowLevel();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderFetch);
                        expect(actions[1]).toEqual(expectedOrderError);
                        resolve();
                    }
                });
            });
            store.dispatch(userOrdersFetch({market: [market], state: wait}));
            return promise;
        });

        it('should trigger an error', async () => {
            mockAllOrdersLowLevel();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderAllFetch);
                        expect(actions[1]).toEqual(expectedOrderAllError);
                        resolve();
                    }
                });
            });
            store.dispatch(userOrdersAllFetch());
            return promise;
        });
    });

    describe('network error', () => {
        const expectedOrderFetch = {
            type: USER_ORDERS_FETCH,
            payload: {
                market: [market],
                state: wait,
            },
        };

        const expectedOrderError = {
            type: USER_ORDERS_ERROR,
            payload: {
                code: 500,
                message: 'Server error',
            },
        };

        it('should trigger an error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderFetch);
                        expect(actions[1]).toEqual(expectedOrderError);
                        resolve();
                    }
                });
            });
            store.dispatch(userOrdersFetch({market: [market], state: wait}));
            return promise;
        });
    });

    describe('cancel order', async () => {
        const expectedOrderCancelFetch = {
            type: ORDER_CANCEL_FETCH,
            payload: {
                id: 'bchbtc',
            },
        };

        const expectedOrderCancelData = {
            type: ORDER_CANCEL_DATA,
            payload: {
                id: 'bchbtc',
            },
        };

        const expectedOrderCancelError = {
            type: ORDER_CANCEL_ERROR,
            payload: {
                code: 500,
                message: 'Cannot cancel order',
            },
        };

        it('should cancel order', async () => {
            mockOrderCancel();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderCancelFetch);
                        expect(actions[1]).toEqual(expectedOrderCancelData);
                        resolve();
                    }
                });
            });
            store.dispatch(orderCancelFetch({ id: 'bchbtc' }));
            return promise;
        });

        it('should handle cancel order error', async () => {
            mockOrderCancelError();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderCancelFetch);
                        expect(actions[1]).toEqual(expectedOrderCancelError);
                        resolve();
                    }
                });
            });
            store.dispatch(orderCancelFetch({ id: 'bchbtc' }));
            return promise;
        });
    });

    describe('cancel all orders', async () => {
        const expectedOrderCancelAllFetch = {
            type: ORDERS_CANCEL_ALL_FETCH,
        };

        const expectedOrderCancelAllData = {
            type: ORDERS_CANCEL_ALL_DATA,
        };

        const expectedOrderCancelAllError = {
            type: ORDERS_CANCEL_ALL_ERROR,
            payload: {
                code: 500,
                message: 'Cannot cancel order',
            },
        };

        it('should cancel all orders', async () => {
            mockOrderCancelAll();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderCancelAllFetch);
                        expect(actions[1]).toEqual(expectedOrderCancelAllData);
                        resolve();
                    }
                });
            });
            store.dispatch(ordersCancelAllFetch());
            return promise;
        });

        it('should handle cancel order error', async () => {
            mockOrderCancelAllError();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderCancelAllFetch);
                        expect(actions[1]).toEqual(expectedOrderCancelAllError);
                        resolve();
                    }
                });
            });
            store.dispatch(ordersCancelAllFetch());
            return promise;
        });
    });

    describe('execute order', async () => {
        const order: OrderExecution = {
            market: 'bchbtc',
            side: 'buy',
            volume: '0.001',
            price: '0.002',
            ord_type: 'limit',
        };

        const expectedOrderExecuteFetch = {
            type: ORDER_EXECUTE_FETCH,
            payload: order,
        };

        const expectedOrderExecuteData = {
            type: ORDER_EXECUTE_DATA,
            payload: executedOrder,
        };

        const expectedOrderExecuteError = {
            type: ORDER_EXECUTE_ERROR,
            payload: {
                code: 500,
                message: 'Cannot execute order',
            },
        };

        it('should execute order', async () => {
            mockOrderExecute();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderExecuteFetch);
                        expect(actions[1]).toEqual(expectedOrderExecuteData);
                        resolve();
                    }
                });
            });
            store.dispatch(orderExecuteFetch(order));
            return promise;
        });

        it('should handle order execute error', async () => {
            mockOrderExecuteError();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderExecuteFetch);
                        expect(actions[1]).toEqual(expectedOrderExecuteError);
                        resolve();
                    }
                });
            });
            store.dispatch(orderExecuteFetch(order));
            return promise;
        });
    });

    describe('user orders', async () => {
        const markets = [
            {
                id: 'bchbtc',
                name: 'BCH/BTC',
                ask_unit: 'bch',
                bid_unit: 'btc',
                ask_fee: '0.0015',
                bid_fee: '0.0015',
                min_ask_price: '0.0',
                max_bid_price: '0.0',
                min_ask_amount: '0.0',
                min_bid_amount: '0.0',
                ask_precision: 4,
                bid_precision: 4,
            },
        ];

        const expectedOrdersFetch = {
            type: USER_ORDERS_FETCH,
            payload: {
                market: [market],
                state: wait,
            },
        };

        const expectedOrdersData = {
            type: USER_ORDERS_DATA,
            payload: {
                wait: waitOrders,
                cancel: cancelOrders,
                done: doneOrders,
            },
        };

        const expectedOrdersError = {
            type: USER_ORDERS_ERROR,
            payload: {
                code: 500,
                message: 'Cannot fetch orders',
            },
        };

        it('should fetch orders', async () => {
            mockUserOrders();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrdersFetch);
                        expect(actions[1]).toEqual(expectedOrdersData);
                        resolve();
                    }
                });
            });
            store.dispatch(userOrdersFetch({market: markets, state: wait}));
            return promise;
        });

        it('should handle fetch orders error', async () => {
            mockUserOrdersError();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrdersFetch);
                        expect(actions[1]).toEqual(expectedOrdersError);
                        resolve();
                    }
                });
            });
            store.dispatch(userOrdersFetch({market: markets, state: wait}));
            return promise;
        });
    });
});
