import { account, databases, databaseId, profilesCollectionId, ID, Query, OAuthProvider } from "./appwrite";
import type { UserProfile } from "./types";

export const authService = {
  /**
   * Initiates Google OAuth2 login flow.
   * This will redirect the user to Google.
   */
  async loginWithGoogle() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    // Redirect back to home for profile sync
    return account.createOAuth2Session(
      OAuthProvider.Google,
      `${origin}/`, // success
      `${origin}/`  // failure
    );
  },

  /**
   * Ends the current Appwrite session.
   */
  async logout() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  /**
   * Fetches the current authenticated account.
   */
  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },

  /**
   * Fetches the user profile from the database.
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (!databaseId || !profilesCollectionId) return null;
      
      const response = await databases.listDocuments(
        databaseId,
        profilesCollectionId,
        [Query.equal("userId", userId)]
      );

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },

  /**
   * Creates a new user profile.
   */
  async createProfile(data: Omit<UserProfile, "$id">): Promise<UserProfile | null> {
    try {
      if (!databaseId || !profilesCollectionId) return null;

      const doc = await databases.createDocument(
        databaseId,
        profilesCollectionId,
        ID.unique(),
        data
      );

      return doc as unknown as UserProfile;
    } catch (error) {
      console.error("Error creating user profile:", error);
      return null;
    }
  },

  /**
   * Updates an existing user profile.
   */
  async updateProfile(profileId: string, data: Partial<Omit<UserProfile, "$id" | "userId">>): Promise<UserProfile | null> {
    try {
      if (!databaseId || !profilesCollectionId) return null;

      const doc = await databases.updateDocument(
        databaseId,
        profilesCollectionId,
        profileId,
        data
      );

      return doc as unknown as UserProfile;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return null;
    }
  }
};
