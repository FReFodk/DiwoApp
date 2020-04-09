import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions,
  BackHandler,
} from 'react-native';
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native-gesture-handler';
import Text_EN from '../res/lang/static_text';
import LinearGradient from 'react-native-linear-gradient';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      loading: false,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  email_submit() {
    this.setState({loading: true});
    var username = this.state.username;
    var data = new FormData();
    data.append('email', username);
    console.log(data);
    fetch('http://diwo.nu/public/api/forgetPassword', {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({loading: false});
        if (responseJson.status == 200) {
          alert('Mail Successfully Sent');
          this.props.navigation.navigate('Login');
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
      this.props.navigation.navigate('Login');
      return true;
    }
  }

  render() {
    var {height, width} = Dimensions.get('window');
    const {navigate} = this.props.navigation;
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
              bottom: -width * 0.35,
              right: -width * 0.3,
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
                    left: width > height ? wp('33%') : wp('10%'),
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
                <LinearGradient
                  colors={['#87d9f7', '#00a1ff']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.log_btn}>
                  <TouchableOpacity onPress={() => this.email_submit()}>
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
                      Submit
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>

                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity onPress={() => navigate('Login')}>
                    <Text style={{fontSize: 16}}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
        <HideWithKeyboard>
          <View style={{marginBottom: 5}}>
            <Text style={{textAlign: 'center'}}>
              <Text style={{fontSize: 18}}>©</Text> Copyright FReFo
            </Text>
          </View>
        </HideWithKeyboard>
      </View>
    );
  }
}

var {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  first_container: {
    justifyContent: 'center',
    alignItems: 'center',
    // paddingTop: 50,
    // backgroundColor:'green',
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
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 99999,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffab',
  },
  cardview: {
    flexDirection: 'column',
    padding: 0,
    borderRadius: 15,
  },
});
