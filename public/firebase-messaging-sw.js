// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAphecLYaItG4fAPlq1KM3L3yr_53M2bgs",
  authDomain: "aqsentinel.firebaseapp.com",
  projectId: "aqsentinel",
  storageBucket: "aqsentinel.firebasestorage.app",
  messagingSenderId: "225010371616",
  appId: "1:225010371616:web:a2dc4869442a87fdb4c045",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  console.log("reached");
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
