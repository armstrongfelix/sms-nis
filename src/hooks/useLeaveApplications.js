import { useState, useEffect } from "react";
import {
  subscribeMyLeaveApplications,
  subscribeAllLeaveApplications,
  subscribeLeaveApplicationsByZone,
  subscribeLeaveApplicationsByFormation,
} from "../services/leaveService";

export function useMyLeaveApplications(officerId) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!officerId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeMyLeaveApplications(
      officerId,
      (data) => {
        setApplications(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [officerId]);

  return { applications, loading, error };
}

export function useAllLeaveApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeAllLeaveApplications(
      (data) => {
        setApplications(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { applications, loading, error };
}

export function useLeaveApplicationsByZone(zone) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!zone) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeLeaveApplicationsByZone(
      zone,
      (data) => {
        setApplications(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [zone]);

  return { applications, loading, error };
}

export function useLeaveApplicationsByFormation(formation) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!formation) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeLeaveApplicationsByFormation(
      formation,
      (data) => {
        setApplications(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [formation]);

  return { applications, loading, error };
}
