import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { MeteorCameraUI } from 'meteor/okland:camera-ui';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Chats, Messages } from '../../../lib/collections';

export default class ChatCtrl extends Controller {
  constructor() {
    super(...arguments);
    this.interest = 'Выберите интерес';
    this.phone = false;
    this.contactId = this.$stateParams.contactId;
    this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();
    this.isCordova = Meteor.isCordova;
    this.$scope.historyBack = function () {
      window.history.back();
    };
    const profile = this.currentUser && this.currentUser.profile;
    this.name = profile ? profile.name : '';

    /*function onSuccess(contacts) {
     this.contacts = contacts;
     alert('Found ' + contacts.length + ' contacts.');
     };*/

    /*function onError(contactError) {
     alert('onError!');
     };*/


    //var options      = new ContactFindOptions();
    // options.filter   = this.contactId;
    ///navigator.contacts.find([navigator.contacts.fieldType.id], (contacts) => {
    ///this.contacts = contacts;
    //alert('Found ' + contacts.length + ' contacts.');
    //}, onError, options);


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

    if (this.getInterest() == this.interest) {
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

  getInterest () {
    var result = Interest.findOne({to_id: this.contactId});
    if (!result || !result.name) {
      return this.interest;
    }
    return result.name;
  }

  setNotification (to_id, to_name) {
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

        Meteor.call('interest.add', to_id, to_name, self.phone, this.buttons[index].text);
        return true;
      }
    });
  };

  sendInteretsOneSms() {
    const profile = this.currentUser && this.currentUser.profile;
    this.name = profile ? profile.name : '';
    var interetsOne = profile.name + ' проявил(а) к тебе свой интерес, зайди или скачай приложение "CheckInt"';
    Meteor.call('twilio.sendSms', this.phone, interetsOne);

  }

}

ChatCtrl.$inject = ['$stateParams', '$timeout', '$ionicActionSheet', '$ionicScrollDelegate', 'NewChat', '$ionicPopup', '$log'];
