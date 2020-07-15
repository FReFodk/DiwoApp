import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card, Icon} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import {NavigationEvents, SafeAreaView} from 'react-navigation';
import Text_EN from '../res/lang/static_text';
import ViewMoreText from 'react-native-view-more-text';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {PushController} from '../../../PushController';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import firebase from 'react-native-firebase';

export default class home extends Component {
  constructor(props) {
    super(props);
    this._retrieveData = this._retrieveData.bind(this);
    this.state = {
      username: '',
      password: '',
      token: '',
      firstName: '',
      dataSource: '',
      storeToken: '',
      count: '0',
      loading: false,
      isWorkjoy_active: 0,
      isSocialKapital_active: 0,
      message_active: 0,
      badgeCount: 0,
      //loading: false
    };
    this._retrieveData();
    this.workjoyPage = this.workjoyPage.bind(this);
    this.page_reloaded = this.page_reloaded.bind(this);
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;

    // this.help_workjoy = this.help_workjoy.bind(this);
    // this.learnMore = this.learnMore.bind(this);
    // this.checkPermission();
    // this.messageListener();
  }

  // checkPermission = async () => {
  //     const enabled = await firebase.messaging().hasPermission();
  //     if (enabled) {
  //         this.getFcmToken();
  //     } else {
  //         this.requestPermission();
  //     }
  // }

  // getFcmToken = async () => {
  //     const fcmToken = await firebase.messaging().getToken();
  //     if (fcmToken) {
  //         console.log(fcmToken);
  //         alert(fcmToken)
  //         this.showAlert('Your Firebase Token is:', fcmToken);
  //     } else {
  //         this.showAlert('Failed', 'No token received');
  //     }
  // }

  // requestPermission = async () => {
  //     try {
  //         await firebase.messaging().requestPermission();
  //         // User has authorised
  //     } catch (error) {
  //         // User has rejected permissions
  //     }
  // }

  // messageListener = async () => {
  //     this.notificationListener = firebase.notifications().onNotification((notification) => {
  //         const { title, body } = notification;
  //         this.showAlert(title, body);
  //     });

  //     this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
  //         const { title, body } = notificationOpen.notification;
  //         this.showAlert(title, body);
  //     });

  //     const notificationOpen = await firebase.notifications().getInitialNotification();
  //     if (notificationOpen) {
  //         const { title, body } = notificationOpen.notification;
  //         this.showAlert(title, body);
  //     }

  //     this.messageListener = firebase.messaging().onMessage((message) => {
  //         console.log(JSON.stringify(message));
  //     });
  // }

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  };

  page_reloaded() {
    this.setState({loading: true});
    console.log('hi');
    this.componentDidMount();
    this.setState({loading: false});
  }
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      console.log('token_value::' + value);
      if (value !== null) {
        this.setState({storeToken: JSON.parse(value), count: 1});
        this.componentDidMount();
      } else {
        this.props.navigation.navigate('Login');
      }
    } catch (error) {
      alert(error);
    }
  };
  like_click = expr_id => {
    this.setState({loading: true});
    let user_details = this.state.storeToken;
    console.log(user_details.token);
    let token = user_details.token;
    var headers = new Headers();
    let auth = 'Bearer ' + token;
    headers.append('Authorization', auth);
    console.log(headers);
    fetch('http://diwo.nu/public/api/addExpLikes/' + expr_id, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({loading: false});
        console.log(responseJson);
        if (responseJson.status == 200) {
          this.componentDidMount();
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  dislike_click = expr_id => {
    this.setState({loading: true});
    let user_details = this.state.storeToken;
    let token = user_details.token;
    var headers = new Headers();
    let auth = 'Bearer ' + token;
    headers.append('Authorization', auth);
    fetch('http://diwo.nu/public/api/expDislike/' + expr_id, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({loading: false});
        if (responseJson.status == 200) {
          this.componentDidMount();
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  workjoyPage() {
    if (this.state.isWorkjoy_active == 1) {
      this.state.badgeCount--;
      PushNotification.setApplicationIconBadgeNumber(this.state.badgeCount);
    }
    this.props.navigation.navigate('Workjoy', {
      Firstname: this.state.firstName,
      token: this.state.token,
    });
  }

  socialkapital_Page = () => {
    if (this.state.socialkapital_Page == 1) {
      this.state.badgeCount--;
      PushNotification.setApplicationIconBadgeNumber(this.state.badgeCount);
    }
    this.props.navigation.navigate('Social_kapital', {
      Firstname: this.state.firstName,
      token: this.state.token,
    });
  };

  experience_Page = () => {
    this.props.navigation.navigate('Experience', {
      Firstname: this.state.firstName,
      token: this.state.token,
    });
  };

  message_Page = () => {
    if (this.state.message_active == 1) {
      this.state.badgeCount--;
      PushNotification.setApplicationIconBadgeNumber(this.state.badgeCount);
    }
    this.props.navigation.navigate('Message', {
      Firstname: this.state.firstName,
      token: this.state.token,
    });
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

  getDaysInMonth = (month, year) => {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    return new Date(year, month, 0).getDate();
    // Here January is 0 based
    // return new Date(year, month+1, 0).getDate();
  };

  async fetchData() {
    this.setState({loading: true});
    const {navigation} = this.props;
    let user_details;
    const token_value = navigation.getParam('token', 'NO-ID');
    if (this.state.count == '1' && token_value == 'NO-ID') {
      user_details = this.state.storeToken;
      console.log(user_details.token);
      let stateToken = user_details.token;
      this.setState({token: stateToken});
      // if(user_details!='NO-ID'){
      //     this.setState({token:user_details.token});
      // }else{
      //     this.setState({token:token_value});
      // }
      // console.log(this.state.token);

      var headers = new Headers();
      let auth;
      if (token_value == 'NO-ID') {
        auth = 'Bearer ' + user_details.token;
      } else {
        auth = 'Bearer ' + token_value;
      }
      // console.log(auth);
      headers.append('Authorization', auth);
      this.setState({loading: true});
      await fetch('http://diwo.nu/public/api/user', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          if (responseJson) {
            // console.log(responseJson);
            this.setState({firstName: responseJson.user.first_name});
          }
        })
        .catch(error => {
          console.error(error);
        });

      await fetch('http://diwo.nu/public/api/userExperience', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          if (responseJson) {
            // console.log(responseJson.experience);
            //this.setState({firstName:responseJson.user.first_name});
            this.setState({
              dataSource: responseJson.experience,
            });
          }
        })
        .catch(error => {
          console.error(error);
        });

      // this.setState({ loading: true })
      await fetch('http://diwo.nu/public/api/lastAddedWorkJoy', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          console.log('workjoy', responseJson);
          if (responseJson.status == 200) {
            // console.log(responseJson);
            if (responseJson.workjoy_data[0]) {
              this.setState({
                lastReviewDate: responseJson.workjoy_data[0].last_review_date,
              });

              var date = responseJson.workjoy_data[0].last_review_date;
              var t = date.split(/[- :]/);
              var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

              let dayWord = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ];
              var day = new Date().getDay(); //Current Date
              var month = new Date().getMonth() + 1; //Current month
              var year = new Date().getFullYear(); //Current year
              var hours = new Date().getHours(); //Current Hours
              var min = new Date().getMinutes();
              var now = new Date();
              for (
                var dt = new Date(d);
                dt <= now;
                dt.setDate(dt.getDate() + 1)
              ) {
                // console.log(dayWord[dt.getDay()]);
                if (dayWord[dt.getDay()] == 'Thursday') {
                  console.log(dayWord[dt.getDay()]);
                  if (
                    dt.getDate() == d.getDate() &&
                    dt.getMonth() == d.getMonth() &&
                    dt.getFullYear() == d.getFullYear()
                  ) {
                    this.setState({isWorkjoy_active: 0});
                    console.log('gooo');
                  } else {
                    this.setState({isWorkjoy_active: 1});
                    console.log('nooo');
                  }
                  if (
                    d.getDate() == now.getDate() &&
                    d.getMonth() == now.getMonth() &&
                    d.getFullYear() == now.getFullYear()
                  ) {
                    this.setState({isWorkjoy_active: 0});
                    console.log('Hooooo');
                  }
                } else if (dayWord[now.getDay()] == 'Thursday') {
                  this.setState({isWorkjoy_active: 1});
                } else if (
                  d.getDate() == now.getDate() &&
                  d.getMonth() == now.getMonth() &&
                  d.getFullYear() == now.getFullYear()
                ) {
                  this.setState({isWorkjoy_active: 0});
                  console.log('Hi');
                }
              }
              // var currentDate = year +'-'+ month +'-'+day;
              var currentTime = dayWord[day] + ':' + hours + ':' + min;
              if (currentTime == 'Thursday:00:00') {
                this.setState({isWorkjoy_active: 1});
              }
            } else {
              this.setState({isWorkjoy_active: 1});
            }
          }
        })
        .catch(error => {
          console.error(error);
        });

      this.setState({loading: true});
      await fetch('http://diwo.nu/public/api/lastAddedSocialkapital', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          if (responseJson.status == 200) {
            console.log(responseJson);
            if (responseJson.kapital_data[0]) {
              this.setState({
                lastReviewDate: responseJson.kapital_data[0].last_review_date,
              });
              var date = responseJson.kapital_data[0].last_review_date;
              var t = date.split(/[- :]/);
              var d = new Date(t[0], t[1] - 1, t[2]);

              // Checking activation for the current month
              var now = new Date();
              let lastDate =
                this.getDaysInMonth(now.getMonth() + 1, now.getFullYear()) - 3;
              let activationDate =
                now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + lastDate;
              var activet = activationDate.split(/[- :]/);
              let activeDate = new Date(activet[0], activet[1] - 1, activet[2]);
              //console.log(activeDate);

              // Checking activation for the Previous month
              var now = new Date();
              let PrevlastDate =
                this.getDaysInMonth(now.getMonth(), now.getFullYear()) - 3;
              let PrevactivationDate =
                now.getFullYear() + '-' + now.getMonth() + '-' + PrevlastDate;
              var Prevt = PrevactivationDate.split(/[- :]/);
              let PrevactiveDate = new Date(Prevt[0], Prevt[1] - 1, Prevt[2]);
              //console.log(PrevactiveDate);

              //check if database date and previous month activation date is same or not
              if (
                d.getTime() === PrevactiveDate.getTime() ||
                d.getTime() === activeDate.getTime()
              ) {
                this.setState({isSocialKapital_active: 0});
              } else {
                //Check for activation between the database date and current date.
                // let dateArray = [];
                // let count = 0;
                for (
                  var dt = new Date(d);
                  dt <= now;
                  dt.setDate(dt.getDate() + 1)
                ) {
                  // console.log(dt);
                  if (
                    dt.getTime() === PrevactiveDate.getTime() ||
                    dt.getTime() === activeDate.getTime()
                  ) {
                    // console.log("if");
                    this.setState({isSocialKapital_active: 1});
                    break;
                  } else if (dt.getTime() > activeDate.getTime()) {
                    if (
                      dt.getDate() > activeDate.getDate() &&
                      dt.getMonth() + 1 == activeDate.getMonth() + 1
                    ) {
                      this.setState({isSocialKapital_active: 0});
                    } else {
                      // console.log("In else if");
                      this.setState({isSocialKapital_active: 1});
                    }
                  } else {
                    // console.log("else");
                    this.setState({isSocialKapital_active: 0});
                  }
                  // dateArray.push(dt.getTime());
                }
              }
            } else {
              this.setState({isSocialKapital_active: 1});
            }
          }
        })
        .catch(error => {
          console.error(error);
        });

      this.setState({loading: true});
      await fetch('http://diwo.nu/public/api/getLastMessageReadStatus', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          console.log('lastAPI', responseJson);
          if (responseJson.status == 200) {
            if (responseJson.length > 0) {
              this.setState({message_active: 1});
            } else {
              this.setState({message_active: 0});
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
    if (token_value !== 'NO-ID') {
      var headers = new Headers();
      let auth = 'Bearer ' + token_value;
      headers.append('Authorization', auth);
      this.setState({loading: true});
      await fetch('http://diwo.nu/public/api/user', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          if (responseJson) {
            this.setState({firstName: responseJson.user.first_name});
          }
        })
        .catch(error => {
          console.error(error);
        });

      this.setState({loading: true});
      await fetch('http://diwo.nu/public/api/userExperience', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          if (responseJson) {
            //this.setState({firstName:responseJson.user.first_name});
            this.setState({
              dataSource: responseJson.experience,
            });
          }
        })
        .catch(error => {
          console.error(error);
        });

      // this.setState({ loading: true })
      await fetch('http://diwo.nu/public/api/lastAddedWorkJoy', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          console.log('workjoy', responseJson);
          if (responseJson.status == 200) {
            if (responseJson.workjoy_data[0]) {
              this.setState({
                lastReviewDate: responseJson.workjoy_data[0].last_review_date,
              });

              var date = responseJson.workjoy_data[0].last_review_date;
              var t = date.split(/[- :]/);
              var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

              let dayWord = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ];
              var day = new Date().getDay(); //Current Date
              var month = new Date().getMonth() + 1; //Current month
              var year = new Date().getFullYear(); //Current year
              var hours = new Date().getHours(); //Current Hours
              var min = new Date().getMinutes();
              var now = new Date();
              for (
                var dt = new Date(d);
                dt <= now;
                dt.setDate(dt.getDate() + 1)
              ) {
                if (dayWord[dt.getDay()] == 'Thursday') {
                  if (
                    dt.getDate() == d.getDate() &&
                    dt.getMonth() == d.getMonth() &&
                    dt.getFullYear() == d.getFullYear()
                  ) {
                    this.setState({isWorkjoy_active: 0});
                    console.log('1');
                  } else {
                    this.setState({isWorkjoy_active: 1});
                    console.log('2');
                  }
                  if (
                    dt.getDate() == now.getDate() &&
                    dt.getMonth() == now.getMonth() &&
                    dt.getFullYear() == now.getFullYear()
                  ) {
                    this.setState({isWorkjoy_active: 0});
                    console.log('3');
                  }
                } else if (dayWord[now.getDay()] == 'Thursday') {
                  this.setState({isWorkjoy_active: 1});
                  console.log('4');
                } else if (
                  d.getDate() == now.getDate() &&
                  d.getMonth() == now.getMonth() &&
                  d.getFullYear() == now.getFullYear()
                ) {
                  this.setState({isWorkjoy_active: 0});
                  console.log('Hi');
                }
              }
              // var currentDate = year +'-'+ month +'-'+day;
              var currentTime = dayWord[day] + ':' + hours + ':' + min;
              if (currentTime == 'Thursday:00:00') {
                this.setState({isWorkjoy_active: 1});
              }
            } else {
              this.setState({isWorkjoy_active: 0});
              console.log('5');
            }
          }
        })
        .catch(error => {
          console.error(error);
        });

      this.setState({loading: true});
      await fetch('http://diwo.nu/public/api/lastAddedSocialkapital', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          if (responseJson.status == 200) {
            console.log(responseJson);
            if (responseJson.kapital_data[0]) {
              this.setState({
                lastReviewDate: responseJson.kapital_data[0].last_review_date,
              });
              var date = responseJson.kapital_data[0].last_review_date;
              var t = date.split(/[- :]/);
              var d = new Date(t[0], t[1] - 1, t[2]);

              // Checking activation for the current month
              var now = new Date();
              let lastDate =
                this.getDaysInMonth(now.getMonth() + 1, now.getFullYear()) - 3;
              let activationDate =
                now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + lastDate;
              var activet = activationDate.split(/[- :]/);
              let activeDate = new Date(activet[0], activet[1] - 1, activet[2]);
              //console.log(activeDate);

              // Checking activation for the Previous month
              var now = new Date();
              let PrevlastDate =
                this.getDaysInMonth(now.getMonth(), now.getFullYear()) - 3;
              let PrevactivationDate =
                now.getFullYear() + '-' + now.getMonth() + '-' + PrevlastDate;
              var Prevt = PrevactivationDate.split(/[- :]/);
              let PrevactiveDate = new Date(Prevt[0], Prevt[1] - 1, Prevt[2]);
              //console.log(PrevactiveDate);

              //check if database date and previous month activation date is same or not
              if (
                d.getTime() === PrevactiveDate.getTime() ||
                d.getTime() === activeDate.getTime()
              ) {
                this.setState({isSocialKapital_active: 0});
              } else {
                //Check for activation between the database date and current date.
                // let dateArray = [];
                // let count = 0;
                for (
                  var dt = new Date(d);
                  dt <= now;
                  dt.setDate(dt.getDate() + 1)
                ) {
                  // console.log(dt);
                  if (
                    dt.getTime() === PrevactiveDate.getTime() ||
                    dt.getTime() === activeDate.getTime()
                  ) {
                    // console.log("if");
                    this.setState({isSocialKapital_active: 1});
                    break;
                  } else if (dt.getTime() > activeDate.getTime()) {
                    if (
                      dt.getDate() > activeDate.getDate() &&
                      dt.getMonth() + 1 == activeDate.getMonth() + 1
                    ) {
                      this.setState({isSocialKapital_active: 0});
                    } else {
                      // console.log("In else if");
                      this.setState({isSocialKapital_active: 1});
                    }
                  } else {
                    // console.log("else");
                    this.setState({isSocialKapital_active: 0});
                  }
                  // dateArray.push(dt.getTime());
                }
              }
            } else {
              this.setState({isSocialKapital_active: 1});
            }
          }
        })
        .catch(error => {
          console.error(error);
        });

      this.setState({loading: true});
      await fetch('http://diwo.nu/public/api/getLastMessageReadStatus', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          console.log(responseJson);
          if (responseJson.status == 200) {
            if (responseJson.length > 0) {
              this.setState({message_active: 1});
            } else {
              this.setState({message_active: 0});
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
    let self = this;
    let isSendFirstNotification = false;

    let intervalFetch = setInterval(() => {
      if (!self.state.loading) {
        clearInterval(intervalFetch);
        if (!isSendFirstNotification) {
          isSendFirstNotification = true;
          this.state.badgeCount = 0;
          if (this.state.message_active == 1) this.state.badgeCount++;
          if (this.state.isWorkjoy_active == 1) this.state.badgeCount++;
          if (this.state.isSocialKapital_active == 1) this.state.badgeCount++;
          if (this.state.badgeCount > 0) {
            console.log("BADGE COUNT", this.state.badgeCount);
            if (Platform.OS != 'ios') {
              this.sendLocalNotification(this.state.badgeCount);
            }
              PushNotification.setApplicationIconBadgeNumber(this.state.badgeCount);
            
          } else {
            PushNotification.setApplicationIconBadgeNumber(0);
          }
        }
        
      }
    }, 1000);
  }

  componentDidMount() {
    this.fetchData();
    // PushNotificationIOS.setApplicationIconBadgeNumber(10);
    // PushNotificationIOS.getApplicationIconBadgeNumber((res) => {
    //     console.log(res) //returns 10
    // });
  }

  renderViewMore = onPress => {
    return (
      <Text
        onPress={onPress}
        style={{
          fontSize: width > height ? wp('2.3%') : wp('3.5%'),
          color: '#ffff',
          fontWeight: 'bold',
          marginTop: 12,
          textAlign: 'right',
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
          fontSize: width > height ? wp('2.3%') : wp('3.5%'),
          color: '#ffff',
          fontWeight: 'bold',
          marginTop: 12,
          textAlign: 'right',
        }}>
        {Text_EN.Text_en.View_less}
      </Text>
    );
  };
  _renderItem = ({item, index}) => {
    var {height, width} = Dimensions.get('window');
    return (
      <View style={styles.dynamic_list_view}>
        <Card
          borderRadius={15}
          containerStyle={{
            marginLeft: 12,
            backgroundColor: '#00a1ff',
            width: width > height ? wp('90%') : wp('90%'),
          }}>
          <View>
            <ViewMoreText
              numberOfLines={4}
              renderViewMore={this.renderViewMore}
              renderViewLess={this.renderViewLess}
              textStyle={{
                fontSize: width > height ? wp('2%') : wp('3.8%'),
                textAlign: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: width > height ? wp('2%') : wp('4%'),
                }}>
                {item.experience} {'\n'} {item.date} {'\n'} {item.user_name}{' '}
              </Text>
            </ViewMoreText>
            {/* <Text style={{ textAlign: 'center', color: 'white', fontSize: width * 0.035 }}>{item.experience} {"\n"} {item.date} {"\n"} {item.user_name} {item.team_name} </Text> */}
            {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'flex-end' }}>
                            {item.user_likes == 0 ? <TouchableOpacity onPress={() => this.like_click(item.id)}><Image
                                style={styles.like_icon}
                                source={require('../../uploads/heart1.png')}
                            /></TouchableOpacity> : <TouchableOpacity><Image
                                style={styles.like_icon}
                                source={require('../../uploads/liked_heart.png')}
                            /></TouchableOpacity>}
                            <Text style={styles.like_count}>
                                {item.total_likes} likes
                            </Text>
                        </View> */}
          </View>
        </Card>
      </View>
    );
  };
  sendLocalNotification = count => {

    if (Platform.OS == 'ios') {
      PushNotificationIOS.presentLocalNotification({
        alertBody: `Du har ${count} underretninger`,
        alertTitle: 'Diwo',
        applicationIconBadgeNumber: count,
        fireDate: new Date().toISOString(),
      });
    } else {
      PushNotification.localNotification({
        /* Android Only Properties */
  
        /* iOS and Android properties */
        title: 'Diwo', // (optional)
        message: `Du har ${count} underretningerhhaa`, // (required)
        playSound: false, // (optional) default: true
        // soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        // number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
        // actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
      });
    }
  };
  render() {
    var {height, width} = Dimensions.get('window');

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <StatusBar />
          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <ActivityIndicator size="large" color="#12075e" />
            </View>
          ) : null}
          {/* {this.state.loading && <View style={styles.spinner} pointerEvents={'none'} >
              <ActivityIndicator size="large" color="#19e600" animating={this.state.loading}/>
            </View>} */}
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
              padding: 8,
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
                    width: width > height ? wp('3.5%') : wp('6%'),
                    height: width > height ? wp('3%') : wp('6%'),
                  }}
                  source={require('../../uploads/drawer_menu.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginBottom: 12}}>
            <Carousel
              ref={c => {
                this._carousel = c;
              }}
              data={this.state.dataSource}
              renderItem={this._renderItem}
              // containerCustomStyle={{ flex: 2 }}
              sliderWidth={width * 1}
              itemWidth={width * 1}
              itemHeight={height * 1}
              autoplay={true}
              autoplayInterval={6000}
              loop={true}
            />
          </View>
          <View
            style={{
              flex: height * 0.01,
              paddingBottom: 10,
              backgroundColor: 'transparent',
            }}>
            <ScrollView>
              <Card borderRadius={15}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 0.2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={styles.diamond_icon}
                      source={require('../../uploads/diamond_img.png')}
                    />
                    {this.state.message_active == 1 ? (
                      <View style={styles.indicator}>
                        <Text></Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.question_card_text}>
                    <Text style={{fontSize: width * 0.042}}>
                      {Text_EN.Text_en.message_card_txt}
                    </Text>
                  </View>
                  <View style={{flex: 0.3, justifyContent: 'center'}}>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.message_Page()}>
                      <Text style={styles.submit_btn}>
                        {Text_EN.Text_en.home_msg_btn}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
              <Card borderRadius={15}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 0.2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={styles.diamond_icon}
                      source={require('../../uploads/diamond_img.png')}
                    />
                  </View>
                  <View style={styles.question_card_text}>
                    <Text style={{fontSize: width * 0.042}}>
                      {Text_EN.Text_en.experience_card_text}
                    </Text>
                  </View>
                  <View style={{flex: 0.3, justifyContent: 'center'}}>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.experience_Page()}>
                      <Text style={styles.submit_btn}>
                        {' '}
                        {Text_EN.Text_en.home_exp_share_btn}{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
              <Card borderRadius={15}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}>
                  <View
                    style={{
                      flex: 0.2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={styles.diamond_icon}
                      source={require('../../uploads/diamond_img.png')}
                    />
                    {this.state.isWorkjoy_active == 1 ? (
                      <View style={styles.indicator}>
                        <Text></Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.question_card_text}>
                    <Text style={{fontSize: width * 0.042}}>
                      {Text_EN.Text_en.workjoy_card_text}
                    </Text>
                  </View>
                  <View style={{flex: 0.3, justifyContent: 'center'}}>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.workjoyPage()}>
                      <Text style={styles.submit_btn}>
                        {' '}
                        {Text_EN.Text_en.home_btn_send}{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
              <Card borderRadius={15}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 0.2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={styles.diamond_icon}
                      source={require('../../uploads/diamond_img.png')}
                    />
                    {this.state.isSocialKapital_active == 1 ? (
                      <View style={styles.kapitalIndicator}>
                        <Text></Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.question_card_text}>
                    <Text style={{fontSize: width * 0.042}}>
                      {Text_EN.Text_en.socialkapital_card_text}
                    </Text>
                  </View>
                  <View style={{flex: 0.3, justifyContent: 'center'}}>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.socialkapital_Page()}>
                      <Text style={styles.submit_btn}>
                        {' '}
                        {Text_EN.Text_en.home_btn_send}{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            </ScrollView>
          </View>
          {/* <View style={{flex:1.2,flexDirection:'row',marginLeft:12,marginRight:12}}>
                <View style={styles.bottom_btn}>
                    <TouchableOpacity onPress={()=>this.help_workjoy()}>
                        <Text style={styles.bottom_btn_text}>{Text_EN.Text_en.bottom_btn_one_txt}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottom_btn}>
                    <TouchableOpacity onPress={()=>this.help_socialkapital()}>
                        <Text style={styles.bottom_btn_text}>{Text_EN.Text_en.bottom_btn_two_txt}</Text>
                    </TouchableOpacity>
                </View>                
                <View style={styles.bottom_btn}>
                    <TouchableOpacity onPress={()=>this.help_experience()}>
                        <Text style={styles.bottom_btn_text}>{Text_EN.Text_en.bottom_btn_three_txt}</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
          <HideWithKeyboard>
            <View style={{marginBottom: 0}}>
              {/* <Text style={{ textAlign: 'center' }}>{Text_EN.Text_en.register} <Text style={{ color: '#01a2ff', textDecorationLine: 'underline' }} onPress={() => Linking.openURL('http://diwo.nu/')}>{Text_EN.Text_en.click_here}</Text></Text> */}
              <Text style={{textAlign: 'center', marginBottom: 0}}>
                <Text style={{fontSize: 18}}>©</Text> Copyright FReFo
              </Text>
            </View>
          </HideWithKeyboard>
        </View>
      </SafeAreaView>
    );
  }
}
var {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  dynamic_list_view: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    //height: '80%'
  },
  icon: {
    width: 24,
    height: 24,
  },
  question_card_text: {
    flex: 0.5,
    paddingRight: 12,
    paddingLeft: 12,
  },
  bottom_btn: {
    width: '30.333%',
    backgroundColor: '#00a1ff',
    marginLeft: width * 0.028,
    marginTop: 0,
    marginBottom: 2,
    borderRadius: 10,
    justifyContent: 'center',
  },
  bottom_btn_text: {
    textAlign: 'center',
    color: 'white',
    fontSize: width * 0.042,
    padding: 10,
  },
  spinner: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2,
  },
  submit_btn: {
    textAlign: 'center',
    color: 'white',
    fontSize: width * 0.036,
    fontWeight: 'bold',
  },
  btn_view: {
    padding: 8,
    backgroundColor: '#00a1ff',
    borderRadius: 5,
  },
  diamond_icon: {
    width: width * 0.17,
    height: width * 0.1216,
  },
  like_count: {
    textAlign: 'right',
    color: 'white',
    marginTop: 5,
    fontSize: width * 0.038,
  },
  like_icon: {
    width: width * 0.057,
    height: width * 0.057,
    marginTop: 5,
    marginRight: 5,
    //backgroundColor: 'red'
  },
  indicator: {
    width: width * 0.05,
    height: width * 0.05,
    backgroundColor: '#00a1ff',
    borderRadius: 30,
    position: 'absolute',
    right: 0,
    top: -2,
    borderColor: 'white',
    borderWidth: 2.5,
  },
  kapitalIndicator: {
    width: width * 0.05,
    height: width * 0.05,
    backgroundColor: '#00a1ff',
    borderRadius: 30,
    position: 'absolute',
    right: 0,
    top: 10,
    borderColor: 'white',
    borderWidth: 2.5,
  },
  background_diamond: {
    position: 'absolute',
    width: width * 1,
    height: width * 0.9,
    bottom: -width * 0.3,
    right: -width * 0.28,
    opacity: 0.2,
    transform: [{rotate: '321deg'}],
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
});
