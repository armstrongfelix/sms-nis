import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import useAdminDataStore from "../stores/admin-data/adminDataStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      if (currentUser) {
        try {
          const snap = await getDoc(doc(db, "admins", currentUser.uid));
          const data = snap.exists() ? { id: snap.id, ...snap.data() } : null;
          setAdminData(data);
          useAdminDataStore.getState().setAdminData(data);
        } catch {
          setAdminData(null);
          useAdminDataStore.getState().clearAdminData();
        }
      } else {
        setAdminData(null);
        useAdminDataStore.getState().clearAdminData();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  function adminLogin(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, adminData, loading, adminLogin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
