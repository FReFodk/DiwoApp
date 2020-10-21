/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import PrimaryNav from './src/components/AppNavigator';
import PushController from './PushController';
import Text from 'react-native';
import {translate} from 'react-i18next';
import i18n from './src/I18n/index';

const WrappedNav = ({t}) => {
  return <PrimaryNav screenProps={{t}} />;
};
const ReloadAppOnLanguageChange = translate('common', {
  bindI18n: 'languageChanged',
  bindStore: false,
})(WrappedNav);

export default class App extends Component {
  constructor(props) {
    super(props);
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }

  render() {
    return (
      <>
        <PushController />
        <ReloadAppOnLanguageChange />
      </>
    );
  }
}
