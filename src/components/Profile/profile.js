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
import {Card, Icon, Input} from 'react-native-elements';
import {Dialog} from 'react-native-simple-dialogs';
import Text_EN from '../res/lang/static_text';
import MultiSelect from 'react-native-multiple-select';
import {NavigationEvents, SafeAreaView} from 'react-navigation';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class Profile extends Component {
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
    console.log(this.state.selectedItems.toString());
    console.log(this.state.title);
    console.log(this.state.message_text);
    let rec_id = this.state.selectedItems.toString();
    if (
      rec_id.length > 0 &&
      this.state.title.length > 0 &&
      this.state.message_text.length > 0
    ) {
      const user_details = this.state.token;
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.token;
      headers.append('Authorization', auth);

      var data = new FormData();
      data.append('receiver_id', rec_id);
      data.append('title', this.state.title);
      data.append('message', this.state.message_text);
      console.log(data);
      fetch('http://diwo.nu/public/api/sendMessage', {
        method: 'POST',
        headers: headers,
        body: data,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson.status == 200) {
            console.log(responseJson);
            this.setState({
              message_dialog: false,
              title: '',
              message_text: '',
              selectedItems: [],
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

  render() {
    const {selectedItems} = this.state;
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
            onTouchOutside={() =>
              this.setState({message_dialog: false, errorText: false})
            }>
            <View style={{position: 'relative', padding: 15}}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({message_dialog: false, errorText: false})
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
              <View style={{paddingBottom: 10, marginTop: 50}}>
                {this.state.errorText == true ? (
                  <Text style={{paddingLeft: 15, color: 'red'}}>
                    {Text_EN.Text_en.select_user_error}
                  </Text>
                ) : null}
                <MultiSelect
                  hideSubmitButton
                  styleTextDropdown={{paddingLeft: 15}}
                  styleTextDropdownSelected={{paddingLeft: 15}}
                  styleDropdownMenu={{marginTop: 20}}
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
                  searchInputStyle={{color: '#CCC'}}
                  submitButtonColor="#3dce59"
                  submitButtonText="Submit"
                />
                <TextInput
                  style={styles.Text_input_title}
                  placeholder={Text_EN.Text_en.title}
                  onChangeText={title => this.setState({title, errorText: false})}
                />
                <TextInput
                  style={styles.Text_input_message}
                  placeholder="Kommentar til din leder"
                  multiline={true}
                  numberOfLines={8}
                  onChangeText={message_text =>
                    this.setState({message_text, errorText: false})
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
                    {Text_EN.Text_en.cooperation}
                  </Text>
                  <Image
                    style={styles.diamond_icon}
                    source={require('../../uploads/diamond_img.png')}
                  />
                  <Text style={styles.upper_txt}>{Text_EN.Text_en.trust}</Text>
                  <Image
                    style={styles.diamond_icon}
                    source={require('../../uploads/diamond_img.png')}
                  />
                  <Text style={styles.upper_txt}>{Text_EN.Text_en.justice}</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.profile_title}>Min Profil:</Text>
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
                <Text style={{fontSize: width > height ? wp('2.5%') : wp('4%')}}>
                  Har du en Kommentar?
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
                  <Text style={styles.submit_btn}>Skriv besked</Text>
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
  },
});
