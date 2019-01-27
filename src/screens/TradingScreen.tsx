import { Grid, TabPanel } from '@openware/components';
import * as React from 'react';
import {connect, MapDispatchToPropsFunction, MapStateToProps} from 'react-redux';
import {
    Asks,
    Bids,
    MarketDepthsComponent,
    MarketsComponent,
    OpenOrdersComponent,
    OrderComponent,
    RecentTrades,
    TradingChart,
} from '../components';
import {
  RootState,
  selectUserInfo,
  User,
} from '../modules';
import { Market, marketsFetch, selectMarkets } from '../modules/markets';
import { selectWallets, Wallet, walletsFetch } from '../modules/wallets';

const breakpoints = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
};

const cols = {
    lg: 24,
    md: 24,
    sm: 12,
    xs: 12,
    xxs: 12,
};

const layouts = {
    lg: [
        { x: 0, y: 0, w: 4, h: 24, i: '0', minH: 12, minW: 4 },
        { x: 4, y: 0, w: 4, h: 24, i: '1', minH: 18, minW: 4 },
        { x: 8, y: 0, w: 16, h: 39, i: '2', minH: 12, minW: 5 },
        { x: 0, y: 39, w: 4, h: 24, i: '3', minH: 10, minW: 3 },
        { x: 4, y: 39, w: 4, h: 24, i: '4', minH: 10, minW: 3 },
        { x: 0, y: 6, w: 8, h: 15, i: '5', minH: 10, minW: 5 },
        { x: 8, y: 72, w: 16, h: 24, i: '6', minH: 23, minW: 5 },
    ],
    md: [
        { x: 0, y: 0, w: 5, h: 12, i: '0', minH: 12, minW: 4 },
        { x: 0, y: 10, w: 5, h: 18, i: '1', minH: 18, minW: 4 },
        { x: 5, y: 0, w: 19, h: 30, i: '2', minH: 12, minW: 5 },
        { x: 0, y: 24, w: 5, h: 12, i: '3', minH: 10, minW: 3 },
        { x: 5, y: 12, w: 5, h: 12, i: '4', minH: 10, minW: 3 },
        { x: 0, y: 24, w: 10, h: 24, i: '5', minH: 10, minW: 5 },
        { x: 10, y: 0, w: 14, h: 36, i: '6', minH: 8, minW: 5 },
    ],
    sm: [
        {
            x: 0,
            y: 0,
            w: 12,
            h: 15,
            i: '0',
            minH: 15,
            minW: 4,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 12,
            w: 12,
            h: 24,
            i: '1',
            minH: 24,
            minW: 5,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 30,
            w: 12,
            h: 30,
            i: '2',
            minH: 30,
            minW: 5,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 60,
            w: 12,
            h: 12,
            i: '3',
            minH: 12,
            minW: 3,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 72,
            w: 12,
            h: 12,
            i: '4',
            minH: 12,
            minW: 3,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 106,
            w: 12,
            h: 12,
            i: '5',
            minH: 12,
            minW: 7,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 72,
            w: 12,
            h: 12,
            i: '6',
            minH: 12,
            minW: 7,
            draggable: false,
            resizable: false,
        },
    ],
};

const renderTabs = () => {
    return [
        {
          content: <RecentTrades/>,
          label: 'Recent Trades',
        },
        {
            content: <OpenOrdersComponent/>,
            label: 'Open Orders',
        },
    ];
};

const gridItems = [
    {
        i: 0,
        render: () => <MarketsComponent />,
    },
    {
        i: 1,
        render: () => <OrderComponent />,
    },
    {
        i: 2,
        render: () => <TradingChart />,
    },
    {
        i: 3,
        render: () => <Bids />,
    },
    {
        i: 4,
        render: () => <Asks />,
    },
    {
        i: 5,
        render: () => <MarketDepthsComponent />,
    },
];

const handleLayoutChange = () => {
    return;
};
// tslint:disable
interface ReduxProps {
    markets: Market[]
    wallets: Wallet [];
    user: User;
}

interface DispatchProps {
    marketsFetch: typeof marketsFetch
    accountWallets: typeof walletsFetch;
}

type Props = DispatchProps & ReduxProps;

class Trading extends React.Component<Props> {
    public async componentDidMount() {
        const { wallets, markets } = this.props;

        if (markets.length < 1) {
            this.props.marketsFetch();
        }
        if (!wallets || wallets.length === 0) {
            this.props.accountWallets();
        }
    }

    public renderTrades() {
      if (this.props.user.uid) {
        return (
          <div className="pg-trading-screen__tab-panel"><TabPanel  panels={renderTabs()} /></div>
        );
      } else {
        return (
          <React.Fragment>
            <div className="cr-table-header__content">
                <div className={'pg-market-depth__title'}>
                      Recent Trades
                </div>
              </div>
            <RecentTrades/>
          </React.Fragment>
        );
      }
    }
    public render() {
        const rowHeight = 12;
        const allGridItems = [...gridItems, {i: 6, render: () => this.renderTrades()}];

        return (
            <div className={'pg-trading-screen'}>
                <div className={'pg-trading-wrap'}>
                    <Grid
                        breakpoints={breakpoints}
                        className="layout"
                        children={allGridItems}
                        cols={cols}
                        draggableHandle=".cr-table-header__content, .pg-trading-screen__tab-panel"
                        layouts={layouts}
                        rowHeight={rowHeight}
                        onLayoutChange={handleLayoutChange}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    markets: selectMarkets(state),
    wallets: selectWallets(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    marketsFetch: () => dispatch(marketsFetch()),
    accountWallets: () => dispatch(walletsFetch()),
});

const TradingScreen = connect(mapStateToProps, mapDispatchToProps)(Trading);

export {
    TradingScreen,
};
