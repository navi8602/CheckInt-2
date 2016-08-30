
// Configure the Twilio client
var  twilioClient = new Twilio({
    from:  '+18048854059',
    sid:   'AC1e4631d96bd3a5e3ea7e7db71cd6a1ed',
    token: 'b5db96f9a7fc9c69ba188b643465b834'
});


Meteor.methods({

    'twilio.sendSms': function(to, body){

        try {

            let phone = to.replace(/[^+0-9.]/g, '');

            if(phone[0] == '8' && phone.length == 11) {
                phone = '+7'+phone.substring(1);
            }

            var result = twilioClient.sendSMS({
                to: phone,
                body: body
            });
        } catch (err) {
            throw new Meteor.error(err);
        }
        return result;
    },

    'twilio.sendMMS': function(to, body, mediaUrl){


        try {
            var result = twilioClient.sendMMS({
                to: to,
                body: body,
                mediaUrl: mediaUrl
            });
        } catch (err) {
            throw new Meteor.error(err);
        }
        return result;
    }
})