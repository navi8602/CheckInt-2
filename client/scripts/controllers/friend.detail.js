import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class FriendDetail  extends Controller {
    constructor() {
        super(...arguments);
        var self = this;
        this.contactId = this.$stateParams.contactId;
        this.subscribe('InterestByUserId', function() {
            self.item = Interest.findOne({to_id: self.contactId });
        });



        this.$scope.data={visible : false};

        this.$scope.historyBack = function () {
            window.history.back();
        };

        this.subscribe('InterestByUserId', function() {
            self.interest = Interest.findOne({to_id: self.contactId});
            self.interest = self.interest && self.interest.name ? self.interest.name : self.defaultInterest;
            console.log(self.interest);
        });

        this.contactId = this.$stateParams.contactId;

        this.defaultInterest = 'Выберите интерес';

        this.phone = false;

        const profile = this.currentUser && this.currentUser.profile;
        this.name = profile ? profile.name : '';
        console.log(this.currentUser);

        for (var i in this.contacts) {
            if (this.contacts[i].id == this.contactId) {
                this.contact = this.contacts[i];
                break;
            }
        }
        this.phones = [];
    }


    setNotification () {

        var self = this;
        this.$ionicActionSheet.show({
            buttons: [
                { text: 'Сходить за пивом' },
                { text: 'Пойти в кино' },
                { text: 'Ловить лягушек' },
                { text: 'Поехать в Тайланд' }
            ],
            titleText: 'Выбирите интерес для отправки контакты',
            cancelText: 'Отмена',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                self.interest = this.buttons[index].text;
                return true;
            }
        });
    };

    sendInteretsOneSms() {
        var self = this;
        const profile = this.currentUser && this.currentUser.profile;
        this.name = profile ? profile.name : '';
        var interetsOne = profile.name + ' проявил(а) к  тебе свой интерес, зайди или скачай приложение "CheckInt"';

        //confirm

        const confirmPopup = this.$ionicPopup.confirm({
            title: 'Number confirmation',
            template: '<div>' + this.phone + '</div><div>Is your phone number above correct?</div>',
            cssClass: 'text-center',
            okText: 'Yes',
            okType: 'button-positive button-clear',
            cancelText: 'edit',
            cancelType: 'button-dark button-clear'
        });

        confirmPopup.then((res) => {
            if (!res) return;

            this.$ionicLoading.show({
                template: 'Sending verification code...'
            });

            Meteor.call('interest.add', self.contactId, self.contact.name.givenName, self.phone, self.interest, function() {
                Meteor.call('twilio.sendSms', self.phone, interetsOne, (err) => {
                    self.$ionicLoading.hide();
                    if (err) return self.handleError(err);
                    self.$state.go('tab.groups');
                });
            })


        });

    }

}

FriendDetail.$inject = [ '$state','$stateParams', '$ionicLoading', '$timeout', '$ionicModal', '$ionicActionSheet', '$ionicScrollDelegate', 'NewChat', '$ionicPopup', '$log'];