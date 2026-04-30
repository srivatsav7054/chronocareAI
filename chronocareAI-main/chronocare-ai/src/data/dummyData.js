export const dummyUserData = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  bloodGroup: "O+",
  healthScore: 82,
  allergies: ["Penicillin", "Peanuts", "Shellfish"],
  chronicConditions: ["Hypertension", "Type 2 Diabetes"],
  currentMedications: [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
  ],
};

export const dummyReports = [
  {
    id: 1,
    title: "Annual Health Checkup",
    date: "2024-01-15",
    type: "General",
    status: "Reviewed",
  },
  {
    id: 2,
    title: "Blood Work Results",
    date: "2024-01-10",
    type: "Lab",
    status: "Reviewed",
  },
  {
    id: 3,
    title: "Cardiogram Test",
    date: "2024-01-05",
    type: "Diagnostic",
    status: "Pending",
  },
];

export const dummyTimelineEvents = [
  {
    id: 1,
    date: "2015-03-20",
    title: "Hypertension Diagnosed",
    description: "Initial diagnosis of high blood pressure. Started on medication.",
    type: "diagnosis",
  },
  {
    id: 2,
    date: "2017-06-10",
    title: "Type 2 Diabetes Diagnosed",
    description: "Discovered during routine checkup. Lifestyle changes recommended.",
    type: "diagnosis",
  },
  {
    id: 3,
    date: "2019-11-05",
    title: "Surgery: Appendectomy",
    description: "Minor surgical procedure completed successfully.",
    type: "surgery",
  },
  {
    id: 4,
    date: "2021-04-15",
    title: "Medication Adjustment",
    description: "Dosage of Lisinopril increased for better BP control.",
    type: "treatment",
  },
  {
    id: 5,
    date: "2023-08-22",
    title: "Vaccination: Flu Shot",
    description: "Annual flu vaccination completed.",
    type: "vaccination",
  },
  {
    id: 6,
    date: "2024-01-15",
    title: "Annual Health Checkup",
    description: "Comprehensive annual health assessment. All vitals normal.",
    type: "checkup",
  },
];

export const dummyHealthTrendData = [
  { month: "Jan", healthScore: 75, bmi: 26.5, bloodPressure: 135 },
  { month: "Feb", healthScore: 77, bmi: 26.2, bloodPressure: 133 },
  { month: "Mar", healthScore: 78, bmi: 25.9, bloodPressure: 131 },
  { month: "Apr", healthScore: 79, bmi: 25.5, bloodPressure: 129 },
  { month: "May", healthScore: 80, bmi: 25.2, bloodPressure: 128 },
  { month: "Jun", healthScore: 81, bmi: 24.8, bloodPressure: 126 },
  { month: "Jul", healthScore: 82, bmi: 24.5, bloodPressure: 125 },
];
