import { useState } from "react";
import { useFormik } from "formik";
import { reportIncident } from "../../services/incidentService";
import INCIDENT_TYPES from "../../constants/incidentTypes";
import Button from "../buttons/Button";
import { FiX } from "react-icons/fi";

function validate(values) {
  const errors = {};
  if (!values.incidentType) errors.incidentType = "Incident type is required";
  if (!values.report) errors.report = "Incident report is required";
  else if (values.report.length < 20)
    errors.report = "Report must be at least 20 characters";
  return errors;
}

export default function IncidentReportForm({ officerId, profile, onClose, onSuccess }) {
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      incidentType: "",
      report: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError("");
      try {
        await reportIncident({
          officerId,
          profile,
          incidentData: values,
        });
        setSuccess(true);
        if (onSuccess) onSuccess();
      } catch (err) {
        setSubmitError(err.message || "Failed to submit incident report");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full mx-4 z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <FiX size={20} />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-5xl mb-4">&#10003;</div>
            <h2 className="text-xl font-bold text-nis-primary mb-2">
              Incident Reported
            </h2>
            <p className="text-gray-600 mb-6">
              Your incident report has been submitted successfully and is pending review.
            </p>
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-nis-primary mb-6">
              Report an Incident
            </h2>

            {submitError && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="incidentType" className="text-sm font-medium text-nis-primary">
                  Incident Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="incidentType"
                  className={[
                    "px-4 py-2.5 rounded-lg border text-sm transition-colors duration-200 bg-white",
                    "focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary",
                    formik.touched.incidentType && formik.errors.incidentType
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-gray-400",
                  ].join(" ")}
                  {...formik.getFieldProps("incidentType")}
                >
                  <option value="">Select incident type</option>
                  {INCIDENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {formik.touched.incidentType && formik.errors.incidentType && (
                  <span className="text-xs text-red-500">{formik.errors.incidentType}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="report" className="text-sm font-medium text-nis-primary">
                  Incident Report <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="report"
                  rows={6}
                  placeholder="Describe the security or migration issue within your locality..."
                  className={[
                    "px-4 py-2.5 rounded-lg border text-sm transition-colors duration-200 resize-none",
                    "focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary",
                    formik.touched.report && formik.errors.report
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white hover:border-gray-400",
                  ].join(" ")}
                  {...formik.getFieldProps("report")}
                />
                {formik.touched.report && formik.errors.report && (
                  <span className="text-xs text-red-500">{formik.errors.report}</span>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={formik.isSubmitting}>
                  {formik.isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
