import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

export const uploadFile = async (
  file: File,
  uid: string,
  docType: string
) => {
  try {
    const filePath = `users/${uid}/${docType}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);

    // 🔄 Uploading
    console.log("Uploading file...");

    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    // ✅ Success
    console.log("Upload successful");
    alert("✅ File uploaded successfully");

    return url;

  } catch (error) {
    console.error("Upload failed:", error);

    // ❌ Failure
    alert("❌ File upload failed. Please try again.");

    return null;
  }
};