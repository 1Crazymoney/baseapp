import { TradesActions } from './actions';
import { TRADES_DATA, TRADES_ERROR, TRADES_FETCH } from './constants';
import { TradesState } from './types';

const initialState: TradesState = {
    list: [],
    loading: false,
};

export const tradesReducer = (state = initialState, action: TradesActions) => {
    switch (action.type) {
        case TRADES_FETCH:
            return {
                ...state,
                loading: true,
            };
        case TRADES_DATA:
            return {
                list: action.payload,
                loading: false,
            };
        case TRADES_ERROR:
            return {
                list: [],
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
