import {
    Button,
    Dropdown,
} from '@openware/components';
import countries = require('country-list');
import * as React from 'react';
import { InjectedIntlProps, injectIntl, intlShape } from 'react-intl';
import MaskInput from 'react-maskinput';
import {
  connect,
  MapDispatchToPropsFunction,
} from 'react-redux';
import { RootState } from '../../modules';
import {
    selectSendIdentityError,
    selectSendIdentitySuccess,
    sendIdentity,
} from '../../modules/kyc/identity';
import { changeUserLevel } from '../../modules/profile';
import { CommonError } from '../../modules/types';
import { nationalities } from './nationalities';

interface ReduxProps {
    error?: CommonError;
    success?: string;
}

interface DispatchProps {
    sendIdentity: typeof sendIdentity;
    changeUserLevel: typeof changeUserLevel;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface IdentityState {
    city: string;
    countryOfBirth: string;
    dateOfBirth: string;
    firstName: string;
    lastName: string;
    nationality: string;
    postcode: string;
    residentialAddress: string;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class IdentityComponent extends React.Component<Props, IdentityState> {
    //tslint:disable-next-line:no-any
    public static propsTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };
    public state = {
        city: '',
        countryOfBirth: '',
        dateOfBirth: '',
        firstName: '',
        lastName: '',
        nationality: '',
        postcode: '',
        residentialAddress: '',
    };

    public componentDidMount() {
        this.setState({
          countryOfBirth: countries().getCodes()[0],
          nationality: nationalities[0],
        });
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public componentDidUpdate(prev: Props) {
        if (!prev.success && this.props.success) {
            this.props.changeUserLevel({ level: 3 });
        }
    }

    public render() {
        const {
            city,
            dateOfBirth,
            firstName,
            lastName,
            postcode,
            residentialAddress,
        } = this.state;
        const { error, success } = this.props;

        const dataNationalities = nationalities;
        const onSelectNationality = value => this.selectNationality(dataNationalities[value]);

        const dataCountries = countries().getNames();
        const onSelectCountry = value => this.selectCountry(dataCountries[value]);

        return (
          <div className="pg-confirm__content-identity">
            <div className="pg-confirm__content-identity-forms">
                <div className="pg-confirm__content-identity-col">
                    <div className="pg-confirm__content-identity-col-row">
                      <fieldset className={`pg-confirm__content-identity-col-row-content ${firstName && 'pg-confirm__content-identity-col-row-is-active'}`}>
                          {firstName && <legend>{this.translate('page.body.kyc.identity.firstName')}</legend>}
                              <input
                                  className="pg-confirm__content-identity-col-row-content-number"
                                  type="string"
                                  placeholder={this.translate('page.body.kyc.identity.firstName')}
                                  value={firstName}
                                  onChange={this.handleChange('firstName')}
                              />
                      </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                      <fieldset className={`pg-confirm__content-identity-col-row-content ${dateOfBirth && 'pg-confirm__content-identity-col-row-is-active'}`}>
                          {dateOfBirth && <legend>{this.translate('page.body.kyc.identity.dateOfBirth')}</legend>}
                          <MaskInput
                            className="pg-confirm__content-identity-col-row-content-number"
                            maskString="00/00/0000"
                            mask="00/00/0000"
                            onChange={this.handleChangeDate}
                            value={dateOfBirth}
                            placeholder={this.translate('page.body.kyc.identity.dateOfBirth')}
                          />
                      </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                      <fieldset className={`pg-confirm__content-identity-col-row-content ${residentialAddress && 'pg-confirm__content-identity-col-row-is-active'}`}>
                          {residentialAddress && <legend>{this.translate('page.body.kyc.identity.residentialAddress')}</legend>}
                          <input
                            className="pg-confirm__content-identity-col-row-content-number"
                            type="string"
                            placeholder={this.translate('page.body.kyc.identity.residentialAddress')}
                            value={residentialAddress}
                            onChange={this.handleChange('residentialAddress')}
                          />
                      </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                      <fieldset className={`pg-confirm__content-identity-col-row-content ${city && 'pg-confirm__content-identity-col-row-is-active'}`}>
                          {city && <legend>{this.translate('page.body.kyc.identity.city')}</legend>}
                          <input
                              className="pg-confirm__content-identity-col-row-content-number"
                              type="string"
                              placeholder={this.translate('page.body.kyc.identity.city')}
                              value={city}
                              onChange={this.handleChange('city')}
                          />
                      </fieldset>
                    </div>
                </div>
                <div className="pg-confirm__content-identity-col pg-confirm__content-identity-col-right">
                  <div className="pg-confirm__content-identity-col-row">
                    <fieldset className={`pg-confirm__content-identity-col-row-content ${lastName && 'pg-confirm__content-identity-col-row-is-active'}`}>
                        {lastName && <legend>{this.translate('page.body.kyc.identity.lastName')}</legend>}
                            <input
                                className="pg-confirm__content-identity-col-row-content-number"
                                type="string"
                                placeholder={this.translate('page.body.kyc.identity.lastName')}
                                value={lastName}
                                onChange={this.handleChange('lastName')}
                            />
                    </fieldset>
                  </div>
                    <div className="pg-confirm__content-identity-col-row">
                      <div className="pg-confirm__content-identity-col-row-content">
                        <Dropdown
                          className="pg-confirm__content-documents-col-row-content-number"
                          list={dataNationalities}
                          onSelect={onSelectNationality}
                        />
                      </div>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                        <div className="pg-confirm__content-identity-col-row-content">
                            <Dropdown
                                className="pg-confirm__content-documents-col-row-content-number"
                                list={dataCountries}
                                onSelect={onSelectCountry}
                            />
                        </div>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                      <fieldset className={`pg-confirm__content-identity-col-row-content ${postcode && 'pg-confirm__content-identity-col-row-is-active'}`}>
                          {postcode && <legend>{this.translate('page.body.kyc.identity.postcode')}</legend>}
                          <input
                              className="pg-confirm__content-identity-col-row-content-number"
                              type="string"
                              placeholder={this.translate('page.body.kyc.identity.postcode')}
                              value={postcode}
                              onChange={this.handleChange('postcode')}
                          />
                      </fieldset>
                    </div>
                </div>
              </div>
              {success && <p className="pg-confirm__success">{success}</p>}
              {error && <p className="pg-confirm__error">{error.message}</p>}
              <div className="pg-confirm__content-deep">
                  <Button
                      className="pg-confirm__content-phone-deep-button"
                      label={this.translate('page.body.kyc.next')}
                      onClick={this.sendData}
                  />
              </div>
          </div>
        );
    }

    private handleChange = (key: string) => {
        return (e: OnChangeEvent) => {
            // @ts-ignore
            this.setState({
                [key]: e.target.value,
            });
        };
    };

    private formatDate = (date: string) => {
        const [day, month, year] = date.split('/');

        let formatDay = day ? day : '';
        formatDay = formatDay === '' || parseFloat(formatDay) <= 31 ? formatDay : '31';
        let formatMonth = month ? month : '';
        formatMonth = formatMonth === '' || parseFloat(formatMonth) <= 12 ? formatMonth : '12';
        const formatYear = year ? parseFloat(year) : '';

        return (formatDay && formatMonth && formatYear) ?
            `${formatDay}/${formatMonth}/${formatYear}` : ``;
    }

    private checkDate = (date: string) => {
        const [day, month, year] = date.split('/');
        const inputDate = new Date(`${month}/${day}/${year}`);
        const curDate = new Date();

        return (inputDate <= curDate) ? true : false;
    }

    private handleChangeDate = (e: OnChangeEvent) => {
        this.setState({
            dateOfBirth: this.formatDate(e.target.value),
        });
    }

    private selectNationality = (value: string) => {
        this.setState({
            nationality: value,
        });
    };

    private selectCountry = (value: string) => {
        this.setState({
            countryOfBirth: countries().getCode(value),
        });
    };

    private sendData = () => {
        const dob = this.checkDate(this.state.dateOfBirth) ? this.state.dateOfBirth : '';
        const profileInfo = {
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          dob,
          address: this.state.residentialAddress,
          postcode: this.state.postcode,
          city: this.state.city,
          country: this.state.countryOfBirth,
        };
        this.props.sendIdentity(profileInfo);
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    error: selectSendIdentityError(state),
    success: selectSendIdentitySuccess(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        sendIdentity: payload => dispatch(sendIdentity(payload)),
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
    });

// tslint:disable-next-line
export const Identity = injectIntl(connect(mapStateToProps, mapDispatchProps)(IdentityComponent) as any);
