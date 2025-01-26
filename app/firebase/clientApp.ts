import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAphecLYaItG4fAPlq1KM3L3yr_53M2bgs",
  authDomain: "aqsentinel.firebaseapp.com",
  projectId: "aqsentinel",
  storageBucket: "aqsentinel.firebasestorage.app",
  messagingSenderId: "225010371616",
  appId: "1:225010371616:web:a2dc4869442a87fdb4c045",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let messaging: Messaging;
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

const generateToken = async () => {
  if (typeof window === "undefined") return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BHSalI0dqSxHczt13l0v-AbeW8pqcFjkTY8XWDr5CrIbhORRGw2kakSslbbbjUie0eTsPDKEw1TXdAv23MNnxJw",
      });
      if (token) {
        console.log("FCM token:", token);
      } else {
        console.warn("No FCM token received.");
      }
    } else {
      console.warn("Notification permission not granted.");
    }
  } catch (error) {
    console.error("Error generating FCM token:", error);
  }
};

export { app, messaging, generateToken };
