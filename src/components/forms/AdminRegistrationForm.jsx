import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Button from "../buttons/Button";

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

const ROLES = [
  "HRM",
  "PRS",
  "ACCOUNTS",
  "PROVOST",
  "FORMATION HEAD",
  "INVESTIGATIONS",
  "UNIT HEAD",
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
  if (!values.zone) errors.zone = "Zone is required";
  if (!values.formation) errors.formation = "Formation is required";
  if (!values.role) errors.role = "Role is required";
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

export default function AdminRegistrationForm() {
  const [submitted, setSubmitted] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      zone: "",
      formation: "",
      role: "",
      email: "",
    },
    validate,
    onSubmit: async (values) => {
      const email = `${values.role.toLowerCase()}${values.formation.toLowerCase()}admin@nis.gov.ng`;
      setSubmitting(true);
      setSubmitError("");
      try {
        const password = generatePassword();
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "admins", credential.user.uid), {
          zone: values.zone,
          formation: values.formation,
          role: values.role,
          email,
        });
        setGeneratedPassword(password);
        setSubmitted({ ...values, email });
      } catch (error) {
        setSubmitError(error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const formation = formik.values.formation;
  const role = formik.values.role;
  const computedEmail = (formation && role) ? `${role.toLowerCase()}${formation.toLowerCase()}admin@nis.gov.ng` : "";

  useEffect(() => {
    formik.setFieldValue("email", computedEmail);
  }, [formation, role]);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="text-green-600 text-5xl mb-4">&#10003;</div>
        <h2 className="text-2xl font-bold text-nis-primary mb-2">
          Admin Registration Successful
        </h2>
        <p className="text-gray-600 mb-6">
          Admin with email{" "}
          <span className="font-semibold">{submitted.email}</span> has been
          registered successfully.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6 text-left space-y-2">
          <p className="text-sm font-semibold text-yellow-800">
            Temporary Login Credentials
          </p>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>
              Email:{" "}
              <span className="font-mono font-bold">{submitted.email}</span>
            </p>
            <p>
              Password:{" "}
              <span className="font-mono font-bold text-red-600 text-base">
                {generatedPassword}
              </span>
            </p>
          </div>
          <p className="text-xs text-yellow-600 mt-2">
            This password will not be shown again. Share it securely with the
            admin.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => {
            setSubmitted(null);
            setGeneratedPassword("");
            formik.resetForm();
          }}
        >
          Register Another Admin
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-6"
    >
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-nis-primary">
          Admin Registration
        </h1>
        <p className="text-sm text-gray-500">
          Register a new administrator for the system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="zone"
          label="Zone"
          formik={formik}
          options={ZONES}
          placeholder="Select zone"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="role"
          label="Role"
          formik={formik}
          options={ROLES}
          placeholder="Select role"
          required
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-nis-primary">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            value={computedEmail}
            disabled
            className="px-4 py-2.5 rounded-lg border text-sm bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
          />
          <span className="text-xs text-gray-400">
            Auto-generated from formation
          </span>
        </div>
      </div>

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
          Register Admin
        </Button>
      </div>
    </form>
  );
}
