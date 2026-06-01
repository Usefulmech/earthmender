import { ID, Query } from "appwrite";
import { databases, databaseId, collectionId, storage, profilesCollectionId } from "./appwrite";
import type { ReportRecord, ReportStatus } from "./types";
import { Models } from "appwrite";

function parseCoordinate(value: any): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

// Map Appwrite document to our application format
function mapDocumentToReport(doc: Models.Document): ReportRecord {
  const data = doc as Models.Document & Record<string, any>;
  let detections = [];
  try {
    if (data.detections) {
      detections = JSON.parse(data.detections);
    }
  } catch (e) {
    console.error("Failed to parse detections", e);
  }

  // Handle both native Array and custom serialized formats if needed for impactSignals
  const impactSignals = data.impactSignals || [];

  return {
    id: data.$id,
    menderId: data.menderId || "",
    title: data.title,
    notes: data.notes,
    locationLabel: data.locationLabel,
    latitude: parseCoordinate(data.latitude),
    longitude: parseCoordinate(data.longitude),
    severity: data.severity,
    status: data.status,
    imageName: data.imageName || "",
    // If the database has a createdAt attribute, use it; otherwise fallback to $createdAt
    createdAt: data.createdAt || data.$createdAt,
    detections,
    recommendedAction: data.recommendedAction || "",
    impactSignals,
  };
}

export async function fetchReports(): Promise<ReportRecord[]> {
  try {
    if (!databaseId || !collectionId) {
      console.warn("Database or Collection ID not set.");
      return [];
    }

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.orderDesc("$createdAt")]
    );

    return response.documents.map(mapDocumentToReport);
  } catch (error) {
    console.error("Error fetching reports from Appwrite:", error);
    return [];
  }
}

export async function createReport(report: ReportRecord, imageFile?: File | null): Promise<ReportRecord | null> {
  try {
    if (!databaseId || !collectionId) return null;

    let finalImageName = report.imageName;
    if (imageFile) {
      try {
        const fileId = ID.unique();
        const uploadedFile = await storage.createFile(
          "reports-images",
          fileId,
          imageFile
        );
        finalImageName = uploadedFile.$id;
      } catch (uploadError) {
        console.error("Failed to upload image to Appwrite storage:", uploadError);
      }
    }

    const data = {
      title: report.title,
      notes: report.notes || undefined,
      locationLabel: report.locationLabel,
      latitude: report.latitude ?? undefined,
      longitude: report.longitude ?? undefined,
      severity: report.severity,
      status: report.status,
      imageName: finalImageName,
      detections: JSON.stringify(report.detections || []),
      recommendedAction: report.recommendedAction,
      impactSignals: report.impactSignals || [],
      menderId: report.menderId || undefined,
    };

    const doc = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      data
    );

    return mapDocumentToReport(doc);
  } catch (error) {
    console.error("Error creating report in Appwrite:", error);
    return null;
  }
}

export async function updateReportStatus(reportId: string, status: ReportStatus) {
  try {
    if (!databaseId || !collectionId) return null;

    // Fetch current document to check old status and menderId
    const currentDoc = await databases.getDocument(
      databaseId,
      collectionId,
      reportId
    );
    const oldStatus = currentDoc.status;

    const doc = await databases.updateDocument(
      databaseId,
      collectionId,
      reportId,
      { status }
    );

    // If report is newly marked as resolved, update the reporter's trustScore
    if (status === "resolved" && oldStatus !== "resolved") {
      const menderId = currentDoc.menderId;
      if (menderId && profilesCollectionId) {
        try {
          const profilesRes = await databases.listDocuments(
            databaseId,
            profilesCollectionId,
            [Query.equal("userId", menderId)]
          );

          if (profilesRes.documents.length > 0) {
            const profileDoc = profilesRes.documents[0];
            const currentScore = profileDoc.trustScore ?? 50;
            
            await databases.updateDocument(
              databaseId,
              profilesCollectionId,
              profileDoc.$id,
              { trustScore: currentScore + 10 }
            );
            console.log(`Incremented trust score for mender ${menderId} from ${currentScore} to ${currentScore + 10}`);
          }
        } catch (profileError) {
          console.error("Failed to update mender trust score:", profileError);
        }
      }
    }

    return mapDocumentToReport(doc);
  } catch (error) {
    console.error("Error updating report status in Appwrite:", error);
    return null;
  }
}
