import { Market } from '../markets';
import { CommonError } from '../types';
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
    SET_CURRENT_PRICE,
    USER_ORDERS_ALL_DATA,
    USER_ORDERS_ALL_ERROR,
    USER_ORDERS_ALL_FETCH,
    USER_ORDERS_DATA,
    USER_ORDERS_ERROR,
    USER_ORDERS_FETCH,
    USER_ORDERS_UPDATE,
} from './constants';
import {
    GroupedOrders,
    Order,
    OrderSide,
    OrderStatus,
} from './types';

export interface OrdersCancelAllFetch {
    type: typeof ORDERS_CANCEL_ALL_FETCH;
}

export interface OrdersCancelAllData {
    type: typeof ORDERS_CANCEL_ALL_DATA;
}

export interface OrdersCancelAllError {
    type: typeof ORDERS_CANCEL_ALL_ERROR;
    payload: CommonError;
}


export interface OrderCancelFetch {
    type: typeof ORDER_CANCEL_FETCH;
    payload: {
        id: string | number;
    };
}

export interface OrderCancelData {
    type: typeof ORDER_CANCEL_DATA;
    payload: {
        id: string | number;
    };
}

export interface OrderCancelError {
    type: typeof ORDER_CANCEL_ERROR;
    payload: CommonError;
}

export interface OrderExecution {
    market: string;
    side: OrderSide;
    volume: string;
    price?: string;
    ord_type?: string;
}

export interface OrderExecuteFetch {
    type: typeof ORDER_EXECUTE_FETCH;
    payload: OrderExecution;
}

export interface OrderExecuteData {
    type: typeof ORDER_EXECUTE_DATA;
    payload: Order;
}

export interface OrderExecuteError {
    type: typeof ORDER_EXECUTE_ERROR;
    payload: CommonError;
}

export interface UserOrdersFetch {
    type: typeof USER_ORDERS_FETCH;
    payload: {
        market: Market[],
        state: OrderStatus,
    };
}

export interface UserOrdersData {
    type: typeof USER_ORDERS_DATA;
    payload: GroupedOrders;
}

export interface UserOrdersError {
    type: typeof USER_ORDERS_ERROR;
    payload: CommonError;
}

export interface UserOrdersUpdate {
    type: typeof USER_ORDERS_UPDATE;
    payload: Order;
}

export interface UserOrdersAllFetch {
    type: typeof USER_ORDERS_ALL_FETCH;
}

export interface UserOrdersAllData {
    type: typeof USER_ORDERS_ALL_DATA;
    payload: GroupedOrders;
}

export interface UserOrdersAllError {
    type: typeof USER_ORDERS_ALL_ERROR;
    payload: CommonError;
}

export interface SetCurrentPrice {
  type: typeof SET_CURRENT_PRICE;
  payload: string;
}

export type OrdersAction = OrdersCancelAllFetch
    | OrdersCancelAllData
    | OrdersCancelAllError
    | OrderCancelFetch
    | OrderCancelData
    | OrderCancelError
    | OrderExecuteFetch
    | OrderExecuteData
    | OrderExecuteError
    | UserOrdersFetch
    | UserOrdersData
    | UserOrdersError
    | UserOrdersUpdate
    | UserOrdersAllFetch
    | UserOrdersAllData
    | UserOrdersAllError
    | SetCurrentPrice;

export const ordersCancelAllFetch = (): OrdersCancelAllFetch => ({
    type: ORDERS_CANCEL_ALL_FETCH,
});

export const ordersCancelAllData = (): OrdersCancelAllData => ({
    type: ORDERS_CANCEL_ALL_DATA,
});

export const ordersCancelAllError =
    (payload: OrdersCancelAllError['payload']): OrdersCancelAllError => ({
        type: ORDERS_CANCEL_ALL_ERROR,
        payload,
    });

export const orderCancelFetch =
    (payload: OrderCancelFetch['payload']): OrderCancelFetch => ({
        type: ORDER_CANCEL_FETCH,
        payload,
    });

export const orderCancelData =
    (payload: OrderCancelData['payload']): OrderCancelData => ({
        type: ORDER_CANCEL_DATA,
        payload,
    });

export const orderCancelError =
    (payload: OrderCancelError['payload']): OrderCancelError => ({
        type: ORDER_CANCEL_ERROR,
        payload,
    });

export const orderExecuteFetch =
    (payload: OrderExecuteFetch['payload']): OrderExecuteFetch => ({
        type: ORDER_EXECUTE_FETCH,
        payload,
    });

export const orderExecuteData = (payload: OrderExecuteData['payload']): OrderExecuteData => ({
    type: ORDER_EXECUTE_DATA,
    payload,
});

export const orderExecuteError =
    (payload: OrderExecuteError['payload']): OrderExecuteError => ({
        type: ORDER_EXECUTE_ERROR,
        payload,
    });

export const userOrdersFetch =
    (payload: UserOrdersFetch['payload']): UserOrdersFetch => ({
        type: USER_ORDERS_FETCH,
        payload,
    });

export const userOrdersData = (payload: UserOrdersData['payload']): UserOrdersData => ({
    type: USER_ORDERS_DATA,
    payload,
});

export const userOrdersUpdate = (payload: UserOrdersUpdate['payload']): UserOrdersUpdate => ({
    type: USER_ORDERS_UPDATE,
    payload,
});

export const userOrdersError = (payload: UserOrdersError['payload']): UserOrdersError => ({
    type: USER_ORDERS_ERROR,
    payload,
});

export const userOrdersAllFetch = (): UserOrdersAllFetch => ({
    type: USER_ORDERS_ALL_FETCH,
});

export const userOrdersAllData = (payload: UserOrdersAllData['payload']): UserOrdersAllData => ({
    type: USER_ORDERS_ALL_DATA,
    payload,
});

export const userOrdersAllError = (payload: UserOrdersAllError['payload']): UserOrdersAllError => ({
    type: USER_ORDERS_ALL_ERROR,
    payload,
});

export const setCurrentPrice =
  (payload: SetCurrentPrice['payload']): SetCurrentPrice => ({
    type: SET_CURRENT_PRICE,
    payload,
  });
