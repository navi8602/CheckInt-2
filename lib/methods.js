import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Chats, Messages } from '../lib/collections';

Meteor.methods({
  newMessage(message) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to send message.');
    }

    check(message, Match.OneOf(
      {
        text: String,
        type: String,
        contactId: String
      },
      {
        picture: String,
        type: String,
        contactId: String
      }
    ));

    message.timestamp = new Date();
    message.userId = this.userId;

    const messageId = Messages.insert(message);
    Chats.update(message.contactId, { $set: { lastMessage: message } });

    return messageId;
  },
  updateName(name) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update his name.');
    }

    check(name, String);

    if (name.length === 0) {
      throw Meteor.Error('name-required', 'Must provide a user name');
    }

    return Meteor.users.update(this.userId, { $set: { 'profile.name': name } });
  },
  newChat(otherId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged to create a chat.');
    }

    check(otherId, String);
    const otherUser = Meteor.users.findOne(otherId);

    if (!otherUser) {
      throw new Meteor.Error('user-not-exists',
        'Chat\'s user not exists');
    }

    const chat = {
      userIds: [this.userId, otherId],
      createdAt: new Date()
    };

    const contactId = Chats.insert(chat);

    return contactId;
  },
  removeChat(contactId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged to create a chat.');
    }

    check(contactId, String);

    const chat = Chats.findOne(contactId);

    if (!chat || !_.include(chat.userIds, this.userId)) {
      throw new Meteor.Error('chat-not-exists',
        'Chat not exists');
    }

    Messages.remove({ contactId: chatId });

    return Chats.remove({ _id: chatId });
  },
  updatePicture(data) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update his picture.');
    }

    check(data, String);

    return Meteor.users.update(this.userId, { $set: { 'profile.picture': data } });
  },
});