import { useState } from "react";
import { useFormik } from "formik";
import { createLeaveApplication } from "../../services/leaveService";
import LEAVE_TYPES from "../../constants/leaveTypes";
import Button from "../buttons/Button";
import { FiX } from "react-icons/fi";

function validate(values) {
  const errors = {};
  if (!values.leaveType) errors.leaveType = "Leave type is required";
  if (!values.startDate) errors.startDate = "Start date is required";
  if (!values.endDate) errors.endDate = "End date is required";
  if (!values.reason) errors.reason = "Reason for leave is required";

  if (values.startDate && values.endDate) {
    const start = new Date(values.startDate);
    const end = new Date(values.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      errors.startDate = "Start date cannot be in the past";
    }
    if (end < start) {
      errors.endDate = "End date must be on or after start date";
    }
  }

  return errors;
}

export default function LeaveApplicationForm({ officerId, profile, onClose, onSuccess }) {
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError("");
      try {
        await createLeaveApplication({
          officerId,
          profile,
          leaveData: values,
        });
        setSuccess(true);
        if (onSuccess) onSuccess();
      } catch (err) {
        setSubmitError(err.message || "Failed to submit leave application");
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
              Leave Application Submitted
            </h2>
            <p className="text-gray-600 mb-6">
              Your leave application has been submitted successfully and is pending review.
            </p>
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-nis-primary mb-6">
              Apply for Leave
            </h2>

            {submitError && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="leaveType" className="text-sm font-medium text-nis-primary">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="leaveType"
                  className={[
                    "px-4 py-2.5 rounded-lg border text-sm transition-colors duration-200 bg-white",
                    "focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary",
                    formik.touched.leaveType && formik.errors.leaveType
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-gray-400",
                  ].join(" ")}
                  {...formik.getFieldProps("leaveType")}
                >
                  <option value="">Select leave type</option>
                  {LEAVE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {formik.touched.leaveType && formik.errors.leaveType && (
                  <span className="text-xs text-red-500">{formik.errors.leaveType}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="startDate" className="text-sm font-medium text-nis-primary">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="startDate"
                  type="date"
                  className={[
                    "px-4 py-2.5 rounded-lg border text-sm transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary",
                    formik.touched.startDate && formik.errors.startDate
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white hover:border-gray-400",
                  ].join(" ")}
                  {...formik.getFieldProps("startDate")}
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <span className="text-xs text-red-500">{formik.errors.startDate}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="endDate" className="text-sm font-medium text-nis-primary">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="endDate"
                  type="date"
                  className={[
                    "px-4 py-2.5 rounded-lg border text-sm transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary",
                    formik.touched.endDate && formik.errors.endDate
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white hover:border-gray-400",
                  ].join(" ")}
                  {...formik.getFieldProps("endDate")}
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <span className="text-xs text-red-500">{formik.errors.endDate}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="reason" className="text-sm font-medium text-nis-primary">
                  Reason for Leave <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reason"
                  rows={4}
                  placeholder="Provide a reason for your leave application"
                  className={[
                    "px-4 py-2.5 rounded-lg border text-sm transition-colors duration-200 resize-none",
                    "focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary",
                    formik.touched.reason && formik.errors.reason
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white hover:border-gray-400",
                  ].join(" ")}
                  {...formik.getFieldProps("reason")}
                />
                {formik.touched.reason && formik.errors.reason && (
                  <span className="text-xs text-red-500">{formik.errors.reason}</span>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={formik.isSubmitting}>
                  {formik.isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
