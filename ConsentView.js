import React from "react";
import { FileText, CheckCircle } from "lucide-react";
import { useConsentLogic } from "./useConsentLogic";



const ConsentView = () => {
  const {
    selectedPatient,
    setSelectedPatient,
    language,
    setLanguage,
    literacyLevel,
    setLiteracyLevel,
    consentGenerated,
    patients,
    consentTemplates,
    selectedPatientData,
    handleGenerateConsent,
    handleDownload,
  } = useConsentLogic();

  const currentContent = consentTemplates[language];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Consent Form Generation
      </h2>

      {/* Configuration Panel */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        {/* Patient Selection */}
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">-- Select Patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id} - Age {p.age}
            </option>
          ))}
        </select>

        {/* Language Buttons */}
        <div className="flex gap-3">
          {["english", "hindi", "malayalam"].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-lg ${
                language === lang
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Literacy */}
        <select
          value={literacyLevel}
          onChange={(e) => setLiteracyLevel(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="standard">Standard</option>
          <option value="advanced">Advanced</option>
        </select>

        <button
          onClick={handleGenerateConsent}
          className="bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <FileText size={20} />
          Generate Consent
        </button>
      </div>

      {/* Preview */}
      {consentGenerated && selectedPatientData && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Preview</h3>
            <button
              onClick={handleDownload}
              className="text-blue-600 flex items-center gap-1"
            >
              <CheckCircle size={16} />
              Download PDF
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-center font-bold">
              {currentContent.title}
            </h4>
            <p className="text-center text-sm">
              {currentContent.subtitle}
            </p>

            <div className="text-sm">
              <p>
                <strong>Patient ID:</strong>{" "}
                {selectedPatientData.id}
              </p>
              <p>
                <strong>Age:</strong> {selectedPatientData.age}
              </p>
              <p>
                <strong>Sex:</strong>{" "}
                {selectedPatientData.sex}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date().toLocaleDateString("en-IN")}
              </p>
            </div>

            {currentContent.sections.map((section, i) => (
              <div key={i}>
                <h5 className="font-semibold">{section.heading}</h5>
                <p className="text-gray-700">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsentView;