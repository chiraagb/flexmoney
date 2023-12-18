import React, { useState } from "react";

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    selectedBatch: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      // Trim whitespace before sending the data
      const trimmedFormData = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        selectedBatch: formData.selectedBatch.trim(),
      };

      // Make API call to the backend
      const response = await fetch("/api/admission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedFormData),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          setSuccessMessage(result.message);
        } else {
          setErrorMessage(`${result.message} ${result.errorDetails || ""}`);
        }
      } else {
        console.error("API Request failed:", response.statusText);
        setErrorMessage("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error during API request:", error);
      setErrorMessage(`Failed to submit the form. ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Yoga Class Admission Form
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-600"
            >
              Age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="selectedBatch"
              className="block text-sm font-medium text-gray-600"
            >
              Select Batch:
            </label>
            <select
              id="selectedBatch"
              name="selectedBatch"
              value={formData.selectedBatch}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="6-7AM">6-7AM</option>
              <option value="7-8AM">7-8AM</option>
              <option value="8-9AM">8-9AM</option>
              <option value="5-6PM">5-6PM</option>
            </select>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 mb-4">{successMessage}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
