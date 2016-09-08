import { Ionic } from "ionic-scripts";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { Controller } from "angular-ecmascript/module-helpers";

export default class ChatCtrl extends Controller {

    constructor() {
        super(...arguments);

        this.inter = [];
        this.subscribe('InterestByUserId', function () {
            this.inter = Interest.findOne({to_id: this.$stateParams.contactId});
            this.inter = this.inter && this.inter.name ? this.inter.name : [];
            this.interest = [
                {text: 'Дружба', id: 'int1', checked: this.inter.indexOf('Дружба') > -1 ? true : false},
                {text: 'Бизнес', id: 'int2', checked: this.inter.indexOf('Бизнес') > -1 ? true : false},
                {text: 'Встреча', id: 'int3', checked: this.inter.indexOf('Встреча') > -1 ? true : false},
                {text: 'Отношения', id: 'int4', checked: this.inter.indexOf('Отношения') > -1 ? true : false},
                {text: 'Свадьба', id: 'int5', checked: this.inter.indexOf('Свадьба') > -1 ? true : false},
                {text: 'Дети', id: 'int6', checked: this.inter.indexOf('Дети') > -1 ? true : false},
                {text: 'Путешествия', id: 'int7', checked: this.inter.indexOf('Путешествия') > -1 ? true : false},
                {text: 'Спорт', id: 'int8', checked: this.inter.indexOf('Спорт') > -1 ? true : false},
                {text: 'Учеба', id: 'int9', checked: this.inter.indexOf('Учеба') > -1 ? true : false},
                {text: 'Культура', id: 'int10', checked: this.inter.indexOf('Культура') > -1 ? true : false},
                {text: 'Вещи', id: 'int11', checked: this.inter.indexOf('Вещи') > -1 ? true : false},
                {text: 'Стиль жизни', id: 'int12', checked: this.inter.indexOf('Стиль жизни') > -1 ? true : false}

            ];
        });
        this.phone = false;
        this.contactId = this.$stateParams.contactId;
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
