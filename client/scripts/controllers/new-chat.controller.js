import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class NewChatCtrl extends Controller {
    constructor() {
        super(...arguments);

        this.subscribe('users');

        this.helpers({
            users() {
                return Meteor.users.find({_id: {$ne: this.currentUserId}});
            }
        });

    }


    hideNewChatModal() {
        this.NewChat.hideModal();
    }

    goToChat(contactId) {
        this.$state.go('tab.chat', {contactId});
    }

    handleError(err) {
        this.$log.error('New chat creation error ', err);

        this.$ionicPopup.alert({
            title: err.reason || 'New chat creation failed',
            template: 'Please try again',
            okType: 'button-positive button-clear'
        });
    }
}

NewChatCtrl.$inject = ['$state', 'NewChat', '$ionicPopup', '$log'];