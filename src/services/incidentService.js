import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "incidentReports";

function docToReport(docSnap) {
  return { id: docSnap.id, ...docSnap.data() };
}

function toMillis(ts) {
  if (!ts) return Number.MAX_SAFE_INTEGER;
  if (ts.toMillis) return ts.toMillis();
  if (typeof ts.seconds === "number") return ts.seconds * 1000;
  return new Date(ts).getTime();
}

function sortByReportedAtDesc(list) {
  return [...list].sort((a, b) => toMillis(b.reportedAt) - toMillis(a.reportedAt));
}

export async function reportIncident({ officerId, profile, incidentData }) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    officerId,
    surname: profile.surname,
    firstName: profile.firstName,
    middleName: profile.middleName || "",
    serviceNo: profile.serviceNumber,
    rank: profile.rank,
    email: profile.email || "",
    zone: profile.zone || "",
    formation: profile.formation || "",
    incidentType: incidentData.incidentType,
    report: incidentData.report,
    status: "pending",
    reportedAt: serverTimestamp(),
  });

  return { id: docRef.id };
}

export async function fetchMyIncidentReports(officerId) {
  const q = query(collection(db, COLLECTION), where("officerId", "==", officerId));
  const snapshot = await getDocs(q);
  return sortByReportedAtDesc(snapshot.docs.map(docToReport));
}

export async function fetchAllIncidentReports() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return sortByReportedAtDesc(snapshot.docs.map(docToReport));
}

export async function fetchIncidentReportsByZone(zone) {
  const q = query(collection(db, COLLECTION), where("zone", "==", zone));
  const snapshot = await getDocs(q);
  return sortByReportedAtDesc(snapshot.docs.map(docToReport));
}

export async function fetchIncidentReportsByFormation(formation) {
  const q = query(collection(db, COLLECTION), where("formation", "==", formation));
  const snapshot = await getDocs(q);
  return sortByReportedAtDesc(snapshot.docs.map(docToReport));
}

export function subscribeAllIncidentReports(onNext, onError) {
  return onSnapshot(
    collection(db, COLLECTION),
    (snapshot) => onNext(sortByReportedAtDesc(snapshot.docs.map(docToReport))),
    onError
  );
}

export function subscribeMyIncidentReports(officerId, onNext, onError) {
  const q = query(collection(db, COLLECTION), where("officerId", "==", officerId));
  return onSnapshot(
    q,
    (snapshot) => onNext(sortByReportedAtDesc(snapshot.docs.map(docToReport))),
    onError
  );
}

export function subscribeIncidentReportsByZone(zone, onNext, onError) {
  const q = query(collection(db, COLLECTION), where("zone", "==", zone));
  return onSnapshot(
    q,
    (snapshot) => onNext(sortByReportedAtDesc(snapshot.docs.map(docToReport))),
    onError
  );
}

export function subscribeIncidentReportsByFormation(formation, onNext, onError) {
  const q = query(collection(db, COLLECTION), where("formation", "==", formation));
  return onSnapshot(
    q,
    (snapshot) => onNext(sortByReportedAtDesc(snapshot.docs.map(docToReport))),
    onError
  );
}

export async function markIncidentAttended(reportId) {
  await updateDoc(doc(db, COLLECTION, reportId), {
    status: "attended",
    attendedAt: serverTimestamp(),
  });
}

export async function deleteIncidentReport(reportId) {
  await deleteDoc(doc(db, COLLECTION, reportId));
}