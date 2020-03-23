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

export default class App extends Component {
  render() {
    return (
      <>
        <PushController />
        <PrimaryNav />
      </>
    );
  }
}
