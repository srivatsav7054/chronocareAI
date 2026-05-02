import { HealthScore } from "../models/HealthScore.js";
import { Report } from "../models/Report.js";
import { User } from "../models/User.js";

// ─── Scoring algorithm ───────────────────────────────────────────────────────
// Score = 100 minus penalty points, clamped 0–100
export const computeScore = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  let score = 100;
  const breakdown = {
    chronicConditionsPenalty: 0,
    allergyPenalty: 0,
    agePenalty: 0,
    bmiPenalty: 0,
    reportRiskPenalty: 0,
  };

  // 1. Chronic conditions  (−8 each)
  const conditionCount = (user.chronicConditions || []).length;
  breakdown.chronicConditionsPenalty = conditionCount * 8;

  // 2. Allergies (−3 each, max −12)
  const allergyPenalty = Math.min((user.allergies || []).length * 3, 12);
  breakdown.allergyPenalty = allergyPenalty;

  // 3. Age
  if (user.dateOfBirth) {
    const age = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();
    if (age >= 65) breakdown.agePenalty = 10;
    else if (age >= 50) breakdown.agePenalty = 5;
  }

  // 4. BMI (rough parse from stored strings like "145 lbs" / "5'6\"")
  try {
    const weightLbs = parseFloat((user.weight || "").replace(/[^0-9.]/g, ""));
    const heightRaw = (user.height || "").replace(/[^0-9'".]/g, "");
    let heightM = null;
    if (heightRaw.includes("'")) {
      const [ft, inch] = heightRaw.split("'");
      heightM = (parseFloat(ft) * 12 + parseFloat(inch || 0)) * 0.0254;
    } else if (parseFloat(heightRaw) > 0) {
      heightM = parseFloat(heightRaw) / 100; // assume cm
    }
    if (weightLbs > 0 && heightM && heightM > 0) {
      const weightKg = weightLbs * 0.453592;
      const bmi = weightKg / (heightM * heightM);
      if (bmi < 18.5 || bmi > 30) breakdown.bmiPenalty = 8;
      else if (bmi > 25) breakdown.bmiPenalty = 4;
    }
  } catch (_) { /* skip BMI if parsing fails */ }

  // 5. Recent report risk (last 3 reports, past 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const recentReports = await Report.find({
    userId,
    createdAt: { $gte: sixMonthsAgo },
  }).sort({ createdAt: -1 }).limit(3);

  if (recentReports.length === 0) {
    breakdown.reportRiskPenalty = 5; // no check-ups penalty
  } else {
    for (const r of recentReports) {
      const sev = (r.analysisResult?.severity || "").toLowerCase();
      if (sev === "critical") { breakdown.reportRiskPenalty += 15; break; }
      if (sev === "severe") { breakdown.reportRiskPenalty += 10; break; }
      if (sev === "moderate") { breakdown.reportRiskPenalty += 5; break; }
    }
  }

  // Sum all penalties
  const totalPenalty = Object.values(breakdown).reduce((a, b) => a + b, 0);
  score = Math.max(0, Math.min(100, 100 - totalPenalty));

  // ─── Update / create HealthScore record ───────────────────────────────────
  const now = new Date();
  const monthLabel = now.toLocaleString("en-US", { month: "short", year: "2-digit" });

  const existing = await HealthScore.findOne({ userId });
  let trend = existing?.trend || [];

  // Update or append current month
  const lastEntry = trend[trend.length - 1];
  if (lastEntry?.month === monthLabel) {
    trend[trend.length - 1].score = score;
  } else {
    trend.push({ month: monthLabel, score });
    if (trend.length > 6) trend = trend.slice(-6); // keep last 6 months
  }

  const healthScore = await HealthScore.findOneAndUpdate(
    { userId },
    {
      score,
      breakdown,
      trend,
      lastComputed: now,
    },
    { upsert: true, new: true }
  );

  // Also mirror score onto User document for quick access
  await User.findByIdAndUpdate(userId, { healthScore: score });

  return healthScore;
};

// ─── HTTP handlers ────────────────────────────────────────────────────────────
export const getHealthScore = async (req, res) => {
  try {
    let healthScore = await HealthScore.findOne({ userId: req.userId });
    if (!healthScore) {
      healthScore = await computeScore(req.userId);
    }
    return res.json({ healthScore });
  } catch (err) {
    console.error("Get health score error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const recomputeHealthScore = async (req, res) => {
  try {
    const healthScore = await computeScore(req.userId);
    return res.json({ healthScore });
  } catch (err) {
    console.error("Compute health score error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const predictScore = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const currentScore = user.healthScore || 100;
    const age = user.dateOfBirth ? (new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()) : 30;
    const conditions = user.chronicConditions || [];

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const reports = await Report.find({
      userId: req.userId,
      createdAt: { $gte: sixMonthsAgo }
    }).sort({ createdAt: -1 }).limit(5);

    const events = await TimelineEvent.find({
      userId: req.userId,
      date: { $gte: sixMonthsAgo }
    }).sort({ date: -1 }).limit(10);

    const recent_reports = reports.map(r => ({
      diagnosis: r.analysisResult?.diagnosis || "Unknown",
      severity: r.analysisResult?.severity || "Unknown"
    }));

    const recent_events = events.map(e => ({
      type: e.type || "Other",
      title: e.title || "Medical Event"
    }));

    // Call Python AI service
    const axios = (await import("axios")).default;
    const aiResponse = await axios.post("http://127.0.0.1:8000/predict-score", {
      current_score: currentScore,
      age,
      conditions,
      recent_reports,
      recent_events
    });

    return res.json({ prediction: aiResponse.data });

  } catch (err) {
    console.error("Predict score error:", err);
    return res.status(500).json({ message: "Failed to generate AI forecast" });
  }
};
