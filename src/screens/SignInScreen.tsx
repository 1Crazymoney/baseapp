import * as React from 'react';
import { SignIn } from '../containers/SignIn';
import { Titled } from '../decorators';

@Titled('Sign In')
class SignInScreen extends React.Component {
    public render() {
        return (
           <SignIn />
        );
    }
}

export {
    SignInScreen,
};
