import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const createUserIfNotExists = async (user: any) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      name: user.displayName || "User",
      email: user.email,

      // 🔐 SERVICES
      services: {
        itr: false,
        gst: false,
        legal: false,
        vcfo: false,
      },

      // 📁 DOCUMENTS (MATCHING YOUR STRUCTURE)
      documents: {
        ais: "",
        bankStatement: "",
        form16: "",
        form26as: "",
        gstCert: "",
        investmentProof: "",
        panCard: "",
        tis: "",
        others: "",
      },

      // 📊 SERVICE DATA
      itr: {
        dummy: "",
      },
      gst: {
        dummy: "",
      },
      vcfo: {
        dummy: "",
      },

      // 📩 OTHER SECTIONS
      notices: [],
      invoices: [],
      others: [],

      createdAt: new Date(),
    });
  }
};