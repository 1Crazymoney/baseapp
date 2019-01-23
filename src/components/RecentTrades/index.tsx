import { Table } from '@openware/components';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Market, RootState, selectCurrentMarket } from '../../modules';
import { recentTrades, selectRecentTrades } from '../../modules/recentTrades';

// tslint:disable no-any
interface ReduxProps {
    recentTrades: any;
    currentMarket: Market;
}

interface DispatchProps {
    tradesFetch: typeof recentTrades;
}

type Props = DispatchProps & ReduxProps;

class RecentTradesComponent extends React.Component<Props> {
    public componentWillReceiveProps(next: Props) {
        if (this.props.currentMarket !== next.currentMarket) {
          this.props.tradesFetch(next.currentMarket);
        }
    }

    public componentDidMount() {
        if (this.props.currentMarket.id){
          this.props.tradesFetch(this.props.currentMarket);
        }
    }

    public render() {
        return (
            <div className="pg-recent-trades">
                <Table data={this.getTrades(this.props.recentTrades)} header={['Time', 'Price', 'Volume']}/>
            </div>
        );
    }

    private getTrades(trades: any) {
        const renderRow = item => {
            return [item[0], ...item.slice(2)];
        };
        return trades.length ?
            trades.map(renderRow).slice(0,100) :
            [['There is no data to show...']];
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    recentTrades: selectRecentTrades(state),
    currentMarket: selectCurrentMarket(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    tradesFetch: market => dispatch(recentTrades(market)),
});


export const RecentTrades = connect(mapStateToProps, mapDispatchToProps)(RecentTradesComponent);
