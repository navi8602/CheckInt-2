import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class InterestFriend  extends Controller {
    constructor() {
        super(...arguments);
        var self = this;
        this.subscribe('interestSomeUserId', function() {

            self.list = [];

            var mySend = Interest.find({user_id: Meteor.userId()}).fetch();

            var users_phone = [];
            var inter = {};

            _.each(mySend, function(i){
                users_phone.push(i.to_phone);
                inter[i.to_phone] = i.name;
                self.list.push(i);
            });


            var phone = Meteor.user().phone.number;

            var someSend = Interest.find({to_phone: phone, from_phone: { $in: users_phone }}).fetch();

            _.each(someSend, function(i){
                for(var k in i.name) {
                    if(inter[i.from_phone].indexOf(i.name[k]) > -1) {
                        _.each(self.list, function(l){
                            if(l.to_phone == i.from_phone) {
                                l.math = true;
                            }
                        });
                        //self.list.push(info[i.from_phone]);
                        break;
                    }
                }
            });
        });

        this.helpers({
            users() {
                return Meteor.users.find({ _id: {$ne: this.currentUserId } });
                console.log(this.currentUserId);
            }
        });

    }
}

InterestFriend.$inject = [];