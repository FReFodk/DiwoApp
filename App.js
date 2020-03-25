/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import PrimaryNav from './src/components/AppNavigator';
import PushController from './PushController';
import BackgroundTask from 'react-native-background-task';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from 'react-native-push-notification';

const getDaysInMonth = (month, year) => {
  // Here January is 1 based
  //Day 0 is the last day in the previous month
  return new Date(year, month, 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
};

// const checkNotify = async () => {
//   try {
//     console.log('Hello from a background task');

//     let count = 0;
//     let token_value = await AsyncStorage.getItem('usertoken');
//     let headers = new Headers();
//     let auth;
//     if (!token_value) {
//       auth = 'Bearer NO-ID';
//     } else {
//       auth = 'Bearer ' + token_value;
//     }
//     headers.append('Authorization', auth);
//     let rturn = false;
//     fetch('http://diwo.nu/public/api/lastAddedSocialkapital', {
//       method: 'POST',
//       headers: headers,
//     })
//       .then(response => response.json())
//       .then(responseJson => {
//         if (responseJson.status == 200) {
//           if (responseJson.kapital_data[0]) {
//             var date = responseJson.kapital_data[0].last_review_date;
//             var t = date.split(/[- :]/);
//             var d = new Date(t[0], t[1] - 1, t[2]);

//             // Checking activation for the current month
//             var now = new Date();
//             let lastDate =
//               getDaysInMonth(now.getMonth() + 1, now.getFullYear()) - 3;
//             let activationDate =
//               now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + lastDate;
//             var activet = activationDate.split(/[- :]/);
//             let activeDate = new Date(activet[0], activet[1] - 1, activet[2]);
//             //console.log(activeDate);

//             // Checking activation for the Previous month
//             var now = new Date();
//             let PrevlastDate =
//               getDaysInMonth(now.getMonth(), now.getFullYear()) - 3;
//             let PrevactivationDate =
//               now.getFullYear() + '-' + now.getMonth() + '-' + PrevlastDate;
//             var Prevt = PrevactivationDate.split(/[- :]/);
//             let PrevactiveDate = new Date(Prevt[0], Prevt[1] - 1, Prevt[2]);
//             //console.log(PrevactiveDate);

//             //check if database date and previous month activation date is same or not
//             if (
//               d.getTime() === PrevactiveDate.getTime() ||
//               d.getTime() === activeDate.getTime()
//             ) {
//               rturn = false;
//             } else {
//               //Check for activation between the database date and current date.
//               // let dateArray = [];
//               // let count = 0;
//               for (
//                 var dt = new Date(d);
//                 dt <= now;
//                 dt.setDate(dt.getDate() + 1)
//               ) {
//                 // console.log(dt);
//                 if (
//                   dt.getTime() === PrevactiveDate.getTime() ||
//                   dt.getTime() === activeDate.getTime()
//                 ) {
//                   // console.log("if");
//                   rturn = true;
//                   break;
//                 } else if (dt.getTime() > activeDate.getTime()) {
//                   if (
//                     dt.getDate() > activeDate.getDate() &&
//                     dt.getMonth() + 1 == activeDate.getMonth() + 1
//                   ) {
//                     rturn = false;
//                   } else {
//                     // console.log("In else if");
//                     rturn = true;
//                   }
//                 } else {
//                   // console.log("else");
//                   rturn = false;
//                 }

//                 // dateArray.push(dt.getTime());
//               }
//             }
//           } else {
//             rturn = true;
//           }
//         }
//         if (rturn) count++;
//         rturn = false;
//         fetch('http://diwo.nu/public/api/lastAddedWorkJoy', {
//           method: 'POST',
//           headers: headers,
//         })
//           .then(response => response.json())
//           .then(responseJson => {
//             if (responseJson.status == 200) {
//               // console.log(responseJson);
//               if (responseJson.workjoy_data[0]) {
//                 var date = responseJson.workjoy_data[0].last_review_date;
//                 var t = date.split(/[- :]/);
//                 var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

//                 let dayWord = [
//                   'Sunday',
//                   'Monday',
//                   'Tuesday',
//                   'Wednesday',
//                   'Thursday',
//                   'Friday',
//                   'Saturday',
//                 ];
//                 var day = new Date().getDay(); //Current Date
//                 var month = new Date().getMonth() + 1; //Current month
//                 var year = new Date().getFullYear(); //Current year
//                 var hours = new Date().getHours(); //Current Hours
//                 var min = new Date().getMinutes();
//                 var now = new Date();
//                 for (
//                   var dt = new Date(d);
//                   dt <= now;
//                   dt.setDate(dt.getDate() + 1)
//                 ) {
//                   // console.log(dayWord[dt.getDay()]);
//                   if (dayWord[dt.getDay()] == 'Thursday') {
//                     if (
//                       dt.getDate() == d.getDate() &&
//                       dt.getMonth() == d.getMonth() &&
//                       dt.getFullYear() == d.getFullYear()
//                     ) {
//                       rturn = false;
//                     } else {
//                       rturn = true;
//                     }
//                     if (
//                       d.getDate() == now.getDate() &&
//                       d.getMonth() == now.getMonth() &&
//                       d.getFullYear() == now.getFullYear()
//                     ) {
//                       rturn = false;
//                     }
//                   } else if (dayWord[now.getDay()] == 'Thursday') {
//                     rturn = true;
//                   } else if (
//                     d.getDate() == now.getDate() &&
//                     d.getMonth() == now.getMonth() &&
//                     d.getFullYear() == now.getFullYear()
//                   ) {
//                     rturn = false;
//                   }
//                 }
//                 // var currentDate = year +'-'+ month +'-'+day;
//                 var currentTime = dayWord[day] + ':' + hours + ':' + min;
//                 if (currentTime == 'Thursday:00:00') {
//                   rturn = true;
//                 }
//               } else {
//                 rturn = true;
//               }
//             }
//             if (rturn) count++;
//             rturn = false;
//             fetch('http://diwo.nu/public/api/getLastMessageReadStatus', {
//               method: 'POST',
//               headers: headers,
//             })
//               .then(response => response.json())
//               .then(responseJson => {
//                 console.log(responseJson);
//                 if (responseJson.status == 200) {
//                   if (responseJson.length > 0) {
//                     rturn = true;
//                   } else {
//                     rturn = false;
//                   }
//                 }
//                 if (rturn) count++;
//                 console.log(`COUNTTTTTTTTTTTTT${count}`);
//                 if (count > 0) {
//                   PushNotification.localNotification({
//                     /* Android Only Properties */

//                     /* iOS and Android properties */
//                     title: 'Diwo', // (optional)
//                     message: `Du har ${count} underretningerHAHA`, // (required)
//                     playSound: false, // (optional) default: true
//                     // soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
//                     // number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
//                     // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
//                     // actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
//                   });
//                   PushNotification.setApplicationIconBadgeNumber(count);
//                 }
//                 BackgroundTask.finish();
//               });
//           })
//           .catch(err => {
//             console.log(err);
//           });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   } catch (err) {
//     console.log(err);
//   }
// };

// BackgroundTask.define(async () => {
//   checkNotify();
// });

export default class App extends Component {
  componentDidMount() {
    // this.sendLocalNotification();
    // BackgroundTask.schedule();
    // PushNotificationIOS.setApplicationIconBadgeNumber(10);
    // PushNotificationIOS.getApplicationIconBadgeNumber((res) => {
    //     console.log(res) //returns 10
    // });
    // this.checkStatus();
  }

  async checkStatus() {
    const status = await BackgroundTask.statusAsync();

    if (status.available) {
      // Everything's fine
      return;
    }

    const reason = status.unavailableReason;
    if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
      Alert.alert(
        'Denied',
        'Please enable background "Background App Refresh" for this app',
      );
    } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
      Alert.alert(
        'Restricted',
        'Background tasks are restricted on your device',
      );
    }
  }
  render() {
    return (
      <>
        <PushController />
        <PrimaryNav />
      </>
    );
  }
}
