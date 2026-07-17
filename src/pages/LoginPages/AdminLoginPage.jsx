import { useState } from "react";
import { useFormik } from "formik";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/buttons/Button";
import { FiMail, FiLock, FiArrowLeft, FiAlertCircle } from "react-icons/fi";

function validate(values) {
  const errors = {};
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
}

export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const [authError, setAuthError] = useState(null);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError(null);
      try {
        await adminLogin(values.email, values.password);
      } catch (err) {
        const map = {
          "auth/invalid-credential": "Invalid email or password",
          "auth/invalid-email": "Enter a valid email address",
          "auth/too-many-requests": "Too many attempts. Try again later",
        };
        setAuthError(
          map[err.code] || "Login failed. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  function getFieldProps(id) {
    const touch = formik.touched[id];
    const error = formik.errors[id];
    const hasError = touch && error;
    return {
      ...formik.getFieldProps(id),
      hasError,
      error,
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nis-primary to-nis-primary-light flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 md:p-14 max-w-md w-full gap-4">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-nis-primary transition-colors mb-8"
        >
          <FiArrowLeft /> Back
        </a>

        <div className="w-25 h-25 bg-nis-secondary/5 rounded-full flex items-center justify-center mx-auto p-2 ">
          <img src="src/assets/images/nis-logo.png" alt="nis-logo" />
        </div>

        <div className="text-center space-y-2 mb-8  pt-10">
          <h1 className="text-xl font-bold text-nis-primary">Admin Login</h1>
          <p className="text-sm text-gray-500">
            Sign in to manage the staff management system
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {authError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              <FiAlertCircle className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-nis-primary"
            >
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="roleformationadmin@nis.gov.ng"
                className={[
                  "w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary",
                  getFieldProps("email").hasError
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 bg-white hover:border-gray-400",
                ].join(" ")}
                {...formik.getFieldProps("email")}
              />
            </div>
            {getFieldProps("email").hasError && (
              <span className="text-xs text-red-500">
                {getFieldProps("email").error}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-nis-primary"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={[
                  "w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-nis-primary/30 focus:border-nis-primary",
                  getFieldProps("password").hasError
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 bg-white hover:border-gray-400",
                ].join(" ")}
                {...formik.getFieldProps("password")}
              />
            </div>
            {getFieldProps("password").hasError && (
              <span className="text-xs text-red-500">
                {getFieldProps("password").error}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            className="w-full"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
