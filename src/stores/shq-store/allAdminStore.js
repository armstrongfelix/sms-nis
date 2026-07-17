import { create } from "zustand";
import { collection, getDocs, query, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const useAllAdminStore = create((set) => ({
  adminList: [],
  allAdmins: [],
  loading: false,
  fetchAllAdmins: async () => {
    set({ loading: true })
    const snapshot = await getDocs(query(collection(db, "admins")))
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    set({ adminList: list, allAdmins: list, loading: false })
  },
  updateAdmin: async (id, data) => {
    await updateDoc(doc(db, "admins", id), data)
  },
}));

export default useAllAdminStore;
