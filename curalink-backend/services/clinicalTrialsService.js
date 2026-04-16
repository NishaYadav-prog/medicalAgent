import axios from "axios";

export const fetchClinicalTrials = async (disease) => {
  try {
    const url = "https://clinicaltrials.gov/api/v2/studies";

    const response = await axios.get(url, {
      params: {
        "query.cond": disease,
        pageSize: 10,
        format: "json",
      },
    });

    const studies = response.data.studies || [];

    const trials = studies.map((study) => {
      const protocol = study.protocolSection;

      return {
        title: protocol?.identificationModule?.briefTitle || "No title",
        status: protocol?.statusModule?.overallStatus || "Unknown",
        eligibility:
          protocol?.eligibilityModule?.eligibilityCriteria || "Not specified",
        location:
          protocol?.contactsLocationsModule?.locations?.[0]?.facility ||
          "Not specified",
        contact:
          protocol?.contactsLocationsModule?.centralContacts?.[0]?.name ||
          "Not available",
        source: "ClinicalTrials",
      };
    });

    return trials;
  } catch (error) {
    console.error("Clinical Trials fetch error:", error.message);
    return [];
  }
};
