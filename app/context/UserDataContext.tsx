"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const UserDataContext = createContext<any>(null);

export const UserDataProvider = ({ children }: any) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUserData({ uid: user.uid, ...snap.data() });
      } else {
        // ✅ SAME STRUCTURE AS SIGNUP
        const defaultData = {
          name: user.displayName || "User",
          email: user.email,
          pan: "",

          services: {
            itr: false,
            gst: false,
            vcfo: false,
            legal: false,
          },

          documents: {
            panCard: [],
            form16: [],
            bankStatement: [],
            investmentProof: [],
            others: [],

            gstCert: [],
            invoices: [],

            ais: [],
            tis: [],
            form26as: [],
          },

          itr: {},
          gst: {},
          notices: [],
          vcfo: {},
        };

        await setDoc(ref, defaultData);
        setUserData({ uid: user.uid, ...defaultData });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserDataContext.Provider value={{ userData, setUserData, loading }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);