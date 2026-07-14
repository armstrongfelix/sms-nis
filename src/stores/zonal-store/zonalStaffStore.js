import { create } from "zustand";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

const useZonalStaffStore = create((set) => ({
  staffList: [],
  allStaff: [],
  loading: false,
  addStaff: async (staffData) => {
    const docRef = await addDoc(collection(db, "staff"), staffData);
    set((state) => ({
      staffList: [...state.staffList, { ...staffData, id: docRef.id }],
    }));
  },
  fetchAllStaff: async () => {
    set({ loading: true })
    const uid = auth.currentUser?.uid
    if (!uid) { set({ loading: false }); return }
    const adminSnap = await getDoc(doc(db, "admins", uid))
    if (!adminSnap.exists()) { set({ loading: false }); return }
    const { zone } = adminSnap.data()
    if (!zone) { set({ loading: false }); return }
    const q = query(collection(db, "staff"), where("zone", "==", zone));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    set({ staffList: list, allStaff: list, loading: false });
  },
  updateStaff: async (id, data) => {
    await updateDoc(doc(db, "staff", id), data);
  },
}));

export default useZonalStaffStore;
