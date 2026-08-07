from .models import ActionPlanItem
from .rules.action_rules import ACTION_RULES


def _build_item(assessment, rule_code):
    rule = ACTION_RULES[rule_code]
    return ActionPlanItem(
        assessment=assessment, rule_code=rule_code,
        title_en=rule["title_en"], title_ms=rule["title_ms"],
        detail_en=rule["detail_en"], detail_ms=rule["detail_ms"],
        requires_clinic_visit=rule["requires_clinic_visit"],
        target_facility_type=rule["target_facility_type"],
    )


class RecommendationEngine:
    @staticmethod
    def generate(assessment, *, delta_yll_smoking: float, delta_yll_activity_bmi: float) -> list:
        """assessment must already be saved (has a pk) before calling this.
        delta_yll_* come from the same ScoreEngine call — used only to decide
        rank order, never stored on ActionPlanItem itself."""
        items = []

        if assessment.smoking_status == "current":
            items.append(_build_item(assessment, "SMOKING_CURRENT_MQUIT"))
        if assessment.bmi_category in ("obese_1", "obese_2_plus"):
            items.append(_build_item(assessment, "BMI_OBESE_DIETITIAN"))
        if assessment.activity_level == "inactive":
            items.append(_build_item(assessment, "ACTIVITY_INACTIVE_TARGET"))
        if assessment.high_sodium:
            items.append(_build_item(assessment, "HIGH_SODIUM_DASH"))
        if assessment.low_fruit_veg:
            items.append(_build_item(assessment, "LOW_FRUIT_VEG_INCREASE"))
        if not assessment.screened_past_2yrs:
            items.append(_build_item(assessment, "SCREENING_BASELINE"))
        if assessment.has_diabetes:
            items.append(_build_item(assessment, "DIABETES_ANNUAL_SCREENING"))
        if assessment.has_hypertension:
            items.append(_build_item(assessment, "HYPERTENSION_BP_LOG"))
        if assessment.has_high_cholesterol:
            items.append(_build_item(assessment, "CHOLESTEROL_LIPID_PANEL"))

        # rank the two data-backed groups by magnitude — bigger YLL cost = rank 1
        rank_groups = {"smoking": abs(delta_yll_smoking), "activity_bmi": abs(delta_yll_activity_bmi)}
        ordered = sorted(rank_groups.items(), key=lambda x: x[1], reverse=True)
        rank_by_group = {group: rank for rank, (group, _) in enumerate(ordered, start=1)}

        for item in items:
            group = ACTION_RULES[item.rule_code]["rank_group"]
            if group is not None:
                item.is_priority_ranked = True
                item.priority_rank = rank_by_group[group]

        return items