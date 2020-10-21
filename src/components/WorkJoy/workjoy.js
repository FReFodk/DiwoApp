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
  CheckBox,
} from 'react-native';
import Checkbox from '@react-native-community/checkbox'
import AsyncStorage from '@react-native-community/async-storage';
import {Card} from 'react-native-elements';
import {Dialog} from 'react-native-simple-dialogs';
// import Text_EN from '../res/lang/static_text';
import {NavigationEvents, SafeAreaView} from 'react-navigation';
import MultiSelect from 'react-native-multiple-select';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';
import Carousel from 'react-native-snap-carousel';
import {translate} from 'react-i18next';
import i18n from 'i18next';

class home extends Component {
  myInterval = '';
  Newitem = [];
  constructor(props) {
    super(props);
    this._retrieveData = this._retrieveData.bind(this);
    this.state = {
      tokenValue: '',
      token: '',
      firstName: '',
      dataSource: '',
      yellow_selected: 1,
      red_selected: '',
      green_selected: '',
      count: 0,
      greenDialogVisible: false,
      redDialogVisible: false,
      yellowDialogVisible: false,
      threeTimesRed: false,
      lastReviewDate: '',
      submit_btn_active: 0,
      userId: '',
      commentBox: false,
      commentText: '',
      last_inserted_id: '',
      message_dialog: false,
      message_title: '',
      message_text: '',
      title: '',
      message: '',
      selectedItems: [],
      errorText: '',
      redMessage_dialog: false,
      loading: false,

      gotoShareBox: false,
      isGotoShare: false,

      isFocusTextArea: false,
      searchText: '',
      listItemCheck: [],

      showOpen: true,
    };
    this._retrieveData();
    this.yellow_selected = this.yellow_selected.bind(this);
    this.red_selected = this.red_selected.bind(this);
    this.green_selected = this.green_selected.bind(this);
    this.page_reloaded = this.page_reloaded.bind(this);
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }
  onSelectedItemsChange = selectedItems => {
    this.setState({
      selectedItems,
      errorText: false,
    });
  };
  page_reloaded() {
    this._retrieveData();
  }
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      if (value !== null) {
        this.setState({
          token: JSON.parse(value),
          count: 1,
        });
        this.componentDidMount();
      }
    } catch (error) {
      alert(error);
    }
  };
  red_selected() {
    this.setState({
      yellow_selected: '',
      green_selected: '',
      red_selected: 1,
    });
  }
  green_selected() {
    this.setState({
      yellow_selected: '',
      green_selected: 1,
      red_selected: '',
    });
  }
  yellow_selected() {
    this.setState({
      yellow_selected: 1,
      green_selected: '',
      red_selected: '',
    });
  }

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
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Learn More',
          onPress: () => this.learnMore(),
        },
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
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Learn More',
          onPress: () => this.learnMore(),
        },
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
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Learn More',
          onPress: () => this.learnMore(),
        },
      ],
      {cancelable: false},
    );
  };

  send_answer = () => {
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

    const {t} = this.props.screenProps;

    if (this.state.green_selected == 1) {
      var review_value = t('workjoy:workjoy_green_selected');
      var data = new FormData();
      data.append('user_id', this.state.userId);
      data.append('review_date', reviewDate);
      data.append('review', review_value);
      data.append('last_review_date', now);
      console.log(data);
      this.setState({loading: true});
      fetch('http://diwo.nu/public/api/addWorkJoy', {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          if (responseJson.status == 200) {
            console.log(responseJson);
            this.setState({submit_btn_active: 0});
            this.setState({
              commentBox: true,
              isGotoShare: true,
            });
            this.setState({
              last_inserted_id: responseJson.last_inserted_id,
            });
          } else {
            alert('Something went wrong. Please try later.');
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else if (this.state.red_selected == 1) {
      var review_value = t('workjoy:workjoy_red_selected');
      var data = new FormData();
      data.append('user_id', this.state.userId);
      data.append('review_date', reviewDate);
      data.append('review', review_value);
      data.append('last_review_date', now);
      console.log(data);
      this.setState({loading: true});
      fetch('http://diwo.nu/public/api/addWorkJoy', {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          if (responseJson.status == 200) {
            console.log(responseJson);
            this.setState({submit_btn_active: 0});
            this.setState({
              last_inserted_id: responseJson.last_inserted_id,
            });
            this.setState({loading: true});
            fetch('http://diwo.nu/public/api/latestWorkJoy', {
              method: 'POST',
              headers: headers,
            })
              .then(response => response.json())
              .then(responseJson => {
                this.setState({loading: false});
                if (responseJson.status == 200) {
                  let count = 0;
                  for (var i = 0; i < responseJson.workjoy_data.length; i++) {
                    if (responseJson.workjoy_data[i].review == review_value) {
                      count = count + 1;
                    } else {
                      console.log('else');
                      count = 0;
                    }
                    // console.log(count);console.log("if");
                  }
                  if (count >= 3) {
                    this.setState({
                      redDialogVisible: true,
                      threeTimesRed: true,
                    });
                  } else {
                    this.setState({
                      redDialogVisible: true,
                      isGotoShare: false,
                    });
                  }
                } else {
                  alert('Something went wrong. Please try later.');
                }
              })
              .catch(error => {
                console.error(error);
              });
          } else {
            alert('Something went wrong. Please try later.');
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      var review_value = t('workjoy:workjoy_yellow_selected');
      var data = new FormData();
      data.append('user_id', this.state.userId);
      data.append('review_date', reviewDate);
      data.append('review', review_value);
      data.append('last_review_date', now);
      console.log(data);
      this.setState({loading: true});
      fetch('http://diwo.nu/public/api/addWorkJoy', {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({loading: false});
          if (responseJson.status == 200) {
            console.log(responseJson);
            this.setState({submit_btn_active: 0});
            this.setState({
              yellowDialogVisible: true,
              isGotoShare: false,
            });
            this.setState({
              last_inserted_id: responseJson.last_inserted_id,
            });
          } else {
            alert('Something went wrong. Please try later.');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  save_comment = () => {
    console.log(this.state.commentText);
    console.log(this.state.last_inserted_id);
    const user_details = this.state.token;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.token;
    headers.append('Authorization', auth);

    var data = new FormData();
    data.append('id', this.state.last_inserted_id);
    data.append('comments', this.state.commentText);
    console.log(data);
    this.setState({loading: true});
    fetch('http://diwo.nu/public/api/updateCommentsWorkJoy', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({loading: false});
        if (responseJson) {
          console.log(responseJson);
          if( this.state.green_selected == 1) {
            this.setState({
              commentBox: false,
              greenDialogVisible: true,
              redMessage_dialog: false,

              gotoShareBox: false,
            });
          } else if (this.state.isGotoShare) {
            this.setState({
              commentBox: false,
              greenDialogVisible: false,
              redMessage_dialog: false,

              gotoShareBox: true,
            });
          } else {
            this.setState({
              commentBox: false,
              greenDialogVisible: false,
              redMessage_dialog: false,
            });
          }
        } else {
          alert('Something went wrong. Please try later.');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  inactive_press = () => {
    const {t} = this.props.screenProps;
    Alert.alert(
      '',
      t('workjoy:inactive_workjoy_submit'),
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

  experience_Page = () => {
    this.props.navigation.navigate('Experience', {
      Firstname: this.state.firstName,
      token: this.state.token,
    });
    this.setState({greenDialogVisible: false});
  };

  redirect_measurement = () => {
    this.props.navigation.navigate('Measurement', {
      Firstname: this.state.firstName,
      token: this.state.token,
    });
  };

  redMessage_Send = () => {
    console.log(this.state.message_title);
    console.log(this.state.message_text);
    console.log(this.state.selectedItems.toString());
    let rec_id = this.state.selectedItems.toString();
    if (
      rec_id.length > 0 &&
      this.state.message_title.length > 0 &&
      this.state.message_text.length > 0
    ) {
      const user_details = this.state.token;
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.token;
      headers.append('Authorization', auth);

      var data = new FormData();
      data.append('receiver_id', rec_id);
      data.append('title', this.state.message_title);
      data.append('message', this.state.message_text);
      console.log(data);
      this.setState({loading: true});
      fetch('http://diwo.nu/public/api/sendMessage', {
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
            this.setState({
              redMessage_dialog: false,
              message_dialog: false,
              title: '',
              message_title: '',
              message_text: '',
              selectedItems: [],
              threeTimesRed: false,
              commentBox: true,
            });
          } else {
            alert('Something went wrong.');
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      this.setState({errorText: true});
    }
  };

  message_send = () => {
    console.log(this.state.message_title);
    console.log(this.state.message_text);
    console.log(this.state.selectedItems.toString());
    let rec_id = this.state.selectedItems.toString();
    if (
      rec_id.length > 0 &&
      this.state.message_title.length > 0 &&
      this.state.message_text.length > 0
    ) {
      const user_details = this.state.token;
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.token;
      headers.append('Authorization', auth);

      var data = new FormData();
      data.append('receiver_id', rec_id);
      data.append('title', this.state.message_title);
      data.append('message', this.state.message_text);
      console.log(data);
      this.setState({loading: true});
      fetch('http://diwo.nu/public/api/sendMessage', {
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
            const {listItemCheck} = this.state;
            const temp = [];
            for (let item of listItemCheck) {
              temp.push(false);
            }

            this.setState({
              message_dialog: false,
              title: '',
              message_title: '',
              message_text: '',
              selectedItems: [],
              listItemCheck: [...temp],
              threeTimesRed: false,
              commentBox: true,
              redDialogVisible: false,
              yellowDialogVisible: false,
            });
          } else {
            alert('Something went wrong.');
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      this.setState({errorText: true});
    }
  };

  gotoMessage() {
    this.setState({
      redDialogVisible: false,
      errorText: false,
    });
    this.setState({yellowDialogVisible: false});
    AsyncStorage.setItem('isOpenMessage', 'true');
    this.props.navigation.navigate('Message', {
      Firstname: this.state.firstName,
      token: this.state.token,
    });
  }

  componentDidMount() {
    this.setState({
      yellow_selected: 1,
      red_selected: 0,
      green_selected: 0,
    });
    const {navigation} = this.props;
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

      fetch('http://diwo.nu/public/api/lastAddedWorkJoy', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.status == 200) {
            console.log(responseJson);
            if (responseJson.workjoy_data && responseJson.workjoy_data[0]) {
              this.setState({
                lastReviewDate: responseJson.workjoy_data[0].last_review_date,
              });

              var date = responseJson.workjoy_data[0].last_review_date;
              var z = date.split(/[- :]/);
              var d = new Date(z[0], z[1] - 1, z[2], z[3], z[4], z[5]);
              console.log('lastReviewDate: ' + d + 'Today: ' + new Date());
              let dayWord = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ];
              // var day = new Date().getDay(); //Current Date
              // var month = new Date().getMonth() + 1; //Current month
              // var year = new Date().getFullYear(); //Current year
              // var hours = new Date().getHours(); //Current Hours
              // var min = new Date().getMinutes();

              var now = new Date();
              const {showOpen} = this.state;
              console.log(
                'Day of week today ' +
                  now.getDay() +
                  ' Day of week last lastReviewDate  ' +
                  d.getDay(),
              );
              if (
                // now is 5, lastrw is 2
                (now.getDay() >= 4 && now.getDay() <= 6) || now.getDay() == 0
              ) {
                  var sunday = this.getSunday();
                  if (d<sunday){
                      if (showOpen) {
                        alert(t('common:question_open'));
                        this.setState({submit_btn_active: 1, showOpen: false});
                      }
                    } else this.setState({submit_btn_active: 0});
              } else {
                this.setState({submit_btn_active: 0});
              }

              // for (
              //   var dt = new Date(d);
              //   dt <= now;
              //   dt.setDate(dt.getDate() + 1)
              // ) {
              //   if (dayWord[dt.getDay()] == 'Thursday') {
              //     if (
              //       dt.getDate() == d.getDate() &&
              //       dt.getMonth() == d.getMonth() &&
              //       dt.getFullYear() == d.getFullYear()
              //     ) {
              //       this.setState({submit_btn_active: 0});
              //     } else {
              //       this.setState({submit_btn_active: 1});
              //     }
              //     if (
              //       dt.getDate() == now.getDate() &&
              //       dt.getMonth() == now.getMonth() &&
              //       dt.getFullYear() == now.getFullYear()
              //     ) {
              //       this.setState({submit_btn_active: 0});
              //     }
              //   }
              // }
              // if (dayWord[now.getDay()] == 'Thursday') {
              //   this.setState({submit_btn_active: 1});
              // }
              // // var currentDate = year +'-'+ month +'-'+day;
              // var currentTime = dayWord[day] + ':' + hours + ':' + min;
              // if (currentTime == 'Thursday:12:00') {
              //   this.setState({submit_btn_active: 1});
              // }
            } else {
              if ((now.getDay() >= 4 && now.getDay() <= 5)|| now.getDay() == 0) {
                const {showOpen} = this.state;

                if (showOpen) {
                  alert(t('common:question_open'));
                  this.setState({submit_btn_active: 1, showOpen: false});
                }
              } else {
                this.setState({submit_btn_active: 0});
              }
            }
          }
        })
        .catch(error => {
          console.error(error);
        });

      fetch('http://diwo.nu/public/api/getAllUserInfo', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          //this.setState({item:responseJson.users[0].user_id});
          this.Newitem = [];
          for (var i = 0; i < responseJson.users.length; i++) {
            var id = responseJson.users[i].user_id;
            var name =
              responseJson.users[i].first_name +
              ' ' +
              responseJson.users[i].last_name;
            console.log(id);
            this.Newitem.push({
              id: id,
              name: name,
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  getThursday(){
    let d = new Date();
    let day = d.getDay();
    let diff = d.getDate() - day + 4;
    const rt = new Date(d.setDate(diff));
    return new Date(rt).setHours(0,0,0,0);
  }
  getSunday(){
    let d = new Date();
    let day = d.getDay();
    if (day == 0) day = 7;
    let diff = d.getDate() - day;
    const rt = new Date(d.setDate(diff));
    return new Date(rt).setHours(23,59,59,999);
  }
  pickUser = (index, itemId) => {
    const listItemCheck = [...this.state.listItemCheck];
    const selectedItems = [...this.state.selectedItems];

    const i = selectedItems.findIndex(it => it === itemId);

    if (listItemCheck[index]) {
      listItemCheck[index] = false;
      selectedItems.splice(i, 1);
    } else {
      listItemCheck[index] = true;
      selectedItems.push(itemId);
    }
    console.log(selectedItems);

    this.setState({
      listItemCheck: listItemCheck,
      selectedItems: selectedItems,
    });
  };

  _renderItem = ({item, index}) => {
    const {t} = this.props.screenProps;
    if (index === 0) {
      return (
        <View
          style={{
            position: 'relative',
            padding: 15,
            maxHeight: 550,
          }}>
          <View
            style={{
              paddingBottom: 10,
              marginTop: 50,
            }}>
            {this.state.errorText == true ? (
              <Text
                style={{
                  paddingLeft: 15,
                  color: 'red',
                }}>
                {t('common:select_user_error')}
              </Text>
            ) : null}

            <Text
              style={{
                textAlign: 'right',
                color: '#bdbdbd',
              }}>
              {t('workjoy:slide_to_write')}
            </Text>

            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
              }}>
              {t('workjoy:choose_receiver')}
            </Text>

            <TextInput
              onFocus={() =>
                this.setState({
                  isFocusTextArea: true,
                })
              }
              style={{
                ...styles.Text_input_title,
                paddingLeft: 0,
              }}
              placeholder={t('common:search')}
              onChangeText={text => this.setState({searchText: text})}
              onBlur={() =>
                this.setState({
                  isFocusTextArea: false,
                })
              }
            />
            <ScrollView
              style={{
                marginBottom: this.state.isFocusTextArea ? wp('55%') : 0,
              }}>
              {this.Newitem.map((item, index) => {
                const search = this.state.searchText.toLowerCase();
                const itemName = item.name.toLowerCase();

                const {listItemCheck} = this.state;

                if (itemName.indexOf(search) !== -1) {
                  return (
                    <View style={styles._container}>
                      <View style={styles.checkboxContainer}>
                        <Checkbox
                          value={listItemCheck[index]}
                          onValueChange={() => this.pickUser(index, item.id)}
                          style={styles.checkbox}
                        />
                        <TouchableOpacity>
                          <Text
                            onPress={() => this.pickUser(index, item.id)}
                            style={styles.label}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }
                return null;
              })}
            </ScrollView>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            position: 'relative',
            padding: 15,
            maxHeight: 550,
          }}>
          <View
            style={{
              paddingBottom: 10,
              marginTop: 50,
            }}>
            {this.state.errorText == true ? (
              <Text
                style={{
                  paddingLeft: 15,
                  color: 'red',
                }}>
                {t('common:select_user_error')}
              </Text>
            ) : null}

            <TextInput
              defaultValue={this.state.message_title}
              style={styles.Text_input_title}
              placeholder={t('common:title')}
              onChangeText={message_title =>
                this.setState({
                  message_title,
                  errorText: false,
                })
              }
            />
            {this.state.errorText == true ? (
              <Text
                style={{
                  paddingLeft: 15,
                  color: 'red',
                }}
              />
            ) : null}
            <TextInput
              defaultValue={this.state.message_text}
              style={styles.Text_input_message}
              placeholder={t('common:comment_to_mng')}
              multiline={true}
              numberOfLines={5}
              onChangeText={message_text =>
                this.setState({
                  message_text,
                  errorText: false,
                })
              }
            />
            <View style={styles.dialog_submit_btn}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#00a1ff',
                  padding: 10,
                  paddingRight: 25,
                  paddingLeft: 25,
                  borderRadius: 5,
                  marginBottom: 20,
                }}
                onPress={() => {
                  this.message_send();
                }}>
                <Text style={styles.submit_btn}>
                  {t('common:send_message')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  };

  render() {
    const {selectedItems} = this.state;
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
              console.log('DID FOCUS workjoy')
              this.page_reloaded();
            }}
          />
          {/* <Dialog
            visible={this.state.message_dialog}
            onTouchOutside={() =>
              this.setState({
                message_dialog: false,
                errorText: false,
              })
            }>
            <View
              style={{
                position: 'relative',
                padding: 15,
              }}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      message_dialog: false,
                      errorText: false,
                    })
                  }>
                  <Image
                    style={{
                      width: width > height ? wp('3.5%') : wp('8%'),
                      height: width > height ? wp('3.5%') : wp('8%'),
                    }}
                    source={require('../../uploads/close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingBottom: 10,
                  marginTop: 50,
                }}>
                {this.state.errorText == true ? (
                  <Text
                    style={{
                      paddingLeft: 15,
                      color: 'red',
                      fontSize: width > height ? wp('1.5%') : wp('2.6%'),
                    }}>
                    {Text_EN.Text_en.select_user_error}
                  </Text>
                ) : null}
                <MultiSelect
                  styleTextDropdown={{
                    paddingLeft: 15,
                  }}
                  styleTextDropdownSelected={{
                    paddingLeft: 15,
                  }}
                  styleDropdownMenu={{
                    marginTop: 20,
                  }}
                  hideSubmitButton
                  hideTags
                  items={this.Newitem}
                  uniqueKey="id"
                  ref={component => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={this.onSelectedItemsChange}
                  selectedItems={selectedItems}
                  selectText="Users"
                  fontSize={width > height ? wp('1.5%') : wp('4%')}
                  searchInputPlaceholderText="Search Name..."
                  onChangeInput={text => console.log(text)}
                  tagRemoveIconColor="#68c5fc"
                  tagBorderColor="#68c5fc"
                  tagTextColor="#68c5fc"
                  selectedItemTextColor="#68c5fc"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{
                    color: '#CCC',
                  }}
                  submitButtonColor="#48d22b"
                  submitButtonText="Submit"
                />
                <TextInput
                  defaultValue={this.state.message_title}
                  style={styles.Text_input_title}
                  placeholder={Text_EN.Text_en.title}
                  onChangeText={message_title =>
                    this.setState({
                      message_title,
                      errorText: false,
                    })
                  }
                />
                {this.state.errorText == true ? (
                  <Text
                    style={{
                      paddingLeft: 15,
                      color: 'red',
                    }}
                  />
                ) : null}
                <TextInput
                  defaultValue={this.state.message_text}
                  style={styles.Text_input_message}
                  placeholder="Kommentar til din leder"
                  multiline={true}
                  numberOfLines={8}
                  onChangeText={message_text =>
                    this.setState({
                      message_text,
                      errorText: false,
                    })
                  }
                />
              </View>
              <View style={styles.dialog_submit_btn}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 25,
                    paddingLeft: 25,
                    borderRadius: 5,
                  }}
                  onPress={() => this.message_send()}>
                  <Text style={styles.submit_btn}>
                    {Text_EN.Text_en.send_message}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
           */}

          <Dialog
            visible={this.state.message_dialog}
            onTouchOutside={() => {
              const {listItemCheck} = this.state;
              const temp = [];
              for (let item of listItemCheck) {
                temp.push(false);
              }
              this.setState({
                message_dialog: false,
                errorText: false,
                message_title: '',
                message_text: '',
                selectedItems: [],
                listItemCheck: [...temp],
              });
            }}>
            <View
              style={{
                position: 'relative',
                padding: 15,
              }}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() => {
                    const {listItemCheck} = this.state;
                    const temp = [];
                    for (let item of listItemCheck) {
                      temp.push(false);
                    }

                    this.setState({
                      message_dialog: false,
                      errorText: false,
                      message_title: '',
                      message_text: '',
                      selectedItems: [],
                      listItemCheck: [...temp],
                    });
                  }}>
                  <Image
                    style={{
                      width: width > height ? wp('3.5%') : wp('8%'),
                      height: width > height ? wp('3.5%') : wp('8%'),
                    }}
                    source={require('../../uploads/close.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Carousel
              ref={c => {
                this._carousel = c;
              }}
              data={[1, 2]}
              renderItem={this._renderItem}
              sliderWidth={wp('73%')}
              itemWidth={wp('73%')}
            />
          </Dialog>

          <Dialog
            visible={this.state.redMessage_dialog}
            onTouchOutside={() =>
              this.setState({
                redMessage_dialog: false,
                errorText: false,
              })
            }>
            <View
              style={{
                position: 'relative',
                padding: 15,
              }}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      redMessage_dialog: false,
                      errorText: false,
                    })
                  }>
                  <Image
                    style={{
                      width: width > height ? wp('3.5%') : wp('8%'),
                      height: width > height ? wp('3.5%') : wp('8%'),
                    }}
                    source={require('../../uploads/close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingBottom: 10,
                  marginTop: 50,
                }}>
                {this.state.errorText == true ? (
                  <Text
                    style={{
                      paddingLeft: 15,
                      color: 'red',
                      fontSize: width > height ? wp('1.5%') : wp('2.6%'),
                    }}>
                    {t('common:select_user_error')}
                  </Text>
                ) : null}
                <MultiSelect
                  styleTextDropdown={{
                    paddingLeft: 15,
                  }}
                  styleTextDropdownSelected={{
                    paddingLeft: 15,
                  }}
                  styleDropdownMenu={{
                    marginTop: 20,
                  }}
                  hideSubmitButton
                  hideTags
                  items={this.Newitem}
                  uniqueKey="id"
                  ref={component => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={this.onSelectedItemsChange}
                  selectedItems={selectedItems}
                  selectText="Users"
                  fontSize={width > height ? wp('1.5%') : wp('4%')}
                  searchInputPlaceholderText="Search Name..."
                  onChangeInput={text => console.log(text)}
                  tagRemoveIconColor="#68c5fc"
                  tagBorderColor="#68c5fc"
                  tagTextColor="#68c5fc"
                  selectedItemTextColor="#68c5fc"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{
                    color: '#CCC',
                  }}
                  submitButtonColor="#48d22b"
                  submitButtonText="Submit"
                />
                <TextInput
                  defaultValue={this.state.message_title}
                  style={styles.Text_input_title}
                  placeholder={t('common:title')}
                  onChangeText={message_title =>
                    this.setState({
                      message_title,
                      errorText: false,
                    })
                  }
                />
                {this.state.errorText == true ? (
                  <Text
                    style={{
                      paddingLeft: 15,
                      color: 'red',
                    }}
                  />
                ) : null}
                <TextInput
                  defaultValue={this.state.message_text}
                  style={styles.Text_input_message}
                  placeholder={t('common:comment_to_mng')}
                  multiline={true}
                  numberOfLines={8}
                  onChangeText={message_text =>
                    this.setState({
                      message_text,
                      errorText: false,
                    })
                  }
                />
              </View>
              <View style={styles.dialog_submit_btn}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 25,
                    paddingLeft: 25,
                    borderRadius: 5,
                  }}
                  onPress={() => this.redMessage_Send()}>
                  <Text style={styles.submit_btn}>
                    {t('common:send_message')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
          <Dialog
            visible={this.state.greenDialogVisible}
            onTouchOutside={() =>
              this.setState({
                greenDialogVisible: false,
              })
            }>
            <View
              style={{
                position: 'relative',
                padding: 15,
              }}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      greenDialogVisible: false,
                    })
                  }>
                  <Image
                    style={{
                      width: width > height ? wp('3.5%') : wp('8%'),
                      height: width > height ? wp('3.5%') : wp('8%'),
                    }}
                    source={require('../../uploads/close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingBottom: 10,
                  marginTop: 50,
                }}>
                <Text style={styles.dialog_txt}>
                  {t('workjoy:workjoy_greenselected_popup')}
                </Text>
              </View>
              <View style={styles.dialog_submit_btn}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 15,
                    paddingLeft: 15,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.setState({
                      greenDialogVisible: false,
                      gotoShareBox: false,
                    });
                    
                  }
                  }
                  // onPress={() => {
                  //   this.setState({
                  //     commentBox: true,
                  //     greenDialogVisible: false,
                  //   });
                  // }}
                >
                  <Text style={styles.submit_btn}>{t('common:no')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginLeft: 15,
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 15,
                    paddingLeft: 15,
                    borderRadius: 5,
                  }}
                  // onPress={() => this.experience_Page()}
                  onPress={() => {
                    this.setState({
                      commentBox: false,
                      greenDialogVisible: false,
                    });
                    this.experience_Page()
                  }}>
                  <Text style={styles.submit_btn}>{t('common:yes')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
          <Dialog
            visible={this.state.redDialogVisible}
            onTouchOutside={() =>
              this.setState({
                redDialogVisible: false,
              })
            }>
            <View
              style={{
                position: 'relative',
                padding: 15,
              }}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      redDialogVisible: false,
                    })
                  }>
                  <Image
                    style={{
                      width: width > height ? wp('3.5%') : wp('8%'),
                      height: width > height ? wp('3.5%') : wp('8%'),
                    }}
                    source={require('../../uploads/close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingBottom: 10,
                  marginTop: 50,
                }}>
                <Text style={styles.dialog_txt}>
                  {this.state.threeTimesRed
                    ? t('workjoy:three_time_red')
                    : t('workjoy:workjoy_redselected_popup')}
                </Text>
              </View>
              <View style={styles.dialog_submit_btn}>
                {this.state.threeTimesRed ? null : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#00a1ff',
                      padding: 10,
                      paddingRight: 15,
                      paddingLeft: 15,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      this.setState({
                        commentBox: true,
                        redDialogVisible: false,
                      });
                    }}>
                    <Text style={styles.submit_btn}>{t('common:no')}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{
                    marginLeft: 15,
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 25,
                    paddingLeft: 25,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    // this.gotoMessage();
                    this.setState({
                      redDialogVisible: false,
                      message_dialog: true,
                    });
                  }}>
                  <Text style={styles.submit_btn}>
                    {t('common:send_message')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
          {/* <Dialog
            visible={this.state.threeTimesRed}
            onTouchOutside={() =>
              this.setState({
                threeTimesRed: false,
              })
            }>
            <View
              style={{
                position: 'relative',
                padding: 15,
              }}>
              <View style={{paddingBottom: 10}}>
                <Text style={styles.dialog_txt}>
                  {Text_EN.Text_en.three_time_red}
                </Text>
              </View>
              <View style={styles.dialog_submit_btn}>
                <TouchableOpacity
                  style={{
                    marginLeft: 15,
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 25,
                    paddingLeft: 25,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.setState({
                      redMessage_dialog: true,
                    });
                  }}>
                  <Text style={styles.submit_btn}>
                    {Text_EN.Text_en.send_message}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
           */}
          <Dialog
            visible={this.state.yellowDialogVisible}
            onTouchOutside={() =>
              this.setState({
                yellowDialogVisible: false,
                commentBox: true,
              })
            }>
            <View
              style={{
                position: 'relative',
                padding: 15,
              }}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      yellowDialogVisible: false,
                      commentBox: true,
                    })
                  }>
                  <Image
                    style={{
                      width: width > height ? wp('3.5%') : wp('8%'),
                      height: width > height ? wp('3.5%') : wp('8%'),
                    }}
                    source={require('../../uploads/close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingBottom: 10,
                  marginTop: 50,
                }}>
                <Text style={styles.dialog_txt}>
                  {t('workjoy:workjoy_yellowselected_popup')}
                </Text>
              </View>
              <View style={styles.dialog_submit_btn}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 15,
                    paddingLeft: 15,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.setState({
                      commentBox: true,
                      yellowDialogVisible: false,
                    });
                  }}>
                  <Text style={styles.submit_btn}>{t('common:no')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginLeft: 15,
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 15,
                    paddingLeft: 15,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    // this.gotoMessage();
                    this.setState({
                      yellowDialogVisible: false,
                      message_dialog: true,
                    });
                  }}>
                  <Text style={styles.submit_btn}>
                    {/* {Text_EN.Text_en.send_message} */}
                    {t('common:yes')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
          <Dialog
            visible={this.state.commentBox}
            title={t('socail_capital:social_kapital_submit_message')}
            onTouchOutside={() => this.setState({commentBox: false})}>
            <View
              style={{
                position: 'relative',
                padding: 15,
              }}>
              <View style={styles.dialog_close_icon_comment}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      commentBox: false,
                    })
                  }>
                  <Image
                    style={{
                      width: width > height ? wp('3.5%') : wp('8%'),
                      height: width > height ? wp('3.5%') : wp('8%'),
                    }}
                    source={require('../../uploads/close.png')}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: width > height ? wp('2%') : wp('4%'),
                }}>
                {t('workjoy:comment_text')}
              </Text>
              <View
                style={{
                  paddingBottom: 10,
                  marginTop: 20,
                }}>
                <TextInput
                  style={styles.Text_input}
                  placeholder={t('workjoy:write_comment')}
                  multiline={true}
                  fontSize={width > height ? wp('1.5%') : wp('4%')}
                  numberOfLines={4}
                  onChangeText={commentText => this.setState({commentText})}
                />
              </View>
              <View style={styles.dialog_submit_btn}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 30,
                    paddingLeft: 30,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.setState({
                      commentBox: false,
                      redMessage_dialog: false,
                    });
                  }}>
                  <Text style={styles.submit_btn}>{t('common:no')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginLeft: 15,
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 25,
                    paddingLeft: 25,
                    borderRadius: 5,
                  }}
                  onPress={() => this.save_comment()}>
                  <Text style={styles.submit_btn}>{t('common:yes')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
          <Dialog
            visible={this.state.gotoShareBox}
            onTouchOutside={() => this.setState({gotoShareBox: false})}>
            <View
              style={{
                position: 'relative',
                padding: 15,
              }}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      gotoShareBox: false,
                    })
                  }>
                  <Image
                    style={{
                      width: width > height ? wp('3.5%') : wp('8%'),
                      height: width > height ? wp('3.5%') : wp('8%'),
                    }}
                    source={require('../../uploads/close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingBottom: 10,
                  marginTop: 50,
                }}>
                <Text style={styles.dialog_txt}>
                  {t('workjoy:share_box_text')}
                </Text>
              </View>
              <View style={styles.dialog_submit_btn}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 15,
                    paddingLeft: 15,
                    borderRadius: 5,
                  }}
                  onPress={() =>
                    this.setState({
                      gotoShareBox: false,
                    })
                  }>
                  <Text style={styles.submit_btn}>{t('common:no')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginLeft: 15,
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 15,
                    paddingLeft: 15,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.setState({
                      gotoShareBox: false,
                    });
                    this.experience_Page();
                  }}>
                  <Text style={styles.submit_btn}>
                    {t('workjoy:share_experience')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>

          <Image
            style={styles.background_diamond}
            source={require('../../uploads/diamond-dark.png')}
          />
          <ScrollView>
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                borderBottomColor: '#01a2ff',
                borderBottomWidth: 2,
                justifyContent: 'space-between',
              }}>
              <View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}>
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
            <View
              style={{
                flex: 1,
                marginHorizontal: width > height ? wp('3%') : wp('2%'),
                marginTop: 10,
              }}>
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
                  <Text style={styles.upper_txt}>
                    {t('common:cooperation')}
                  </Text>
                  <Image
                    style={styles.diamond_icon}
                    source={require('../../uploads/diamond_img.png')}
                  />
                  <Text style={styles.upper_txt}>{t('common:trust')}</Text>
                  <Image
                    style={styles.diamond_icon}
                    source={require('../../uploads/diamond_img.png')}
                  />
                  <Text style={styles.upper_txt}>{t('common:justice')}</Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.workjoy_title}>
                <Text
                  style={{
                    fontSize: width > height ? wp('2.5%') : wp('4%'),
                    fontWeight: 'bold',
                  }}>
                  {t('workjoy:job_satisfaction')}:{" "}  
                </Text>
                {t('workjoy:workjoy_title')}
              </Text>

              <TouchableOpacity onPress={() => this.green_selected()}>
                <Card
                  borderRadius={15}
                  containerStyle={{
                    marginVertical: 40,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {this.state.green_selected == 1 ? (
                      <Image
                        style={{
                          width: width > height ? wp('4%') : wp('10%'),
                          height: width > height ? wp('4%') : wp('10%'),
                        }}
                        source={require('../../uploads/g1.png')}
                      />
                    ) : (
                      <Image
                        style={{
                          width: width > height ? wp('4%') : wp('10%'),
                          height: width > height ? wp('4%') : wp('10%'),
                        }}
                        source={require('../../uploads/green.png')}
                      />
                    )}
                    <Text style={styles.question_txt}>
                      {t('workjoy:workjoy_good_week')}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.yellow_selected()}>
                <Card borderRadius={10}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {this.state.yellow_selected == 1 ? (
                      <Image
                        style={{
                          width: width > height ? wp('4%') : wp('10%'),
                          height: width > height ? wp('4%') : wp('10%'),
                        }}
                        source={require('../../uploads/y1.png')}
                      />
                    ) : (
                      <Image
                        style={{
                          width: width > height ? wp('4%') : wp('10%'),
                          height: width > height ? wp('4%') : wp('10%'),
                        }}
                        source={require('../../uploads/yellow.png')}
                      />
                    )}
                    <Text style={styles.question_txt}>
                      {t('workjoy:workjoy_normal_week')}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.red_selected()}>
                <Card borderRadius={10}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {this.state.red_selected == 1 ? (
                      <Image
                        style={{
                          width: width > height ? wp('4%') : wp('10%'),
                          height: width > height ? wp('4%') : wp('10%'),
                        }}
                        source={require('../../uploads/r1.png')}
                      />
                    ) : (
                      <Image
                        style={{
                          width: width > height ? wp('4%') : wp('10%'),
                          height: width > height ? wp('4%') : wp('10%'),
                        }}
                        source={require('../../uploads/red.png')}
                      />
                    )}
                    <Text style={styles.question_txt}>
                      {' '}
                      {t('workjoy:workjoy_not_good')}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
              {this.state.submit_btn_active == 0 ? (
                <TouchableOpacity
                  style={styles.inactive_submit_btn}
                  onPress={() => this.inactive_press()}>
                  <Text style={styles.submit_btn}>
                    {t('workjoy:submit_answer')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.active_submit_btn}
                  onPress={() => this.send_answer()}>
                  <Text style={styles.submit_btn}>
                    {t('workjoy:submit_answer')}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.active_submit_btn}
                onPress={() => this.redirect_measurement()}>
                <Text style={styles.submit_btn}>
                  {t('workjoy:link_measurement_btn')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

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

export default translate(['workjoy', 'common'], {wait: true})(home);

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  question_txt: {
    width: width > height ? wp('76%') : wp('72%'),
    marginLeft: 30,
    fontSize: width > height ? wp('2%') : wp('4%'),
  },
  active_submit_btn: {
    marginTop: 10,
    marginRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    backgroundColor: '#00a1ff',
    borderRadius: 5,
  },
  diamond_icon: {
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
  inactive_submit_btn: {
    marginTop: 20,
    marginRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    backgroundColor: '#87d9f7',
    borderRadius: 5,
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
  dialog_txt: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: width > height ? wp('2%') : wp('4%'),
  },
  dialog_close_icon: {
    paddingBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 0,
    right: -10,
  },
  dialog_close_icon_comment: {
    paddingBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    top: -60,
    right: -10,
  },
  workjoy_title: {
    fontSize: width > height ? wp('2.2%') : wp('3.8%'),
    padding: 30,
    paddingBottom: 0,
  },
  submit_btn: {
    textAlign: 'center',
    color: 'white',
    fontSize: width > height ? wp('1.5%') : wp('3.5%'),
    fontWeight: 'bold',
  },
  dialog_submit_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 20,
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
  Text_input: {
    paddingLeft: 15,
    borderWidth: 1,
    textAlignVertical: 'top',
    backgroundColor: 'white',
    borderTopColor: 'black',
    borderLeftColor: 'black',
    borderBottomColor: 'black',
    borderRightColor: 'black',
    marginBottom: 0,
    borderRadius: 15,
  },
  Text_input_title: {
    paddingLeft: 15,
    borderWidth: 1,
    textAlignVertical: 'top',
    backgroundColor: 'white',
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderBottomColor: 'lightgrey',
    borderRightColor: 'white',
    marginBottom: 0,
    fontSize: width > height ? wp('1.5%') : wp('4%'),
    minHeight: 40,
  },
  Text_input_message: {
    fontSize: width > height ? wp('1.5%') : wp('4%'),
    paddingLeft: 15,
    borderWidth: 1,
    textAlignVertical: 'top',
    backgroundColor: 'white',
    borderTopColor: 'lightgrey',
    borderLeftColor: 'lightgrey',
    borderBottomColor: 'lightgrey',
    borderRightColor: 'lightgrey',
    marginTop: 30,
    marginBottom: 15,
    borderRadius: 15,
    minHeight: 150,
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
  checkboxContainer: {
    flexDirection: 'row',
  },
  checkbox: {
    alignSelf: 'center',
    marginTop: 5,
    marginRight: 5,
  },
  label: {
    margin: 8,
  },
});
