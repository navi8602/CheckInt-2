import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Chats, Messages } from '../../../lib/collections';

export default class ChatCtrl extends Controller {

  constructor() {
    super(...arguments);

    var self = this;

    this.defaultInterest = 'Выберите интерес';
    this.subscribe('InterestByUserId', function() {
      self.interest = Interest.findOne({to_id: self.contactId});
      self.interest = self.interest && self.interest.name ? self.interest.name : self.defaultInterest;

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


  sendFlag () {

    if (this.interest == this.defaultInterest) {
      return true;
    }

    this.phone = false;

    for(var i in this.phones) {
      if(this.phones[i].checked == true && this.phone != false) {
        return true;
      } else if(this.phones[i].checked == true) {
        this.phone = this.phones[i].text;
      }
    }

    return this.phone ? false : true;
  };

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

ChatCtrl.$inject = [ '$state','$stateParams', '$ionicLoading', '$timeout', '$ionicModal', '$ionicActionSheet', '$ionicScrollDelegate', 'NewChat', '$ionicPopup', '$log'];
