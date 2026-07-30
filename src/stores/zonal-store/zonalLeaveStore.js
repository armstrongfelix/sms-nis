import { create } from "zustand";
import { onSnapshot, collection, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  approveLeaveApplication,
  rejectLeaveApplication,
} from "../../services/leaveService";

const useZonalLeaveStore = create((set, get) => ({
  applications: [],
  loading: false,
  error: null,
  unsubscribe: null,

  subscribe: async () => {
    set({ loading: true, error: null });
    const uid = auth.currentUser?.uid;
    if (!uid) { set({ loading: false }); return }
    const adminSnap = await getDoc(doc(db, "admins", uid));
    if (!adminSnap.exists()) { set({ loading: false }); return }
    const { zone } = adminSnap.data();
    if (!zone) { set({ loading: false }); return }

    const q = query(
      collection(db, "leaveApplications"),
      where("zone", "==", zone),
      orderBy("appliedAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        set({ applications: list, loading: false, error: null });
      },
      (err) => set({ error: err.message, loading: false })
    );
    set({ unsubscribe: unsub });
  },

  approveLeave: async (leaveId, adminUid, adminName) => {
    await approveLeaveApplication(leaveId, adminUid, adminName);
  },

  rejectLeave: async (leaveId, adminUid, adminName, comment) => {
    await rejectLeaveApplication(leaveId, adminUid, adminName, comment);
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null });
    }
  },
}));

export default useZonalLeaveStore;
