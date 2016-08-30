import {Ionic} from "ionic-scripts";
import {_} from "meteor/underscore";
import {Meteor} from "meteor/meteor";
import {Controller} from "angular-ecmascript/module-helpers";

export default class ChatCtrl extends Controller {

    constructor() {
        super(...arguments);

        this.inter = [];
        this.subscribe('InterestByUserId', function () {
            this.inter = Interest.findOne({to_id: this.$stateParams.contactId});
            this.inter = this.inter && this.inter.name ? this.inter.name : [];
            this.interest = [
                {text: 'Дружба', id: 'int1', checked: this.inter.indexOf('Дружба') > -1 ? true : false},
                {text: 'Свидание', id: 'int2', checked: this.inter.indexOf('Свидание') > -1 ? true : false},
                {text: 'Флирт', id: 'int3', checked: this.inter.indexOf('Флирт') > -1 ? true : false},
                {text: 'Любовь', id: 'int4', checked: this.inter.indexOf('Любовь') > -1 ? true : false},
                {text: 'Романтика', id: 'int5', checked: this.inter.indexOf('Романтика') > -1 ? true : false},
                {text: 'Близость', id: 'int6', checked: this.inter.indexOf('Близость') > -1 ? true : false}
            ];
        });
        this.phone = false;
        this.contactId = this.$stateParams.contactId;
        this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();
        this.isCordova = Meteor.isCordova;
        this.$scope.historyBack = function () {
            window.history.back();
        };
        const profile = this.currentUser && this.currentUser.profile;
        this.name = profile ? profile.name : '';
        this.contacts = this.NewChat.contacts;
        for (var i in this.contacts) {
            if (this.contacts[i].id == this.contactId) {
                this.contact = this.contacts[i];
                break;
            }
        }
        
        this.phones = [];
        for (var i in this.contact.phoneNumbers) {
            this.phones.push({text: this.contact.phoneNumbers[i].value, checked: false});
        }
    }

    sendFlag() {

        let flag = true;
        for (let i in this.interest) {
            if (this.interest[i].checked == true) {
                flag = false;
                break;
            }
        }

        if (flag) {
            return true;
        }

        this.phone = false;

        for (let i in this.phones) {
            if (this.phones[i].checked == true && this.phone != false) {
                return true;
            } else if (this.phones[i].checked == true) {
                this.phone = this.phones[i].text;
            }
        }

        return this.phone ? false : true;
    };

    sendInteretsOneSms() {
        var self = this;
        //const profile = this.currentUser && this.currentUser.profile;
        ///this.name = profile ? profile.name : '1111';
        //var interetsOne =' проявил(а) к  тебе свой интерес, зайди или скачай приложение "CheckInt"';

        //confirm

        const confirmPopup = this.$ionicPopup.confirm({
            title: 'Отправка интереса',
            template: '<div>Отправить интерес на номер?</div><div>' + this.phone + '</div>',
            cssClass: 'text-center',
            okText: 'Да',
            okType: 'button-positive button-clear',
            cancelText: 'Нет',
            cancelType: 'button-dark button-clear'
        });

        confirmPopup.then((res) => {
            if (!res) return;

            this.$ionicLoading.show({
                template: 'Отправка интереса...'
            });

            var name = [];

            for (var i in self.interest) {
                var tmp = self.interest[i];
                if (tmp.checked == true) {
                    name.push(tmp.text);
                }
            }

            if (name.length) {
                Meteor.call('interest.add', self.contactId, self.contact.name.formatted, self.phone, name, function (err) {
                    self.$ionicLoading.hide();
                    if (err) return self.handleError(err);
                    self.$state.go('inter-ok');
                })
            }


        });
    }
}

ChatCtrl.$inject = ['$state', '$stateParams', '$ionicLoading', 'NewChat', '$ionicPopup'];
