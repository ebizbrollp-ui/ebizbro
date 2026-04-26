"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userId = "demoUser"; // later replace with auth

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const ref = doc(db, "users", userId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUserData(snap.data());
        } else {
          const defaultData = {
            documents: {},
          };

          await setDoc(ref, defaultData);
          setUserData(defaultData);
        }
      } catch (error) {
        console.error("🔥 FIREBASE ERROR:", error);

        // fallback so UI doesn't break
        setUserData({
          documents: {},
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);