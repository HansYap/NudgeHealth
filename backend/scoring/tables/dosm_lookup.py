from scoring.models import DosmLifeExpectancy

AGE_BANDS = [0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]


def get_dosm_e_x(age: int, sex: str, state: str) -> float:
    """Returns e_x for the age band at or below the given age.
    e.g. age 43 -> uses the age-40 row. Age 85 -> uses the age-80 row (oldest available)."""
    band = max((b for b in AGE_BANDS if b <= age), default=0)
    row = DosmLifeExpectancy.objects.get(age_band=band, sex=sex, state=state)
    return float(row.e_x)