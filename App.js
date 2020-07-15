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


export default class App extends Component {

  constructor(props){
    super(props);
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }

  render() {
    return (
      <>
        <PushController />
        <PrimaryNav />
      </>
    );
  }
}
