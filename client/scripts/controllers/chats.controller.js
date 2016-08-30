import {Controller} from "angular-ecmascript/module-helpers";

export default class ChatsCtrl extends Controller {
    constructor() {
        super(...arguments);

        var self = this;

        this.onDeviceReady = function () {
            var self = this;

            console.log('Загрузка контактов');

            if (!navigator || !navigator.contacts) {
                console.log('Устройство не поддерживает контакты');

                self.allContacts = [{
                    "id": "1",
                    "firstName": "Kate",
                    "middleName": "",
                    "lastName": "Bell",
                    "displayName": "Kate Bell",
                    "name": {"formatted": "Kate Bell"},
                    "phoneNumbers": [{
                        "number": "(555) 564-8583",
                        "normalizedNumber": "(555) 564-8583",
                        "value": "(555) 564-8583",
                        "type": "MOBILE"
                    }, {
                        "number": "(415) 555-3695",
                        "normalizedNumber": "(415) 555-3695",
                        "value": "(415) 555-3695",
                        "type": "OTHER"
                    }]
                }, {
                    "id": "2",
                    "firstName": "Daniel",
                    "middleName": "",
                    "lastName": "Higgins",
                    "displayName": "Daniel Higgins",
                    "name": {"formatted": "Daniel Higgins"},
                    "phoneNumbers": [{
                        "number": "555-478-7672",
                        "normalizedNumber": "555-478-7672",
                        "value": "555-478-7672",
                        "type": "HOME"
                    }, {
                        "number": "(408) 555-5270",
                        "normalizedNumber": "(408) 555-5270",
                        "value": "(408) 555-5270",
                        "type": "MOBILE"
                    }, {
                        "number": "(408) 555-3514",
                        "normalizedNumber": "(408) 555-3514",
                        "value": "(408) 555-3514",
                        "type": "OTHER"
                    }]
                }, {
                    "id": "3",
                    "firstName": "John",
                    "middleName": "Paul",
                    "lastName": "Appleseed",
                    "displayName": "John Paul Appleseed",
                    "name": {"formatted": "John Paul Appleseed"},
                    "phoneNumbers": [{
                        "number": "888-555-5512",
                        "normalizedNumber": "888-555-5512",
                        "value": "888-555-5512",
                        "type": "MOBILE"
                    }, {
                        "number": "888-555-1212",
                        "normalizedNumber": "888-555-1212",
                        "value": "888-555-1212",
                        "type": "HOME"
                    }]
                }];

                self.$ionicLoading.hide();
                self.tabContacs();
            } else {
                navigator.contacts.find(["*"], function (contacts) {
                    self.allContacts = contacts;
                    self.$ionicLoading.hide();
                    self.tabContacs();
                }, function () {
                    alert('onError!');
                });
            }
        };

        this.tab = 'all';

        this.$ionicLoading.show({
            template: 'Загрузка контактов...'
        });

        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener("deviceready", self.onDeviceReady, false);
        } else {
            self.onDeviceReady();
        }
    }


    tabContacs() {

        var self = this;
        self.NewChat.contacts = self.allContacts;

        if (this.tab == 'all') {
            this.contacts = this.allContacts;
        } else {
            this.subscribe('interestByUserId', function () {
                var tmp = Interest.find({user_id: Meteor.userId()}).fetch();
                var ids = [];
                _.each(tmp, function (i) {
                    ids.push(parseInt(i.to_id));
                });

                this.contacts = [];
                _.each(this.allContacts, function (i) {
                    if (ids.indexOf(i.id) > -1) {
                        self.contacts.push(i);
                    }
                });
            })
        }
    }


    onContact(contact) {
        this.NewChat.contact = contact;
        this.$state.go('chatse', {contactId: contact.id})
    }


    sendFrendSms(phone) {
        Meteor.call('twilio.sendSms', phone, 'Hello World!')
    }

    sendFrendMMS() {
        Meteor.call('twilio.sendMMS', '+79031225995', 'Hello World!', 'http://vignette2.wikia.nocookie.net/tardis/images/9/90/Jhjh.jpg/revision/latest?cb=20100501130316')
    }

}

ChatsCtrl.$inject = ['NewChat', '$state', '$ionicLoading'];
