var pushSend = function(user_id, title, text) {

    Push.debug = true;

    let token = Meteor.users.findOne({_id: user_id});

    if(token && token.profile && token.profile.token) {
        token = token.profile.token;
    } else {
        return false;
    }

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
};


Meteor.methods({

    'interest.add': function(to_id, to_name, to_phone, name) {
        let phone = to_phone.replace(/[^+0-9.]/g, '');

        if(phone[0] == '8' && phone.length == 11) {
            phone = '+7'+phone.substring(1);
        }

        Interest.upsert({user_id: Meteor.userId(), to_phone: phone}, { $set: {
            name: name,
            to_name: to_name,
            to_id: to_id,
            from_phone: Meteor.user().phone.number,
            status:'Запрос отправлен'}
        });

        let dataForPush = Meteor.users.findOne({'phone.number': phone});

        if(dataForPush) {
            if(dataForPush.profile && dataForPush.profile.token) {

                var msg = {
                    title: 'К Вам проявили интерес!',
                    text: 'Один из пользователей проявил к Вам интерес!'
                };
                
                var someSend = Interest.findOne({to_phone: Meteor.user().phone.number, from_phone: phone});
                
                if(someSend) {
                    for (var k in someSend.name) {
                        if (name.indexOf(someSend.name[k]) > -1) {
                            msg.text = 'У Вас совпали интересы с пользователем'+someSend.to_name+'!';
                            break;
                        }
                    }
                }
                
                pushSend(dataForPush._id, msg.title, msg.text);
            }
        }
    },

    'interest.remove': function(_id) {
        return Interest.remove({_id: _id, user_id: Meteor.userId()});
    }
});