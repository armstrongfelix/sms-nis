import { create } from "zustand";
import { collection, addDoc, getDocs, query, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const useAllStaffStore = create((set) => ({
  staffList: [],
  allStaff: [],
  loading: false,
  addStaff: async (staffData) => {
    const docRef = await addDoc(collection(db, "staff"), staffData)
    set((state) => ({
      staffList: [...state.staffList, { ...staffData, id: docRef.id }],
    }))
  },
  fetchAllStaff: async () => {
    set({ loading: true })
    const snapshot = await getDocs(query(collection(db, "staff")))
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    set({ staffList: list, allStaff: list, loading: false })
  },
  updateStaff: async (id, data) => {
    await updateDoc(doc(db, "staff", id), data)
  },
}));

export default useAllStaffStore;