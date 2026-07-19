import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import useLocationStore from "../../stores/locations/locations";
import useAllStaffStore from "../../stores/shq-store/allStaffStore";
import Button from "../buttons/Button";

const TITLES = ["Mr", "Mrs", "Miss"];

const GENDERS = ["Male", "Female"];

const RANKS = [
  "IA3",
  "IA2",
  "IA1",
  "AII",
  "II",
  "ASI2",
  "ASI1",
  "DSI",
  "SI",
  "CSI",
  "ACI",
  "DCI",
  "CIS",
  "ACG",
  "DCG",
  "CG",
];

const FORMATIONS = [
  "SHQ",
  "ZONEA",
  "ZONEB",
  "ZONEC",
  "ZONED",
  "ZONEE",
  "ZONEF",
  "ZONEG",
  "ZONEH",
  "ABSC",
  "ADSC",
  "AKSC",
  "ANSC",
  "BASC",
  "BESC",
  "BOSC",
  "BYSC",
  "CRSC",
  "DESC",
  "EBSC",
  "EDSC",
  "EKSC",
  "ENSC",
  "FCSC",
  "GOSC",
  "IMSC",
  "JISC",
  "KDSC",
  "KESC",
  "KNSC",
  "KOSC",
  "KTSC",
  "KWSC",
  "LASC",
  "NASC",
  "NISC",
  "OGSC",
  "ONSC",
  "OSSC",
  "OYSC",
  "PLSC",
  "RISC",
  "SOSC",
  "TASC",
  "YOSC",
  "ZASC",
  "NITSOL",
  "NITSA",
  "ITSK",
  "MMIA",
  "NAIA",
  "NFBC",
  "SEBC",
  "IDBC",
  "RVMC",
];

const ZONES = [
  "SHQ",
  "ZONEA",
  "ZONEB",
  "ZONEC",
  "ZONED",
  "ZONEE",
  "ZONEF",
  "ZONEG",
  "ZONEH",
];

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let password = "";
  for (let i = 0; i < 10; i++) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    password += chars[array[0] % chars.length];
  }
  return password;
}

function validate(values) {
  const errors = {};

  if (!values.surname) errors.surname = "Surname is required";
  if (!values.firstName) errors.firstName = "First name is required";
  if (!values.serviceNumber) {
    errors.serviceNumber = "Service number is required";
  } else if (!/^NIS\d{5}$/.test(values.serviceNumber)) {
    errors.serviceNumber = "Service number must be in the format NISXXXXX (e.g. NIS00001)";
  }
  if (!values.formation) errors.formation = "Formation is required";
  if (!values.zone) errors.zone = "Zone is required";
  if (!values.phoneNumber) {
    errors.phoneNumber = "Phone number is required";
  } else if (!/^0\d{10}$/.test(values.phoneNumber)) {
    errors.phoneNumber =
      "Enter a valid Nigerian phone number (e.g. 08012345678)";
  }
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!values.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
  if (!values.stateOfOrigin)
    errors.stateOfOrigin = "State of origin is required";
  if (!values.lgaOfOrigin) errors.lgaOfOrigin = "LGA of origin is required";
  if (!values.nin) {
    errors.nin = "NIN is required";
  } else if (!/^\d{11}$/.test(values.nin)) {
    errors.nin = "NIN must be an 11-digit number";
  }
  if (!values.bvn) {
    errors.bvn = "BVN is required";
  } else if (!/^\d{10}$/.test(values.bvn)) {
    errors.bvn = "BVN must be a 10-digit number";
  }
  if (!values.nhf) {
    errors.nhf = "NHF number is required";
  } else if (!/^\d{10}$/.test(values.nhf)) {
    errors.nhf = "NHF number must be a 10-digit number";
  }
  if (!values.permanentAddress)
    errors.permanentAddress = "Permanent home address is required";
  if (!values.dateOfFirstAppointment)
    errors.dateOfFirstAppointment = "Date of first appointment is required";
  if (!values.gender) errors.gender = "Gender is required";
  if (!values.title) errors.title = "Title is required";
  if (!values.rank) errors.rank = "Rank is required";

  return errors;
}

function Input({ label, id, formik, type = "text", placeholder, required }) {
  const touch = formik.touched[id];
  const error = formik.errors[id];
  const hasError = touch && error;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-nis-primary">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={[
          "px-4 py-2.5 rounded-lg border text-sm transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary",
          hasError
            ? "border-red-400 bg-red-50"
            : "border-gray-300 bg-white hover:border-gray-400",
        ].join(" ")}
        {...formik.getFieldProps(id)}
      />
      {hasError && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function Select({ label, id, formik, options, placeholder, required }) {
  const touch = formik.touched[id];
  const error = formik.errors[id];
  const hasError = touch && error;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-nis-primary">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        className={[
          "px-4 py-2.5 rounded-lg border text-sm transition-colors duration-200 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary",
          hasError
            ? "border-red-400 bg-red-50"
            : "border-gray-300 hover:border-gray-400",
        ].join(" ")}
        {...formik.getFieldProps(id)}
      >
        <option value="">
          {placeholder || `Select ${label.toLowerCase()}`}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {hasError && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function RadioGroup({ label, id, formik, options, required }) {
  const touch = formik.touched[id];
  const error = formik.errors[id];
  const hasError = touch && error;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-nis-primary">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className="flex gap-6">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="radio"
              name={id}
              value={opt}
              checked={formik.values[id] === opt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="accent-nis-primary w-4 h-4"
            />
            {opt}
          </label>
        ))}
      </div>
      {hasError && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <fieldset className="border border-gray-200 rounded-xl p-5 space-y-4">
      <legend className="text-base font-semibold text-nis-primary px-2">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Dialog({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 z-10">
        {children}
      </div>
    </div>
  );
}

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [reauthError, setReauthError] = useState("");
  const states = useLocationStore((s) => s.states);
  const getLgas = useLocationStore((s) => s.getLgas);
  const addStaff = useAllStaffStore((s) => s.addStaff);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pendingStaffSuccess");
      if (raw) {
        const parsed = JSON.parse(raw);
        const fiveMin = 5 * 60 * 1000;
        if (Date.now() - parsed.timestamp < fiveMin) {
          setPasswordDialog(parsed);
          setSubmitted(parsed);
        }
      }
    } catch {}
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      surname: "",
      firstName: "",
      middleName: "",
      gender: "",
      dateOfBirth: "",
      serviceNumber: "",
      rank: "",
      formation: "",
      zone: "",
      dateOfFirstAppointment: "",
      email: "",
      phoneNumber: "",
      stateOfOrigin: "",
      lgaOfOrigin: "",
      nin: "",
      bvn: "",
      nhf: "",
      permanentAddress: "",
    },
    validate,
    onSubmit: (values) => {
      const password = generatePassword();
      setAdminPassword("");
      setReauthError("");
      setPasswordDialog({ ...values, password });
    },
  });

  const selectedState = formik.values.stateOfOrigin;
  const lgaOptions = selectedState ? getLgas(selectedState) : [];

  return (
    <>
      <Dialog open={!!passwordDialog} onClose={() => { if (!submitting) { sessionStorage.removeItem("pendingStaffSuccess"); setPasswordDialog(null); setSubmitted(null); } }}>
        {!submitted ? (
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-4">&#10003;</div>
            <h2 className="text-xl font-bold text-nis-primary mb-2">
              Staff Registration
            </h2>
            <p className="text-gray-600 mb-6">
              Generated login credentials for{" "}
              <span className="font-semibold">
                {passwordDialog?.title} {passwordDialog?.surname} {passwordDialog?.firstName}
              </span>
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6 text-left space-y-2">
              <p className="text-sm font-semibold text-yellow-800">
                Temporary Login Credentials
              </p>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>
                  Service Number:{" "}
                  <span className="font-mono font-bold">{passwordDialog?.serviceNumber}</span>
                </p>
                <p>
                  Password:{" "}
                  <span className="font-mono font-bold text-red-600 text-base">
                    {passwordDialog?.password}
                  </span>
                </p>
              </div>
              <p className="text-xs text-yellow-600 mt-2">
                Share these credentials securely with the officer.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 mb-4 text-left">
              <label htmlFor="adminPassword" className="text-sm font-medium text-nis-primary">
                Your Admin Password
              </label>
              <input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter your password to confirm"
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary"
              />
              {reauthError && (
                <span className="text-xs text-red-500">{reauthError}</span>
              )}
            </div>

            <Button
              variant="primary"
              loading={submitting}
              onClick={async () => {
                if (!adminPassword) {
                  setReauthError("Please enter your admin password");
                  return;
                }
                const data = passwordDialog;
                setSubmitting(true);
                setSubmitError("");
                setReauthError("");
                try {
                  const email = `${data.serviceNumber}@nis.gov.ng`;
                  const adminEmail = auth.currentUser.email;

                  sessionStorage.setItem(
                    "pendingStaffSuccess",
                    JSON.stringify({ ...data, email, timestamp: Date.now() })
                  );

                  const credential = await createUserWithEmailAndPassword(auth, email, data.password);
                  await addStaff({ ...data, email, authUid: credential.user.uid });
                  await signOut(auth);
                  await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
                  window.location.href = "/dashboard/register-staff";
                } catch (error) {
                  sessionStorage.removeItem("pendingStaffSuccess");
                  if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
                    setReauthError("Incorrect admin password. Try again.");
                  } else {
                    setSubmitError(error.message);
                  }
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              Confirm Registration
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-4">&#10003;</div>
            <h2 className="text-xl font-bold text-nis-primary mb-2">
              Registration Successful
            </h2>
            <p className="text-gray-600 mb-6">
              <span className="font-semibold">
                {submitted.title} {submitted.surname} {submitted.firstName}
              </span>{" "}
              has been registered successfully.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  sessionStorage.removeItem("pendingStaffSuccess");
                  setPasswordDialog(null);
                  setSubmitted(null);
                  formik.resetForm();
                }}
              >
                Register Another Staff
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  sessionStorage.removeItem("pendingStaffSuccess");
                  setPasswordDialog(null);
                  setSubmitted(null);
                  navigate("/dashboard");
                }}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </Dialog>

    <form
      onSubmit={formik.handleSubmit}
      className="max-w-4xl mx-auto p-6 space-y-6"
    >
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-nis-primary">
          Staff Registration
        </h1>
        <p className="text-sm text-gray-500">
          Nigeria Immigration Service — Personnel Record Form
        </p>
      </div>

      <Section title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            id="title"
            label="Title"
            formik={formik}
            options={TITLES}
            required
          />
          <Input
            id="surname"
            label="Surname"
            formik={formik}
            placeholder="Enter surname"
            required
          />
          <Input
            id="firstName"
            label="First Name"
            formik={formik}
            placeholder="Enter first name"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="middleName"
            label="Middle Name"
            formik={formik}
            placeholder="Enter middle name (optional)"
          />
          <Select
            id="gender"
            label="Gender"
            formik={formik}
            options={GENDERS}
            required
          />
          <Input
            id="dateOfBirth"
            label="Date of Birth"
            type="date"
            formik={formik}
            required
          />
        </div>
      </Section>

      <Section title="Service Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="serviceNumber"
            label="Service Number"
            formik={formik}
            placeholder="e.g. NIS00001"
            required
          />
          <Select
            id="rank"
            label="Rank"
            formik={formik}
            options={RANKS}
            required
          />
          <Select
            id="formation"
            label="Formation"
            formik={formik}
            options={FORMATIONS}
            placeholder="Select formation"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            id="zone"
            label="Zone"
            formik={formik}
            options={ZONES}
            placeholder="Select zone"
            required
          />
          <Input
            id="dateOfFirstAppointment"
            label="Date of First Appointment"
            type="date"
            formik={formik}
            required
          />
        </div>
      </Section>

      <Section title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="email"
            label="Email Address"
            type="email"
            formik={formik}
            placeholder="name@example.com"
            required
          />
          <Input
            id="phoneNumber"
            label="Phone Number"
            formik={formik}
            placeholder="08012345678"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="permanentAddress"
            label="Permanent Home Address"
            formik={formik}
            placeholder="House number, street, city"
            required
          />
        </div>
      </Section>

      <Section title="Origin">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="stateOfOrigin"
            label="State of Origin"
            formik={formik}
            options={states}
            placeholder="Select state"
            required
          />
          <Select
            id="lgaOfOrigin"
            label="LGA of Origin"
            formik={formik}
            options={lgaOptions}
            placeholder={selectedState ? "Select LGA" : "Select a state first"}
            required
          />
        </div>
      </Section>

      <Section title="Identification Numbers">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="nin"
            label="NIN (National Identification Number)"
            formik={formik}
            placeholder="11-digit NIN"
            required
          />
          <Input
            id="bvn"
            label="BVN (Bank Verification Number)"
            formik={formik}
            placeholder="10-digit BVN"
            required
          />
          <Input
            id="nhf"
            label="NHF (National Housing Fund Number)"
            formik={formik}
            placeholder="10-digit NHF"
            required
          />
        </div>
      </Section>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex items-center justify-end gap-4 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => formik.resetForm()}
        >
          Reset
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          Submit Registration
        </Button>
      </div>
    </form>
    </>
  );
}
