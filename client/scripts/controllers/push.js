angular.module('helpmed.push', ['ionic'])

    .service('pushService', ['$rootScope', '$ionicPopup',
        function($rootScope, $ionicPopup) {
            var self = {};
            var push;
            self.register = function () {
                push = PushNotification.init({
                    android: {
                        senderID: "925925152744"
                    },
                    ios: {
                        alert: "true",
                        badge: "true",
                        sound: "true"
                    },
                    windows: {}
                });

                push.on('registration', function (data) {
                    console.log("Post token registration call", data.registrationId);
                    // data.registrationId
                    if (ionic.Platform.isIOS())
                        self.type = 'ios';
                    else if (ionic.Platform.isAndroid())
                        self.type = 'android';
                    else self.type = 'xxx';

                    self.regId = data.registrationId;

                    var user = {type: self.type, token: self.regId};
                    console.log(JSON.stringify(user));
                    Tracker.autorun(function () {
                        if (Meteor.userId()) {
                            console.log("Post token for registered device with data " + JSON.stringify(user));
                            Meteor.call('profile.token', self.regId, function() {
                                console.log('profile.token');
                            });
                        }
                    });
                });

                push.on('notification', function (data) {
                    $ionicPopup.showLongTop(data.message);
                    // data.message,
                    // data.title,
                    // data.count,
                    // data.sound,
                    // data.image,
                    console.log("data", data);
                    console.log(data.message);
                    console.log(data.title);
                    console.log(data.count);
                    console.log(data.sound);
                    console.log(data.image);
                    console.log(data.additionalData);
                });
            }
            return { register: self.register };

        }]);