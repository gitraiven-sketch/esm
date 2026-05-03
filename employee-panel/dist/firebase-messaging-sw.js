importScripts('https://www.gstatic.com/firebasejs/9.25.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.25.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBetYVUBQiNXpmqkFdCTu5KW4oV2Nc0mOU',
  authDomain: 'system-hr-fa2e8.firebaseapp.com',
  projectId: 'system-hr-fa2e8',
  storageBucket: 'system-hr-fa2e8.firebasestorage.app',
  messagingSenderId: '153024739028',
  appId: '1:153024739028:web:00c13d438b7e5581b16d41',
  measurementId: 'G-TSZ6DL5GR1'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'EMS Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification.',
    icon: '/logo192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
