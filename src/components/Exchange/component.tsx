import {
    Button,
    CryptoIcon,
    Decimal,
    Dropdown,
    InputBlock,
    Modal,
    SummaryField,
    WalletItemProps,
} from '@openware/components';
import * as React from 'react';
import {connect, MapDispatchToProps} from 'react-redux';
import {
    marketsFetch,
    marketsTickersFetch,
    RootState,
    selectMarketTickers,
    selectWallets,
    selectWalletsError,
    selectWalletsLoading,
    walletsFetch,
} from '../../modules';
import { Market, selectMarkets, Ticker } from '../../modules/markets';
import {
    orderExecuteFetch,
    selectOrderExecuteError,
 } from '../../modules/orders';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    wallets: WalletItemProps[];
    executeError?: CommonError;
    marketsData: Market[];
    marketTickers: {
        [key: string]: Ticker,
    };
    walletsLoading?: boolean;
    walletsError?: CommonError;
}

interface DispatchProps {
    fetchWallets: typeof walletsFetch;
    markets: typeof marketsFetch;
    orderExecute: typeof orderExecuteFetch;
    tickers: typeof marketsTickersFetch;
}

interface ExchangeProps {
    type: 'sell' | 'buy';
}

export type Props = ReduxProps & DispatchProps & ExchangeProps;

export interface ExchangeState {
    amountFrom: number;
    amountTo: number;
    fee: string;
    currentTickerValue: number;
    filteredWallets: WalletItemProps[] | null;
    loading: boolean;
    selectedWalletFrom: WalletItemProps | null;
    selectedWalletTo: WalletItemProps | null;
    showFrom: boolean;
    showSubmit: boolean;
    showTo: boolean;
    walletsFrom: WalletItemProps[];
    walletsTo: WalletItemProps[];
}

const defaultWallet = {
    currency: '',
    balance: 0,
    fixed: 8,
};

export class ExchangeComponent extends React.Component<Props, ExchangeState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            amountFrom: 0,
            amountTo: 0,
            fee: '0',
            currentTickerValue: 0,
            filteredWallets: null,
            loading: true,
            selectedWalletFrom: null,
            selectedWalletTo: null,
            showFrom: false,
            showSubmit: false,
            showTo: false,
            walletsFrom: [],
            walletsTo: [],
        };
    }

    public componentDidMount() {
        const { marketsData } = this.props;
        this.props.fetchWallets();
        this.props.markets();
        this.getTradingFees(marketsData);
    }

    public componentWillReceiveProps(props: Props) {
        const {selectedWalletFrom, selectedWalletTo} = this.state;

        if (selectedWalletTo && selectedWalletFrom) {
            this.setState({loading: false});
            return;
        }

        if (props.marketsData.length > 0 && props.wallets.length > 0 && !selectedWalletFrom) {
            this.getWalletsFromList(props);
        }

        if (props.marketTickers && Object.keys(props.marketTickers).length && selectedWalletFrom && !selectedWalletTo) {
            this.getWalletsToList(props, selectedWalletFrom);
        }
    }

    public render() {
        const {loading} = this.state;
        return (
            <div className="cr-wallet-trades">
                {loading ? (<div className="cr-wallet-trades__loading">Loading</div>) : this.renderMainContent()}
            </div>
        );
    }

    private renderMainContent() {
        const {
            amountFrom,
            amountTo,
            fee,
            currentTickerValue,
            showSubmit,
            selectedWalletFrom,
            selectedWalletTo,
            walletsFrom,
            walletsTo,
        } = this.state;

        const {type} = this.props;
        const fromCurrency = this.formatCurrency(selectedWalletFrom);
        const toCurrency = this.formatCurrency(selectedWalletTo);

        const canShowMessages = selectedWalletFrom && selectedWalletTo;

        const rateMessage = canShowMessages ?
            `1 ${fromCurrency} = ${currentTickerValue} ${toCurrency}` :
            'Loading...';

        const submitRequestFunc = e => this.showModal(e, 'showSubmit');
        const emptyFunc = () => {
            return;
        };

        return (
            <div className="cr-wallet-trades__container">
                <div className="cr-wallet-trades__item">
                    <div className="cr-wallet-trades__item-exchange">
                        <div className="cr-wallet-trades__item-input">
                            <InputBlock
                                handleChangeValue={this.handleChangeAmount}
                                value={amountFrom || ''}
                                type="number"
                                message={type === 'buy' ? 'Buy' : 'Sell'}
                                placeholder="0"
                            />
                        </div>
                        <div className="cr-wallet-trades__item-trade">
                            <Dropdown
                                list={this.renderDropdownWalletList(walletsFrom)}
                                onSelect={this.selectWalletFrom}
                            />
                        </div>
                    </div>
                    <div className="cr-wallet-trades__item-exchange">
                        <div className="cr-wallet-trades__item-input">
                            <InputBlock
                                handleChangeValue={emptyFunc}
                                value={amountTo}
                                type="number"
                                message={type === 'buy' ? 'Spend' : 'Get'}
                                placeholder=""
                            />
                        </div>
                        <div className="cr-wallet-trades__item-trade">
                            <Dropdown
                                list={this.renderDropdownWalletList(walletsTo)}
                                onSelect={this.selectWalletTo}
                            />
                        </div>
                    </div>
                </div>
                <div className="cr-wallet-trades__summary">
                    <div className="cr-wallet-trades__summary-block">
                        <SummaryField
                            className="cr-wallet-trades__summary-block-field"
                            message="Rate"
                            content={rateMessage}
                            borderItem="empty-circle"
                        />
                        <SummaryField
                            className="cr-wallet-trades__summary-block-field"
                            message="Fee"
                            content={canShowMessages ? fee : 'Loading...'}
                            borderItem="empty-circle"
                        />
                    </div>
                    <div className="cr-wallet-trades__button">
                        <Button
                            className="pg-wallet-trades-button"
                            label="CONFIRM"
                            onClick={submitRequestFunc}
                            disabled={this.state.amountFrom === 0}
                        />
                        <Modal
                            show={showSubmit}
                            header={this.renderHeaderModalSubmit()}
                            content={this.renderBodyModalSubmit()}
                            footer={this.renderFooterModalSubmit()}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // tslint:disable
    private getWalletsFromList({ wallets, marketsData, marketTickers }) {
        const walletsList = marketsData.map(elem => {
            const walletNameFrom = elem.name.split('/')[0].toLowerCase();
            const wallet = wallets.find(walletItem => walletItem.currency === walletNameFrom);
            return wallet ? wallet : null;
        });

        const walletsItems: WalletItemProps[] = [];
        for (const wallet of walletsList) {
            const item = walletsItems.length && walletsItems.find(w => w.currency === wallet.currency);
            if (!item) {
                walletsItems.push(wallet);
            }
        }

        this.setState({
            selectedWalletFrom: walletsItems[0] as WalletItemProps,
            walletsFrom: walletsItems as WalletItemProps[],
        }, () => {
            if (!marketTickers || Object.keys(marketTickers).length === 0) {
                this.props.tickers();
            }
        });
    }

    private getWalletsToList({ wallets, marketsData, marketTickers }, selectedWalletFrom: WalletItemProps | null) {
        if (selectedWalletFrom) {
            const filteredMarkets = marketsData.filter(market => {
                const [walletNameFrom = ''] = market.name.split('/');
                return walletNameFrom.toLowerCase() === selectedWalletFrom!.currency;
            });
            const walletsItems = wallets.filter(wallet => {
                // tslint:disable-next-line
                return !!(filteredMarkets.findIndex(k => k.name.split('/')[1].toLowerCase() === wallet.currency) + 1);
            });

            this.setState({
                selectedWalletTo: walletsItems[0] as WalletItemProps,
                walletsTo: walletsItems as WalletItemProps[],
            });

            const defaultTicker = { last: 0 };

            if (walletsItems.length) {
                const currentMarket = `${selectedWalletFrom!.currency}${walletsItems[0].currency}`.toLowerCase();
                this.setState({
                    currentTickerValue: (marketTickers[currentMarket] || defaultTicker).last,
                    amountTo: 0,
                });
            }
        }
    }

    private renderHeaderModalSubmit = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                Confirm?
            </div>
        );
    };

    private renderBodyModalSubmit = () => {
        return (
            <div className="pg-exchange-modal-submit-body">
                Do you confirm this transaction?
            </div>
        );
    };

    private renderFooterModalSubmit = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label="CANCEL"
                    onClick={this.hideModal}
                />
                <Button
                    className="pg-exchange-modal-submit-footer__button"
                    label="CONFIRM"
                    onClick={this.confirmRequest}
                />
            </div>
        );
    };

    private renderDropdownWalletList = (wallets: WalletItemProps[]) => {
        return wallets.map(this.renderDropdownWalletItem);
    };

    private renderDropdownWalletItem = (wallet: WalletItemProps, index: number) => {
        const icon = `${wallet.currency.toUpperCase()}-alt`;
        return (
            <span
                className="pg-exchange-dropdown-list-item"
                key={`${wallet.currency}${index}`}
            >
                <span>
                    <CryptoIcon code={icon} />
                    <span className="pg-exchange-dropdown-list-item__currency">
                        {wallet.currency}
                    </span>
                </span>
                <span className="pg-exchange-dropdown-list-item__balance"><Decimal fixed={wallet.fixed}>{wallet.balance.toString()}</Decimal></span>
            </span>
        );
    };

    private confirmRequest = () => {
        const {
            amountFrom,
            selectedWalletFrom,
            selectedWalletTo,
        } = this.state;
        const {type} = this.props;
        const currentMarket = (selectedWalletTo && selectedWalletFrom) ?
            `${selectedWalletFrom.currency}${selectedWalletTo.currency}`.toLowerCase() :
            null;
        const orderType = 'Market';
        if (currentMarket) {
            const resultData = {
                market: currentMarket,
                side: type,
                volume: amountFrom.toString(),
                ord_type: (orderType as string).toLowerCase(),
            };
            const order = resultData;
            this.props.orderExecute(order);
        }
        this.hideModal();
    };

    private getFeeMessage = (amountTo: number, amountFrom: number) => {
        const { selectedWalletTo, selectedWalletFrom } = this.state;
        const { marketsData, type } = this.props;
        const orderFees = this.getTradingFees(marketsData);
        const toCurrency = this.formatCurrency(selectedWalletTo);
        const fromCurrency = this.formatCurrency(selectedWalletFrom);
        if (marketsData && selectedWalletTo) {
            return type === 'buy'
                ? `${+orderFees.ask_fee * amountFrom} ${fromCurrency}`
                : `${+orderFees.bid_fee * amountTo} ${toCurrency}`;
        }
        return 'Loading';
    };

    private getTradingFees = (markets: Market[]) => {
        const {selectedWalletTo, selectedWalletFrom} = this.state;
        const emptyFees = {
            ask_fee: "0",
            bid_fee: "0",
        };
        const currentMarket = (selectedWalletTo && selectedWalletFrom) ?
            `${selectedWalletFrom.currency}${selectedWalletTo.currency}`.toLowerCase()
            : null;
        if (markets && currentMarket) {
            const foundFee = markets.find((market: Market) => { return market.id === currentMarket });
            return foundFee && markets.length > 0 ? foundFee : emptyFees;
        }
        return emptyFees;
    };

    private formatCurrency(wallet: WalletItemProps | null) {
        return (wallet || defaultWallet).currency.toUpperCase();
    }

    private selectWalletFrom = (i: number) => {
        const {walletsFrom} = this.state;
        this.setState({
            selectedWalletFrom: walletsFrom[i],
            amountFrom: 0,
            amountTo: 0,
        });
        this.getWalletsToList(this.props, walletsFrom[i]);
        this.hideModal();
    };

    private selectWalletTo = (i: number): void => {
        const {walletsTo} = this.state;
        this.setState({
            selectedWalletTo: walletsTo[i],
            amountFrom: 0,
            amountTo: 0,
        });
        this.hideModal();
    };

    // tslint:disable-next-line
    private showModal = (e: any, key: string) => {
        // @ts-ignore
        this.setState({
            [key]: true,
        });
    };

    private hideModal = () => {
        this.setState({
            showFrom: false,
            showSubmit: false,
            showTo: false,
            filteredWallets: null,
        });
    };

    private formatBalance(wallet: WalletItemProps | null) {
        const userWallet = (wallet || defaultWallet);
        return Number(Decimal.format(Number(userWallet.balance), userWallet.fixed));
    }

    public static handleAmountFromValue = (value: string, toBalance: number, fromBalance: number, type: string, currentTickerValue: number) => {
        if (type === 'sell' && (+value > fromBalance)) {
            return fromBalance;
        }
        if (type === 'buy' && ((+value * currentTickerValue) > toBalance)) {
            return toBalance / currentTickerValue;
        }
        return +value;
    };

    private calcAmounts = (value: string, toBalance: number, fromBalance: number, type: string) => {
        const amountFrom = handleAmountFromValue(value, toBalance, fromBalance, type, this.state.currentTickerValue) || 0;
        const amountTo = amountFrom * this.state.currentTickerValue;

        this.setState({
            amountFrom: amountFrom,
            amountTo: amountTo,
            fee: this.getFeeMessage(amountTo, amountFrom),
        });
    };

    private handleChangeAmount = (value: string) => {
        return this.calcAmounts(value, this.formatBalance(this.state.selectedWalletTo), this.formatBalance(this.state.selectedWalletFrom), this.props.type)
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    executeError: selectOrderExecuteError(state),
    marketsData: selectMarkets(state),
    marketTickers: selectMarketTickers(state),
    wallets: selectWallets(state),
    walletsError: selectWalletsError(state),
    walletsLoading: selectWalletsLoading(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchWallets: () => dispatch(walletsFetch()),
    markets: () => dispatch(marketsFetch()),
    orderExecute: payload => dispatch(orderExecuteFetch(payload)),
    tickers: () => dispatch(marketsTickersFetch()),
});

export const handleAmountFromValue = ExchangeComponent.handleAmountFromValue;
export const ExchangeElement = connect(mapStateToProps, mapDispatchToProps)(ExchangeComponent);
