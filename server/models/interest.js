
Meteor.methods({

    'interest.add': function(to_id, to_name, to_phone, name){
        Interest.upsert({user_id: Meteor.userId(), to_id: to_id}, { $set: {name: name, to_name: to_name, to_phone: to_phone, status:'Запрос отправлен'}} )
    },
})