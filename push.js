var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey":"BKTJb1_YolEn1qz4ssYBz5yRwnqPkmkjxJjqsOZLJsLrF4aP3yK5fyXOxAuKR9bjZFdXPZH1h-tfVPu-6WhjRoo",
   "privateKey":"YlJvtPs8KHhsebbuDfPbzpFL39lXLjZZCltX7m2lb90"
}; 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/eHNfaYAVdn8:APA91bFwosMut2HpVVqwbRXIsPYrd3oK4fq34nXoI5mBQjdRMWkLgQ6dDcP_MxxvTSbt5sRBpkc81Gx3TLM1gN6lQNdQFu23hKw5SBN2_rCvPkxQADFR_CEsV0E-xlwiWSAzEmFWkI5Y",
   "keys": {
       "p256dh": "BO2iJm7PxwEvTux/vf8BNuXPhvzfOZIXFwvZleXZH2gf81t59WIJVE7qSr6EOHMzdP67wohZAZqo7rSoNrwq31Y=",
       "auth": "cviUOCrRK5T8XGjN1XS9Cg=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '530827595154',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);