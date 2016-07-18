import { Controller } from 'angular-ecmascript/module-helpers';
import { Chats } from '../../../lib/collections';


export default class ChatsCtrl extends Controller {
  constructor() {
    super(...arguments);

    var self = this;

    this.tab = 'all';

    this.$ionicLoading.show({
      template: 'Загрузка контактов'
    });
    document.addEventListener("deviceready", function() {
      navigator.contacts.find(["*"], function(contacts) {
        self.allContacts = contacts;
        self.$ionicLoading.hide();
        self.tabContacs();
      }, function() {
        alert('onError!');
      })
    }, false);

  }
  
  tabContacs() {

    var self = this;
    self.NewChat.contacts = self.allContacts;
      
    if(this.tab == 'all') {
      this.contacts = this.allContacts;
    } else {
      this.subscribe('interestByUserId', function() {
        var tmp = Interest.find({user_id: Meteor.userId()}).fetch();
        var ids = [];
        _.each(tmp, function(i){
          ids.push(parseInt(i.to_id));
        });

        this.contacts = [];
        _.each(this.allContacts, function(i) {
          if(ids.indexOf(i.id) > -1) {
            self.contacts.push(i);
          }
        });
      })
    }
  }

  openSearch (){
    console.log('Fuck you00');
    var $scope = this;
    for (var i in this.$scope.friends) {
      var room = Room.getByUserId(this.$scope.friends[i].id);

      this.$scope.friends[i].room = room;
    }

    this.$ionicModal.fromTemplateUrl('client/templates/modal/search.html', {
      animation: 'slide-in-up'
    })
  };


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

ChatsCtrl.$inject = ['NewChat','$state',  '$ionicModal','$scope','$ionicLoading', '$ionicPopup', '$log'];
