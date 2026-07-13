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
  addStaff: async (staffData) => {
    const docRef = await addDoc(collection(db, "staff"), staffData);
    set((state) => ({
      staffList: [...state.staffList, { ...staffData, id: docRef.id }],
    }));
  },
  fetchAllStaff: async () => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const adminSnap = await getDoc(doc(db, "admins", uid))
    if (!adminSnap.exists()) return
    const { zone } = adminSnap.data()
    if (!zone) return
    const q = query(collection(db, "staff"), where("zone", "==", "ZONEH"));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    set({ staffList: list, allStaff: list });
  },
  updateStaff: async (id, data) => {
    await updateDoc(doc(db, "staff", id), data);
  },
}));

export default useZonalStaffStore;
