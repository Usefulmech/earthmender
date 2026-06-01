const { Client, Databases, Permission, Role, Storage } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

async function setup() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!endpoint || !projectId || !databaseId || !apiKey) {
    console.error("Missing required environment variables in .env.local.");
    console.error("Make sure NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_DATABASE_ID, and APPWRITE_API_KEY are set.");
    process.exit(1);
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  const databases = new Databases(client);
  const storage = new Storage(client);

  try {
    let collectionId = 'reports';
    try {
      console.log("Creating 'Reports' collection...");
      await databases.createCollection(
        databaseId,
        collectionId,
        'Reports',
        [
          Permission.read(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ]
      );
      console.log(`✅ Collection created with ID: ${collectionId}`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`Collection ${collectionId} already exists. Continuing...`);
      } else {
        throw e;
      }
    }

    console.log("Creating attributes...");
    
    async function safeCreate(fn) {
      try {
        await fn();
        return true;
      } catch (e) {
        if (e.code === 409) return false;
        throw e;
      }
    }

    if (await safeCreate(() => databases.createStringAttribute(databaseId, collectionId, 'title', 255, true))) console.log(" - title added");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, collectionId, 'notes', 2000, false))) console.log(" - notes added");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, collectionId, 'locationLabel', 255, true))) console.log(" - locationLabel added");
    if (await safeCreate(() => databases.createFloatAttribute(databaseId, collectionId, 'latitude', false))) console.log(" - latitude added");
    if (await safeCreate(() => databases.createFloatAttribute(databaseId, collectionId, 'longitude', false))) console.log(" - longitude added");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, collectionId, 'severity', 50, true))) console.log(" - severity added");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, collectionId, 'status', 50, true))) console.log(" - status added");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, collectionId, 'imageName', 255, false))) console.log(" - imageName added");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, collectionId, 'detections', 5000, false))) console.log(" - detections added");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, collectionId, 'recommendedAction', 2000, false))) console.log(" - recommendedAction added");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, collectionId, 'impactSignals', 100, false, undefined, true))) console.log(" - impactSignals added");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, collectionId, 'menderId', 50, false))) console.log(" - menderId added");

    // --- END REPORTS COLLECTION ---

    // --- START USERS_PROFILES COLLECTION ---
    let profilesCollectionId = 'users_profiles';
    try {
      console.log(`\nCreating 'UsersProfiles' collection...`);
      await databases.createCollection(
        databaseId,
        profilesCollectionId,
        'Users Profiles',
        [
          Permission.read(Role.any()), // Assuming users only read their own realistically, but any is fine for MVP
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ]
      );
      console.log(`✅ Collection created with ID: ${profilesCollectionId}`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`Collection ${profilesCollectionId} already exists. Continuing...`);
      } else {
        throw e;
      }
    }

    console.log("Creating UsersProfiles attributes...");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, profilesCollectionId, 'userId', 50, true))) console.log(" - userId added");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, profilesCollectionId, 'role', 50, true))) console.log(" - role added");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, profilesCollectionId, 'companyName', 255, false))) console.log(" - companyName added");
    if (await safeCreate(() => databases.createStringAttribute(databaseId, profilesCollectionId, 'coverageLGA', 255, false))) console.log(" - coverageLGA added");
    
    // To ensure trustScore has our new limits (1 to 10000, default 50), delete old one if exists
    try {
      console.log("Checking/Updating 'trustScore' attribute limits...");
      await databases.deleteAttribute(databaseId, profilesCollectionId, 'trustScore');
      console.log(" - deleted old trustScore attribute for recreation");
      await new Promise(resolve => setTimeout(resolve, 1500)); // wait for deletion propagation
    } catch (e) {
      // Ignored if it doesn't exist yet
    }
    if (await safeCreate(() => databases.createIntegerAttribute(databaseId, profilesCollectionId, 'trustScore', false, 1, 10000, 50))) console.log(" - trustScore added (min 1, max 10000, default 50)");
    
    // --- END USERS_PROFILES COLLECTION ---

    // --- START STORAGE BUCKET SETUP ---
    let bucketId = 'reports-images';
    try {
      console.log("Creating 'reports-images' storage bucket...");
      await storage.createBucket({
        bucketId: bucketId,
        name: 'Reports Images',
        permissions: [
          Permission.read(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ],
        fileSecurity: false,
        enabled: true,
        compression: 'none',
        encryption: true,
        antivirus: true
      });
      console.log("✅ Bucket 'reports-images' created!");
    } catch (e) {
      if (e.code === 409) {
        console.log("Bucket already exists. Continuing...");
      } else {
        console.error("Error creating bucket:", e);
      }
    }
    // --- END STORAGE BUCKET SETUP ---

    console.log("\n⏳ Waiting for all attributes to finish creating (Appwrite does this asynchronously)...");
    
    // Simple polling function to ensure attributes are available for both collections
    let allAvailable = false;
    while (!allAvailable) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const { attributes: reportsAttrs } = await databases.listAttributes(databaseId, collectionId);
      const { attributes: profilesAttrs } = await databases.listAttributes(databaseId, profilesCollectionId);
      
      const combinedAttrs = [...reportsAttrs, ...profilesAttrs];
      const processing = combinedAttrs.filter(attr => attr.status === 'processing');
      const failed = combinedAttrs.filter(attr => attr.status === 'failed');

      if (failed.length > 0) {
        console.error("❌ Some attributes failed to create:", failed);
        process.exit(1);
      }

      if (processing.length === 0) {
        allAvailable = true;
      } else {
        process.stdout.write(".");
      }
    }

    console.log("\n✅ All attributes are ready!");
    console.log(`\nPlease add the following to your .env.local if not already there:`);
    console.log(`NEXT_PUBLIC_APPWRITE_COLLECTION_ID=${collectionId}`);
    console.log(`NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID=${profilesCollectionId}`);

  } catch (error) {
    console.error("❌ Error setting up Appwrite:");
    console.error(error.message || error);
    process.exit(1);
  }
}

setup();
