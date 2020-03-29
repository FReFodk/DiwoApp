import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  Keyboard,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {Dialog} from 'react-native-simple-dialogs';
import Text_EN from '../res/lang/static_text';
import {NavigationEvents, SafeAreaView} from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class home extends Component {
  myInterval = '';
  constructor(props) {
    super(props);
    this._retrieveData = this._retrieveData.bind(this);
    this.state = {
      tokenValue: '',
      token: '',
      firstName: '',
      dataSource: '',
      count: 0,
      experienceText: '',
      answerSend: false,
      error_popup: false,
      isKeyboardOpen: 0,
      view_experience: false,
      experience_date: '',
      experience_text_date: '',
      experience_total_likes: '',
      loading: false,
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

  openExperience = id => {
    // alert(id);
    const user_details = this.state.token;
    // alert(JSON.stringify(user_details));
    // this.setState({token:userToken.token});
    var headers = new Headers();
    let auth = 'Bearer ' + user_details.token;
    headers.append('Authorization', auth);

    var data = new FormData();
    data.append('experience_id', id);
    this.setState({loading: true});

    fetch('http://diwo.nu/public/api/getSingleExperienceDetails', {
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
            experience_date: responseJson.experience_details[0].date,
            experience_text_date: responseJson.experience_details[0].experience,
            experience_total_likes:
              responseJson.experience_details[0].total_likes,
            view_experience: true,
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  send_experience = () => {
    if (this.state.experienceText) {
      var dt = new Date().getDate(); //Current Date
      var month = new Date().getMonth() + 1; //Current Month
      var year = new Date().getFullYear(); //Current Year
      var date = '';
      if (date < 10) {
        date = '0' + dt;
      } else {
        date = dt;
      }
      var reviewDate = year + '-' + month + '-' + date;

      const user_details = this.state.token;
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.token;
      headers.append('Authorization', auth);

      var data = new FormData();
      data.append('user_id', this.state.userId);
      data.append('experience', this.state.experienceText);
      data.append('date', reviewDate);
      data.append('total_likes', 0);
      console.log(data);
      this.setState({loading: true});
      fetch('http://diwo.nu/public/api/addExperience', {
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
            this.setState({answerSend: true, experienceText: ''});
            this.componentDidMount();
          } else {
            alert('Something went wrong.');
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      this.setState({error_popup: true});
    }
  };

  _keyboardDidShow = () => {
    this.setState({isKeyboardOpen: 1});
  };

  _keyboardDidHide = () => {
    this.setState({isKeyboardOpen: 0});
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
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
    }
  }

  render() {
    var {height, width} = Dimensions.get('window');
    return (

      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          {this.state.loading == true ? (
            <View style={styles.spinner}>
              <ActivityIndicator size="large" color="#12075e" />
            </View>
          ) : null}

          <Dialog
            visible={this.state.view_experience}
            onTouchOutside={() => this.setState({view_experience: false})}>
            <View style={{position: 'relative'}}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() => this.setState({view_experience: false})}>
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
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.dialog_txt_title}>Date : </Text>
                  <Text style={styles.dialog_txt}>
                    {this.state.experience_date}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <Text style={styles.dialog_txt_title}>Experience : </Text>
                  <Text
                    style={{
                      width: '70%',
                      fontWeight: '500',
                      color: 'black',
                      fontSize: width > height ? wp('2%') : wp('4%'),
                    }}>
                    {this.state.experience_text_date}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <Text style={styles.dialog_txt_title}>Total likes : </Text>
                  <Text style={styles.dialog_txt}>
                    {this.state.experience_total_likes}
                  </Text>
                </View>
              </View>
            </View>
          </Dialog>
          <Dialog
            visible={this.state.answerSend}
            onTouchOutside={() => this.setState({answerSend: false})}>
            <View style={{position: 'relative'}}>
              <View style={styles.dialog_close_icon}>
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
              <View style={{width: width > height ? wp('80%') : wp('75%')}}>
                <Text style={styles.dialog_txt}>
                  {Text_EN.Text_en.experience_pop}
                </Text>
              </View>
            </View>
          </Dialog>
          <Dialog
            visible={this.state.error_popup}
            onTouchOutside={() => this.setState({error_popup: false})}>
            <View style={{position: 'relative'}}>
              <View style={styles.dialog_close_icon}>
                <TouchableOpacity
                  onPress={() => this.setState({error_popup: false})}>
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
                  width: width > height ? wp('80%') : wp('68%'),
                }}>
                <Text style={styles.dialog_txt}>
                  {Text_EN.Text_en.experience_error_pop}
                </Text>
              </View>
            </View>
          </Dialog>

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
          <View style={{flex: 1, padding: 15}}>
            <ScrollView>
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
              <View style={styles.text_view}>
                <Text style={styles.experience_title}>
                  {Text_EN.Text_en.experience_title}
                </Text>
                <Text style={styles.experience_text}>
                  {Text_EN.Text_en.experience_text}
                </Text>
                <TextInput
                  defaultValue={this.state.experienceText}
                  style={styles.Text_input}
                  placeholder={Text_EN.Text_en.experience_placeholder}
                  multiline={true}
                  numberOfLines={8}
                  onChangeText={experienceText => this.setState({experienceText})}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: width > height ? wp('1.5%') : wp('3.5%'),
                  }}>
                  {Text_EN.Text_en.experience_note}
                </Text>
                <TouchableOpacity
                  style={styles.active_submit_btn}
                  onPress={() => this.send_experience()}>
                  <Text style={styles.submit_btn}>Send</Text>
                </TouchableOpacity>
              </View>

              <View>
                <View style={styles.text_view}>
                  <Text style={styles.experience_likes}>Delte oplevelser</Text>
                  <FlatList
                    style={{padding: 5}}
                    data={this.state.dataSource}
                    showsVerticleScrollIndicator={false}
                    renderItem={({item}) => (
                      <View style={styles.dynamic_list_view}>
                        <TouchableOpacity
                          style={styles.list_part1}
                          onPress={() => this.openExperience(item.id)}>
                          <Text
                            style={{
                              fontSize: width > height ? wp('2%') : wp('4%'),
                            }}>
                            {item.date}
                          </Text>
                        </TouchableOpacity>
                        {/* <View style={styles.list_part2}>
                        <Text style={{ fontSize: width > height ? wp('2%') : wp('4%') }}>
                          {item.total_likes}
                        </Text>
                        <Image
                          style={styles.like_icon}
                          source={require('../../uploads/like_color.png')}
                        />
                      </View> */}
                      </View>
                    )}
                    keyExtractor={({id}, index) => id}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
          {/* {this.state.isKeyboardOpen==0 ?
            <View style={{flex:0.2,flexDirection:'row',marginLeft:12,marginRight:12}}>
              <HideWithKeyboard></HideWithKeyboard>
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
            </View>:null} */}
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
    zIndex: 1,
  },
  active_submit_btn: {
    marginTop: width > height ? wp('1%') : wp('3%'),
    marginRight: width * 0.04,
    paddingTop: width > height ? wp('1%') : wp('3%'),
    paddingBottom: width > height ? wp('1%') : wp('3%'),
    paddingLeft: width > height ? wp('4.5%') : wp('10%'),
    paddingRight: width > height ? wp('4.5%') : wp('10%'),
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
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
  experience_title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: width > height ? wp('2%') : wp('4%'),
  },
  experience_text: {
    textAlign: 'center',
    marginRight: width > height ? wp('10%') : wp('3%'),
    marginLeft: width > height ? wp('10%') : wp('3%'),
    fontSize: width > height ? wp('2%') : wp('4%'),
    lineHeight: width > height ? wp('3%') : wp('6.5%'),
  },
  text_view: {
    marginTop: 10,
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
    margin: 30,
    fontSize: width > height ? wp('1.5%') : wp('4%'),
    marginBottom: 0,
    borderRadius: 15,
    minHeight: 150,
  },
  dialog_close_icon: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    top: -10,
    right: -5,
  },
  dialog_txt: {
    fontWeight: '500',
    color: 'black',
    fontSize: width > height ? wp('2%') : wp('4%'),
  },
  dialog_txt_title: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: width > height ? wp('2%') : wp('4%'),
  },
  dynamic_list_view: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  like_icon: {
    width: width > height ? wp('2.5%') : wp('5%'),
    height: width > height ? wp('2.5%') : wp('5%'),
    marginLeft: 10,
    marginRight: 10,
  },
  experience_likes: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: width > height ? wp('2%') : wp('4%'),
    padding: 5,
  },
  list_part1: {
    flex: 0.8,
    marginLeft: 20,
  },
  list_part2: {
    justifyContent: 'center',
    flex: 0.2,
    flexDirection: 'row',
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
