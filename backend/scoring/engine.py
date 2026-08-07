from dataclasses import dataclass

from scoring.tables.dosm_lookup import get_dosm_e_x
from scoring.tables.smoking_yll import SMOKING_YLL
from scoring.tables.bmi_activity_yll import BMI_ACTIVITY_YLL


def categorize_bmi(height_cm, weight_kg) -> str:
    height_m = float(height_cm) / 100
    bmi = float(weight_kg) / (height_m ** 2)
    if bmi < 25.0:
        # NOTE: covers <18.5 (underweight) too — no separate row exists in the
        # source table. Flagged as an open gap, see chat / your writeup.
        return "normal"
    elif bmi < 30.0:
        return "overweight"
    elif bmi < 35.0:
        return "obese_1"
    return "obese_2_plus"


def determine_risk_band(score: int) -> str:
    if score >= 80:
        return "low"
    elif score >= 50:
        return "moderate"
    return "high"


def _direction_for(delta: float):
    if delta < 0:
        return "increases_risk"
    elif delta > 0:
        return "decreases_risk"   # not possible with today's tables, but supported if that changes
    return None                    # exactly 0.0 — neutral, no tile shown


@dataclass
class ScoreResult:
    e_x: float
    weight: float
    delta_yll_smoking: float
    delta_yll_activity_bmi: float
    delta_yll_total: float
    raw_score: float
    clamped: bool
    modifiable_lifestyle_score: int
    risk_band: str
    bmi_category: str
    score_factors: list

    @property
    def calculation_trace(self) -> dict:
        """Internal only — this is what goes in RiskAssessment.calculation_trace,
        NEVER in a public serializer."""
        return {
            "e_x": self.e_x,
            "weight": round(self.weight, 4),
            "delta_yll_smoking": self.delta_yll_smoking,
            "delta_yll_activity_bmi": self.delta_yll_activity_bmi,
            "delta_yll_total": self.delta_yll_total,
            "raw_score": round(self.raw_score, 2),
            "clamped": self.clamped,
            "formula_version": "dosm_weighted_v1",
        }


class ScoreEngine:
    @staticmethod
    def calculate(*, age, sex, state, smoking_status, height_cm, weight_kg, activity_level) -> ScoreResult:
        e_x = get_dosm_e_x(age, sex, state)
        bmi_category = categorize_bmi(height_cm, weight_kg)

        smoking_entry = SMOKING_YLL[smoking_status]
        bmi_activity_entry = BMI_ACTIVITY_YLL[(bmi_category, activity_level)]

        delta_yll_smoking = smoking_entry["delta_yll"]
        delta_yll_activity_bmi = bmi_activity_entry["delta_yll"]
        delta_yll_total = delta_yll_smoking + delta_yll_activity_bmi

        weight = 100 / e_x
        raw_score = 100 + (weight * delta_yll_total)
        final_score = max(10, min(100, round(raw_score)))
        clamped = final_score != round(raw_score)

        score_factors = []
        smoking_dir = _direction_for(delta_yll_smoking)
        if smoking_dir:
            score_factors.append({
                "label": smoking_entry["label"], "direction": smoking_dir, "category": "smoking",
            })
        bmi_dir = _direction_for(delta_yll_activity_bmi)
        if bmi_dir:
            score_factors.append({
                "label": bmi_activity_entry["label"], "direction": bmi_dir, "category": "bmi_activity",
            })

        return ScoreResult(
            e_x=e_x, weight=weight,
            delta_yll_smoking=delta_yll_smoking, delta_yll_activity_bmi=delta_yll_activity_bmi,
            delta_yll_total=delta_yll_total, raw_score=raw_score, clamped=clamped,
            modifiable_lifestyle_score=final_score, risk_band=determine_risk_band(final_score),
            bmi_category=bmi_category, score_factors=score_factors,
        )