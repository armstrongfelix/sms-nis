import { create } from "zustand";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";

const useStaffStore = create((set) => ({
  staffData: null,
  loading: false,
  error: "",

  login: async (serviceNumber, password) => {
    set({ loading: true, error: "" });
    try {
      const email = `${serviceNumber}@nis.gov.ng`;
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const staffQuery = query(
        collection(db, "staff"),
        where("authUid", "==", credential.user.uid)
      );
      const staffSnap = await getDocs(staffQuery);
      if (!staffSnap.empty) {
        const data = { id: staffSnap.docs[0].id, ...staffSnap.docs[0].data() };
        set({ staffData: data, loading: false });
        return data;
      }
      set({ error: "Staff record not found for this account", loading: false });
    } catch (err) {
      const map = {
        "auth/user-not-found": "No account found with this service number",
        "auth/wrong-password": "Incorrect password",
        "auth/invalid-credential": "Invalid service number or password",
        "auth/too-many-requests": "Too many attempts. Try again later",
      };
      set({ error: map[err.code] || "Login failed. Please try again.", loading: false });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ staffData: null, error: "" });
  },

  clearError: () => set({ error: "" }),
}));

export default useStaffStore;
