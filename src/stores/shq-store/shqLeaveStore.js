import { create } from "zustand";
import {
  fetchAllLeaveApplications,
  approveLeaveApplication,
  rejectLeaveApplication,
} from "../../services/leaveService";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

const useShqLeaveStore = create((set, get) => ({
  applications: [],
  loading: false,
  error: null,
  unsubscribe: null,

  subscribe: () => {
    const q = query(collection(db, "leaveApplications"), orderBy("appliedAt", "desc"));
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

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchAllLeaveApplications();
      set({ applications: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
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

export default useShqLeaveStore;
