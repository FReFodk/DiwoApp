import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Image, Alert, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Dialog } from 'react-native-simple-dialogs';
import Text_EN from '../res/lang/static_text';
import { NavigationEvents } from 'react-navigation';
import { Card } from 'react-native-elements';
import { LineChart } from "react-native-chart-kit";
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class home extends Component {
  myInterval = "";
  constructor(props) {
    super(props)
    this._retrieveData = this._retrieveData.bind(this);
    this.state = {
      tokenValue: "",
      token: "",
      firstName: "",
      dataSource: "",
      dataSocialKapital: "",
      count: 0,
      experienceText: "",
      answerSend: false,
      error_popup: false,
      isKeyboardOpen: 0,
      trust_per: "",
      demo: [10, 30],
      monthGraph: [],
      totalGraph: [10, 20],
    }
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
        this.setState({ token: JSON.parse(value), count: 1 });
        this.componentDidMount();
      }
    } catch (error) {
      alert(error);
    }
  };

  learnMore = () => {
    Linking.openURL('http://diwo.nu');
  }

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
        { text: 'Learn More', onPress: () => this.learnMore() },
      ],
      { cancelable: false },
    );
  }

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
        { text: 'Learn More', onPress: () => this.learnMore() },
      ],
      { cancelable: false },
    );
  }

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
        { text: 'Learn More', onPress: () => this.learnMore() },
      ],
      { cancelable: false },
    );
  }

  getWeekNumber = (d) => {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (this.state.count == 1) {
      const user_details = this.state.token;
      // this.setState({token:userToken.token});
      var headers = new Headers();
      let auth = 'Bearer ' + user_details.token;
      headers.append("Authorization", auth);
      fetch("http://diwo.nu/public/api/user", {
        method: 'POST',
        headers: headers,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson) {
            this.setState({ firstName: responseJson.user.first_name, userId: responseJson.user.user_id });
          }
        }).catch((error) => {
          console.error(error);
        });

      fetch("http://diwo.nu/public/api/lastRecordsWorkJoy", {
        method: 'POST',
        headers: headers,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == 200) {
            for (var i = 0; i < responseJson.workjoy_data.length; i++) {
              var date = responseJson.workjoy_data[i].last_review_date;
              var t = date.split(/[- :]/);
              var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
              var result = this.getWeekNumber(d);
              responseJson.workjoy_data[i].week = result[1];
            }
            console.log(responseJson.workjoy_data);
            this.setState({ dataSource: responseJson.workjoy_data });
          } else {
            alert("Something Bad happen");
          }
        }).catch((error) => {
          console.error(error);
        });

      fetch("http://diwo.nu/public/api/latestSocialkapital", {
        method: 'POST',
        headers: headers,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == 200) {
            console.log(responseJson.kapital_data);              
            let arr = [];
            const months = ['Jan', 'Feb', 'Mar', 'Apl', 'Kan', 'Jun', 'Jul', 'Aug', 'Sept', 'Okt', 'Nov', 'Dec'];
            let month = [];
            for (var i = 0; i < responseJson.kapital_data.length; i++) {
              if (responseJson.kapital_data[i].question1 == "yellow" && responseJson.kapital_data[i].question2 == "yellow") {
                responseJson.kapital_data[i].cooperation = 20;
              } else if (responseJson.kapital_data[i].question1 == "green" && responseJson.kapital_data[i].question2 == "green") {
                responseJson.kapital_data[i].cooperation = 40;
              } else if (responseJson.kapital_data[i].question1 == "yellow" && responseJson.kapital_data[i].question2 == "green" || responseJson.kapital_data[i].question1 == "green" && responseJson.kapital_data[i].question2 == "yellow") {
                responseJson.kapital_data[i].cooperation = 30;
              } else if (responseJson.kapital_data[i].question1 == "yellow" && responseJson.kapital_data[i].question2 == "red" || responseJson.kapital_data[i].question1 == "red" && responseJson.kapital_data[i].question2 == "yellow") {
                responseJson.kapital_data[i].cooperation = 15;
              } else if (responseJson.kapital_data[i].question1 == "green" && responseJson.kapital_data[i].question2 == "red" || responseJson.kapital_data[i].question1 == "red" && responseJson.kapital_data[i].question2 == "green") {
                responseJson.kapital_data[i].cooperation = 25;
              } else if (responseJson.kapital_data[i].question1 == "red" && responseJson.kapital_data[i].question2 == "red") {
                responseJson.kapital_data[i].cooperation = 10;
              }

              if (responseJson.kapital_data[i].question3 == "yellow" && responseJson.kapital_data[i].question4 == "yellow") {
                responseJson.kapital_data[i].trust = 20;
              } else if (responseJson.kapital_data[i].question3 == "green" && responseJson.kapital_data[i].question4 == "green") {
                responseJson.kapital_data[i].trust = 40;
              } else if (responseJson.kapital_data[i].question3 == "yellow" && responseJson.kapital_data[i].question4 == "green" || responseJson.kapital_data[i].question3 == "green" && responseJson.kapital_data[i].question4 == "yellow") {
                responseJson.kapital_data[i].trust = 30;
              } else if (responseJson.kapital_data[i].question3 == "yellow" && responseJson.kapital_data[i].question4 == "red" || responseJson.kapital_data[i].question3 == "red" && responseJson.kapital_data[i].question4 == "yellow") {
                responseJson.kapital_data[i].trust = 15;
              } else if (responseJson.kapital_data[i].question3 == "green" && responseJson.kapital_data[i].question4 == "red" || responseJson.kapital_data[i].question3 == "red" && responseJson.kapital_data[i].question4 == "green") {
                responseJson.kapital_data[i].trust = 25;
              } else if (responseJson.kapital_data[i].question3 == "red" && responseJson.kapital_data[i].question4 == "red") {
                responseJson.kapital_data[i].trust = 10;
              }

              if (responseJson.kapital_data[i].question5 == "red") {
                responseJson.kapital_data[i].justice = 5;
              } else if (responseJson.kapital_data[i].question5 == "yellow") {
                responseJson.kapital_data[i].justice = 10;
              } else if (responseJson.kapital_data[i].question5 == "green") {
                responseJson.kapital_data[i].justice = 20;
              }
            }
            for (var i = 0; i < responseJson.kapital_data.length; i++) {
              var total = responseJson.kapital_data[i].cooperation + responseJson.kapital_data[i].trust + responseJson.kapital_data[i].justice
              var mon = months[responseJson.kapital_data[i].review_date.substring(5, 7).replace(/^0+/, '') - 1];
              arr.push(total);
              month.push(mon);
            }
            console.log(month);
            console.log(responseJson.kapital_data);
            this.setState({ dataSocialKapital: responseJson.kapital_data, monthGraph: month.reverse(), totalGraph: arr.reverse() });
          } else {
            alert("Something Bad happen");
          }
        }).catch((error) => {
          console.error(error);
        });
    }
  }

  render() {

    var { height, width } = Dimensions.get('window');
    console.log(height);
    const months = ['Januar', 'Februar', 'Marts', 'April', 'Kan', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => { this.page_reloaded() }} />
        <Image
          style={styles.background_diamond}
          source={require('../../uploads/diamond-dark.png')}
        />
        <View style={{ padding: 10, flexDirection: 'row', borderBottomColor: '#01a2ff', borderBottomWidth: 2, justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: width > height ? wp('1.6%') : wp('4%') }}>Hej  <Text style={{ fontWeight: "bold", fontSize: width > height ? wp('1.6%') : wp('4.5%') }}>{this.state.firstName}</Text></Text>
          </View>
          <View style={{ position: 'absolute', left: width > height ? wp('48%') : wp('45%'), alignSelf: 'center' }}>
            <Image
              style={{ width: width > height ? wp('6%') : wp('15%'), height: width > height ? wp('3%') : wp('6%') }}
              source={require('../../uploads/Diwologo_png.png')}
            />
          </View>
          <View>
            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
              <Image
                style={{ width: width > height ? wp('3.5%') : wp('8%'), height: width > height ? wp('3%') : wp('7%') }}
                source={require('../../uploads/drawer_menu.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 10, marginBottom: 10 }}>
          <ScrollView>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('More_info', { Firstname: this.state.firstName, token: this.state.token })}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <Text style={styles.upper_txt}>{Text_EN.Text_en.cooperation}</Text>
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
            <View style={{ alignItems: 'center', marginTop: 15 }}>
              <Text style={{ fontSize: width > height ? wp('2.2%') : wp('4%') }}>{Text_EN.Text_en.measurement_workjoy_title}</Text>
              {this.state.dataSource.length != 0 ? <FlatList
                style={{ marginTop: 10 }}
                data={this.state.dataSource}
                showsVerticleScrollIndicator={false}
                renderItem={({ item }) => <View style={{ flexDirection: 'row', paddingBottom: 15 }}>
                  <Text style={{ fontSize: width > height ? wp('2.2%') : wp('4%'), marginRight: 10 }}>Uge {("000" + item.week.toString()).slice(-2)} </Text>

                  {item.review == "Bad" ? <Image
                    style={{ width: width > height ? wp('3%') : wp('5%'), height: width > height ? wp('3%') : wp('5%') }}
                    source={require('../../uploads/red.png')}
                  /> : item.review == "Average" ? <Image
                    style={{ width: width > height ? wp('3%') : wp('5%'), height: width > height ? wp('3%') : wp('5%') }}
                    source={require('../../uploads/yellow.png')}
                  /> : item.review == "Excellent" ? <Image
                    style={{ width: width > height ? wp('3%') : wp('5%'), height: width > height ? wp('3%') : wp('5%') }}
                    source={require('../../uploads/green.png')}
                  /> : null}
                  <Text style={{ fontSize: width > height ? wp('2.2%') : wp('4%'), marginLeft: 15, width: '70%' }}>Kommentar : {item.comments}</Text>
                </View>}
                keyExtractor={({ id }, index) => id}
              /> : <Text style={styles.nosocialKaptial}>No data found</Text>}
            </View>
            <View >
              <Text style={{ fontSize: width > height ? wp('2.2%') : wp('4%'), alignSelf: 'center' }}>{Text_EN.Text_en.measurement_socialkaptial_title}</Text>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                {/* <Text>length:{this.state.dataSocialKapital.length}</Text> */}
                {/* <View style={{ width: '100%', marginTop: 25, marginLeft: 0, justifyContent: 'center', alignItems: 'center' }}> */}
                  {/* <Text style={{fontSize: width * 0.04}}>gg {this.state.totalGraph}</Text> */}
                  {/* {this.state.dataSocialKapital.length > 1 ? <LineChart
                    data={{
                      labels: this.state.monthGraph,
                      datasets: [
                        {
                          data: this.state.totalGraph
                        }
                      ]
                    }}
                    width={Dimensions.get('window').width}
                    height={height * 0.35}
                    chartConfig={{
                      backgroundColor: "#00a1ff",
                      backgroundGradientFrom: "#87d9f7",
                      backgroundGradientTo: "#00a1ff",
                      decimalPlaces: 0, // optional, defaults to 2dp
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        fontSize: 28,
                      }
                    }}
                  /> : <Text style={styles.nosocialKaptial}>{Text_EN.Text_en.min_two_date}</Text>} */}
                {/* </View> */}
              </View>
              <View style={{ width: '100%' }}>
                {this.state.dataSocialKapital.length != 0 ? <FlatList
                  style={{ marginTop: 10, marginBottom: 30 }}
                  data={this.state.dataSocialKapital}
                  showsVerticleScrollIndicator={false}
                  renderItem={({ item }) => <View style={styles.dynamic_list_view}>
                    <Card borderRadius={10} containerStyle={{ width: width > height ? wp('50%') : wp('80%'), }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <View style={{ justifyContent: 'center' }}>
                          <Text style={{ fontSize: width > height ? wp('2.2%') : wp('4%'), fontWeight: 'bold' }}>{months[item.review_date.substring(5, 7).replace(/^0+/, '') - 1]}</Text>
                        </View>
                        <View style={{ borderLeftWidth: 1, borderLeftColor: '#00a1ff', marginRight: 10, marginLeft: width > height ? wp('4%') : wp('1%'), }}></View>
                        <View>
                          {/* {item.question1=="yellow" && item.question2=="yellow"?this.setState({trust_per:20}):item.question1=="green" && item.question2=="green"?this.setState({trust_per:40}):null} */}
                          <Text style={{ fontSize: width > height ? wp('2.2%') : wp('3.5%'), width: width > height ? wp('25%') : wp('32%') }}>{Text_EN.Text_en.cooperation}: <Text style={{ fontWeight: 'bold' }}>{item.cooperation}%</Text></Text>
                          <Text style={{ fontSize: width > height ? wp('2.2%') : wp('3.5%'), width: width > height ? wp('25%') : wp('32%') }}>{Text_EN.Text_en.trust}: <Text style={{ fontWeight: 'bold' }}>{item.trust}% </Text></Text>
                          <Text style={{ fontSize: width > height ? wp('2.2%') : wp('3.5%'), width: width > height ? wp('25%') : wp('32%') }}>{Text_EN.Text_en.justice}: <Text style={{ fontWeight: 'bold' }}>{item.justice}%</Text></Text>
                          <Text style={{ fontSize: width > height ? wp('2.2%') : wp('3.5%'), width: width > height ? wp('25%') : wp('31%'), fontWeight: 'bold', borderTopWidth: 1 }}>{Text_EN.Text_en.total}: {item.trust + item.cooperation + item.justice}% </Text>
                        </View>
                      </View>
                    </Card>
                  </View>}
                  keyExtractor={({ id }, index) => id}
                /> : <Text style={styles.nosocialKaptial}>No data found</Text>}
              </View>
            </View>
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
          <View style={{ marginBottom: 5 }}>
            
            <Text style={{ textAlign: 'center' }}><Text style={{ fontSize: 18 }}>©</Text> Copyright FReFo</Text>
          </View>
        </HideWithKeyboard>
      </View>
    );
  }
}
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  // bottom_btn: {
  //   width: '30.333%',
  //   backgroundColor: '#00a1ff',
  //   marginTop: 0,
  //   marginLeft: 8,
  //   marginBottom: 2,
  //   borderRadius: 10,
  //   justifyContent: 'center'
  // },
  // bottom_btn_txt: {
  //   textAlign: 'center',
  //   color: 'white',
  //   fontSize: width * 0.042,
  //   padding: 10
  // },
  background_diamond: {
    position: 'absolute',
    width: width > height ? wp('70%') : wp('90%'),
    height: width > height ? wp('65%') : wp('85%'),
    bottom: -width * 0.3,
    right: -width * 0.28,
    opacity: 0.2,
    transform: [{ rotate: "321deg" }]
  },
  diamond_icon: {
    width: width > height ? wp('4%') : wp('6%'),
    height: width > height ? wp('4%') : wp('6%'),
    marginLeft: 5,
    marginRight: 5
  },
  upper_txt: {
    fontSize: width > height ? wp('2%') : wp('4%'),
    color: '#038fc1',
    fontWeight: 'bold'
  },
  // text_view: {
  //   marginTop: 15,
  //   flex: 0.4,
  //   padding: 20,
  // },
  dynamic_list_view: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  // like_icon: {
  //   width: width * 0.06,
  //   height: width * 0.06,
  //   marginLeft: 10,
  //   marginRight: 10
  // },
  // experience_likes: {
  //   fontWeight: 'bold',
  //   color: 'black',
  //   fontSize: width * 0.05,
  //   marginBottom: 15
  // },
  // list_part1: {
  //   flex: 0.8,
  //   fontSize: width * 0.045
  // },
  // list_part2: {
  //   justifyContent: 'center',
  //   flex: 0.2,
  //   flexDirection: 'row'
  // },
  nosocialKaptial: {
    fontSize: width > height ? wp('2.2%') : wp('4%'),
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15
  }
});  