import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const useAdminDataStore = create((set) => ({
  adminData: null,
  loading: false,
  error: null,
  fetchAdminData: async (uid) => {
    set({ loading: true, error: null });
    try {
      const snap = await getDoc(doc(db, "admins", uid));
      if (snap.exists()) {
        set({ adminData: { id: snap.id, ...snap.data() }, loading: false });
      } else {
        set({ adminData: null, loading: false, error: "Admin not found" });
      }
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },
  setAdminData: (data) => set({ adminData: data, loading: false, error: null }),
  clearAdminData: () => set({ adminData: null, loading: false, error: null }),
}));

export default useAdminDataStore;
