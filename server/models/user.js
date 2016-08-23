
Meteor.methods({

    'user.updateToken': function(token) {
        Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.token': token}});
    }
});