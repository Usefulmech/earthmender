"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";

// Helper function to convert VAPID public key
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export function NotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    }
  };

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
      return;
    }

    const newPermission = await Notification.requestPermission();
    setPermission(newPermission);

    if (newPermission === "granted") {
      subscribeToPush();
    }
  };

  const subscribeToPush = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!VAPID_PUBLIC_KEY) {
        console.error("VAPID public key not found");
        return;
      }
      const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
      
      const userStr = window.sessionStorage.getItem("earthmender-user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) return;

      // Send the subscription to backend
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription, userId: user.$id }),
      });
      
      setIsSubscribed(true);
      console.log("Successfully subscribed to push notifications");
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
    }
  };

  if (permission === "denied") {
    return (
      <div className="text-xs text-red-500 flex items-center gap-1">
        <BellOff className="w-3 h-3" />
        Notifications blocked
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="text-xs text-green-600 flex items-center gap-1">
        <Bell className="w-3 h-3" />
        Notifications enabled
      </div>
    );
  }

  return (
    <button
      onClick={requestPermission}
      className="flex items-center gap-2 text-sm text-earth-600 hover:text-earth-900 transition-colors"
    >
      <Bell className="w-4 h-4" />
      Enable Push Notifications
    </button>
  );
}
