import Login from './Login/login';
import Home from './Home/home';
import Logout from './Login/logout';
import Forgot from './Login/Forgot';
import Workjoy from './WorkJoy/workjoy';
import Experience from './Experience/experience';
import Message from './Message/message';
import Social_kapital from './Social_Kapital/social_kapital/';
import Measurement from './Measurement/measurement';
import Profile from './Profile/profile';
import More_info from './More_info/More_info'
import { createAppContainer, SafeAreaView } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import React from 'react';
import { Image, Dimensions, ScrollView, View, Text,Alert } from 'react-native';
import Text_EN from './res/lang/static_text';
import SplashScreen from 'react-native-splash-screen';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

var { height, width } = Dimensions.get('window');

setTimeout(function () {
  SplashScreen.hide();
}, 2000)

checkPermission = async () => {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
      this.getFcmToken();
  } else {
      this.requestPermission();
  }
}

getFcmToken = async () => {
  const fcmToken = await firebase.messaging().getToken();
  if (fcmToken) {
    console.log("fcm",fcmToken);
    // this.showAlert('Your Firebase Token is:', fcmToken);
    this.storeDeviceToken(fcmToken);

  } else {
    this.showAlert('Failed', 'No token received');
  }
}

requestPermission = async () => {
  try {
    await firebase.messaging().requestPermission();
    // User has authorised
  } catch (error) {
      // User has rejected permissions
  }
}
messageListener = async () => {
  this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      //this.showAlert(title, body);
      console.log(notification._data.badge)
    firebase.notifications().getBadge()
      .then(count => {
        //alert(count)

        count = parseFloat(notification._data.badge)
        console.log("new", count)
        firebase.notifications().setBadge(count)
      })
      .then(() => {
        console.log('Doing great')
      })
      .catch(error => {
        console.log('fail to count')
      })
  });

  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      // this.showAlert(title, body);
  });

  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      // this.showAlert(title, body);
  }

  this.messageListener = firebase.messaging().onMessage((message) => {
    console.log(JSON.stringify(message));
  });
}

showAlert = (title, message) => {
  Alert.alert(
    title,
    message,
    [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  );
}

storeDeviceToken = async (token) => {
  var data = new FormData()
  data.append("udid", DeviceInfo.getUniqueId());
  data.append("platform", Platform.OS);
  data.append("push_id", token);
  data.append("type", 'default_app');
  console.log(data);

  var headers = new Headers();
  headers.append('Accept', 'application/json');
  fetch("http://diwo.nu/public/api/add_notification", {
    method: "POST",
    headers: headers,
    body: data
  })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("responseJson",responseJson);
    }).catch(error => {
      console.log("error" + error);
    });
}

this.checkPermission();
this.messageListener();

const Primary_Nav = createDrawerNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      drawerLabel: () => null,
      drawerLockMode: 'locked-closed'
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      drawerLabel: Text_EN.Text_en.Home,
      drawerIcon: (
        <Image
          source={require('../uploads/menu_logo/home.png')}
          style={{ width: 30, height: 30 }}
        />
      ),
    }
  },
  Workjoy: {
    screen: Workjoy,
    navigationOptions: {
      drawerLabel: Text_EN.Text_en.Arbejdsglaede,
      drawerIcon: (
        <Image
          source={require('../uploads/menu_logo/portfolio.png')}
          style={{ width: 30, height: 30 }}
        />
      ),
    }
  },
  Social_kapital: {
    screen: Social_kapital,
    navigationOptions: {
      drawerLabel: Text_EN.Text_en.Social_Kapital,
      drawerIcon: (
        <Image
          source={require('../uploads/menu_logo/question.png')}
          style={{ width: 30, height: 30 }}
        />
      ),
    }
  },
  Experience: {
    screen: Experience,
    navigationOptions: {
      drawerLabel: Text_EN.Text_en.Experience,
      drawerIcon: (
        <Image
          source={require('../uploads/menu_logo/experiment-results.png')}
          style={{ width: 30, height: 30 }}
        />
      ),
    }
  },
  Message: {
    screen: Message,
    navigationOptions: {
      drawerLabel: "Beskeder",
      drawerIcon: (
        <Image
          source={require('../uploads/menu_logo/email.png')}
          style={{ width: 30, height: 30 }}
        />
      ),
    }
  },
  Measurement: {
    screen: Measurement,
    navigationOptions: {
      drawerLabel: Text_EN.Text_en.Mine_Malinger,
      drawerIcon: (
        <Image
          source={require('../uploads/menu_logo/graph.png')}
          style={{ width: 30, height: 30 }}
        />
      ),
    }
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      drawerLabel: Text_EN.Text_en.Min_Profile,
      drawerIcon: (
        <Image
          source={require('../uploads/menu_logo/avatar.png')}
          style={{ width: 30, height: 30 }}
        />
      ),
    }
  },
  More_info: {
    screen: More_info,
    navigationOptions: {
      drawerLabel: Text_EN.Text_en.More_info,
      drawerIcon: (
        <Image
          source={require('../uploads/menu_logo/more.png')}
          style={{ width: 30, height: 30 }}
        />
      ),
    }
  },
  Logout: {
    screen: Logout,
    navigationOptions: {
      drawerLabel: Text_EN.Text_en.Logout,
      drawerIcon: (
        <Image
          source={require('../uploads/menu_logo/log-out.png')}
          style={{ width: 30, height: 30 }}
        />
      ),
    }
  },
  Forgot: {
    screen: Forgot,
    navigationOptions: {
      drawerLabel: () => null,
      drawerLockMode: 'locked-closed'
    }
  },
}, {
  initialRouteName: 'Home',
  drawerPosition: 'right',
  drawerType: "slide",
  // drawerOpenRouter:'DrawerOpen',
  // drawerCloseRouter:'DrawerClose',
  drawerBackgroundColor: "#01a2ff",
  drawerType: 'front',
  drawerWidth: width > height ? wp('30%') : wp('50%'),
  contentOptions: {
    inactiveTintColor: 'white',
    activeTintColor: 'white',
    activeBackgroundColor: '#87d9f7',
    labelStyle: {
      fontSize: width > height ? wp('5%') : wp('3.2%'),
    },
  }
});

const PrimaryNav = createAppContainer(Primary_Nav);
export default PrimaryNav;
