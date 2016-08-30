angular.module('checkint.push', ['$rootScope', 'ionic']).service('pushService', ['$rootScope', '$ionicPopup', function ($rootScope, $ionicPopup) {
    var self = {};

    self.register = function () {
        var push = PushNotification.init({
            android: {senderID: "925925152744"},
            ios: {alert: "true", badge: "true", sound: "true"},
            windows: {}
        });

        push.on('registration', function (data) {
            console.log("Post token registration call", data.registrationId);

            if (ionic.Platform.isIOS()) {
                self.token = {apn: data.registrationId};
            } else if (ionic.Platform.isAndroid()) {
                self.token = {apn: data.registrationId};
            } else {
                self.token = {apn: data.registrationId};
            }

            Tracker.autorun(function () {
                if (Meteor.userId()) {
                    Meteor.call('user.updateToken', self.token);
                }
            });
        });

        push.on('notification', function (data) {
            console.log("data", data);
            $ionicPopup.showLongTop(data.message);
        });
    };
    return {register: self.register};

}]);