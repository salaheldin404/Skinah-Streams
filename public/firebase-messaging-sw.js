importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyDXgnCdX-rbhhuZS4LkadsarF_rmzPzpDs", 
  authDomain: "sakinah-streams.firebaseapp.com",
  projectId: "sakinah-streams",
  storageBucket: "sakinah-streams.firebasestorage.app",
  messagingSenderId: "204985007950",
  appId: "1:204985007950:web:3f974dc207f042ffcc281f",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon-192x192.png",
    data: {
      url: payload.data?.url || "/",
      surahId: payload.data?.surahId,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const targetUrl = event.notification.data?.url;
        console.log({ targetUrl });
        if (!targetUrl) return;
        // Loop through each open tab/window
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus(); // If a matching tab exists, bring it to the front
          }
        }
        // If no matching tab is found, open a new one
        return clients.openWindow(targetUrl);
      }),
  );
});
