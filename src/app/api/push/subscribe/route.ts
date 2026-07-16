import { NextResponse } from "next/server";
import { Client, Databases } from "node-appwrite";

export async function POST(req: Request) {
  try {
    const { subscription, userId } = await req.json();

    if (!subscription || !userId) {
      return NextResponse.json({ error: "Missing subscription or userId" }, { status: 400 });
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

    // Fetch the user's profile document
    const profiles = await databases.listDocuments(databaseId, profilesCollectionId, [
      `equal("userId", "${userId}")`,
    ]);

    if (profiles.documents.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileDoc = profiles.documents[0];

    // Save the subscription as a JSON string
    await databases.updateDocument(databaseId, profilesCollectionId, profileDoc.$id, {
      pushSubscription: JSON.stringify(subscription),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}
