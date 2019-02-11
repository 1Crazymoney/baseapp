import {
    Button,
    Input,
    Loader,
} from '@openware/components';
import cr from 'classnames';
import * as React from 'react';
import {
    EMAIL_REGEX,
} from '../../helpers';

interface SignInProps {
    labelSignIn?: string;
    labelSignUp?: string;
    emailLabel?: string;
    passwordLabel?: string;
    receiveConfirmationLabel?: string;
    forgotPasswordLabel?: string;
    isLoading?: boolean;
    title?: string;
    onForgotPassword: (email?: string) => void;
    onConfirmationResend?: (email?: string) => void;
    onSignUp: () => void;
    onSignIn: () => void;
    className?: string;
    image?: string;
    email: string;
    emailError: string;
    password: string;
    passwordError: string;
    emailFocused: boolean;
    emailPlaceholder: string;
    passwordFocused: boolean;
    passwordPlaceholder: string;
    isFormValid: () => void;
    refreshError: () => void;
    handleChangeFocusField: (value: string) => void;
    changePassword: (value: string) => void;
    changeEmail: (value: string) => void;
}

class SignInComponent extends React.Component<SignInProps> {
    public render() {
        const {
            email,
            emailError,
            emailPlaceholder,
            password,
            passwordError,
            passwordPlaceholder,
            isLoading,
            onForgotPassword,
            onSignUp,
            image,
            labelSignIn,
            labelSignUp,
            emailLabel,
            passwordLabel,
            forgotPasswordLabel,
            emailFocused,
            passwordFocused,
        } = this.props;
        const emailGroupClass = cr('cr-sign-in-form__group', {
            'cr-sign-in-form__group--focused': emailFocused,
        });
        const passwordGroupClass = cr('cr-sign-in-form__group', {
            'cr-sign-in-form__group--focused': passwordFocused,
        });
        return (
            <form>
                <div className="cr-sign-in-form">
                    <div className="cr-sign-in-form__options-group">
                        <div className="cr-sign-in-form__option">
                            <div className="cr-sign-in-form__option-inner __selected">
                                {labelSignIn ? labelSignIn : 'Sign In'}
                            </div>
                        </div>
                        <div className="cr-sign-in-form__option">
                            <div className="cr-sign-in-form__option-inner cr-sign-in-form__tab-signup" onClick={onSignUp}>
                                {labelSignUp ? labelSignUp : 'Sign Up'}
                            </div>
                        </div>
                    </div>
                    <div className="cr-sign-in-form__form-content">
                        {/* tslint:disable */}
                        {image && (
                            <h1 className="cr-sign-in-form__title">
                                <img className="cr-sign-in-form__image" src={image} alt="logo"/>
                            </h1>
                        )}
                        {/* tslint:enable tslint:disable:jsx-no-lambda */}
                        <div className={emailGroupClass}>
                            <label className="cr-sign-in-form__label">
                                {emailLabel ? emailLabel : 'Email'}
                            </label>
                            <Input
                                type="email"
                                value={email}
                                placeholder={emailPlaceholder}
                                className="cr-sign-in-form__input"
                                onChangeValue={this.handleChangeEmail}
                                onFocus={() => this.handleFieldFocus('email')}
                                onBlur={() => this.handleFieldFocus('email')}
                            />
                            {emailError && <div className={'cr-sign-in-form__error'}>{emailError}</div>}
                        </div>
                        <div className={passwordGroupClass}>
                            <label className="cr-sign-in-form__label">
                                {passwordLabel ? passwordLabel : 'Password'}
                            </label>
                            <Input
                                type="password"
                                value={password}
                                placeholder={passwordPlaceholder}
                                className="cr-sign-in-form__input"
                                onChangeValue={this.handleChangePassword}
                                onFocus={() => this.handleFieldFocus('password')}
                                onBlur={() => this.handleFieldFocus('password')}
                            />
                            {passwordError && <div className={'cr-sign-in-form__error'}>{passwordError}</div>}
                        </div>
                        <div className="cr-sign-in-form__button-wrapper">
                            <div className="cr-sign-in-form__loader">{isLoading ? <Loader/> : null}</div>
                            <Button
                                label={isLoading ? 'Loading...' : (labelSignIn ? labelSignIn : 'Sign in')}
                                type="submit"
                                className={'cr-sign-in-form__button'}
                                disabled={isLoading || !email.match(EMAIL_REGEX) || !password}
                                onClick={this.handleClick}
                            />
                        </div>
                        <div className="cr-sign-in-form__bottom-section">
                            <div
                                className="cr-sign-in-form__bottom-section-password"
                                onClick={() => onForgotPassword(email)}
                            >
                                {forgotPasswordLabel ? forgotPasswordLabel : 'Forgot your password?'}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private handleChangeEmail = (value: string) => {
        this.props.changeEmail(value);
    }

    private handleChangePassword = (value: string) => {
        this.props.changePassword(value);
    }

    private handleFieldFocus = (field: string) =>  {
        this.props.handleChangeFocusField(field);
    }

    private handleSubmitForm = () => {
        this.props.refreshError();
        this.props.onSignIn();
    }

    private isValidForm = () => {
        const {email, password} = this.props;
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid && password;
    }

    private handleValidateForm = () => {
        this.props.isFormValid();
    }

    private handleClick = (label?: string, e?: React.FormEvent<HTMLInputElement>) => {
        if (e) {
            e.preventDefault();
        }
        if (!this.isValidForm()) {
            this.handleValidateForm();
        } else {
            this.handleSubmitForm();
        }
    };
}

export {
    SignInComponent,
    SignInProps,
};
