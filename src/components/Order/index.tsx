import {
    Loader,
    Order,
    OrderProps,
    WalletItemProps,
} from '@openware/components';
import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';
import { connect } from 'react-redux';
import {
    RootState,
    selectCurrentPrice,
    selectWallets,
    setCurrentPrice,
} from '../../modules';
import { Market, selectCurrentMarket, selectMarketTickers } from '../../modules/markets';
import {
    orderExecuteFetch,
    selectOrderExecuteLoading,
} from '../../modules/orders';

interface ReduxProps {
    currentMarket: Market | undefined;
    executeLoading: boolean;
    marketTickers: {
        [key: string]: {
            last: string;
        },
    };
    wallets: WalletItemProps[];
    currentPrice: string;
}

interface StoreProps {
    orderSide: string;
    // tslint:disable-next-line no-any
    wallet?: any;
    price: string;
    width: number;
}

interface DispatchProps {
    setCurrentPrice: typeof setCurrentPrice;
    orderExecute: typeof orderExecuteFetch;
}

interface OwnProps {
    size: number;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps & OwnProps;

class OrderInsert extends React.PureComponent<Props, StoreProps> {
    //tslint:disable-next-line:no-any
    public static propTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            orderSide: 'buy',
            wallet: undefined,
            price: '',
            width: 311,
        };
        this.orderRef = React.createRef();
    }

    private getOrderTypes = [
        this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.limit'}),
        this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.market'}),
    ];
    private orderRef;

    public componentWillReceiveProps(next: Props) {
        if (this.props.size !== next.size) {
            this.setState({
                width: this.orderRef.current.clientWidth,
            });
        }
        if (next.wallets && (next.wallets.length === 0)) {
            this.setState({
                wallet: undefined,
            });
        }
        if ((next.currentMarket !== this.props.currentMarket) || (next.wallets !== this.props.wallets)) {
            this.setState({
                wallet: this.getWallet(this.state.orderSide, next.currentMarket),
            });
        }
        if (next.currentPrice !== this.props.currentPrice) {
            this.setState({
                price: next.currentPrice,
            });
        }
    }

    public render() {
        const { executeLoading, marketTickers, currentMarket } = this.props;
        if (!currentMarket) {
            return null;
        }
        const { wallet, price } = this.state;
        const to = currentMarket.ask_unit;
        const from = currentMarket.bid_unit;

        const currentTicker = marketTickers[currentMarket.id];
        const defaultCurrentTicker = { last: '0' };
        const headerContent = (
            <div className="cr-table-header__content">
                <div className="cr-title-component"><FormattedMessage id="page.body.trade.header.newOrder" /></div>
            </div>
        );
        return (

            <div className={'pg-order'} ref={this.orderRef}>
                {this.state.width > 450 ? headerContent : undefined}
                <Order
                    disabled={executeLoading}
                    feeBuy={Number(currentMarket.ask_fee)}
                    feeSell={Number(currentMarket.ask_fee)}
                    from={from}
                    available={this.getAvailableValue(wallet)}
                    onSubmit={this.handleSubmit}
                    priceMarketBuy={Number((currentTicker || defaultCurrentTicker).last)}
                    priceMarketSell={Number((currentTicker || defaultCurrentTicker).last)}
                    to={to}
                    handleSendType={this.getOrderType}
                    price={price}
                    orderTypes={this.getOrderTypes}
                    handleChangeInputPrice={this.handleChangePrice}
                    amountText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.amount'})}
                    availableText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.available'})}
                    orderTypeText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType'})}
                    priceText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.price'})}
                    totalText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.total'})}
                    labelFirst={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.buy'})}
                    labelSecond={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.sell'})}
                    estimatedFeeText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.estimatedFee'})}
                    width={this.state.width}
                />
                {executeLoading && <Loader />}
            </div>
        );
    }

    private changeState = (value: string) => {
        this.setState({
            price: value ? value : '',
        });
    };

    private handleChangePrice = (value: string) => {
        const convertedText = value
            .replace(',', '.')
            .replace('-', '');
        const isDotFirst = convertedText[0] === '.';

        if (isDotFirst) {
            this.changeState('0.');
            return;
        }

        const condition = new RegExp('^(?:[\\d-]*\\.?[\\d-]*|[\\d-]*\\.[\\d-])$');

        if (convertedText.match(condition)) {
            this.changeState(convertedText);
        }
    }

    private handleSubmit = (value: OrderProps) => {
        if (!this.props.currentMarket) {
            return;
        }
        const { type, price, orderType, amount } = value;
        this.props.setCurrentPrice('');
        const resultData = {
            market: this.props.currentMarket.id,
            side: type,
            volume: amount.toString(),
            ord_type: (orderType as string).toLowerCase(),
        };
        const order = orderType === 'Limit' ? { ...resultData, price: price.toString() } : resultData;
        this.props.orderExecute(order);
    };

    private getWallet(orderSide: string, market?: Market) {
        const { wallets } = this.props;
        const currentMarket = market ? market : this.props.currentMarket;
        const currentMarketName = orderSide === 'sell' ?
            (currentMarket ? currentMarket.name.split('/')[0] : '') :
            (currentMarket ? currentMarket.name.split('/')[1] : '');

        const wallet = wallets && wallets.find(w => w.currency === currentMarketName.toLowerCase());
        return wallet;
    }

    private getOrderType = (index: number, label: string) => {
        const wallet = this.getWallet(label.toLowerCase());
        this.setState({
            orderSide: label.toLowerCase(),
            wallet,
        });
    }

    private getAvailableValue(wallet) {
        return wallet ? wallet.balance : 0;
    }
}

const mapStateToProps = (state: RootState) => ({
    currentMarket: selectCurrentMarket(state),
    executeLoading: selectOrderExecuteLoading(state),
    marketTickers: selectMarketTickers(state),
    wallets: selectWallets(state),
    currentPrice: selectCurrentPrice(state),
});

const mapDispatchToProps = dispatch => ({
    orderExecute: payload => dispatch(orderExecuteFetch(payload)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
});

// tslint:disable-next-line
const OrderComponent = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderInsert as any)) as any;

export {
    OrderComponent,
};
