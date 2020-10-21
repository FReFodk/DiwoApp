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
  ActivityIndicator,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card} from 'react-native-elements';
import {Dialog} from 'react-native-simple-dialogs';
// import Text_EN from '../res/lang/static_text';
import {NavigationEvents, SafeAreaView} from 'react-navigation';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';
import {translate} from 'react-i18next';
import i18n from 'i18next';

class social_kapital extends Component {
  myInterval = '';
  constructor(props) {
    super(props);
    this._retrieveData = this._retrieveData.bind(this);
    this.state = {
      tokenValue: '',
      token: '',
      firstName: '',
      firstAnswer: '',
      secondAnswer: '',
      thirdAnswer: '',
      fourthAnswer: '',
      fiveAnswer: '',
      commentbox: false,
      commentText: '',
      errorAlert: false,
      activeBtn: 1,
      answerSend: false,
      loading: false,

      showOpen: true,
    };
    this._retrieveData();
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }
  page_reloaded = () => {
    this._retrieveData();
  };
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
    const {t} = this.props.screenProps;
    Alert.alert(
      t('common:sastisfaction_question'),
      t('common:workjoy_help_popup'),
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
    const {t} = this.props.screenProps;
    Alert.alert(
      t('common:social_kapital_question'),
      t('common:socialkapital_help_popup'),
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
    const {t} = this.props.screenProps;
    Alert.alert(
      t('common:why_answer'),
      t('common:experience_help_popup'),
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

  redirect_measurement = () => {
    this.props.navigation.navigate('Measurement', {
      Firstname: this.state.firstName,
      token: this.state.token,
    });
  };

  send_answer = () => {
    if (
      this.state.firstAnswer == '' ||
      this.state.secondAnswer == '' ||
      this.state.thirdAnswer == '' ||
      this.state.fourthAnswer == '' ||
      this.state.fiveAnswer == ''
    ) {
      this.setState({errorAlert: true});
    } else {
      var date = new Date().getDate(); //Current Date
      var month = new Date().getMonth() + 1; //Current Month
      var year = new Date().getFullYear(); //Current Year
      var hours = new Date().getHours(); //Current Hours
      var min = new Date().getMinutes(); //Current Minutes
      var sec = new Date().getSeconds(); //Current Seconds

      var reviewDate = year + '-' + month + '-' + date;
      var now =
        year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':' + sec;

      const user_details = this.state.token;
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.token;
      headers.append('Authorization', auth);

      // if(this.state.commentText==""){
      //   this.setState({commentText:" "});
      // }

      var data = new FormData();
      data.append('user_id', this.state.userId);
      data.append('review_date', reviewDate);
      data.append('comment', this.state.commentText);
      data.append('question1', this.state.firstAnswer);
      data.append('question2', this.state.secondAnswer);
      data.append('question3', this.state.thirdAnswer);
      data.append('question4', this.state.fourthAnswer);
      data.append('question5', this.state.fiveAnswer);
      data.append('last_review_date', now);
      console.log(data);
      this.setState({loading: true});
      fetch('http://diwo.nu/public/api/addSocialKapital', {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          console.log(responseJson);
          if (responseJson.status == 200) {
            console.log(responseJson);
            this.setState({answerSend: true, activeBtn: 0});
          } else {
            alert('Something went wrong.');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  inactive_press_comment = () => {
    const {t} = this.props.screenProps;
    Alert.alert(
      '',
      t('socail_capital:inactive_social_kapital_comment'),
      [
        {
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        // {text: 'Learn More', onPress: () => this.learnMore()},
      ],
      {cancelable: false},
    );
  };

  inactive_press = () => {
    const {t} = this.props.screenProps;
    Alert.alert(
      '',
      t('socail_capital:inactive_social_kapital_submit'),
      [
        {
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        // {text: 'Learn More', onPress: () => this.learnMore()},
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

  componentDidMount() {
    const {navigation} = this.props;
    this.setState({
      firstAnswer: '',
      secondAnswer: '',
      thirdAnswer: '',
      fourthAnswer: '',
      fiveAnswer: '',
    });
    const {t} = this.props.screenProps;

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
              userId: responseJson.user.user_id,
            });
          }
        })
        .catch(error => {
          console.error(error);
        });

      fetch('http://diwo.nu/public/api/lastAddedSocialkapital', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.status == 200) {
            console.log(responseJson);
            if (responseJson.kapital_data[0]) {
              this.setState({
                lastReviewDate: responseJson.kapital_data[0].last_review_date,
              });
              var date = responseJson.kapital_data[0].last_review_date;
              var z = date.split(/[- :]/);
              var d = new Date(z[0], z[1] - 1, z[2]);

              const {showOpen} = this.state;
              const now = new Date();
              if (d.getFullYear() !== now.getFullYear()) {
                if (now.getDate() >= 25) {
                  if (showOpen) {
                    alert(t('common:question_open'));
                    this.setState({activeBtn: 1, showOpen: false});
                  }
                } else {
                  this.setState({activeBtn: 0});
                }
              } else {
                if (d.getMonth() !== now.getMonth()) {
                  if (now.getDate() >= 25) {
                    if (showOpen) {
                      alert(t('common:question_open'));
                      this.setState({activeBtn: 1, showOpen: false});
                    }
                  } else {
                    this.setState({activeBtn: 0});
                  }
                } else {
                  this.setState({activeBtn: 0});
                }
              }

              // // Checking activation for the current month
              // var now = new Date();
              // let lastDate =
              //   this.getDaysInMonth(now.getMonth() + 1, now.getFullYear()) - 3;
              // let activationDate =
              //   now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + lastDate;
              // var activet = activationDate.split(/[- :]/);
              // let activeDate = new Date(activet[0], activet[1] - 1, activet[2]);
              // //console.log(activeDate);

              // // Checking activation for the Previous month
              // var now = new Date();
              // let PrevlastDate =
              //   this.getDaysInMonth(now.getMonth(), now.getFullYear()) - 3;
              // let PrevactivationDate =
              //   now.getFullYear() + '-' + now.getMonth() + '-' + PrevlastDate;
              // var Prevt = PrevactivationDate.split(/[- :]/);
              // let PrevactiveDate = new Date(Prevt[0], Prevt[1] - 1, Prevt[2]);
              // //console.log(PrevactiveDate);

              // //check if database date and previous month activation date is same or not
              // if (
              //   d.getTime() === PrevactiveDate.getTime() ||
              //   d.getTime() === activeDate.getTime()
              // ) {
              //   this.setState({activeBtn: 0});
              // } else {
              //   //Check for activation between the database date and current date.
              //   // let dateArray = [];
              //   // let count = 0;
              //   for (
              //     var dt = new Date(d);
              //     dt <= now;
              //     dt.setDate(dt.getDate() + 1)
              //   ) {
              //     console.log(dt);
              //     if (
              //       dt.getTime() === PrevactiveDate.getTime() ||
              //       dt.getTime() === activeDate.getTime()
              //     ) {
              //       console.log('if');
              //       this.setState({activeBtn: 1});
              //       break;
              //     } else if (dt.getTime() > activeDate.getTime()) {
              //       if (
              //         dt.getDate() > activeDate.getDate() &&
              //         dt.getMonth() + 1 == activeDate.getMonth() + 1
              //       ) {
              //         this.setState({activeBtn: 0});
              //       } else {
              //         console.log('In else if');
              //         this.setState({activeBtn: 1});
              //       }
              //     } else {
              //       console.log('else');
              //       this.setState({activeBtn: 0});
              //     }
              //     // dateArray.push(dt.getTime());
              //   }
              // }
            } else {
              const now = new Date();
              if (now.getDate() >= 27) {
                const {showOpen} = this.state;
                if (showOpen) {
                  alert(t('common:question_open'));
                  this.setState({activeBtn: 1, showOpen: false});
                }
              } else {
                this.setState({activeBtn: 0});
              }
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
  render() {
    var {height, width} = Dimensions.get('window');
    const {t} = this.props.screenProps;

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <ActivityIndicator size="large" color="#12075e" />
            </View>
          ) : null}
          <NavigationEvents
            onDidFocus={() => {
              this.page_reloaded();
            }}
          />
          <Dialog
            visible={this.state.commentbox}
            title={t('common:comments')}
            onTouchOutside={() => this.setState({commentbox: false})}>
            <View style={{position: 'relative', padding: 15}}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() => this.setState({commentbox: false})}>
                  <Image
                    style={{
                      width: width > height ? wp('3.5%') : wp('8%'),
                      height: width > height ? wp('3.5%') : wp('8%'),
                    }}
                    source={require('../../uploads/close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{paddingBottom: 10}}>
                <Text style={styles.dialog_txt}>
                  {t('socail_capital:social_kapital_commentbox')}
                </Text>
                <TextInput
                  style={{
                    borderColor: 'black',
                    marginTop: 15,
                    paddingLeft: 15,
                    borderWidth: 1,
                    textAlignVertical: 'top',
                    backgroundColor: 'white',
                    flexWrap: 'wrap',
                  }}
                  placeholder={t('socail_capital:write_comment')}
                  multiline={true}
                  fontSize={width > height ? wp('1.5') : wp('4%')}
                  numberOfLines={5}
                  onChangeText={commentText => this.setState({commentText})}
                />
              </View>
              <View style={styles.dialog_submit_btn}>
                <TouchableOpacity
                  color="#00a1ff"
                  onPress={() => this.setState({commentbox: false})}>
                  <Text
                    style={{
                      fontSize: width > height ? wp('1.5') : wp('3.5%'),
                      color: 'white',
                      fontWeight: 'bold',
                    }}>
                    {t('socail_capital:send_comment')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
          <Dialog
            visible={this.state.errorAlert}
            onTouchOutside={() => this.setState({errorAlert: false})}>
            <View style={{position: 'relative', padding: 15}}>
              <View style={styles.dialog_close_icon_submit}>
                <TouchableOpacity
                  onPress={() => this.setState({errorAlert: false})}>
                  <Image
                    style={{
                      width: width > height ? wp('3.5%') : wp('8%'),
                      height: width > height ? wp('3.5%') : wp('8%'),
                    }}
                    source={require('../../uploads/close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{paddingBottom: 10}}>
                <Text style={styles.dialog_txt}>
                  {t('socail_capital:social_kapital_error')}
                </Text>
              </View>
            </View>
          </Dialog>
          <Dialog
            visible={this.state.answerSend}
            onTouchOutside={() => this.setState({answerSend: false})}>
            <View style={{position: 'relative', padding: 15}}>
              <View style={styles.dialog_close_icon_submit}>
                <TouchableOpacity
                  onPress={() => this.setState({answerSend: false})}>
                  <Image
                    style={{
                      width: width > height ? wp('3.5%') : wp('8%'),
                      height: width > height ? wp('3.5%') : wp('8%'),
                    }}
                    source={require('../../uploads/close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{paddingBottom: 10}}>
                <Text style={styles.dialog_txt}>
                  {t('socail_capital:social_kapital_submit_message')}
                </Text>
              </View>
            </View>
          </Dialog>

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
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon name="chevron-left" size={30} color="#00a1ff" />
              </TouchableOpacity>
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
          <View style={{flex: 1, paddingBottom: 15, marginTop: 10}}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('More_info', {
                  Firstname: this.state.firstName,
                  token: this.state.token,
                })
              }>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.upper_txt}>{t('common:cooperation')}</Text>
                <Image
                  style={styles.diamond_icon_top}
                  source={require('../../uploads/diamond_img.png')}
                />
                <Text style={styles.upper_txt}>{t('common:trust')}</Text>
                <Image
                  style={styles.diamond_icon_top}
                  source={require('../../uploads/diamond_img.png')}
                />
                <Text style={styles.upper_txt}>{t('common:justice')}</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.social_title}>
              <Text style={{fontWeight: 'bold'}}>
                {t('socail_capital:social_kapital')}:{' '}
              </Text>
              {t('socail_capital:socialkapital_title')}
            </Text>
            <ScrollView>
              <Card borderRadius={15}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.diamond_css}>
                    <Image
                      style={styles.diamond_icon}
                      source={require('../../uploads/diamond_img.png')}
                    />
                  </View>
                  <View style={styles.question_card_text}>
                    <Text
                      style={{
                        fontSize: width > height ? wp('2.5%') : wp('3.5%'),
                      }}>
                      {t('socail_capital:socialkapital_question_one')}
                    </Text>
                  </View>
                  <View style={styles.icon_view}>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({firstAnswer: 'green'})}>
                      <Image
                        style={
                          this.state.firstAnswer == 'green'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/like.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({firstAnswer: 'yellow'})}>
                      <Image
                        style={
                          this.state.firstAnswer == 'yellow'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/normal.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({firstAnswer: 'red'})}>
                      <Image
                        style={
                          this.state.firstAnswer == 'red'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/dislike.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
              <Card borderRadius={15}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.diamond_css}>
                    <Image
                      style={styles.diamond_icon}
                      source={require('../../uploads/diamond_img.png')}
                    />
                  </View>
                  <View style={styles.question_card_text}>
                    <Text
                      style={{
                        fontSize: width > height ? wp('2.5%') : wp('3.5%'),
                      }}>
                      {t('socail_capital:socialkapital_question_two')}
                    </Text>
                  </View>
                  <View style={styles.icon_view}>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({secondAnswer: 'green'})}>
                      <Image
                        style={
                          this.state.secondAnswer == 'green'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/like.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({secondAnswer: 'yellow'})}>
                      <Image
                        style={
                          this.state.secondAnswer == 'yellow'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/normal.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({secondAnswer: 'red'})}>
                      <Image
                        style={
                          this.state.secondAnswer == 'red'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/dislike.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
              <Card borderRadius={15}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.diamond_css}>
                    <Image
                      style={styles.diamond_icon}
                      source={require('../../uploads/diamond_img.png')}
                    />
                  </View>
                  <View style={styles.question_card_text}>
                    <Text
                      style={{
                        fontSize: width > height ? wp('2.5%') : wp('3.5%'),
                      }}>
                      {t('socail_capital:socialkapital_question_three')}
                    </Text>
                  </View>
                  <View style={styles.icon_view}>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({thirdAnswer: 'green'})}>
                      <Image
                        style={
                          this.state.thirdAnswer == 'green'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/like.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({thirdAnswer: 'yellow'})}>
                      <Image
                        style={
                          this.state.thirdAnswer == 'yellow'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/normal.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({thirdAnswer: 'red'})}>
                      <Image
                        style={
                          this.state.thirdAnswer == 'red'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/dislike.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
              <Card borderRadius={15}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.diamond_css}>
                    <Image
                      style={styles.diamond_icon}
                      source={require('../../uploads/diamond_img.png')}
                    />
                  </View>
                  <View style={styles.question_card_text}>
                    <Text
                      style={{
                        fontSize: width > height ? wp('2.5%') : wp('3.5%'),
                      }}>
                      {t('socail_capital:socialkapital_question_four')}
                    </Text>
                  </View>
                  <View style={styles.icon_view}>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({fourthAnswer: 'green'})}>
                      <Image
                        style={
                          this.state.fourthAnswer == 'green'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/like.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({fourthAnswer: 'yellow'})}>
                      <Image
                        style={
                          this.state.fourthAnswer == 'yellow'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/normal.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({fourthAnswer: 'red'})}>
                      <Image
                        style={
                          this.state.fourthAnswer == 'red'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/dislike.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
              <Card borderRadius={15}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.diamond_css}>
                    <Image
                      style={styles.diamond_icon}
                      source={require('../../uploads/diamond_img.png')}
                    />
                  </View>
                  <View style={styles.question_card_text}>
                    <Text
                      style={{
                        fontSize: width > height ? wp('2.5%') : wp('3.5%'),
                      }}>
                      {t('socail_capital:socialkapital_question_five')}
                    </Text>
                  </View>
                  <View style={styles.icon_view}>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({fiveAnswer: 'green'})}>
                      <Image
                        style={
                          this.state.fiveAnswer == 'green'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/like.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({fiveAnswer: 'yellow'})}>
                      <Image
                        style={
                          this.state.fiveAnswer == 'yellow'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/normal.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btn_view}
                      onPress={() => this.setState({fiveAnswer: 'red'})}>
                      <Image
                        style={
                          this.state.fiveAnswer == 'red'
                            ? styles.active_review_icon
                            : styles.review_icon
                        }
                        source={require('../../uploads/dislike.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>

              <View style={styles.submit_btn}>
                <TouchableOpacity onPress={() => this.redirect_measurement()}>
                  <Text style={styles.btn_txt}>
                    {t('socail_capital:link_measurement_btn')}
                  </Text>
                </TouchableOpacity>
                {this.state.activeBtn == 0 ? (
                  <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() => this.inactive_press()}>
                    <Text style={styles.inactive_btn_txt}>
                      {t('socail_capital:submit_answer')}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() => this.send_answer()}>
                    <Text style={styles.btn_txt}>
                      {t('socail_capital:submit_answer')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* <TouchableOpacity style={styles.redirect_submit_btn} onPress={()=>this.redirect_measurement()}>
                <Text style={styles.btn_redirect}>{Text_EN.Text_en.link_measurement_btn}</Text>
            </TouchableOpacity> */}
            </ScrollView>
          </View>
          {/* <View style={{flex:0.2,flexDirection:'row',marginLeft:12,marginRight:12}}>
          <View style={styles.bottom_btn}>
            <TouchableOpacity onPress={()=>this.help_workjoy()}>
                <Text style={styles.bottom_btn_txt}>{Text_EN.Text_en.bottom_btn_one_txt}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottom_btn}>
            <TouchableOpacity onPress={()=>this.help_socialkapital()}>
                <Text style={styles.bottom_btn_txt}>{Text_EN.Text_en.bottom_btn_two_txt}</Text>
            </TouchableOpacity>
          </View>                
          <View style={styles.bottom_btn}>
            <TouchableOpacity onPress={()=>this.help_experience()}>
                <Text style={styles.bottom_btn_txt}>{Text_EN.Text_en.bottom_btn_three_txt}</Text>
            </TouchableOpacity>
          </View>
        </View> */}
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

export default translate(['home', 'common'], {wait: true})(social_kapital);

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  social_title: {
    fontSize: width > height ? wp('2%') : wp('4%'),
    padding: 25,
    paddingBottom: 10,
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
  btn_txt: {
    textAlign: 'center',
    color: 'white',
    fontSize: width > height ? wp('2.5%') : wp('4%'),
    padding: 13,
    backgroundColor: '#00a1ff',
    borderRadius: 5,
  },
  inactive_btn_txt: {
    textAlign: 'center',
    color: 'white',
    fontSize: width > height ? wp('2.5%') : wp('4%'),
    padding: 13,
    backgroundColor: '#87d9f7',
    borderRadius: 5,
  },
  bottom_btn_txt: {
    textAlign: 'center',
    color: 'white',
    fontSize: width * 0.042,
    padding: 10,
    backgroundColor: '#00a1ff',
  },
  question_card_text: {
    flex: 0.5,
    paddingRight: 12,
    paddingLeft: 12,
  },
  diamond_icon: {
    width: width > height ? wp('8%') : wp('13%'),
    height: width > height ? wp('8%') : wp('13%'),
  },
  review_icon: {
    width: width > height ? wp('6%') : wp('10%'),
    height: width > height ? wp('6%') : wp('10%'),
    opacity: 0.3,
  },
  active_review_icon: {
    width: width > height ? wp('6%') : wp('10%'),
    height: width > height ? wp('6%') : wp('10%'),
    opacity: 1,
  },
  submit_btn: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  btn_view: {
    borderRadius: 5,
  },
  diamond_css: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon_view: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
  dialog_submit_btn: {
    marginTop: 10,
    marginRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#00a1ff',
  },
  dialog_close_icon: {
    paddingBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    top: -55,
    right: -5,
  },
  dialog_close_icon_submit: {
    paddingBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 0,
    right: -5,
  },
  dialog_txt: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: width > height ? wp('2%') : wp('4%'),
    width: width > height ? wp('80%') : wp('75%'),
  },
  diamond_icon_top: {
    width: width > height ? wp('4%') : wp('6%'),
    height: width > height ? wp('4%') : wp('6%'),
    marginLeft: 5,
    marginRight: 5,
  },
  upper_txt: {
    fontSize: width > height ? wp('2%') : wp('4%'),
    color: '#038fc1',
    fontWeight: 'bold',
  },
  btn_redirect: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  redirect_submit_btn: {
    marginTop: 10,
    marginRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#00a1ff',
  },
  spinner: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 2,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffab',
  },
});
