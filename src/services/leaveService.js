import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "leaveApplications";

function docToLeave(docSnap) {
  return { id: docSnap.id, ...docSnap.data() };
}

export async function createLeaveApplication({ officerId, profile, leaveData }) {
  const start = new Date(leaveData.startDate);
  const end = new Date(leaveData.endDate);
  const diffTime = Math.abs(end - start);
  const numberOfDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const docRef = await addDoc(collection(db, COLLECTION), {
    officerId,
    surname: profile.surname,
    firstName: profile.firstName,
    middleName: profile.middleName || "",
    serviceNo: profile.serviceNumber,
    rank: profile.rank,
    email: profile.email,
    zone: profile.zone || "",
    formation: profile.formation || "",
    leaveType: leaveData.leaveType,
    startDate: start,
    endDate: end,
    numberOfDays,
    reason: leaveData.reason,
    status: "pending",
    appliedAt: serverTimestamp(),
    reviewedBy: null,
    reviewedByName: null,
    reviewedAt: null,
    adminComment: null,
  });

  return { id: docRef.id };
}

export async function fetchMyLeaveApplications(officerId) {
  const q = query(
    collection(db, COLLECTION),
    where("officerId", "==", officerId),
    orderBy("appliedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToLeave);
}

export async function fetchAllLeaveApplications() {
  const q = query(collection(db, COLLECTION), orderBy("appliedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToLeave);
}

export async function fetchLeaveApplicationsByZone(zone) {
  const q = query(
    collection(db, COLLECTION),
    where("zone", "==", zone),
    orderBy("appliedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToLeave);
}

export async function fetchLeaveApplicationsByFormation(formation) {
  const q = query(
    collection(db, COLLECTION),
    where("formation", "==", formation),
    orderBy("appliedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToLeave);
}

export async function approveLeaveApplication(leaveId, adminUid, adminName) {
  await updateDoc(doc(db, COLLECTION, leaveId), {
    status: "approved",
    reviewedBy: adminUid,
    reviewedByName: adminName,
    reviewedAt: serverTimestamp(),
  });
}

export async function rejectLeaveApplication(leaveId, adminUid, adminName, comment) {
  await updateDoc(doc(db, COLLECTION, leaveId), {
    status: "rejected",
    reviewedBy: adminUid,
    reviewedByName: adminName,
    reviewedAt: serverTimestamp(),
    adminComment: comment || null,
  });
}

export function subscribeMyLeaveApplications(officerId, onNext, onError) {
  const q = query(
    collection(db, COLLECTION),
    where("officerId", "==", officerId),
    orderBy("appliedAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    onNext(snapshot.docs.map(docToLeave));
  }, onError);
}

export function subscribeAllLeaveApplications(onNext, onError) {
  const q = query(collection(db, COLLECTION), orderBy("appliedAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    onNext(snapshot.docs.map(docToLeave));
  }, onError);
}

export function subscribeLeaveApplicationsByZone(zone, onNext, onError) {
  const q = query(
    collection(db, COLLECTION),
    where("zone", "==", zone),
    orderBy("appliedAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    onNext(snapshot.docs.map(docToLeave));
  }, onError);
}

export function subscribeLeaveApplicationsByFormation(formation, onNext, onError) {
  const q = query(
    collection(db, COLLECTION),
    where("formation", "==", formation),
    orderBy("appliedAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    onNext(snapshot.docs.map(docToLeave));
  }, onError);
}
