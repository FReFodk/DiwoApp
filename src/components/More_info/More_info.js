import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card, Icon} from 'react-native-elements';
import {Dialog} from 'react-native-simple-dialogs';
import Text_EN from '../res/lang/static_text';
import {NavigationEvents, SafeAreaView} from 'react-navigation';
import ViewMoreText from 'react-native-view-more-text';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class More_info extends Component {
  myInterval = '';
  constructor(props) {
    super(props);
    this._retrieveData = this._retrieveData.bind(this);
    this.state = {
      tokenValue: '',
      token: '',
      firstName: '',
      lastName: '',
      dataSource: '',
      count: 0,
      experienceText: '',
      answerSend: false,
      error_popup: false,
      isKeyboardOpen: 0,
      hoursHired: '',
      teamName: '',
    };
    this._retrieveData();
    this.page_reloaded = this.page_reloaded.bind(this);
  }
  page_reloaded() {
    this._retrieveData();
  }
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        this.setState({token: JSON.parse(value), count: 1});
        this.componentDidMount();
      }
    } catch (error) {
      alert(error);
    }
  };

  learnMore = () => {
    Linking.openURL('http://diwo.nu');
  };

  help_workjoy = () => {
    Alert.alert(
      'Hvad er arbejdsglæde?',
      Text_EN.Text_en.workjoy_help_popup,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Learn More', onPress: () => this.learnMore()},
      ],
      {cancelable: false},
    );
  };

  help_socialkapital = () => {
    Alert.alert(
      'Hvad er social Kapital?',
      Text_EN.Text_en.socialkapital_help_popup,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Learn More', onPress: () => this.learnMore()},
      ],
      {cancelable: false},
    );
  };

  help_experience = () => {
    Alert.alert(
      'Hvorfor skal jeg svareliht?',
      Text_EN.Text_en.experience_help_popup,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Learn More', onPress: () => this.learnMore()},
      ],
      {cancelable: false},
    );
  };

  renderViewMore = onPress => {
    return (
      <Text
        onPress={onPress}
        style={{
          fontSize: width > height ? wp('2.3%') : wp('3%'),
          color: '#038fc1',
          fontWeight: 'bold',
          marginTop: 10,
        }}>
        {Text_EN.Text_en.View_more}
      </Text>
    );
  };
  renderViewLess = onPress => {
    return (
      <Text
        onPress={onPress}
        style={{
          fontSize: width > height ? wp('2.3%') : wp('3%'),
          color: '#038fc1',
          fontWeight: 'bold',
          marginTop: 10,
        }}>
        {Text_EN.Text_en.View_less}
      </Text>
    );
  };

  componentDidMount() {
    const {navigation} = this.props;
    if (this.state.count == 1) {
      const user_details = this.state.token;
      // this.setState({token:userToken.token});
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.token;
      headers.append('Authorization', auth);
      fetch('http://diwo.nu/public/api/user', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson) {
            this.setState({
              firstName: responseJson.user.first_name,
              lastName: responseJson.user.last_name,
              userId: responseJson.user.user_id,
            });
          }
        })
        .catch(error => {
          console.error(error);
        });

      fetch('http://diwo.nu/public/api/getUserInfo', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            hoursHired: responseJson.users[0].hours_hired,
            teamName: responseJson.users[0].team_name,
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <NavigationEvents
            onDidFocus={() => {
              this.page_reloaded();
            }}
          />
          <Image
            style={styles.background_diamond}
            source={require('../../uploads/diamond-dark.png')}
          />
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              borderBottomColor: '#01a2ff',
              borderBottomWidth: 2,
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{fontSize: width > height ? wp('1.6%') : wp('4%')}}>
                Hej{' '}
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: width > height ? wp('1.6%') : wp('4.5%'),
                  }}>
                  {this.state.firstName}
                </Text>
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                left: width > height ? wp('48%') : wp('45%'),
                alignSelf: 'center',
              }}>
              <Image
                style={{
                  width: width > height ? wp('6%') : wp('15%'),
                  height: width > height ? wp('3%') : wp('6%'),
                }}
                source={require('../../uploads/Diwologo_png.png')}
              />
            </View>
            <View>
              <TouchableOpacity
                onPress={() => this.props.navigation.openDrawer()}>
                <Image
                  style={{
                    width: width > height ? wp('3.5%') : wp('8%'),
                    height: width > height ? wp('3%') : wp('7%'),
                  }}
                  source={require('../../uploads/drawer_menu.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1, marginTop: 10, padding: 10}}>
            <View>
              <ScrollView>
                <Card borderRadius={15}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={styles.diamond_icon_title}
                      source={require('../../uploads/diamond_img.png')}
                    />
                    <Text
                      style={{
                        fontSize: width > height ? wp('2.3%') : wp('4%'),
                        color: '#038fc1',
                        fontWeight: 'bold',
                      }}>
                      {Text_EN.Text_en.more_info_title1}
                    </Text>
                  </View>
                  <ViewMoreText
                    numberOfLines={4}
                    renderViewMore={this.renderViewMore}
                    renderViewLess={this.renderViewLess}
                    textStyle={{
                      fontSize: width > height ? wp('2%') : wp('3.8%'),
                    }}>
                    <Text>{Text_EN.Text_en.more_info_text1}</Text>
                  </ViewMoreText>
                </Card>
                <Card borderRadius={15}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={styles.diamond_icon_title}
                      source={require('../../uploads/diamond_img.png')}
                    />
                    <Text
                      style={{
                        fontSize: width > height ? wp('2.3%') : wp('4%'),
                        color: '#038fc1',
                        fontWeight: 'bold',
                      }}>
                      {Text_EN.Text_en.more_info_title2}
                    </Text>
                  </View>
                  <ViewMoreText
                    numberOfLines={4}
                    renderViewMore={this.renderViewMore}
                    renderViewLess={this.renderViewLess}
                    textStyle={{
                      fontSize: width > height ? wp('2.3%') : wp('3.8%'),
                    }}>
                    <Text>{Text_EN.Text_en.more_info_text2}</Text>
                  </ViewMoreText>
                </Card>
                <Card borderRadius={15}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={styles.diamond_icon_title}
                      source={require('../../uploads/diamond_img.png')}
                    />
                    <Text
                      style={{
                        fontSize: width > height ? wp('2.3%') : wp('4%'),
                        color: '#038fc1',
                        fontWeight: 'bold',
                      }}>
                      {Text_EN.Text_en.more_info_title3}
                    </Text>
                  </View>
                  <ViewMoreText
                    numberOfLines={4}
                    renderViewMore={this.renderViewMore}
                    renderViewLess={this.renderViewLess}
                    textStyle={{
                      fontSize: width > height ? wp('2.3%') : wp('3.8%'),
                    }}>
                    <Text>{Text_EN.Text_en.more_info_text3}</Text>
                  </ViewMoreText>
                </Card>
              </ScrollView>
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
      </SafeAreaView>
    );
  }
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  detail_view: {
    flexDirection: 'row',
  },
  active_submit_btn: {
    paddingTop: width * 0.03,
    paddingBottom: width * 0.03,
    paddingLeft: width * 0.09,
    paddingRight: width * 0.09,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#00a1ff',
    borderRadius: 10,
  },
  bottom_btn: {
    width: '30.333%',
    backgroundColor: '#00a1ff',
    marginTop: 0,
    marginLeft: 8,
    marginBottom: 2,
    borderRadius: 10,
    justifyContent: 'center',
  },
  bottom_btn_txt: {
    textAlign: 'center',
    color: 'white',
    fontSize: width * 0.042,
    padding: 10,
  },
  submit_btn: {
    textAlign: 'center',
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  background_diamond: {
    position: 'absolute',
    width: width > height ? wp('70%') : wp('90%'),
    height: width > height ? wp('65%') : wp('85%'),
    bottom: -width * 0.3,
    right: -width * 0.28,
    opacity: 0.2,
    transform: [{rotate: '321deg'}],
  },
  diamond_icon: {
    width: width * 0.08,
    height: width * 0.08,
    marginLeft: 10,
    marginRight: 10,
  },
  diamond_icon_title: {
    width: width > height ? wp('4%') : wp('8%'),
    height: width > height ? wp('4%') : wp('8%'),
  },
  upper_txt: {
    fontSize: width * 0.045,
    color: '#038fc1',
    fontWeight: 'bold',
  },
  profile_title: {
    marginTop: 20,
    marginLeft: 25,
    color: '#7b7b7b',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  diamond_icon_detail: {
    width: width * 0.11,
    height: width * 0.11,
    marginLeft: 10,
    marginRight: 10,
  },
});
