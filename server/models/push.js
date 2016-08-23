Meteor.methods({

    'push.send': function(user_id, title, text) {
        let token = Meteor.users.findOne({_id: user_id});

        if(token && token.profile && token.profile.token) {
            token = token.profile.token;
        } else {
            return false;
        }

        Push.send({
            from: 'push',
            title: title,
            text: text,
            badge: 1, //optional, use it to set badge count of the receiver when the app is in background.
            token: token//appId or token eg. "{ apn: token }"
            // tokens: array of appId's or tokens
            // payload: user data
            // delayUntil: Date
        });

        return true;
    }

});