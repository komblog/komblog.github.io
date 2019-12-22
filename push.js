var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey":"BLu9XpImMqF9GRAUduD5alzDmqnAxTXcofawf0pSj3LLsfjhwVE3wNC11NxqKpVwJ1Uv9KlIriOOJFilHRkHumA",
   "privateKey":"GdWJmwSDavfWcTlLKdzV-WtB6GjcjXHgqP74Dtatlr4"
}; 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/e3SP6xj2ZB4:APA91bFq6GJZjn38s9WbfdP3Aq5r94icLyfkpy_wiYtXxoh8Ss8xlSaYUofRmMndg7VyXyMp3428e0LDY3WCPUox9sMSBsXe2bgjsnmTbYSLjfgfUwTakV8JyC-wSmA9uXR6gU0RoPBp",
   "keys": {
       "p256dh": "BFCNhjoYA/klQiP+0zKgw4ruXWwIWE/ad6DPgXS9UDZm3i0qm8D/+GugJh1oZHxNbjptlwSXQai1fVAqzEChkSc=",
       "auth": "HcTRH7qWu6YAaiGSU0JsVg=="
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