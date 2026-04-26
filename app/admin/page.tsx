"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { uploadFile } from "../utils/uploadFile";

export default function AdminPage() {
  const router = useRouter();

  const ADMIN_EMAIL = "ebizbrollp@gmail.com";

  // ================= AUTH STATES =================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ================= DATA STATES =================
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ================= AUTH CHECK =================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        setAuthenticated(true);
        fetchUsers();
      } else {
        setAuthenticated(false);
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // ================= LOGIN =================
  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (res.user.email !== ADMIN_EMAIL) {
        alert("Not authorized");
        await signOut(auth);
        return;
      }

      setAuthenticated(true);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin");
  };

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));

      const list = snap.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      setUsers(list);
      setFilteredUsers(list);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = users.filter((u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  // ================= SERVICE TOGGLE =================
  const toggleService = async (key: string) => {
    if (!selectedUser) return;

    const updated = {
      ...selectedUser.services,
      [key]: !selectedUser.services?.[key],
    };

    await updateDoc(doc(db, "users", selectedUser.uid), {
      services: updated,
    });

    setSelectedUser((prev: any) => ({
      ...prev,
      services: updated,
    }));
  };

  // ================= UPLOAD =================
  const handleUpload = async (key: string, file: File) => {
    if (!selectedUser) return;

    const url = await uploadFile(file, selectedUser.uid, key);

    const updatedDocs = {
      ...(selectedUser.documents || {}),
      [key]: [...(selectedUser.documents?.[key] || []), url],
    };

    await updateDoc(doc(db, "users", selectedUser.uid), {
      documents: updatedDocs,
    });

    setSelectedUser((prev: any) => ({
      ...prev,
      documents: updatedDocs,
    }));
  };

  // ================= ADD NOTICE =================
  const addNotice = async () => {
    if (!selectedUser) return;

    const notice = {
      id: Date.now(),
      title: "New Notice",
      department: "Income Tax",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      file: "",
      reply: "",
    };

    const updated = [...(selectedUser.notices || []), notice];

    await updateDoc(doc(db, "users", selectedUser.uid), {
      notices: updated,
    });

    setSelectedUser((prev: any) => ({
      ...prev,
      notices: updated,
    }));
  };

  // ================= UPDATE CFO =================
  const updateScore = async (score: number) => {
    if (!selectedUser) return;

    await updateDoc(doc(db, "users", selectedUser.uid), {
      vcfo: {
        ...(selectedUser.vcfo || {}),
        score,
      },
    });

    setSelectedUser((prev: any) => ({
      ...prev,
      vcfo: {
        ...(prev.vcfo || {}),
        score,
      },
    }));
  };

  // ================= LOADING =================
  if (checkingAuth) {
    return <div className="p-10">Checking access...</div>;
  }

  // ================= LOGIN UI =================
  if (!authenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md">

          <h2 className="text-2xl font-semibold mb-6 text-center">
            Admin Login
          </h2>

          <input
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg mb-6"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Login
          </button>

        </div>
      </div>
    );
  }

  // ================= ADMIN DASHBOARD =================
  return (
    <div className="flex">

      {/* SIDEBAR */}
      <div className="w-72 min-h-screen bg-white shadow-lg p-4">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Users</h2>
          <button
            onClick={handleLogout}
            className="text-xs text-red-500"
          >
            Logout
          </button>
        </div>

        <input
          placeholder="Search user..."
          className="w-full p-2 mb-4 border rounded-lg text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <p>Loading...</p>}

        {!loading && filteredUsers.length === 0 && (
          <p className="text-gray-500 text-sm">No users found</p>
        )}

        <div className="space-y-2">
          {filteredUsers.map((u) => (
            <div
              key={u.uid}
              onClick={() => setSelectedUser(u)}
              className={`p-3 rounded-lg cursor-pointer transition ${
                selectedUser?.uid === u.uid
                  ? "bg-blue-100 border border-blue-300"
                  : "hover:bg-gray-100"
              }`}
            >
              <p className="font-medium text-sm">{u.name || "No Name"}</p>
              <p className="text-xs text-gray-500">{u.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">

        {!selectedUser && (
          <div className="text-center text-gray-500 mt-20">
            Select a user to manage
          </div>
        )}

        {selectedUser && (
          <div className="space-y-6 max-w-5xl mx-auto">

            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-semibold mb-2">Profile</h2>
              <p>{selectedUser.name}</p>
              <p className="text-gray-500 text-sm">{selectedUser.email}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-semibold mb-4">Services</h2>

              <div className="flex flex-wrap gap-3">
                {["itr", "gst", "vcfo", "legal"].map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleService(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedUser.services?.[s]
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-semibold mb-4">Upload Documents</h2>

              <div className="grid grid-cols-2 gap-4">
                {["ais", "tis", "form26as", "gstr1", "gstr3b"].map((key) => (
                  <div key={key}>
                    <p className="text-sm mb-1">{key.toUpperCase()}</p>
                    <input
                      type="file"
                      className="border p-2 rounded w-full"
                      onChange={(e) =>
                        e.target.files &&
                        handleUpload(key, e.target.files[0])
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-semibold mb-3">Notices</h2>

              <button
                onClick={addNotice}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Add Notice
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-semibold mb-3">VCFO Score</h2>

              <input
                type="number"
                placeholder="Enter score"
                onBlur={(e) => updateScore(Number(e.target.value))}
                className="border p-2 rounded w-40"
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}