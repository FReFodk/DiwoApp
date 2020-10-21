import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationEvents} from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import {translate} from 'react-i18next';
import i18n from 'i18next';

class logout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      token: '',
    };
    // alert("hello")
    this._retrieveData();
    // this.logout = this.logout.bind(this);
    // this.logout();
  }

  page_reloaded = () => {
    this.logout();
  };

  _retrieveData = async () => {
    console.log('hi');
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        console.log(value);
        this.setState({token: JSON.parse(value), count: 1});
        // this.logout();
      }
    } catch (error) {
      alert(error);
    }
  };

  logout = async () => {
    console.log("logout called", this.state.token);
    const value = await AsyncStorage.removeItem('visited_onces');
    const user_details = this.state.token;
    console.log(JSON.stringify(user_details));
    // console.log(value)
    // this.props.navigation.navigate('Login');

    var data = new FormData();
    data.append('udid', DeviceInfo.getUniqueId());

    var headers = new Headers();
    let auth = 'Bearer ' + user_details.token;
    headers.append('Authorization', auth);

    fetch('http://diwo.nu/public/api/delete_notification', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('RESPONSEJSON LOGOUT',responseJson)
        // alert(JSON.stringify(responseJson))
        if (responseJson.status == 200) {
          console.log('answer', responseJson);
          this.props.navigation.navigate('Login');
        } else {
          this.props.navigation.navigate('Login');
          console.log("You aren't logged out");
        }
      })
      .catch(error => {
        // this.props.navigation.navigate('Login');
        console.log('err', error);
      });
  };

  componentDidMount() {
    console.log("Logout page");
    this.logout();
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this.page_reloaded()} />
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

export default translate(['home', 'common'], {wait: true})(logout);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
