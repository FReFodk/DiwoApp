import React, {Component, Fragment} from 'react';
import PushNotification from 'react-native-push-notification';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
} from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import DeviceInfo from 'react-native-device-info';

export default class PushController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushData: [],
    };
  }

  storeDeviceToken(token) {
    var data = new FormData();
    data.append('udid', DeviceInfo.getUniqueId());
    data.append('platform', Platform.OS);
    data.append('push_id', token);
    data.append('type', 'default_app');
    console.log(data);

    var headers = new Headers();
    headers.append('Accept', 'application/json');
    fetch('http://diwo.nu/public/api/add_notification', {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('responseJson', responseJson);
        PushNotification.setApplicationIconBadgeNumber(10);
      })
      .catch(error => {
        console.log('error' + error);
      });
  }

  sendLocalNotification = () => {
    PushNotification.localNotification({
      /* Android Only Properties */

      /* iOS and Android properties */
      title: 'Welcome back to Diwo', // (optional)
      message: 'Welcome back to Diwo', // (required)
      playSound: false, // (optional) default: true
      // soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      // actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
    });
  };

  pushNotificationBadge(num) {
    PushNotification.setApplicationIconBadgeNumber(num);
  }
  componentDidMount() {
    let self = this;
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log('TOKEN:', token);
        self.storeDeviceToken(token);
        self.sendLocalNotification();
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);

        // process the notification
        self._addDataToList(notification);
        // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: '18239083421',

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true,
    });
  }

  _renderItem = ({item}) => (
    <View key={item.title}>
      <Text style={styles.title}>{item.custom_title}</Text>
      <Text style={styles.message}>{item.custom_message}</Text>
    </View>
  );

  _addDataToList(data) {
    let array = this.state.pushData;
    array.push(data);
    this.setState({
      pushData: array,
    });
    console.log(this.state);
  }

  render() {
    return <></>;
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  listHeader: {
    backgroundColor: '#eee',
    color: '#222',
    height: 44,
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  noData: {
    paddingVertical: 50,
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    paddingBottom: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
