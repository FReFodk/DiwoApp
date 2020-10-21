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
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card, Input} from 'react-native-elements';
import {Dialog} from 'react-native-simple-dialogs';
// import Text_EN from '../res/lang/static_text';
import MultiSelect from 'react-native-multiple-select';
import {NavigationEvents, SafeAreaView} from 'react-navigation';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';
import {translate} from 'react-i18next';
import i18n from 'i18next';
import Carousel from 'react-native-snap-carousel';
import Checkbox from '@react-native-community/checkbox'

class Profile extends Component {
  myInterval = '';
  Newitem = [];
  constructor(props) {
    super(props);
    this._retrieveData();
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
      message_dialog: false,
      title: '',
      message_text: '',
      selectedItems: [],
      errorText: '',
      isFocusTextArea: false,
      searchText: '',
      listItemCheck: [],
      message_title: ''
    };

    this.page_reloaded = this.page_reloaded.bind(this);
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }
  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems, errorText: false});
  };

  page_reloaded() {
    this._retrieveData();
  }
  _retrieveData = async () => {
    // console.log("Hi");
    try {
      const value = await AsyncStorage.getItem('visited_onces');
      console.log(value);
      if (value !== null) {
        console.log('in if');
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

  componentDidMount() {
    this.Newitem = [];
    console.log(this.state.count);
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
          console.log(responseJson);
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
          console.log(responseJson);
          this.setState({
            hoursHired: responseJson.users[0].hours_hired,
            teamName: responseJson.users[0].team_name,
          });
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
          this.Newitem = [];
          // console.log(responseJson);
          //this.setState({item:responseJson.users[0].user_id});
          for (var i = 0; i < responseJson.users.length; i++) {
            var id = responseJson.users[i].user_id;
            var name =
              responseJson.users[i].first_name +
              ' ' +
              responseJson.users[i].last_name;
            // console.log(id);
            this.Newitem.push({
              id: id,
              name: name,
            });
          }
          //this.setState({hoursHired:responseJson.users[0].hours_hired,teamName:responseJson.users[0].team_name});
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  send_message = () => {
    this.setState({message_dialog: true});
  };

  message_send = () => {
    console.log('SELECTED ITEMS',this.state.selectedItems.toString());
    console.log('SELECTED TITLE',this.state.message_title);
    console.log('SELECTED Text',this.state.message_text);
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
      fetch('http://diwo.nu/public/api/sendMessage', {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          // alert(JSON.stringify(responseJson));
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
            });
            this.componentDidMount();
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
    const {t} = this.props.screenProps;

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <NavigationEvents
            onDidFocus={() => {
              this.page_reloaded();
            }}
          />
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
          <View style={{flex: 1, marginTop: 10}}>
            <View style={{flex: 0.7}}>
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
              <Text style={styles.profile_title}>
                {t('profile:my_profile')}:
              </Text>
              <View style={{marginTop: 25, marginLeft: 10}}>
                <View style={styles.detail_view}>
                  <Image
                    style={styles.diamond_icon_detail}
                    source={require('../../uploads/diamond_img.png')}
                  />
                  <Text
                    style={{fontSize: width > height ? wp('2.5%') : wp('4%')}}>
                    {this.state.firstName} {this.state.lastName}{' '}
                  </Text>
                </View>
                <View style={styles.detail_view}>
                  <Image
                    style={styles.diamond_icon_detail}
                    source={require('../../uploads/diamond_img.png')}
                  />
                  <Text
                    style={{fontSize: width > height ? wp('2.5%') : wp('4%')}}>
                    {this.state.hoursHired} timer
                  </Text>
                </View>
                <View style={styles.detail_view}>
                  <Image
                    style={styles.diamond_icon_detail}
                    source={require('../../uploads/diamond_img.png')}
                  />
                  <Text
                    style={{fontSize: width > height ? wp('2.5%') : wp('4%')}}>
                    {this.state.teamName}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{flex: 0.25}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <Image
                  style={styles.diamond_icon_detail}
                  source={require('../../uploads/diamond_img.png')}
                />
                <Text
                  style={{fontSize: width > height ? wp('2.5%') : wp('4%')}}>
                  {t('profile:question_comment')}
                </Text>
                <Image
                  style={styles.diamond_icon_detail}
                  source={require('../../uploads/diamond_img.png')}
                />
              </View>
              <View>
                <TouchableOpacity
                  style={styles.active_submit_btn}
                  onPress={() => this.send_message()}>
                  <Text style={styles.submit_btn}>
                    {t('common:write_message')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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

export default translate(['profile', 'common'], {wait: true})(Profile);

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
    paddingTop: width > height ? wp('1%') : wp('3%'),
    paddingBottom: width > height ? wp('1%') : wp('3%'),
    paddingLeft: width > height ? wp('1.5%') : wp('6%'),
    paddingRight: width > height ? wp('1.5%') : wp('6%'),
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
  // bottom_btn_txt: {
  //   textAlign: 'center',
  //   color: 'white',
  //   fontSize: width * 0.042,
  //   padding: 10
  // },
  submit_btn: {
    textAlign: 'center',
    color: 'white',
    fontSize: width > height ? wp('2%') : wp('4%'),
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
  profile_title: {
    marginTop: 20,
    marginLeft: 25,
    color: '#7b7b7b',
    fontWeight: 'bold',
    fontSize: width > height ? wp('2.5%') : wp('4%'),
  },
  diamond_icon_detail: {
    width: width > height ? wp('5%') : wp('8%'),
    height: width > height ? wp('5%') : wp('8%'),
    marginLeft: 10,
    marginRight: 10,
  },
  dialog_close_icon: {
    paddingBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 0,
    right: -10,
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
  },checkboxContainer: {
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
