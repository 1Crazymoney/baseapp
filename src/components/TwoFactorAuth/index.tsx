// tslint:disable:jsx-no-lambda
import { Button } from '@openware/components';
import cr from 'classnames';
import {
    CustomInput,
} from '../';

import * as React from 'react';

export interface TwoFactorAuthProps {
    errorMessage?: string;
    isLoading?: boolean;
    onSubmit: () => void;
    title: string;
    label: string;
    buttonLabel: string;
    message: string;
    otpCode: string;
    error: string;
    codeFocused: boolean;
    handleOtpCodeChange: (otp: string) => void;
    handleChangeFocusField: () => void;
}

class TwoFactorAuthComponent extends React.Component<TwoFactorAuthProps> {
    public render() {
        const {
            errorMessage,
            isLoading,
            title,
            label,
            buttonLabel,
            message,
            error,
            otpCode,
            codeFocused,
        } = this.props;

        const errors = errorMessage || error;
        const buttonWrapperClass = cr('cr-email-form__button-wrapper', {
            'cr-email-form__button-wrapper--empty': !errors,
        });
        const emailGroupClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': codeFocused,
        });
        return (
            <div className="pg-2fa___form">
                <form>
                    <div className="cr-email-form">
                        <div className="cr-email-form__options-group">
                            <div className="cr-email-form__option">
                                <div className="cr-email-form__option-inner">
                                    {title || '2FA verification'}
                                </div>
                            </div>
                        </div>
                        <div className="cr-email-form__form-content">
                            <div className="cr-email-form__header">
                              {message}
                            </div>
                            <div className={emailGroupClass}>
                                <CustomInput
                                    type="number"
                                    label={label || '6-digit Google Authenticator Code'}
                                    placeholder={label || '6-digit Google Authenticator Code'}
                                    defaultLabel="6-digit Google Authenticator Code"
                                    handleChangeInput={this.handleChangeCode}
                                    inputValue={otpCode}
                                    handleFocusInput={this.props.handleChangeFocusField}
                                    classNameLabel="cr-email-form__label"
                                    classNameInput="cr-email-form__input"
                                />
                                {errorMessage && <div className="cr-email-form__error">{errorMessage}</div>}
                            </div>
                            <div className={buttonWrapperClass}>
                                <Button
                                    label={isLoading ? 'Loading...' : (buttonLabel ? buttonLabel : 'Sign in')}
                                    type="submit"
                                    className={otpCode ? 'cr-email-form__button' : 'cr-email-form__button cr-email-form__button--disabled'}
                                    disabled={isLoading || !otpCode.match(/.{6}/g)}
                                    onClick={this.handleSubmit}
                                />
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        );
    }

    private handleSubmit = () => {
        this.props.onSubmit();
    };

    private handleChangeCode = (otpCode: string) => {
        if (otpCode.match(/.{6}/g)) {
          this.handleSubmit();
        }
        this.props.handleOtpCodeChange(otpCode);
    };
}

export const TwoFactorAuth = TwoFactorAuthComponent;
