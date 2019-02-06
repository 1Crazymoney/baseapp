import { Loader, OrderBook } from '@openware/components';
import classNames from 'classnames';
import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { accumulateVolume, calcMaxVolume, renderOrderBook, sortBids } from '../../helpers';
import {
    Market,
    RootState,
    selectCurrentMarket,
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids,
    selectDepthError,
    selectDepthLoading,
    setCurrentPrice,
} from '../../modules';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    bids: string[][];
    bidsLoading: boolean;
    bidsError?: CommonError;
    asks: string[][];
    currentMarket: Market | undefined;
    currentPrice: string;
}

interface DispatchProps {
    setCurrentPrice: typeof setCurrentPrice;
}

type Props = ReduxProps & DispatchProps;

class OrderBookContainer extends React.Component<Props> {
    public render() {
        const { bids, bidsLoading, asks } = this.props;
        const cn = classNames('', {
            'pg-bids--loading': bidsLoading,
        });

        return (
            <div className={cn}>
                {bidsLoading ? <Loader /> : this.orderBook(sortBids(bids), asks)}
            </div>
        );
    }

    private orderBook = (bids, asks) => (
        <OrderBook
            side={'right'}
            title={'Bids'}
            headers={['Volume', 'Amount', 'Price']}
            data={renderOrderBook(bids, 'bids', this.props.currentMarket)}
            rowBackgroundColor={'rgba(84, 180, 137, 0.5)'}
            maxVolume={calcMaxVolume(bids, asks)}
            orderBookEntry={accumulateVolume(bids)}
            onSelect={this.handleOnSelect}
        />
    );

    private handleOnSelect = (index: number) => {
        const { bids, currentPrice } = this.props;
        const priceToSet = bids[index] ? bids[index][0] : '';

        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    bids: selectDepthBids(state),
    asks: selectDepthAsks(state),
    bidsLoading: selectDepthLoading(state),
    bidsError: selectDepthError(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    });

const Bids = connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer);
type BidsProps = ReduxProps;

export {
    Bids,
    BidsProps,
};
