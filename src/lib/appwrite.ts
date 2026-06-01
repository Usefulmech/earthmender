import { Client, Account, Databases, Storage } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
export const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
export const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;
export const profilesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID;

if (!endpoint || !projectId || !databaseId || !collectionId) {
  throw new Error("Missing Appwrite environment variables. Check .env.local");
}

export const client = new Client();

client
  .setEndpoint(endpoint)
  .setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { ID, Query, OAuthProvider } from "appwrite";
