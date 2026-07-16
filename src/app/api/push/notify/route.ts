import { NextResponse } from "next/server";
import { Client, Databases, Query } from "node-appwrite";
import webpush from "web-push";

// Configure Web Push
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    "mailto:hello@earthmender.org",
    vapidPublicKey,
    vapidPrivateKey
  );
}

export async function POST(req: Request) {
  try {
    const { title, body, url, locationLabel } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: "Missing title or body" }, { status: 400 });
    }

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json({ error: "Web push not configured" }, { status: 500 });
    }

    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const profilesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID;
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!endpoint || !projectId || !databaseId || !profilesCollectionId || !apiKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    const databases = new Databases(client);

    // Fetch menders who might be in this area
    // For now, if locationLabel matches coverageLGA, or just fetch all menders who have a subscription
    const queries = [
      Query.equal("role", "mender"),
      Query.isNotNull("pushSubscription")
    ];

    const profiles = await databases.listDocuments(databaseId, profilesCollectionId, queries);

    let sentCount = 0;

    for (const doc of profiles.documents) {
      // Very basic matching - if the report location contains the collector's LGA, or if no LGA is set (send to all for MVP)
      const collectorArea = doc.coverageLGA?.toLowerCase() || "";
      const reportArea = locationLabel?.toLowerCase() || "";
      
      const isMatch = !collectorArea || reportArea.includes(collectorArea) || collectorArea.includes(reportArea);

      if (isMatch && doc.pushSubscription) {
        try {
          const subscription = JSON.parse(doc.pushSubscription);
          const payload = JSON.stringify({
            title,
            body,
            url: url || "/mender"
          });

          await webpush.sendNotification(subscription, payload);
          sentCount++;
        } catch (pushErr) {
          console.error(`Failed to send push to user ${doc.userId}:`, pushErr);
          // If subscription is expired/invalid, we could remove it here
        }
      }
    }

    return NextResponse.json({ success: true, sentCount });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}
