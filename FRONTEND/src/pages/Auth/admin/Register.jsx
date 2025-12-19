import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPiggyBank,
  faHandHoldingUsd,
  faUsers,
  faCreditCard,
  faSignal,
  faGraduationCap,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import Tip from "../../../components/tip";
import { apiFetch } from "../../../modules/API";

function AdminRegister() {
  const [step, setStep] = useState(1);
  const [showCoopOptions, setShowCoopOptions] = useState(false);

  const [formData, setFormData] = useState({
    //organisation info
    category: "",
    cooperativeName: "",
    orgName: "",
    orgEmail: "",
    regNumber: "",
    address: "",
    members: "",
    selectedServices: [],

    // admin info
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
    adminConfirmPassword: "",

    // bank info
    accountName: "",
    accountNumber: "",
    bankName: "",
  });

  // password UX toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // ✅ Validation checks
  const isStepValid =
    formData.orgName.trim() &&
    formData.orgEmail.trim() &&
    formData.regNumber.trim() &&
    formData.address.trim() &&
    formData.members !== "";

  const isAdminStepValid =
    formData.adminName.trim() &&
    formData.adminEmail.trim() &&
    formData.adminPhone.trim() &&
    formData.adminPassword.trim() &&
    formData.adminConfirmPassword.trim() &&
    formData.adminPassword.length >= 6 &&
    formData.adminPassword === formData.adminConfirmPassword;

  const isBankStepValid =
    formData.bankName.trim() &&
    formData.accountNumber.trim() &&
    formData.accountName.trim();

  // 🔹 Generic change handler
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle a service in the selectedServices array
  const toggleService = (serviceLabel) => {
    setFormData((prev) => {
      const existing = Array.isArray(prev.selectedServices) ? prev.selectedServices : [];
      if (existing.includes(serviceLabel)) {
        return { ...prev, selectedServices: existing.filter((s) => s !== serviceLabel) };
      }
      return { ...prev, selectedServices: [...existing, serviceLabel] };
    });
  };

  // small helpers for password UX
  const passwordTooShort =
    formData.adminPassword &&
    formData.adminPassword.length > 0 &&
    formData.adminPassword.length < 6;

  const passwordsMismatch =
    formData.adminConfirmPassword &&
    formData.adminConfirmPassword.length > 0 &&
    formData.adminPassword !== formData.adminConfirmPassword;

  // handle submission
  const handleSubmit = async () => {
    console.log("Submitting form data:", formData);

    let num;
    switch (formData.members){
      case "small":
        num = 20000;
        break;
      case  "medium":
        num = 25000;
        break;
      default:
        num = 30000;
    }

    // TODO: JOBA hook up API here
    const data = await apiFetch({
      url : "register-information",
      method : "Post",
      body : {
        institution_name : formData.orgName,
        institution_email : formData.orgEmail,
        reg_number : formData.regNumber,
        institution_type : formData.category,
        institution_sub : formData.cooperativeName,
        services : Array.isArray(formData.selectedServices) ? formData.selectedServices : [formData.selectedServices],
        address : formData.address,
        size : formData.members,
        num_members : num,
        bank_name : formData.bankName,
        account_name : formData.accountName,
        account_number : formData.accountNumber,
        user_name : formData.adminName,
        user_email : formData.adminEmail,
        password : formData.adminPassword,
        phone : formData.adminPhone,
        user_type : "admin",
      },
      isAuth : false
    });

    if(data){
      localStorage.setItem("token", data.accessToken);
      navigate("/admin/splash");
    }
    
  };

  // 🔹 Check validations before next step
  const isNextDisabled = (step) => {
    switch (step) {
      case 1:
        return !formData.category|| (showCoopOptions && !formData.cooperativeName);
      case 2:
        return !isStepValid;
      case 3:
        return !(Array.isArray(formData.selectedServices) && formData.selectedServices.length > 0);
      case 4:
        return !isAdminStepValid;
      case 5:
        return !isBankStepValid;
      default:
        return true;
    }
  };

  // Options data
  const options = [
    {
      id: "cooperative",
      label: "Cooperative",
      desc: "Member-owned financial organization focused on mutual aid and shared resources",
    },
    {
      id: "thrifts",
      label: "Thrifts",
      desc: "Rotating savings group where members contribute and take turns receiving payouts",
    },
    {
      id: "association",
      label: "Association",
      desc: "Professional or community group with shared interests and financial goals",
    },
  ];

  // Cooperative types
  const cooperatives = [
    { id: "cooperative", label: "Cooperative only" },
    { id: "mixed", label: "Cooperative with agents and customers" },
    { id: "agents", label: "Cooperative with agents only" },
    { id: "customers", label: "Cooperative with customers only" },
  ];

  // Services data
  const services = [
    { label: "Savings", icon: faPiggyBank },
    { label: "Loans", icon: faHandHoldingUsd },
    { label: "Contribution", icon: faUsers },
    { label: "Payment", icon: faCreditCard },
    { label: "Data", icon: faSignal },
    { label: "Education", icon: faGraduationCap },
  ];

  // 🔹 Animation variants
  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="flex flex-col h-dvh gap-3 p-4 max-h-dvh bg-white">
      {/* Logo/header */}
      <img src="/logo.png" alt="PayCollect logo" className="mx-auto w-44 h-auto" />

      {/* Steps wrapper (flex-1 makes it stretch, overflow-y-auto allows scrolling) */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flexflex-col"
          >
            <AnimatePresence mode="wait">
              {!showCoopOptions ? (
                <motion.div
                  key="groupTypes"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full flex flex-col gap-2 "
                >
                  <h2 className="text-lg text-center font-semibold">Select your Group Type</h2>
                  <div className="w-full flex flex-col gap-2">
                    {options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`border p-3 rounded-md cursor-pointer ${
                          formData.category=== opt.id
                            ? "bg-blue-50 border-blue-500"
                            : "border-gray-300"
                        }`}
                        onClick={() => handleChange("category", opt.id)}
                      >
                        <h3 className="font-bold">{opt.label}</h3>
                        <p className="text-sm">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="coopTypes"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col gap-2 w-full"
                >
                  <h2 className="text-lg text-center font-semibold">Choose your Cooperative Type</h2>
                  <div className="w-full flex flex-col gap-3">
                    {cooperatives.map((coop) => (
                      <div
                        key={coop.id}
                        className={`border p-3 rounded-md cursor-pointer ${
                          formData.cooperativeName === coop.id
                          ? "bg-blue-50 border-blue-500"
                          : "border-gray-300"
                        }`}
                        onClick={() => handleChange("cooperativeName", coop.id)}
                      >
                        <p className="font-bold">{coop.label}</p>
                      </div>
                    ))}
                    <Tip />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}


        {step === 2 && (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex flex-col gap-4"
          >
            <h2 className="text-lg font-semibold text-center">Organisation Details</h2>
            <div className="flex flex-col gap-3">
              <label htmlFor="orgName" className="font-medium">Organisation Name</label>
              <input
                id="orgName"
                type="text"
                value={formData.orgName}
                onChange={(e) => handleChange("orgName", e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Enter organisation name"
              />

              <label htmlFor="orgEmail" className="font-medium">Organisation Email</label>
              <input
                id="orgEmail"
                type="email"
                value={formData.orgEmail}
                onChange={(e) => handleChange("orgEmail", e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Enter organisation email"
              />

              <label htmlFor="regNo" className="font-medium">Registration Number</label>
              <input
                id="regNo"
                type="text"
                value={formData.regNumber}
                onChange={(e) => handleChange("regNumber", e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Enter registration number"
              />

              <label htmlFor="address" className="font-medium">Address</label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Enter organisation address"
              />

              <label htmlFor="members" className="font-medium">Expected Members</label>
              <select
                id="members"
                value={formData.members}
                onChange={(e) => handleChange("members", e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="" disabled hidden>Select number of members</option>
                <option value="small">Small (₦20,000)</option>
                <option value="medium">Medium (₦25,000)</option>
                <option value="large">Large (₦30,000)</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Step 3 */}
      {step === 3 && (
        <motion.div
          key="step3"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex flex-col gap-4"
        >
          <h2 className="text-lg font-semibold text-center">Select Services</h2>
          <div className="grid grid-cols-2 gap-4">
                {services.map((service, idx) => (
              <div
                key={idx}
                className={`border p-3 rounded-md cursor-pointer flex flex-col items-center gap-2 ${
                  (Array.isArray(formData.selectedServices) && formData.selectedServices.includes(service.label))
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => toggleService(service.label)}
              >
                <FontAwesomeIcon
                  icon={service.icon}
                  className={`text-[16px] p-2 rounded-md ${
                    (Array.isArray(formData.selectedServices) && formData.selectedServices.includes(service.label))
                      ? "bg-sky-500 text-gray-900"
                      : "bg-sky-100 text-gray-600"
                  }`}
                />
                <p className="text-sm font-semibold text-gray-800">
                  {service.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <motion.div
          key="step4"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-center">
            Admin Account Details
          </h2>
          <div className="flex flex-col gap-3">
            <label htmlFor="adminName" className="font-medium">
              Full Name
            </label>
            <input
              id="adminName"
              type="text"
              value={formData.adminName}
              onChange={(e) => handleChange("adminName", e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter full name"
            />

            <label htmlFor="adminEmail" className="font-medium">
              Email
            </label>
            <input
              id="adminEmail"
              type="email"
              value={formData.adminEmail}
              onChange={(e) => handleChange("adminEmail", e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter email"
            />

            <label htmlFor="adminPhone" className="font-medium">
              Phone Number
            </label>
            <input
              id="adminPhone"
              type="tel"
              value={formData.adminPhone}
              onChange={(e) => handleChange("adminPhone", e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter phone number"
            />

            {/* Password with eye toggle and inline validation */}
            <label htmlFor="adminPassword" className="font-medium flex items-center gap-2">
              Password
            </label>
            <div className="relative">
              <input
                id="adminPassword"
                type={showPassword ? "text" : "password"}
                value={formData.adminPassword}
                onChange={(e) => handleChange("adminPassword", e.target.value)}
                className={`border p-2 rounded w-full pr-10 ${passwordTooShort ? "border-red-500" : ""}`}
                placeholder="Enter password"
                aria-invalid={passwordTooShort ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {passwordTooShort && (
              <p className="text-red-500 text-sm">Password must be at least 6 characters.</p>
            )}

            {/* Confirm Password with eye toggle and match check */}
            <label htmlFor="adminConfirmPassword" className="font-medium flex items-center gap-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="adminConfirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.adminConfirmPassword}
                onChange={(e) => handleChange("adminConfirmPassword", e.target.value)}
                className={`border p-2 rounded w-full pr-10 ${passwordsMismatch ? "border-red-500" : ""}`}
                placeholder="Confirm password"
                aria-invalid={passwordsMismatch ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-2 top-2 text-gray-500"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {passwordsMismatch && (
              <p className="text-red-500 text-sm">Passwords do not match.</p>
            )}

            {/* optional subtle success hint when both are okay */}
            {!passwordTooShort && !passwordsMismatch && formData.adminPassword && formData.adminConfirmPassword && (
              <p className="text-green-600 text-sm">Passwords match and meet length requirement.</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Step 5 */}
      {step === 5 && (
        <motion.div
          key="step5"
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex flex-col gap-2"
        >
          <h2 className="text-lg font-semibold text-center">Bank Details</h2>
          <div className="flex flex-col gap-3">
            <label htmlFor="accountName" className="font-medium">
              Account Name
            </label>
            <input
              id="accountName"
              type="text"
              value={formData.accountName}
              onChange={(e) => handleChange("accountName", e.target.value)}
              className="border p-2 rounded w-full" 
              placeholder="Enter account name"
            />
            <label htmlFor="accountNumber" className="font-medium">
              Account Number
            </label>
            <input
              id="accountNumber"
              type="number"
              value={formData.accountNumber}
              onChange={(e) => handleChange("accountNumber", e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter account number"
            />
            <label htmlFor="bankName" className="font-medium">
              Bank Name
            </label>
            <input
              id="bankName"
              type="text"
              value={formData.bankName}
              onChange={(e) => handleChange("bankName", e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter bank name"
            />
          </div>
        </motion.div>
      )}
      </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex w-full justify-between gap-2">
        <button
          onClick={() => {
            showCoopOptions && step === 1
              ? (setShowCoopOptions(false), setFormData({ ...formData, cooperativeName: "" }))
              : setStep(step - 1);
          }}
          className={`px-4 py-2 w-full bg-gray-200 text-gray-900 rounded 
            ${step === 1 && !showCoopOptions ? "hidden" : ""}`}
        >
          Back
        </button>
        <button
          disabled={isNextDisabled(step)}
          onClick={() => {
            formData.category=== "cooperative" && !showCoopOptions
              ? setShowCoopOptions(true)
              : step === 5
              ? handleSubmit()
              : setStep(step + 1);
          }}
          className="px-4 py-2 w-full bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {step === 5 ? "Submit" : "Next"}
        </button>
      </div>
      <button
        onClick={() => navigate("/admin/login")}
        className={`px-4 py-2 w-full bg-gray-200 text-gray-900 rounded ${
        step === 1 && !showCoopOptions ? "" : "hidden"}`}
      >
        Back to Login
      </button>
    </div>
  );
}

export default AdminRegister;