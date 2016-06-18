import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class InterestFriend  extends Controller {
    constructor() {
        super(...arguments);
        var self = this;
        this.subscribe('InterestByUserId', function() {
            self.list = Interest.find().fetch()
        });

        this.helpers({
            users() {
                return Meteor.users.find({ _id: { $ne: this.currentUserId } });
                console.log(this.currentUserId);
            }
        });

    }

}

InterestFriend.$inject = [ '$state','$stateParams', '$ionicLoading', '$timeout', '$ionicModal', '$ionicActionSheet', '$ionicScrollDelegate', 'NewChat', '$ionicPopup', '$log'];