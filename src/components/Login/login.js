import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Linking,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {ScrollView} from 'react-navigation';
import Text_EN from '../res/lang/static_text';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';

var {height, width} = Dimensions.get('window');

export default class login extends Component {
  constructor(props) {
    super(props);
    //this._retrieveData = this._retrieveData.bind(this);
    this.state = {
      username: '',
      password: '',
      token: '',
      loading: false,
    };
    //this._retrieveData();
    this.login_clicked = this.login_clicked.bind(this);
    this.storeData = this.storeData.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  // _retrieveData = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('visited_onces');
  //     if (value !== null ) {
  //       this.setState({loading:false});
  //       this.props.navigation.navigate('Home',{Json_value:value});
  //       console.log(value);
  //     }
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  storeData = async () => {
    let obj = {
      token: this.state.token,
    };
    try {
      await AsyncStorage.setItem('visited_onces', JSON.stringify(obj));
    } catch (e) {
      alert(e);
    }
  };

  login_clicked() {
    var username = this.state.username;
    var password = this.state.password;
    //alert(username);
    var data = new FormData();
    data.append('email', username);
    data.append('password', password);
    console.log(data);
    this.setState({loading: true});
    fetch('http://diwo.nu/public/api/login', {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({loading: false});

        if (responseJson.status == 200) {
          //console.log(responseJson.token);
          this.setState({token: responseJson.token});
          this.storeData();

          var data = new FormData();
          data.append('udid', DeviceInfo.getUniqueId());
          var headers = new Headers();
          let auth = 'Bearer ' + responseJson.token;
          headers.append('Authorization', auth);

          fetch('http://diwo.nu/public/api/edit_notification', {
            method: 'POST',
            headers: headers,
            body: data,
          })
            .then(response => response.json())
            .then(responseJson => {
              console.log('answer', responseJson);
            })
            .catch(error => {
              console.log('err', error);
            });
          AsyncStorage.setItem('usertoken', responseJson.token);
          this.props.navigation.navigate('Home', {token: responseJson.token});
        } else {
          alert('Invalid Credentails');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  UNSAFE_componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    console.log(this.props.navigation.isFocused());
    if (this.props.navigation.isFocused()) {
      BackHandler.exitApp();
      return true;
    }
  }

  componentDidMount() {
    this.setState({loading: false});
  }

  render() {
    var {height, width} = Dimensions.get('window');
    const {navigate} = this.props.navigation;
    console.log(width);
    // console.log(height);
    return (
      <View style={styles.container} behavior="height">
        {this.state.loading == true ? (
          <View style={styles.spinner} pointerEvents={'none'}>
            <ActivityIndicator
              size="large"
              color="#00a1ff"
              animating={this.state.loading}
            />
          </View>
        ) : null}

        <View style={styles.container}>
          <Image
            style={{
              position: 'absolute',
              width: width > height ? wp('58%') : wp('80%'),
              height: width > height ? wp('68%') : wp('85%'),
              bottom: -width * 0.3,
              right: -width * 0.2,
              opacity: 0.1,
              transform: [{rotate: '320deg'}],
            }}
            source={require('../../uploads/diamond.png')}
          />

          <View style={styles.first_container}>
            <Image
              style={{
                width: width > height ? wp('30%') : wp('70%'),
                height: width > height ? wp('15%') : wp('40%'),
              }}
              source={require('../../uploads/Diwo_logo_txt.png')}
            />
            <KeyboardAvoidingView>
              <View style={{marginTop: height * 0.02}}>
                <Text
                  style={{
                    fontSize: width > height ? wp('2%') : wp('3.5%'),
                    position: 'absolute',
                    left: width > height ? wp('33%') : wp('16%'),
                    backgroundColor: 'white',
                    zIndex: 999,
                    top: 5,
                  }}>
                  {' '}
                  {Text_EN.Text_en.email}{' '}
                </Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  returnKeyType="next"
                  returnKeyLabel="Next"
                  paddingLeft={25}
                  onChangeText={username => this.setState({username})}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: width > height ? wp('2%') : wp('3.5%'),
                    position: 'absolute',
                    left: width > height ? wp('33%') : wp('16%'),
                    backgroundColor: 'white',
                    zIndex: 999,
                    top: 5,
                  }}>
                  {' '}
                  {Text_EN.Text_en.password}{' '}
                </Text>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  returnKeyLabel="Go"
                  secureTextEntry={true}
                  paddingLeft={25}
                  onChangeText={password => this.setState({password})}
                />

                <TouchableOpacity
                  style={{
                    marginLeft: width > height ? wp('62%') : wp('63%'),
                    marginRight: width > height ? wp('30%') : wp('12%'),
                  }}
                  onPress={() => navigate('Forgot')}>
                  <Text
                    style={{
                      textAlign: 'right',
                      marginRight: width > height ? wp('1%') : wp('2%'),
                      fontSize: width > height ? wp('2%') : wp('3.5%'),
                    }}>
                    {Text_EN.Text_en.forget_password}
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <LinearGradient
                  colors={['#87d9f7', '#00a1ff']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.log_btn}>
                  <TouchableOpacity onPress={() => this.login_clicked()}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: width > height ? wp('2%') : wp('4%'),
                        fontWeight: 'bold',
                        borderRadius: 28,
                        paddingTop: 15,
                        paddingBottom: 15,
                      }}>
                      Log in
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </KeyboardAvoidingView>
          </View>

          <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
            <HideWithKeyboard>
              <View
                style={{
                  paddingBottom: 10,
                  justifyContent: 'flex-end',
                  height: width > height ? wp('15%') : wp('10%'),
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: width > height ? wp('1.3%') : wp('3.5%'),
                  }}>
                  {Text_EN.Text_en.register}{' '}
                  <Text
                    style={{color: '#01a2ff', textDecorationLine: 'underline'}}
                    onPress={() => Linking.openURL('http://diwo.nu/')}>
                    {Text_EN.Text_en.click_here}
                  </Text>
                </Text>
              </View>
            </HideWithKeyboard>

            <HideWithKeyboard>
              <View style={{marginBottom: 5}}>
                <Text style={{textAlign: 'center'}}>
                  <Text style={{fontSize: 18}}>©</Text> Copyright FReFo
                </Text>
              </View>
            </HideWithKeyboard>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  first_container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:'red'
  },
  second_container: {
    // backgroundColor:'grey',
    flexDirection: 'column',
    justifyContent: 'center',
    marginVertical: width > height ? wp('2%') : wp('5%'),
  },
  input: {
    borderRadius: 15,
    fontSize: width > height ? wp('2%') : wp('3.5%'),
    marginVertical: 15,
    borderColor: '#01a2ff',
    borderWidth: 1.2,
    height: width > height ? wp('5%') : wp('12%'),
    width: width > height ? wp('40%') : wp('80%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  log_btn: {
    borderRadius: 30,
    marginVertical: 15,
    width: width > height ? wp('20%') : wp('50%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: '#ffffffab',
    opacity: 0.8,
  },
  cardview: {
    flexDirection: 'column',
    padding: 0,
    borderRadius: 15,
  },
});
