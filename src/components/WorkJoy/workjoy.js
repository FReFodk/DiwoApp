import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Card, Icon } from 'react-native-elements';
import { Dialog } from 'react-native-simple-dialogs';
import Text_EN from '../res/lang/static_text';
import { NavigationEvents, SafeAreaView } from 'react-navigation';
import MultiSelect from 'react-native-multiple-select';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class home extends Component {
    myInterval = "";
    Newitem = [];
    constructor(props) {
        super(props)
        this._retrieveData = this._retrieveData.bind(this);
        this.state = {
            tokenValue: "",
            token: "",
            firstName: "",
            dataSource: "",
            yellow_selected: 1,
            red_selected: "",
            green_selected: "",
            count: 0,
            greenDialogVisible: false,
            redDialogVisible: false,
            yellowDialogVisible: false,
            threeTimesRed: false,
            lastReviewDate: "",
            submit_btn_active: 0,
            userId: "",
            commentBox: false,
            commentText: "",
            last_inserted_id: "",
            message_dialog: false,
            message_title: "",
            message_text: "",
            title: "",
            message: "",
            selectedItems: [],
            errorText: "",
            redMessage_dialog: false,
            loading: false
        }
        this._retrieveData();
        this.yellow_selected = this.yellow_selected.bind(this);
        this.red_selected = this.red_selected.bind(this);
        this.green_selected = this.green_selected.bind(this);
        this.page_reloaded = this.page_reloaded.bind(this);
    }
    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems, errorText: false });
    };
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
    red_selected() {
        this.setState({ yellow_selected: "", green_selected: "", red_selected: 1 });
    }
    green_selected() {
        this.setState({ yellow_selected: "", green_selected: 1, red_selected: "" });
    }
    yellow_selected() {
        this.setState({ yellow_selected: 1, green_selected: "", red_selected: "" });
    }

    learnMore = () => {
        Linking.openURL('http://diwo.nu');
    }

    help_workjoy = () => {
        Alert.alert(
            'Hvad er arbejdsglæde?',
            Text_EN.Text_en.workjoy_help_popup,
            [
                {
                    text: 'Ok',
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
                    text: 'Ok',
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
                    text: 'Ok',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Learn More', onPress: () => this.learnMore() },
            ],
            { cancelable: false },
        );
    }

    send_answer = () => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds

        var reviewDate = year + '-' + month + '-' + date;
        var now = year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':' + sec;

        const user_details = this.state.token;
        var headers = new Headers();
        let auth = 'Bearer ' + user_details.token;
        headers.append("Authorization", auth);

        if (this.state.green_selected == 1) {
            var review_value = Text_EN.Text_en.workjoy_green_selected;
            var data = new FormData()
            data.append('user_id', this.state.userId);
            data.append('review_date', reviewDate);
            data.append('review', review_value);
            data.append('last_review_date', now);
            console.log(data);
            this.setState({ loading: true })
            fetch("http://diwo.nu/public/api/addWorkJoy", {
                method: 'POST',
                headers: headers,
                body: data,
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({ loading: false })
                    if (responseJson.status == 200) {
                        console.log(responseJson);
                        this.setState({ submit_btn_active: 0 });
                        this.setState({ greenDialogVisible: true });
                        this.setState({ last_inserted_id: responseJson.last_inserted_id });
                    } else {
                        alert("Something went wrong. Please try later.");
                    }
                }).catch((error) => {
                    console.error(error);
                });
        }
        else if (this.state.red_selected == 1) {
            var review_value = Text_EN.Text_en.workjoy_red_selected;
            var data = new FormData()
            data.append('user_id', this.state.userId);
            data.append('review_date', reviewDate);
            data.append('review', review_value);
            data.append('last_review_date', now);
            console.log(data);
            this.setState({ loading: true })
            fetch("http://diwo.nu/public/api/addWorkJoy", {
                method: 'POST',
                headers: headers,
                body: data,
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({ loading: false })
                    if (responseJson.status == 200) {
                        console.log(responseJson);
                        this.setState({ submit_btn_active: 0 });
                        this.setState({ last_inserted_id: responseJson.last_inserted_id });
                        this.setState({ loading: true })
                        fetch("http://diwo.nu/public/api/latestWorkJoy", {
                            method: 'POST',
                            headers: headers,
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                this.setState({ loading: false })
                                if (responseJson.status == 200) {
                                    let count = 0;
                                    for (var i = 0; i < responseJson.workjoy_data.length; i++) {
                                        if (responseJson.workjoy_data[i].review == review_value) {
                                            count = count + 1;
                                        } else {
                                            console.log("else");
                                            count = 0;
                                        }
                                        // console.log(count);console.log("if");
                                    }
                                    if (count > 1) {
                                        this.setState({ threeTimesRed: true });
                                    } else {
                                        this.setState({ redDialogVisible: true });
                                    }
                                } else {
                                    alert("Something went wrong. Please try later.");
                                }
                            }).catch((error) => {
                                console.error(error);
                            });
                    } else {
                        alert("Something went wrong. Please try later.");
                    }
                }).catch((error) => {
                    console.error(error);
                });

        } else {
            var review_value = Text_EN.Text_en.workjoy_yellow_selected;
            var data = new FormData()
            data.append('user_id', this.state.userId);
            data.append('review_date', reviewDate);
            data.append('review', review_value);
            data.append('last_review_date', now);
            console.log(data);
            this.setState({ loading: true })
            fetch("http://diwo.nu/public/api/addWorkJoy", {
                method: 'POST',
                headers: headers,
                body: data,
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({ loading: false })
                    if (responseJson.status == 200) {
                        console.log(responseJson);
                        this.setState({ submit_btn_active: 0 });
                        this.setState({ yellowDialogVisible: true });
                        this.setState({ last_inserted_id: responseJson.last_inserted_id });
                    } else {
                        alert("Something went wrong. Please try later.");
                    }
                }).catch((error) => {
                    console.error(error);
                });
        }
    }

    save_comment = () => {
        console.log(this.state.commentText);
        console.log(this.state.last_inserted_id);
        const user_details = this.state.token;
        var headers = new Headers();
        let auth = 'Bearer ' + user_details.token;
        headers.append("Authorization", auth);

        var data = new FormData()
        data.append('id', this.state.last_inserted_id);
        data.append('comments', this.state.commentText);
        console.log(data);
        this.setState({ loading: true })
        fetch("http://diwo.nu/public/api/updateCommentsWorkJoy", {
            method: 'POST',
            headers: headers,
            body: data,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ loading: false })
                if (responseJson) {
                    console.log(responseJson);
                    this.setState({ commentBox: false, greenDialogVisible: false, redMessage_dialog: false });
                } else {
                    alert("Something went wrong. Please try later.");
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    inactive_press = () => {
        Alert.alert(
            '',
            Text_EN.Text_en.inactive_workjoy_submit,
            [
                {
                    text: 'Ok',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                // {text: 'Learn More', onPress: () => this.learnMore()},
            ],
            { cancelable: false },
        );
    }

    experience_Page = () => {
        this.props.navigation.navigate('Experience', { Firstname: this.state.firstName, token: this.state.token });
        this.setState({ greenDialogVisible: false });
    }

    redirect_measurement = () => {
        this.props.navigation.navigate('Measurement', { Firstname: this.state.firstName, token: this.state.token });
    }

    redMessage_Send = () => {
        console.log(this.state.message_title);
        console.log(this.state.message_text);
        console.log(this.state.selectedItems.toString());
        let rec_id = this.state.selectedItems.toString();
        if (rec_id.length > 0 && this.state.message_title.length > 0 && this.state.message_text.length > 0) {
            const user_details = this.state.token;
            var headers = new Headers();
            let auth = 'Bearer ' + user_details.token;
            headers.append("Authorization", auth);

            var data = new FormData()
            data.append('receiver_id', rec_id);
            data.append('title', this.state.message_title);
            data.append('message', this.state.message_text);
            console.log(data);
            this.setState({ loading: true })
            fetch("http://diwo.nu/public/api/sendMessage", {
                method: 'POST',
                headers: headers,
                body: data,
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({ loading: false })
                    console.log(responseJson);
                    if (responseJson.status == 200) {
                        console.log(responseJson);
                        this.setState({ redMessage_dialog: false, message_dialog: false, title: "", message_title: "", message_text: "", selectedItems: [], threeTimesRed: false, commentBox: true });
                    } else {
                        alert("Something went wrong.");
                    }
                }).catch((error) => {
                    console.error(error);
                });
        } else {
            this.setState({ errorText: true });
        }
    }

    message_send = () => {
        console.log(this.state.message_title);
        console.log(this.state.message_text);
        console.log(this.state.selectedItems.toString());
        let rec_id = this.state.selectedItems.toString();
        if (rec_id.length > 0 && this.state.message_title.length > 0 && this.state.message_text.length > 0) {
            const user_details = this.state.token;
            var headers = new Headers();
            let auth = 'Bearer ' + user_details.token;
            headers.append("Authorization", auth);

            var data = new FormData()
            data.append('receiver_id', rec_id);
            data.append('title', this.state.message_title);
            data.append('message', this.state.message_text);
            console.log(data);
            this.setState({ loading: true })
            fetch("http://diwo.nu/public/api/sendMessage", {
                method: 'POST',
                headers: headers,
                body: data,
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({ loading: false })
                    console.log(responseJson);
                    if (responseJson.status == 200) {
                        console.log(responseJson);
                        this.setState({ message_dialog: false, title: "", message_title: "", message_text: "", selectedItems: [], threeTimesRed: false, commentBox: true, redDialogVisible: false, yellowDialogVisible: false });
                    } else {
                        alert("Something went wrong.");
                    }
                }).catch((error) => {
                    console.error(error);
                });
        } else {
            this.setState({ errorText: true });
        }
    }

    componentDidMount() {
        this.setState({ yellow_selected: 1, red_selected: 0, green_selected: 0 });
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

            fetch("http://diwo.nu/public/api/lastAddedWorkJoy", {
                method: 'POST',
                headers: headers,
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status == 200) {
                        console.log(responseJson);
                        if (responseJson.workjoy_data[0]) {
                            this.setState({ lastReviewDate: responseJson.workjoy_data[0].last_review_date });

                            var date = responseJson.workjoy_data[0].last_review_date;
                            var t = date.split(/[- :]/);
                            var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

                            let dayWord = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            var day = new Date().getDay(); //Current Date
                            var month = new Date().getMonth() + 1; //Current month
                            var year = new Date().getFullYear(); //Current year
                            var hours = new Date().getHours(); //Current Hours
                            var min = new Date().getMinutes();

                            var now = new Date();
                            for (var dt = new Date(d); dt <= now; dt.setDate(dt.getDate() + 1)) {
                                if (dayWord[dt.getDay()] == "Thursday") {
                                    if (dt.getDate() == d.getDate() && dt.getMonth() == d.getMonth() && dt.getFullYear() == d.getFullYear()) {
                                        this.setState({ submit_btn_active: 0 });
                                    } else {
                                        this.setState({ submit_btn_active: 1 });
                                    }
                                    if (dt.getDate() == now.getDate() && dt.getMonth() == now.getMonth() && dt.getFullYear() == now.getFullYear()) {
                                        this.setState({ submit_btn_active: 0 });
                                    }
                                } else if (dayWord[now.getDay()] == "Thursday") {
                                    this.setState({ submit_btn_active: 1 });
                                }
                            }
                            // var currentDate = year +'-'+ month +'-'+day;
                            var currentTime = dayWord[day] + ':' + hours + ':' + min;
                            if (currentTime == 'Thursday:12:00') {
                                this.setState({ submit_btn_active: 1 });
                            }
                        } else {
                            this.setState({ submit_btn_active: 1 });
                        }
                    }
                }).catch((error) => {
                    console.error(error);
                });

            fetch("http://diwo.nu/public/api/getAllUserInfo", {
                method: 'POST',
                headers: headers,
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    //this.setState({item:responseJson.users[0].user_id});
                    this.Newitem = [];
                    for (var i = 0; i < responseJson.users.length; i++) {
                        var id = responseJson.users[i].user_id;
                        var name = responseJson.users[i].first_name + ' ' + responseJson.users[i].last_name
                        console.log(id);
                        this.Newitem.push({
                            id: id,
                            name: name
                        });
                    }
                }).catch((error) => {
                    console.error(error);
                });
        }
    }

    render() {
        const { selectedItems } = this.state;
        var { height, width } = Dimensions.get('window');
        return (
            <View style={styles.container}>
                {this.state.loading == true ? <View style={styles.spinner}>
                    <ActivityIndicator size="large" color="#12075e" />
                </View>
                    : null}
                <NavigationEvents onDidFocus={() => { this.page_reloaded() }} />
                <Dialog
                    visible={this.state.message_dialog}
                    onTouchOutside={() => this.setState({ message_dialog: false, errorText: false })} >
                    <View style={{ position: 'relative', padding: 15 }}>
                        <View style={styles.dialog_close_icon}>
                            <TouchableOpacity onPress={() => this.setState({ message_dialog: false, errorText: false })}>
                                <Image
                                    style={{
                                        width: width > height ? wp('3.5%') : wp('8%'),
                                        height: width > height ? wp('3.5%') : wp('8%')
                                    }}
                                    source={require('../../uploads/close.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingBottom: 10, marginTop: 50 }}>
                            {this.state.errorText == true ? <Text style={{ paddingLeft: 15, color: 'red', fontSize: width > height ? wp('1.5%') : wp('2.6%') }}>{Text_EN.Text_en.select_user_error}</Text> : null}
                            <MultiSelect
                                styleTextDropdown={{ paddingLeft: 15 }}
                                styleTextDropdownSelected={{ paddingLeft: 15 }}
                                styleDropdownMenu={{ marginTop: 20 }}
                                hideSubmitButton
                                hideTags
                                items={this.Newitem}
                                uniqueKey="id"
                                ref={(component) => { this.multiSelect = component }}
                                onSelectedItemsChange={this.onSelectedItemsChange}
                                selectedItems={selectedItems}
                                selectText="Users"
                                fontSize={width > height ? wp('1.5%') : wp('4%')}
                                searchInputPlaceholderText="Search Name..."
                                onChangeInput={(text) => console.log(text)}
                                tagRemoveIconColor="#68c5fc"
                                tagBorderColor="#68c5fc"
                                tagTextColor="#68c5fc"
                                selectedItemTextColor="#68c5fc"
                                selectedItemIconColor="#CCC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: '#CCC' }}
                                submitButtonColor="#48d22b"
                                submitButtonText="Submit"
                            />
                            <TextInput
                                defaultValue={this.state.message_title}
                                style={styles.Text_input_title}
                                placeholder={Text_EN.Text_en.title}
                                onChangeText={(message_title) => this.setState({ message_title, errorText: false })}
                            />
                            {this.state.errorText == true ? <Text style={{ paddingLeft: 15, color: 'red' }}></Text> : null}
                            <TextInput
                                defaultValue={this.state.message_text}
                                style={styles.Text_input_message}
                                placeholder="Kommentar til din leder"
                                multiline={true}
                                numberOfLines={8}
                                onChangeText={(message_text) => this.setState({ message_text, errorText: false })}
                            />
                        </View>
                        <View style={styles.dialog_submit_btn}>
                            <TouchableOpacity style={{ backgroundColor: '#00a1ff', padding: 10, paddingRight: 25, paddingLeft: 25, borderRadius: 5 }} onPress={() => this.message_send()}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.send_message}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Dialog>
                <Dialog
                    visible={this.state.redMessage_dialog}
                    onTouchOutside={() => this.setState({ redMessage_dialog: false, errorText: false })} >
                    <View style={{ position: 'relative', padding: 15 }}>
                        <View style={styles.dialog_close_icon}>
                            <TouchableOpacity onPress={() => this.setState({ redMessage_dialog: false, errorText: false })}>
                                <Image
                                    style={{
                                        width: width > height ? wp('3.5%') : wp('8%'),
                                        height: width > height ? wp('3.5%') : wp('8%')
                                    }}
                                    source={require('../../uploads/close.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingBottom: 10, marginTop: 50 }}>
                            {this.state.errorText == true ? <Text style={{ paddingLeft: 15, color: 'red', fontSize: width > height ? wp('1.5%') : wp('2.6%') }}>{Text_EN.Text_en.select_user_error}</Text> : null}
                            <MultiSelect
                                styleTextDropdown={{ paddingLeft: 15 }}
                                styleTextDropdownSelected={{ paddingLeft: 15 }}
                                styleDropdownMenu={{ marginTop: 20 }}
                                hideSubmitButton
                                hideTags
                                items={this.Newitem}
                                uniqueKey="id"
                                ref={(component) => { this.multiSelect = component }}
                                onSelectedItemsChange={this.onSelectedItemsChange}
                                selectedItems={selectedItems}
                                selectText="Users"
                                fontSize={width > height ? wp('1.5%') : wp('4%')}
                                searchInputPlaceholderText="Search Name..."
                                onChangeInput={(text) => console.log(text)}
                                tagRemoveIconColor="#68c5fc"
                                tagBorderColor="#68c5fc"
                                tagTextColor="#68c5fc"
                                selectedItemTextColor="#68c5fc"
                                selectedItemIconColor="#CCC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: '#CCC' }}
                                submitButtonColor="#48d22b"
                                submitButtonText="Submit"
                            />
                            <TextInput
                                defaultValue={this.state.message_title}
                                style={styles.Text_input_title}
                                placeholder={Text_EN.Text_en.title}
                                onChangeText={(message_title) => this.setState({ message_title, errorText: false })}
                            />
                            {this.state.errorText == true ? <Text style={{ paddingLeft: 15, color: 'red' }}></Text> : null}
                            <TextInput
                                defaultValue={this.state.message_text}
                                style={styles.Text_input_message}
                                placeholder="Kommentar til din leder"
                                multiline={true}
                                numberOfLines={8}
                                onChangeText={(message_text) => this.setState({ message_text, errorText: false })}
                            />
                        </View>
                        <View style={styles.dialog_submit_btn}>
                            <TouchableOpacity style={{ backgroundColor: '#00a1ff', padding: 10, paddingRight: 25, paddingLeft: 25, borderRadius: 5 }} onPress={() => this.redMessage_Send()}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.send_message}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Dialog>
                <Dialog
                    visible={this.state.greenDialogVisible}
                    onTouchOutside={() => this.setState({ greenDialogVisible: false })} >
                    <View style={{ position: 'relative', padding: 15 }}>
                        <View style={styles.dialog_close_icon}>
                            <TouchableOpacity onPress={() => this.setState({ greenDialogVisible: false })}>
                                <Image
                                    style={{
                                        width: width > height ? wp('3.5%') : wp('8%'),
                                        height: width > height ? wp('3.5%') : wp('8%')
                                    }}
                                    source={require('../../uploads/close.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingBottom: 10, marginTop: 50 }}>
                            <Text style={styles.dialog_txt}>{Text_EN.Text_en.workjoy_greenselected_popup}</Text>
                        </View>
                        <View style={styles.dialog_submit_btn}>
                            <TouchableOpacity style={{ backgroundColor: '#00a1ff', padding: 10, paddingRight: 15, paddingLeft: 15, borderRadius: 5 }} onPress={() => { this.setState({ commentBox: true, greenDialogVisible: false }) }}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.workjoy_yes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 15, backgroundColor: '#00a1ff', padding: 10, paddingRight: 15, paddingLeft: 15, borderRadius: 5 }} onPress={() => this.experience_Page()}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.share_experience}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Dialog>
                <Dialog
                    visible={this.state.redDialogVisible}
                    onTouchOutside={() => this.setState({ redDialogVisible: false })} >
                    <View style={{ position: 'relative', padding: 15 }}>
                        <View style={styles.dialog_close_icon}>
                            <TouchableOpacity onPress={() => this.setState({ redDialogVisible: false })}>
                                <Image
                                    style={{
                                        width: width > height ? wp('3.5%') : wp('8%'),
                                        height: width > height ? wp('3.5%') : wp('8%')
                                    }}
                                    source={require('../../uploads/close.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingBottom: 10, marginTop: 50 }}>
                            <Text style={styles.dialog_txt}>{Text_EN.Text_en.workjoy_redselected_popup}</Text>
                        </View>
                        <View style={styles.dialog_submit_btn}>
                            <TouchableOpacity style={{ marginLeft: 15, backgroundColor: '#00a1ff', padding: 10, paddingRight: 25, paddingLeft: 25, borderRadius: 5 }} onPress={() => { this.setState({ message_dialog: true }) }}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.send_message}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Dialog>
                <Dialog
                    visible={this.state.threeTimesRed}
                    onTouchOutside={() => this.setState({ threeTimesRed: false })}>
                    <View style={{ position: 'relative', padding: 15 }}>
                        <View style={{ paddingBottom: 10, }}>
                            <Text style={styles.dialog_txt}>{Text_EN.Text_en.three_time_red}</Text>
                        </View>
                        <View style={styles.dialog_submit_btn}>
                            <TouchableOpacity style={{ marginLeft: 15, backgroundColor: '#00a1ff', padding: 10, paddingRight: 25, paddingLeft: 25, borderRadius: 5 }} onPress={() => { this.setState({ redMessage_dialog: true }) }}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.send_message}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Dialog>
                <Dialog
                    visible={this.state.yellowDialogVisible}
                    onTouchOutside={() => this.setState({ yellowDialogVisible: false })} >
                    <View style={{ position: 'relative', padding: 15 }}>
                        <View style={styles.dialog_close_icon}>
                            <TouchableOpacity onPress={() => this.setState({ yellowDialogVisible: false })}>
                                <Image
                                    style={{
                                        width: width > height ? wp('3.5%') : wp('8%'),
                                        height: width > height ? wp('3.5%') : wp('8%')
                                    }}
                                    source={require('../../uploads/close.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingBottom: 10, marginTop: 50 }}>
                            <Text style={styles.dialog_txt}>{Text_EN.Text_en.workjoy_yellowselected_popup}</Text>
                        </View>
                        <View style={styles.dialog_submit_btn}>
                            <TouchableOpacity style={{ backgroundColor: '#00a1ff', padding: 10, paddingRight: 15, paddingLeft: 15, borderRadius: 5 }} onPress={() => { this.setState({ commentBox: true, yellowDialogVisible: false }) }}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.no}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 15, backgroundColor: '#00a1ff', padding: 10, paddingRight: 15, paddingLeft: 15, borderRadius: 5 }} onPress={() => { this.setState({ message_dialog: true }) }}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.send_message}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Dialog>
                <Dialog
                    visible={this.state.commentBox}
                    title="Kommentar"
                    onTouchOutside={() => this.setState({ commentBox: false })} >
                    <View style={{ position: 'relative', padding: 15 }}>
                        <View style={styles.dialog_close_icon_comment}>
                            <TouchableOpacity onPress={() => this.setState({ commentBox: false })}>
                                <Image
                                    style={{
                                        width: width > height ? wp('3.5%') : wp('8%'),
                                        height: width > height ? wp('3.5%') : wp('8%')
                                    }}
                                    source={require('../../uploads/close.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: width > height ? wp('2%') : wp('4%'), }}>{Text_EN.Text_en.comment_text}</Text>
                        <View style={{ paddingBottom: 10, marginTop: 20 }}>
                            <TextInput style={styles.Text_input}
                                placeholder="skriv din kommentar..."
                                multiline={true}
                                fontSize={width > height ? wp('1.5%') : wp('4%')}
                                numberOfLines={4}
                                onChangeText={(commentText) => this.setState({ commentText })} />
                        </View>
                        <View style={styles.dialog_submit_btn}>
                            <TouchableOpacity style={{ backgroundColor: '#00a1ff', padding: 10, paddingRight: 30, paddingLeft: 30, borderRadius: 5 }} onPress={() => this.save_comment()}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.ja}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 15, backgroundColor: '#00a1ff', padding: 10, paddingRight: 25, paddingLeft: 25, borderRadius: 5 }} onPress={() => { this.setState({ commentBox: false, redMessage_dialog: false }) }}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.no}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Dialog>


                <Image
                    style={styles.background_diamond}
                    source={require('../../uploads/diamond-dark.png')}
                />
                <ScrollView>
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
                    <View style={{ flex: 1, marginHorizontal: width > height ? wp('3%') : wp('2%'), marginTop: 10 }}>
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

                        <Text style={styles.workjoy_title}><Text style={{ fontSize: width > height ? wp('2.5%') : wp('4%'), fontWeight: 'bold' }}>{Text_EN.Text_en.job_satisfaction} : </Text>{Text_EN.Text_en.workjoy_title}</Text>

                        <TouchableOpacity onPress={() => this.green_selected()}>
                            <Card borderRadius={15} containerStyle={{ marginVertical: 40 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {this.state.green_selected == 1 ? <Image
                                        style={{ width: width > height ? wp('4%') : wp('10%'), height: width > height ? wp('4%') : wp('10%') }}
                                        source={require('../../uploads/g1.png')}
                                    /> : <Image
                                            style={{ width: width > height ? wp('4%') : wp('10%'), height: width > height ? wp('4%') : wp('10%') }}
                                            source={require('../../uploads/green.png')}
                                        />}
                                    <Text style={styles.question_txt}>{Text_EN.Text_en.workjoy_good_week}</Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.yellow_selected()}>
                            <Card borderRadius={10}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {this.state.yellow_selected == 1 ? <Image
                                        style={{ width: width > height ? wp('4%') : wp('10%'), height: width > height ? wp('4%') : wp('10%') }}
                                        source={require('../../uploads/y1.png')}
                                    /> : <Image
                                            style={{ width: width > height ? wp('4%') : wp('10%'), height: width > height ? wp('4%') : wp('10%') }}
                                            source={require('../../uploads/yellow.png')}
                                        />}
                                    <Text style={styles.question_txt}>{Text_EN.Text_en.workjoy_normal_week}</Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.red_selected()}>
                            <Card borderRadius={10}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {this.state.red_selected == 1 ? <Image
                                        style={{ width: width > height ? wp('4%') : wp('10%'), height: width > height ? wp('4%') : wp('10%') }}
                                        source={require('../../uploads/r1.png')}
                                    /> : <Image
                                            style={{ width: width > height ? wp('4%') : wp('10%'), height: width > height ? wp('4%') : wp('10%') }}
                                            source={require('../../uploads/red.png')}
                                        />}
                                    <Text style={styles.question_txt}> {Text_EN.Text_en.workjoy_not_good}</Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                        {this.state.submit_btn_active == 0 ?
                            <TouchableOpacity style={styles.inactive_submit_btn} onPress={() => this.inactive_press()}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.submit_answer}</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity style={styles.active_submit_btn} onPress={() => this.send_answer()}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.submit_answer}</Text>
                            </TouchableOpacity>}
                        <TouchableOpacity style={styles.active_submit_btn} onPress={() => this.redirect_measurement()}>
                            <Text style={styles.submit_btn}>{Text_EN.Text_en.link_measurement_btn}</Text>
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
                    <View style={{ marginBottom: 5 }}>
                        <Text style={{ textAlign: 'center' }}><Text style={{ fontSize: 18 }}>©</Text> Copyright FReFo</Text>
                    </View>
                </HideWithKeyboard>
            </View >
        );
    }
}
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        zIndex: 1
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
        borderRadius: 5
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
        borderRadius: 5
    },
    bottom_btn: {
        width: '30.333%',
        backgroundColor: '#00a1ff',
        marginTop: 0,
        marginLeft: 8,
        marginBottom: 2,
        borderRadius: 10,
        justifyContent: 'center'
    },
    bottom_btn_txt: {
        textAlign: 'center',
        color: 'white',
        fontSize: width * 0.042,
        padding: 10
    },
    dialog_txt: {
        fontWeight: "bold",
        color: "black",
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
        paddingBottom: 0
    },
    submit_btn: {
        textAlign: 'center',
        color: 'white',
        fontSize: width > height ? wp('1.5%') : wp('3.5%'),
        fontWeight: 'bold'
    },
    dialog_submit_btn: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        paddingTop: 20
    },
    background_diamond: {
        position: 'absolute',
        width: width > height ? wp('70%') : wp('90%'),
        height: width > height ? wp('65%') : wp('85%'),
        bottom: -width * 0.3,
        right: -width * 0.28,
        opacity: 0.2,
        transform: [{ rotate: "321deg" }]
    },
    Text_input: {
        paddingLeft: 15,
        borderWidth: 1,
        textAlignVertical: "top",
        backgroundColor: "white",
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
        textAlignVertical: "top",
        backgroundColor: "white",
        borderTopColor: 'white',
        borderLeftColor: 'white',
        borderBottomColor: 'lightgrey',
        borderRightColor: 'white',
        marginBottom: 0,
        fontSize: width > height ? wp('1.5%') : wp('4%'),
        minHeight: 40
    },
    Text_input_message: {
        fontSize: width > height ? wp('1.5%') : wp('4%'),
        paddingLeft: 15,
        borderWidth: 1,
        textAlignVertical: "top",
        backgroundColor: "white",
        borderTopColor: 'lightgrey',
        borderLeftColor: 'lightgrey',
        borderBottomColor: 'lightgrey',
        borderRightColor: 'lightgrey',
        marginTop: 30,
        marginBottom: 15,
        borderRadius: 15,
        minHeight: 150
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
    }
});  