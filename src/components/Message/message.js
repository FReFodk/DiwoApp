import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Dialog} from 'react-native-simple-dialogs';
import Text_EN from '../res/lang/static_text';
import {NavigationEvents, ScrollView, SafeAreaView} from 'react-navigation';
import MultiSelect from 'react-native-multiple-select';
import Card from 'react-native-elements';
import {throwStatement, toComputedKey} from '@babel/types';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class home extends Component {
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
      messageData: '',
      count: 0,
      experienceText: '',
      answerSend: false,
      error_popup: false,
      isKeyboardOpen: 0,
      message_dialog: false,
      message_title: '',
      message_text: '',
      title: '',
      message: '',
      selectedItems: [],
      errorText: '',
      view_message_dialog: false,
      unreadMessage: 0,
      receiveMessage: 1,
      sendMessage: 0,
      replyMessage_dialog: false,
      replyRecID: '',
      loading: false,
    };
    this._retrieveData();
    this.page_reloaded = this.page_reloaded.bind(this);
  }
  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems, errorText: false});
  };
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

  messageDeleteConfirm = messageID => {
    Alert.alert(
      'Er du sikker på, at du vil slette?',
      Text_EN.Text_en.delete_message,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'SLET', onPress: () => this.messageDelete(messageID)},
      ],
      {cancelable: false},
    );
  };

  messageDelete = messageID => {
    this.setState({loading: true});
    console.log(messageID);
    const user_details = this.state.token;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.token;
    headers.append('Authorization', auth);

    var data = new FormData();
    data.append('message_id', messageID);

    fetch('http://diwo.nu/public/api/deleteSingleMessage', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({loading: false});
        if (responseJson.status == 200) {
          console.log(responseJson);
          this.componentDidMount();
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  messageForward = messageID => {
    this.setState({loading: true});
    console.log(messageID);
    const user_details = this.state.token;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.token;
    headers.append('Authorization', auth);

    var data = new FormData();
    data.append('message_id', messageID);

    fetch('http://diwo.nu/public/api/getSingleMessage', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({loading: false});
        if (responseJson.status == 200) {
          console.log(responseJson);
          this.setState({
            message_title: responseJson.message_details.title,
            message_text: responseJson.message_details.message,
            message_dialog: true,
          });
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  messageView = messageID => {
    this.setState({loading: true});
    console.log(messageID);
    const user_details = this.state.token;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.token;
    headers.append('Authorization', auth);

    var data = new FormData();
    data.append('message_id', messageID);

    fetch('http://diwo.nu/public/api/getSingleMessage', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({loading: false});

        if (responseJson.status == 200) {
          console.log(responseJson);

          fetch('http://diwo.nu/public/api/readSingleMessage', {
            method: 'POST',
            headers: headers,
            body: data,
          })
            .then(response => response.json())
            .then(responseJson2 => {
              this.setState({loading: false});
              console.log(responseJson2);
              if (responseJson2.status == 200) {
                console.log(responseJson2);
                this.setState({
                  message_title: responseJson.message_details.title,
                  message_text: responseJson.message_details.message,
                  view_message_dialog: true,
                });
                this.componentDidMount();
              } else {
                alert('Something went wrong');
              }
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          alert('Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  changeNumber = async () => {
    this.setState({loading: true});
    // console.log(messageID);
    const user_details = this.state.token;
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.token;
    headers.append('Authorization', auth);
    await fetch('http://diwo.nu/public/api/edit_badge', {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({loading: false});
        console.log('readMessage', responseJson);
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

  messageReply = sender_id => {
    console.log(sender_id);
    this.setState({replyRecID: sender_id});
    this.setState({replyMessage_dialog: true});
  };

  send_message = () => {
    this.setState({message_dialog: true});
  };

  reply_send = () => {
    console.log(this.state.message_title);
    console.log(this.state.message_text);
    console.log(this.state.replyRecID.toString());
    let rec_id = this.state.replyRecID.toString();

    if (
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
              title: '',
              message_text: '',
              replyMessage_dialog: false,
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
            this.setState({
              message_dialog: false,
              message_title: '',
              message_text: '',
              selectedItems: [],
              replyMessage_dialog: false,
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

  componentDidMount() {
    const {navigation} = this.props;
    console.log('page loaded');
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

      fetch('http://diwo.nu/public/api/authenticatedUserExperience', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          this.setState({dataSource: responseJson.experience});
        })
        .catch(error => {
          console.error(error);
        });

      fetch('http://diwo.nu/public/api/userMessages', {
        method: 'POST',
        headers: headers,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson.status == 200) {
            this.setState({messageData: responseJson.messages_array});
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
      console.log(this.Newitem);
    }
  }

  convertedDate(date) {
    var t = date.split(/[- :]/);
    var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();

    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }
    date = day + '-' + month + '-' + year;
    return date.toString();
  }

  render() {
    const {selectedItems} = this.state;
    var {height, width} = Dimensions.get('window');
    var day = new Date().getDay(); //Current Date
    var month = new Date().getMonth() + 1; //Current month
    var year = new Date().getFullYear(); //Current year
    var string = day + '-' + month + '-' + year;

    return (
      <SafeAreaView style={{flex: 1}}>
        {this.state.loading == true ? (
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="#12075e" />
          </View>
        ) : null}
        <View style={styles.container}>
          <NavigationEvents
            onDidFocus={() => {
              this.page_reloaded();
            }}
          />
          <Dialog
            visible={this.state.replyMessage_dialog}
            onTouchOutside={() =>
              this.setState({
                replyMessage_dialog: false,
                errorText: false,
                message_title: '',
                message_text: '',
                selectedItems: [],
              })
            }>
            <View style={{position: 'relative', padding: 15}}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      replyMessage_dialog: false,
                      errorText: false,
                      message_title: '',
                      message_text: '',
                      selectedItems: [],
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
              <View style={{paddingBottom: 10, marginTop: 50}}>
                <TextInput
                  style={styles.Text_input_title}
                  placeholder={Text_EN.Text_en.title}
                  onChangeText={message_title =>
                    this.setState({message_title, errorText: false})
                  }
                />
                {this.state.errorText == true ? (
                  <Text style={{paddingLeft: 15, color: 'red'}}></Text>
                ) : null}
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
              <View>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#00a1ff',
                    padding: 10,
                    paddingRight: 25,
                    paddingLeft: 25,
                    borderRadius: 5,
                  }}
                  onPress={() => this.reply_send()}>
                  <Text style={styles.submit_btn}>
                    {Text_EN.Text_en.send_message}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
          <Dialog
            visible={this.state.view_message_dialog}
            onTouchOutside={() =>
              this.setState({
                view_message_dialog: false,
                errorText: false,
                message_title: '',
                message_text: '',
                selectedItems: [],
              })
            }>
            <View style={{position: 'relative'}}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      view_message_dialog: false,
                      errorText: false,
                      message_title: '',
                      message_text: '',
                      selectedItems: [],
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
              <View style={{paddingBottom: 10, marginTop: 50}}>
                <View>
                  <Text style={styles.dialog_txt_title}>Title</Text>
                  <Text style={styles.dialog_txt}>
                    {this.state.message_title}
                  </Text>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.dialog_txt_title}>Message</Text>
                  <Text style={styles.dialog_txt}>
                    {this.state.message_text}
                  </Text>
                </View>
              </View>
              {/* <View style={styles.dialog_submit_btn}>
              <TouchableOpacity style={{backgroundColor:'#00a1ff',padding:10,paddingRight:25,paddingLeft:25,borderRadius:5}} onPress={()=>this.message_send()}>
                <Text style={styles.submit_btn}>{Text_EN.Text_en.send_message}</Text>
              </TouchableOpacity>
            </View> */}
            </View>
          </Dialog>
          <Dialog
            visible={this.state.message_dialog}
            onTouchOutside={() =>
              this.setState({
                message_dialog: false,
                errorText: false,
                message_title: '',
                message_text: '',
                selectedItems: [],
              })
            }>
            <View style={{position: 'relative', padding: 15}}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      message_dialog: false,
                      errorText: false,
                      message_title: '',
                      message_text: '',
                      selectedItems: [],
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
                  submitButtonColor="#48d22b"
                  submitButtonText="Submit"
                />
                <TextInput
                  defaultValue={this.state.message_title}
                  style={styles.Text_input_title}
                  placeholder={Text_EN.Text_en.title}
                  onChangeText={message_title =>
                    this.setState({message_title, errorText: false})
                  }
                />
                {this.state.errorText == true ? (
                  <Text style={{paddingLeft: 15, color: 'red'}}></Text>
                ) : null}
                <TextInput
                  defaultValue={this.state.message_text}
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
            <View style={{flex: 0.99}}>
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
                    style={styles.diamond_icon_top}
                    source={require('../../uploads/diamond_img.png')}
                  />
                  <Text style={styles.upper_txt}>{Text_EN.Text_en.trust}</Text>
                  <Image
                    style={styles.diamond_icon_top}
                    source={require('../../uploads/diamond_img.png')}
                  />
                  <Text style={styles.upper_txt}>
                    {Text_EN.Text_en.justice}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{flexDirection: 'row', margin: 20}}>
                {/* <View style={{flex:0.33,justifyContent:'center',alignContent:'center',alignItems:'center',borderWidth:1,borderRadius:25,borderColor:'lightgrey',marginLeft:5,padding:8}}>
                  <TouchableOpacity onPress={()=>{this.setState({receiveMessage:0,unreadMessage:1,sendMessage:0})}}>
                    {this.state.unreadMessage==1?<Text style={{color:'#00a1ff',fontWeight:'bold',fontSize:16}}>Unread</Text>:<Text>Unread</Text>}
                    </TouchableOpacity>
                </View> */}
                <TouchableOpacity
                  style={{
                    flex: 0.5,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderRadius: 25,
                    borderColor: 'lightgrey',
                    marginRight: 5,
                    padding: 8,
                  }}
                  onPress={() => {
                    this.setState({
                      receiveMessage: 1,
                      unreadMessage: 0,
                      sendMessage: 0,
                    });
                  }}>
                  <View>
                    {this.state.receiveMessage == 1 ? (
                      <Text
                        style={{
                          color: '#00a1ff',
                          fontWeight: 'bold',
                          fontSize: width > height ? wp('1.5%') : wp('4%'),
                        }}>
                        {Text_EN.Text_en.Receive}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: width > height ? wp('1.5%') : wp('3.5%'),
                        }}>
                        {Text_EN.Text_en.Receive}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 0.5,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderRadius: 25,
                    borderColor: 'lightgrey',
                    marginLeft: 5,
                    marginRight: 5,
                    padding: 8,
                  }}
                  onPress={() => {
                    this.setState({
                      receiveMessage: 0,
                      unreadMessage: 0,
                      sendMessage: 1,
                    });
                  }}>
                  <View>
                    {this.state.sendMessage == 1 ? (
                      <Text
                        style={{
                          color: '#00a1ff',
                          fontWeight: 'bold',
                          fontSize: width > height ? wp('1.5%') : wp('4%'),
                        }}>
                        {Text_EN.Text_en.Send}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: width > height ? wp('1.5%') : wp('3.5%'),
                        }}>
                        {Text_EN.Text_en.Send}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <ScrollView>
                <View style={{padding: 20, marginTop: 10}}>
                  <FlatList
                    data={this.state.messageData}
                    showsVerticleScrollIndicator={false}
                    renderItem={({item}) =>
                      this.state.receiveMessage == 1 &&
                      item.receiver_id == this.state.userId ? (
                        <View style={styles.dynamic_list_view}>
                          <View style={{flexDirection: 'row', flex: 1}}>
                            {this.state.userId == item.receiver_id ? (
                              <TouchableOpacity
                                style={styles.list_part1}
                                onPress={() => this.messageView(item.id)}>
                                {item.is_read == 0 &&
                                item.receiver_id == this.state.userId ? (
                                  <View style={styles.messageIndicator}>
                                    <Text></Text>
                                  </View>
                                ) : (
                                  <View style={styles.readIndicator}>
                                    <Text></Text>
                                  </View>
                                )}
                                <Text
                                  style={{
                                    fontSize:
                                      width > height ? wp('2%') : wp('3.8%'),
                                  }}>
                                  {item.sender_name}
                                  {'\n'}
                                  <Text style={{fontSize: 15}}>
                                    {this.convertedDate(item.created_at)}
                                  </Text>
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={styles.list_part1}
                                onPress={() => this.messageView(item.id)}>
                                {item.is_read == 0 &&
                                item.receiver_id == this.state.userId ? (
                                  <View style={styles.messageIndicator}>
                                    <Text></Text>
                                  </View>
                                ) : (
                                  <View style={styles.readIndicator}>
                                    <Text></Text>
                                  </View>
                                )}
                                <Text
                                  style={{
                                    fontSize:
                                      width > height ? wp('2%') : wp('3.8%'),
                                  }}>
                                  {item.receiver_name}
                                </Text>
                              </TouchableOpacity>
                            )}
                            <View style={styles.list_part2}>
                              <TouchableOpacity
                                onPress={() => this.messageForward(item.id)}>
                                <Image
                                  style={styles.like_icon}
                                  source={require('../../uploads/emailForward.png')}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.messageReply(item.sender_id)
                                }>
                                <Image
                                  style={styles.like_icon}
                                  source={require('../../uploads/emailReply.png')}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.messageDeleteConfirm(item.id)
                                }>
                                <Image
                                  style={styles.like_icon}
                                  source={require('../../uploads/delete.png')}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ) : this.state.sendMessage == 1 &&
                        item.sender_id == this.state.userId ? (
                        <View style={styles.dynamic_list_view}>
                          <View style={{flexDirection: 'row', flex: 1}}>
                            {this.state.userId == item.receiver_id ? (
                              <TouchableOpacity
                                style={styles.list_part1}
                                onPress={() => this.messageView(item.id)}>
                                {item.is_read == 0 &&
                                item.receiver_id == this.state.userId ? (
                                  <View style={styles.messageIndicator}>
                                    <Text></Text>
                                  </View>
                                ) : (
                                  <View style={styles.readIndicator}>
                                    <Text></Text>
                                  </View>
                                )}
                                <Text
                                  style={{
                                    fontSize:
                                      width > height ? wp('2%') : wp('3.8%'),
                                  }}>
                                  {item.sender_name}
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={styles.list_part1}
                                onPress={() => this.messageView(item.id)}>
                                {item.is_read == 0 &&
                                item.receiver_id == this.state.userId ? (
                                  <View style={styles.messageIndicator}>
                                    <Text></Text>
                                  </View>
                                ) : (
                                  <View style={styles.readIndicator}>
                                    <Text></Text>
                                  </View>
                                )}
                                <Text
                                  style={{
                                    fontSize:
                                      width > height ? wp('2%') : wp('3.8%'),
                                  }}>
                                  {item.receiver_name}
                                  {'\n'}
                                  <Text style={{fontSize: 15}}>
                                    {this.convertedDate(item.created_at)}
                                  </Text>
                                </Text>
                              </TouchableOpacity>
                            )}
                            <View style={styles.list_part2}>
                              <TouchableOpacity
                                onPress={() => this.messageForward(item.id)}>
                                <Image
                                  style={styles.like_icon}
                                  source={require('../../uploads/emailForward.png')}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.messageDeleteConfirm(item.id)
                                }>
                                <Image
                                  style={styles.like_icon}
                                  source={require('../../uploads/delete.png')}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ) : null
                    }
                    keyExtractor={({id}, index) => id}
                  />
                </View>
              </ScrollView>
            </View>
            <View>
              <TouchableOpacity
                style={styles.active_submit_btn}
                onPress={() => this.send_message()}>
                <Text style={styles.submit_btn}>Skriv besked</Text>
              </TouchableOpacity>
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
  background_diamond: {
    position: 'absolute',
    width: width > height ? wp('70%') : wp('90%'),
    height: width > height ? wp('65%') : wp('85%'),
    bottom: -width * 0.3,
    right: -width * 0.28,
    opacity: 0.2,
    transform: [{rotate: '321deg'}],
  },
  upper_txt: {
    fontSize: width > height ? wp('2%') : wp('4%'),
    color: '#038fc1',
    fontWeight: 'bold',
  },
  text_view: {
    marginTop: 15,
    flex: 0.4,
    padding: 20,
  },
  dynamic_list_view: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  like_icon: {
    width: width > height ? wp('3.5%') : wp('7%'),
    height: width > height ? wp('3.5%') : wp('7%'),
    marginLeft: 10,
    marginRight: 10,
  },
  experience_likes: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: width * 0.05,
    marginBottom: 15,
  },
  list_part1: {
    flex: 0.5,
    flexDirection: 'row',
  },
  list_part2: {
    justifyContent: 'flex-end',
    flex: 0.5,
    flexDirection: 'row',
  },
  diamond_icon_top: {
    width: width > height ? wp('4%') : wp('6%'),
    height: width > height ? wp('4%') : wp('6%'),
    marginLeft: 5,
    marginRight: 5,
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
  submit_btn: {
    textAlign: 'center',
    color: 'white',
    fontSize: width > height ? wp('2%') : wp('4%'),
    fontWeight: 'bold',
  },
  dialog_submit_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 20,
  },
  messageIndicator: {
    width: width > height ? wp('2%') : wp('5%'),
    height: width > height ? wp('2%') : wp('5%'),
    backgroundColor: '#00a1ff',
    borderRadius: 75,
    borderColor: 'white',
    borderWidth: 2.5,
    alignSelf: 'center',
    marginRight: 10,
  },
  readIndicator: {
    width: width > height ? wp('2%') : wp('5%'),
    height: width > height ? wp('2%') : wp('5%'),
    backgroundColor: 'white',
    opacity: 0,
    borderRadius: 75,
    borderColor: 'white',
    borderWidth: 2.5,
    alignSelf: 'center',
    marginRight: 10,
  },
  dialog_txt_title: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: width > height ? wp('2%') : wp('4%'),
  },
  dialog_txt: {
    fontWeight: '500',
    color: 'black',
    fontSize: width > height ? wp('2%') : wp('4%'),
    marginTop: 5,
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
    marginTop: 10,
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
