import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import {
  subscribeAllIncidentReports,
  subscribeIncidentReportsByZone,
  subscribeIncidentReportsByFormation,
  markIncidentAttended,
  deleteIncidentReport,
} from "../../services/incidentService";

const useIncidentStore = create((set, get) => ({
  reports: [],
  loading: false,
  error: null,
  unsubscribe: null,

  subscribe: async () => {
    set({ loading: true, error: null });
    const uid = auth.currentUser?.uid;
    if (!uid) {
      set({ loading: false });
      return;
    }
    const adminSnap = await getDoc(doc(db, "admins", uid));
    if (!adminSnap.exists()) {
      set({ loading: false });
      return;
    }
    const { zone, formation } = adminSnap.data();

    const handleNext = (list) =>
      set({ reports: list, loading: false, error: null });
    const handleError = (err) => set({ error: err.message, loading: false });

    let unsub;
    if (zone === "SHQ" && formation === "SHQ") {
      unsub = subscribeAllIncidentReports(handleNext, handleError);
    } else if (zone && zone === formation) {
      unsub = subscribeIncidentReportsByZone(zone, handleNext, handleError);
    } else if (formation) {
      unsub = subscribeIncidentReportsByFormation(
        formation,
        handleNext,
        handleError
      );
    } else {
      set({ loading: false });
      return;
    }
    set({ unsubscribe: unsub });
  },

  markAttended: async (reportId) => {
    await markIncidentAttended(reportId);
  },

  clearReport: async (reportId) => {
    await deleteIncidentReport(reportId);
  },

  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null });
    }
  },
}));

export default useIncidentStore;