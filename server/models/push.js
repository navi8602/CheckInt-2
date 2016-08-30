Meteor.methods({

    'push.send': function(user_id, title, text) {

        Push.debug = true;

        let token = Meteor.users.findOne({_id: user_id});

        if(token && token.profile && token.profile.token) {
            token = token.profile.token;
        } else {
            return false;
        }

        //let token = {apn: "a0d909333468c9afe88910031e72158aea6a8caff08143b349507f7252b0ef3c"};

        let doc = Push.appCollection.findOne({
            $and: [
                { token: token },     // Match token
                { appName: 'checkInt' }, // Match appName
                { token: { $exists: true } }  // Make sure token exists
            ]
        });

        if (!doc) {
            Push.appCollection.insert({
                token: token,
                appName: 'checkInt',
                userId: Meteor.userId(),
                enabled: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        Push.send({
            from: 'push',
            title: title,
            text: text,
            badge: 1, //optional, use it to set badge count of the receiver when the app is in background.
            token: token
            // tokens: array of appId's or tokens
            // payload: user data
            // delayUntil: Date
        });
    }

});