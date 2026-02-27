import { useState } from "react";

export const useConsentLogic = () => {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [language, setLanguage] = useState("english");
  const [literacyLevel, setLiteracyLevel] = useState("standard");
  const [consentGenerated, setConsentGenerated] = useState(false);

  // Sample patients (later fetch from Supabase)
  const patients = [
    { id: "P001", age: 52, sex: "M" },
    { id: "P002", age: 45, sex: "F" },
    { id: "P003", age: 58, sex: "M" },
    { id: "P004", age: 41, sex: "F" },
  ];

  const handleGenerateConsent = () => {
    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }
    setConsentGenerated(true);
  };

  const handleDownload = () => {
    alert(
      "Consent form will be downloaded as PDF!\n(In production, this will generate a real PDF)"
    );
  };

  // Consent templates
  const consentTemplates = {
    english: {
      title: "INFORMED CONSENT FORM",
      subtitle: "Clinical Trial for Type 2 Diabetes Treatment",
      sections: [
        {
          heading: "Purpose of the Study",
          content:
            "You are invited to participate in a clinical trial to evaluate a new treatment for Type 2 Diabetes.",
        },
        {
          heading: "Study Duration",
          content:
            "Participation lasts approximately 6 months with regular follow-ups.",
        },
        {
          heading: "Risks",
          content:
            "Possible risks include nausea, dizziness, hypoglycemia, and minor discomfort from blood draws.",
        },
        {
          heading: "Confidentiality",
          content:
            "All personal and medical information will remain confidential.",
        },
      ],
    },
    hindi: {
      title: "सूचित सहमति पत्र",
      subtitle: "टाइप 2 मधुमेह उपचार परीक्षण",
      sections: [
        {
          heading: "अध्ययन का उद्देश्य",
          content:
            "आपको टाइप 2 मधुमेह के उपचार परीक्षण में भाग लेने के लिए आमंत्रित किया जाता है।",
        },
      ],
    },
    malayalam: {
      title: "അറിവുള്ള സമ്മത ഫോം",
      subtitle: "ടൈപ്പ് 2 പ്രമേഹ ചികിത്സാ പരീക്ഷണം",
      sections: [
        {
          heading: "പഠനത്തിന്റെ ഉദ്ദേശ്യം",
          content:
            "ടൈപ്പ് 2 പ്രമേഹ ചികിത്സാ പരീക്ഷണത്തിൽ പങ്കെടുക്കാൻ നിങ്ങളെ ക്ഷണിക്കുന്നു.",
        },
      ],
    },
  };

  const selectedPatientData = patients.find(
    (p) => p.id === selectedPatient
  );

  return {
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
  };
};