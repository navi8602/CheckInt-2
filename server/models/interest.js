
Meteor.methods({

    'interest.add': function(to_id, to_name, to_phone, name) {
        var phone = to_phone.replace(/[^+0-9.]/g, '')
        Interest.upsert({user_id: Meteor.userId(), to_phone: phone}, { $set: {
            name: name,
            to_name: to_name,
            to_id: to_id,
            from_phone: Meteor.user().phone.number,
            status:'Запрос отправлен'}
        } )
    },
    
    'interest.remove': function(_id) {
        return Interest.remove({_id: _id, user_id: Meteor.userId()});
    }
});