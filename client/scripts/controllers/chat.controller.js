import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Chats, Messages } from '../../../lib/collections';

export default class ChatCtrl extends Controller {

  constructor() {
    super(...arguments);

    this.inter = [];
    this.subscribe('InterestByUserId', function() {
      this.inter = Interest.findOne({to_id: this.$stateParams.contactId});
      console.log(this.$stateParams.contactId, this.inter);
      this.inter = this.inter && this.inter.name ? this.inter.name : [];
      console.log(this.inter);
      this.interest = [
        { text: 'Сходить за пивом', checked: this.inter.indexOf('Сходить за пивом') > -1 ? true : false},
        { text: 'Пойти в кино', checked: this.inter.indexOf('Пойти в кино') > -1 ? true : false},
        { text: 'Ловить лягушек', checked: this.inter.indexOf('Ловить лягушек') > -1 ? true : false},
        { text: 'Поехать в Тайланд', checked: this.inter.indexOf('Поехать в Тайланд') > -1 ? true : false}
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


  sendFlag () {

    let flag = true;
    for(let i in this.interest) {
      if(this.interest[i].checked == true) {
        flag = false;
        break;
      }
    }

    if(flag) {
      return true;
    }

    this.phone = false;

    for(let i in this.phones) {
      if(this.phones[i].checked == true && this.phone != false) {
        return true;
      } else if(this.phones[i].checked == true) {
        this.phone = this.phones[i].text;
      }
    }

    return this.phone ? false : true;
  };

  /*setNotification () {

   var self = this;
   this.interest({
   checked: [
   { text: 'Сходить за пивом', checked: true},
   { text: 'Пойти в кино', checked: false},
   { text: 'Ловить лягушек', checked: false},
   { text: 'Поехать в Тайланд', checked: false}
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
   };*/

  sendInteretsOneSms() {
    var self = this;
    //const profile = this.currentUser && this.currentUser.profile;
    ///this.name = profile ? profile.name : '1111';
    var interetsOne =' проявил(а) к  тебе свой интерес, зайди или скачай приложение "CheckInt"';

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

      var name = [];

      for(var i in self.interest) {
        var tmp = self.interest[i];
        if(tmp.checked == true) {
          name.push(tmp.text);
        }
      }

      if(name.length) {
        Meteor.call('interest.add', self.contactId, self.contact.name.formatted, self.phone, name, function () {
          Meteor.call('twilio.sendSms', self.phone, interetsOne, (err) => {
            self.$ionicLoading.hide();
            if (err) return self.handleError(err);
            self.$state.go('tab.groups');
          });
        })
      }


    });

  }

}

ChatCtrl.$inject = [ '$state','$stateParams', '$ionicLoading', '$timeout', '$ionicModal', '$ionicActionSheet', '$ionicScrollDelegate', 'NewChat', '$ionicPopup', '$log'];
