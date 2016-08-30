// Libs
//import 'angular-animate';
import 'angular-meteor';
import 'angular-meteor-auth';
import 'angular-moment';
import 'angular-sanitize';
import 'angular-ui-router';
import 'ionic-scripts';
import Angular from 'angular';
import Loader from 'angular-ecmascript/module-loader';
import { Meteor } from 'meteor/meteor';

// Modules
import ChatsCtrl from '../controllers/chats.controller';
import ChatCtrl from '../controllers/chat.controller';
import ConfirmationCtrl from '../controllers/confirmation.controller';
import LoginCtrl from '../controllers/login.controller';
import NewChatCtrl from '../controllers/new-chat.controller';
import SettingsCtrl from '../controllers/settings.controller';
import InputDirective from '../directives/input.directive';
import CalendarFilter from '../filters/calendar.filter';
import ChatNameFilter from '../filters/chat-name.filter';
import ChatPictureFilter from '../filters/chat-picture.filter';
import NewChatService from '../services/new-chat.service';
import InterestFriend from '../controllers/interest.friend';
import FriendDetail from '../controllers/friend.detail';
import Routes from '../routes';

const App = 'CheckInt';

// App
Angular.module(App, [
    'angular-meteor',
    'angular-meteor.auth',
    'angularMoment',
    'ngMask',
    'ionic'
]).run(function () {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
    }

    if (window.PushNotification) {
        //pushService.register();
        var token = {};

        var push = window.PushNotification.init({
            android: {senderID: "925925152744"},
            ios: {alert: "true", badge: "true", sound: "true"},
            windows: {}
        });

        push.on('registration', function (data) {
            console.log("Post token registration call", data.registrationId);

            if (ionic.Platform.isIOS()) {
                token = {apn: data.registrationId};
            } else if (ionic.Platform.isAndroid()) {
                token = {apn: data.registrationId};
            } else {
                token = {apn: data.registrationId};
            }

            Tracker.autorun(function () {
                if (Meteor.userId()) {
                    Meteor.call('user.updateToken', token);
                }
            });
        });

        push.on('notification', function (data) {
            console.log("data", data);
            $ionicPopup.showLongTop(data.message);
        });
    }

});

new Loader(App)
    .load(ChatsCtrl)
    .load(ChatCtrl)
    .load(ConfirmationCtrl)
    .load(LoginCtrl)
    .load(NewChatCtrl)
    .load(SettingsCtrl)
    .load(InputDirective)
    .load(CalendarFilter)
    .load(ChatNameFilter)
    .load(ChatPictureFilter)
    .load(NewChatService)
    .load(InterestFriend)
    .load(FriendDetail)
    .load(Routes);

// Startup

if (Meteor.isClient) {

    function onReady() {
        angular.bootstrap(document, [App]);
    }

    if (Meteor.isCordova) {
        angular.element(document).on("deviceready", onReady);
    }
    else {
        angular.element(document).ready(onReady);
    }
}