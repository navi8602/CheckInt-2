import { Mongo } from 'meteor/mongo';

export const Chats = new Mongo.Collection('chats');
export const Messages = new Mongo.Collection('messages');

interestStatuses = ['Запрос отправлен', 'Интерес совпал', 'Интерес не совпал'];

InterestSchema = new SimpleSchema({

    user_id:{
        type: String,
        label: 'Уникальный идентификатор пользователя'
    },

    to_user_id:{
        optional: true,
        type: String,
        label: 'Уникальный идентификатор приглашенного пользователя'
    },

    to_id:{
        type: String,
        label: 'Номер в записной книге'
    },

    to_phone:{
        type: String,
        label: 'Телефон в записной книге'
    },

    to_name:{
        type: String,
        label: 'Имя в записной книге'
    },

    status:{
        type: String,
        label: 'Статус',
        allowedValues: interestStatuses
    },

    name: {
        type: String,
        label: 'Название интереса'
    }

});

Interest = new Mongo.Collection('interest', InterestSchema);
Interest.attachSchema(InterestSchema);