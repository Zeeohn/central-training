"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";

interface Question {
  text: string;
  type: string;
  options: string[];
  id: string;
}

interface InterviewForm {
  _id: string;
  title: string;
  cohort: {
    _id: string;
    name: string;
    year: number;
  };
  level: {
    _id: string;
    name: string;
  };
  nextLevel: {
    _id: string;
    name: string;
  };
  questions: Question[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  responseObject: {
    forms: InterviewForm[];
  };
  statusCode: number;
}

export default function InterviewQuestions() {
  const { profile, leadershipLevel } = useSelector(
    (state: RootState) => state.auth
  );
  const [formColor, setFormColor] = useState("bg-purple-100");
  const [headerText, setHeaderText] = useState("Interview Questions");
  const [profilePicture, setProfilePicture] = useState<string | null>(
    profile?.cached_bio?.passport || null
  );
  const [signature, setSignature] = useState<string | null>(
    profile?.cached_bio?.signature || null
  );
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formLeadershipLevel, setFormLeadershipLevel] = useState<string | null>(
    null
  );
  const [form, setForm] = useState<InterviewForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch interview form based on leadership level
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TRAINING_API_URL}/interview-form/get-by-hierarchy/${leadershipLevel}`
        );
        const data: ApiResponse = await response.json();
        if (data.success && data.responseObject.forms.length > 0) {
          setForm(data.responseObject.forms[0]);
          setHeaderText(data.responseObject.forms[0].title);
          setFormLeadershipLevel(data.responseObject.forms[0].level.name);
        }
      } catch (error) {
        console.error("Error fetching interview form:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (leadershipLevel) {
      fetchForm();
    }
  }, [leadershipLevel]);

  // Prefill form data from profile
  useEffect(() => {
    if (profile && form) {
      const initialData = { ...formData };
      form.questions.forEach((question) => {
        if (question.text.toLowerCase().includes("full name")) {
          initialData[question.id] = `${profile.name}`;
        } else if (question.text.toLowerCase().includes("gender")) {
          initialData[question.id] = profile?.cached_bio?.gender || "";
        } else if (question.text.toLowerCase().includes("telegram")) {
          initialData[question.id] = profile?.cached_bio?.phone_contact || "";
        }
      });
      setFormData(initialData);
    }
  }, [profile, form]);

  // Set different colors based on leadership level
  useEffect(() => {
    switch (formLeadershipLevel) {
      case "WORKER":
        setFormColor("bg-purple-50"); // Purple theme
        break;
      case "EXECUTIVE_ASSISTANT":
        setFormColor("bg-gray-50"); // Gray theme
        break;
      case "ASSISTANT_HOD":
        setFormColor("bg-purple-50"); // Purple theme
        break;
      case "HOD":
        setFormColor("bg-gray-50"); // Gray theme
        break;
      case "MINISTER":
        setFormColor("bg-purple-50"); // Purple theme
        break;
      case "PASTOR":
        setFormColor("bg-purple-50"); // Purple theme
        break;
      default:
        setFormColor("bg-purple-50");
    }
  }, [leadershipLevel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = document.querySelectorAll(
      "input[required], textarea[required], select[required]"
    );

    requiredFields.forEach((field) => {
      const name = field.getAttribute("name");

      // Skip validation for follow-up questions when the related yes/no question is "no"
      if (
        name === "relationshipDetails" &&
        formData["inRelationship"] === "no"
      ) {
        return;
      }
      if (name === "relationshipWith" && formData["inRelationship"] === "no") {
        return;
      }
      if (name === "challengesDetails" && formData["hasChallenges"] === "no") {
        return;
      }
      // For HOD form
      if (name === "mentorAware" && formData["inRelationship"] === "no") {
        return;
      }

      if (!formData[name] || formData[name].trim() === "") {
        errors[name] = "This field is required";
      }
    });

    if (!profilePicture) {
      errors["profilePicture"] = "Profile picture is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        // Create form data object that would be sent to backend
        const completeFormData = {
          leadershipLevel,
          form_id: form?._id,
          profilePicture,
          signature,
          ...formData,
        };

        // TODO: Add API endpoint for form submission
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TRAINING_API_URL}/interview-form/submit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(completeFormData),
          }
        );

        const data = await response.json();
        if (data.success) {
          alert(`${headerText} submitted successfully!`);
          // router.push('/trainee/dashboard')
        } else {
          throw new Error(data.message || "Form submission failed");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit form. Please try again.");
      }
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector(".error-message");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      alert("Please fill in all required fields");
    }

    setIsSubmitting(false);
  };

  // Function to get the focus color based on leadership level
  const getFocusColor = () => {
    switch (formLeadershipLevel) {
      case "WORKER":
        return "focus:border-purple-500";
      case "EXECUTIVE_ASSISTANT":
        return "focus:border-gray-500";
      case "ASSISTANT_HOD":
        return "focus:border-purple-500";
      case "HOD":
        return "focus:border-gray-500";
      case "MINISTER":
        return "focus:border-purple-500";
      case "PASTOR":
        return "focus:border-purple-500";
      default:
        return "focus:border-purple-500";
    }
  };

  // Function to get the button color based on leadership level
  const getButtonColor = () => {
    switch (formLeadershipLevel) {
      case "WORKER":
        return "bg-purple-600 hover:bg-purple-700";
      case "EXECUTIVE_ASSISTANT":
        return "bg-gray-600 hover:bg-gray-700";
      case "ASSISTANT_HOD":
        return "bg-purple-600 hover:bg-purple-700";
      case "HOD":
        return "bg-gray-600 hover:bg-gray-700";
      case "MINISTER":
      case "PASTOR":
        return "bg-purple-600 hover:bg-purple-700";
      default:
        return "bg-purple-600 hover:bg-purple-700";
    }
  };

  const focusColor = getFocusColor();
  const buttonColor = getButtonColor();

  useEffect(() => {
    // Clear relationship details when "inRelationship" changes to "no"
    if (formData["inRelationship"] === "no") {
      setFormData((prev) => ({
        ...prev,
        relationshipDetails: "",
        relationshipWith: "",
        mentorAware: "", // For HOD form
      }));
    }

    // Clear challenges details when "hasChallenges" changes to "no"
    if (formData["hasChallenges"] === "no") {
      setFormData((prev) => ({
        ...prev,
        challengesDetails: "",
      }));
    }
  }, [formData["inRelationship"], formData["hasChallenges"]]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Main content */}
        <div className="flex-1">
          <div className="">
            <div className={`rounded-lg ${formColor} p-6 shadow-md`}>
              <h1 className="mb-2 text-xl font-bold text-gray-800">
                {headerText}
              </h1>
              <p className="mb-6 text-sm text-gray-600">
                Kindly fill out the information correctly and accurately.
                <br />
                Please note that the information given should be carefully
                filled out.
                <br />
                <span className="text-red-500 font-medium">
                  Fields marked with * are required.
                </span>
              </p>

              <div className="mb-6 flex justify-center items-center gap-8">
                {/* Passport */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <input
                      type="file"
                      id="profile-picture"
                      accept="image/*"
                      className="hidden"
                      disabled={!!profile?.cached_bio?.passport}
                      onChange={(e) => {
                        if (profile?.cached_bio?.passport) return;
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setProfilePicture(event.target.result.toString());
                              if (formErrors["profilePicture"]) {
                                setFormErrors({
                                  ...formErrors,
                                  profilePicture: null,
                                });
                              }
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="profile-picture"
                      className={`flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 ${
                        formErrors["profilePicture"]
                          ? "border-red-500"
                          : "border-dashed border-gray-300"
                      } bg-white hover:border-purple-500 ${
                        profile?.cached_bio?.passport
                          ? "pointer-events-none opacity-80"
                          : ""
                      }`}
                    >
                      {profilePicture ? (
                        <div className="h-full w-full overflow-hidden rounded-lg">
                          <img
                            src={profilePicture || "/placeholder.svg"}
                            alt="Profile Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto h-8 w-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                            />
                          </svg>
                          <p className="mt-1 text-xs text-gray-500">
                            Upload your Picture{" "}
                            <span className="text-red-500">*</span>
                          </p>
                        </div>
                      )}
                    </label>
                    {formErrors["profilePicture"] && (
                      <p className="mt-1 text-xs text-red-500 error-message">
                        {formErrors["profilePicture"]}
                      </p>
                    )}
                    {/* Remove delete button if image is from profile */}
                    {profilePicture && !profile?.cached_bio?.passport && (
                      <button
                        type="button"
                        onClick={() => setProfilePicture(null)}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-center text-xs text-gray-500">
                    Passport
                  </p>
                </div>
                {/* Signature */}
                {signature && (
                  <div className="flex flex-col items-center">
                    <div className="h-32 w-32 overflow-hidden rounded-lg border-2 border-gray-300">
                      <img
                        src={signature}
                        alt="Signature"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <p className="mt-2 text-center text-xs text-gray-500">
                      Signature
                    </p>
                  </div>
                )}
              </div>
              <form onSubmit={handleSubmit}>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form?.questions.map((question, index) => (
                      <div key={question.id}>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          {index + 1}. {question.text}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {/* Text input for type="text" */}
                        {question.type === "text" && (
                          <input
                            type="text"
                            name={question.id}
                            value={formData[question.id] || ""}
                            className={`w-full rounded-md border ${
                              formErrors[question.id]
                                ? "border-red-500"
                                : "border-gray-300"
                            } p-2 ${focusColor} focus:outline-none`}
                            required
                            onChange={handleInputChange}
                          />
                        )}

                        {/* Textarea for long text content or when text contains newlines */}
                        {question.type === "textarea" && (
                          <textarea
                            name={question.id}
                            value={formData[question.id] || ""}
                            className={`w-full rounded-md border ${
                              formErrors[question.id]
                                ? "border-red-500"
                                : "border-gray-300"
                            } p-2 ${focusColor} focus:outline-none`}
                            rows={4}
                            required
                            onChange={handleInputChange}
                          />
                        )}

                        {/* Select dropdown for options */}
                        {question.type === "select" && (
                          <select
                            name={question.id}
                            value={formData[question.id] || ""}
                            className={`w-full rounded-md border ${
                              formErrors[question.id]
                                ? "border-red-500"
                                : "border-gray-300"
                            } p-2 ${focusColor} focus:outline-none`}
                            required
                            onChange={handleInputChange}
                          >
                            <option value="">Select an option</option>
                            {question.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* Render text input for other types as fallback */}
                        {!["text", "textarea", "select"].includes(
                          question.type
                        ) && (
                          <input
                            type="text"
                            name={question.id}
                            value={formData[question.id] || ""}
                            className={`w-full rounded-md border ${
                              formErrors[question.id]
                                ? "border-red-500"
                                : "border-gray-300"
                            } p-2 ${focusColor} focus:outline-none`}
                            required
                            onChange={handleInputChange}
                          />
                        )}
                        {formErrors[question.id] && (
                          <p className="mt-1 text-xs text-red-500 error-message">
                            {formErrors[question.id]}
                          </p>
                        )}
                      </div>
                    ))}

                    <div className="mt-6 flex justify-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`rounded-md px-4 py-2 text-white ${buttonColor} ${
                          isSubmitting ? "opacity-50" : ""
                        }`}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
