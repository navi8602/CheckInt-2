import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from '../lib/collections';

Meteor.publish('users', function() {
  return Meteor.users.find({}, { fields: { profile: 1 } });
});

Meteor.publishComposite('chats', function() {

  if (!this.userId) return;

  return {
    find() {
      return Chats.find({ userIds: this.userId });
    },
    children: [
      {
        find(chat) {
          return Messages.find({ contactId: contact.id });
        }
      },
      {
        find(chat) {
          const query = { _id: { $in: chat.userIds } };
          const options = { fields: { profile: 1 } };

          return Meteor.users.find(query, options);
        }
      }
    ]
  };
});

Meteor.publish('interestByUserId', function(){
  return Interest.find({user_id: this.userId});
});

Meteor.publish('interestSomeUserId', function(){
  let data = Meteor.users.findOne({_id: this.userId});

  if(data && data.phone && data.phone.number) {
    return Interest.find({ $or: [{user_id: this.userId}, {to_phone: data.phone.number}] });
  }

  return null;

});