import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(function() {



SMS.twilio = {FROM: '+18048854059', ACCOUNT_SID: 'AC1e4631d96bd3a5e3ea7e7db71cd6a1ed', AUTH_TOKEN: 'b5db96f9a7fc9c69ba188b643465b834'};

SMS.phoneTemplates = {                                                                                              // 84
    from: '+18048854059',                                                                                          // 85
    text: function (user, code) {                                                                                   // 86
        return 'SMS-код для регистрации в приложении CheckInt: ' + code;                                            // 87
    }                                                                                                               // 88
};  

  if (Meteor.users.find().count() != 0) return;

});