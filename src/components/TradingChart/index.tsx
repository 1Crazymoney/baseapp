import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import {
    AvailableSaveloadVersions,
    IChartingLibraryWidget,
    LanguageCode,
    ThemeName,
    widget,
} from '../../charting_library/charting_library.min';
import {
    Market,
    MarketsState,
    RootState,
    selectCurrentMarket,
    selectMarkets,
    selectMarketTickers,
} from '../../modules';
import { dataFeedObject, print, TickSubscriptions } from './api';

interface ReduxProps {
    markets: Market[];
    currentMarket: Market | undefined;
    tickers: MarketsState['tickers'];
}

type Props = ReduxProps;

export class TradingChartComponent extends React.PureComponent<Props> {

    private params = {
        interval: '15',
        containerId: 'tv_chart_container',
        libraryPath: '/charting_library/',
        chartsStorageUrl: 'https://saveload.tradingview.com',
        chartsStorageApiVersion: '1.1' as AvailableSaveloadVersions,
        clientId: 'tradingview.com',
        userId: 'public_user_id',
        fullscreen: false,
        autosize: true,
        studiesOverrides: {},
    };

    private tvWidget: IChartingLibraryWidget | null = null;
    private subscriptions: TickSubscriptions = {};

    public componentWillReceiveProps(next: Props) {
        if (next.currentMarket && (!this.props.currentMarket || next.currentMarket.id !== this.props.currentMarket.id)) {
            if (this.props.currentMarket && (this.props.currentMarket.id && this.tvWidget)) {
                this.updateChart(next.currentMarket);
            } else {
                this.setChart(next.markets, next.currentMarket);
            }
        }
    }

    public componentDidMount() {
        if (this.props.currentMarket) {
          this.setChart(this.props.markets, this.props.currentMarket);
        }
    }

    public componentWillUnmount() {
        if (this.tvWidget) {
            try {
                this.tvWidget.remove();
            } catch (error) {
                // tslint:disable-next-line no-console
                console.log(`TradingChart unmount failed: ${error}`);
            }
        }
    }

    public render() {
        return (
            <React.Fragment>
                <div className="cr-table-header__content">
                    {this.props.currentMarket ? this.props.currentMarket.name : ''}
                </div>
                <div
                    id={this.params.containerId}
                    className="pg-trading-chart"
                />
            </React.Fragment>
        );
    }

    private setChart = (
        markets: Market[], currentMarket: Market,
    ) => {

        const datafeed = dataFeedObject(markets, this.subscriptions);

        const widgetOptions = {
            debug: false,
            symbol: currentMarket.id,
            toolbar_bg: '#1a243b',
            datafeed,
            interval: this.params.interval,
            container_id: this.params.containerId,
            library_path: this.params.libraryPath,
            locale: 'en' as LanguageCode,
            disabled_features: ['use_localstorage_for_settings', 'header_symbol_search'],
            enabled_features: ['show_animated_logo'],
            charts_storage_url: this.params.chartsStorageUrl,
            charts_storage_api_version: this.params.chartsStorageApiVersion,
            client_id: this.params.clientId,
            user_id: this.params.userId,
            fullscreen: this.params.fullscreen,
            autosize: this.params.autosize,
            studies_overrides: this.params.studiesOverrides,
            overrides: {
                ['symbolWatermarkProperties.color']: '#1a243b',
                ['volumePaneSize']: 'iny',
                ['mainSeriesProperties.candleStyle.upColor']: '#54B489',
                ['mainSeriesProperties.candleStyle.downColor']: '#E85E59',
                ['mainSeriesProperties.candleStyle.borderUpColor']: '#54B489',
                ['mainSeriesProperties.candleStyle.borderDownColor']: '#E85E59',
                ['mainSeriesProperties.candleStyle.wickUpColor']: '#54B489',
                ['mainSeriesProperties.candleStyle.wickDownColor']: '#E85E59',
                ['paneProperties.background']: '#1a243b',
                ['paneProperties.vertGridProperties.color']: '#1a243b',
                ['paneProperties.vertGridProperties.style']: 1,
                ['paneProperties.horzGridProperties.color']: '#1a243b',
                ['paneProperties.horzGridProperties.style']: 1,
                ['paneProperties.crossHairProperties.color']: '#1a243b',
                ['paneProperties.crossHairProperties.width']: 1,
                ['paneProperties.crossHairProperties.style']: 1,
                ['scalesProperties.backgroundColor']: '#1a243b',
            },
            loading_screen: {
                backgroundColor: '#1a243b',
            },
            popup_width: '000',
            // hide_top_toolbar: true,
            enable_publishing: false,
            withdateranges: false,
            hide_side_toolbar: false,
            theme: 'Dark' as ThemeName,
            allow_symbol_change: false,
            details: true,
            hotlist: true,
            calendar: true,
            show_popup_button: true,
            popup_height: '50',
            height: 610,
        };

        this.tvWidget = new widget(widgetOptions);

        this.tvWidget.onChartReady(() => {
            this.tvWidget!.activeChart().setSymbol(currentMarket.id, () => {
                print('Symbol set', currentMarket.id);
            });
        });
    };

    private updateChart = (currentMarket: Market) => {
        if (this.tvWidget) {
            this.tvWidget.onChartReady(() => {
                this.tvWidget!.activeChart().setSymbol(currentMarket.id, () => {
                    print('Symbol set', currentMarket.id);
                });
            });
        }
    }
}

const reduxProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    markets: selectMarkets(state),
    currentMarket: selectCurrentMarket(state),
    tickers: selectMarketTickers(state),
});

export const TradingChart =
    connect<ReduxProps, {}, {}, RootState>(reduxProps)(TradingChartComponent);
