import { Controller } from 'angular-ecmascript/module-helpers';
import { Chats } from '../../../lib/collections';


export default class ChatsCtrl extends Controller {
  constructor() {
    super(...arguments);


    function onSuccess(contacts) {
      this.contacts = contacts;
      alert('Found ' + contacts.length + ' contacts.');
    };

    function onError(contactError) {
      alert('onError!');
    };


    document.addEventListener("deviceready", () => {
      navigator.contacts.find(["*"], (contacts) => {
        console.log(contacts);
        this.contacts = contacts;
        this.NewChat.contacts = contacts;
        //alert('Found ' + contacts.length + ' contacts.');
      }, onError);

    }, false);

    // search modal


  }




  onContact(contact) {
    this.NewChat.contact = contact;
    this.$state.go('chatse', {contactId: contact.id})
  }



  sendFrendSms(phone){
    Meteor.call('twilio.sendSms', phone, 'Hello World!')
  }

  sendFrendMMS(){
    Meteor.call('twilio.sendMMS', '+79031225995', 'Hello World!', 'http://vignette2.wikia.nocookie.net/tardis/images/9/90/Jhjh.jpg/revision/latest?cb=20100501130316')
  }

}

ChatsCtrl.$inject = ['NewChat','$state', '$ionicModal','$scope','$ionicLoading', '$ionicPopup', '$log'];
