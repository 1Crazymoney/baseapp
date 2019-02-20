import * as React from 'react';
import { ChangeForgottenPassword } from '../containers/ChangeForgottenPassword';
import { Titled } from '../decorators';

@Titled('Change forgotten password')
export class ChangeForgottenPasswordScreen extends React.Component {
    public render() {
        return (
           <ChangeForgottenPassword />
        );
    }
}
