import csv
from pathlib import Path
from django.core.management.base import BaseCommand
from clinics.models import Clinic

DEFAULT_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "moh_facilities.csv"


def _clean(value):
    return value.strip() if value else ""


class Command(BaseCommand):
    help = "Loads MOH facility data from CSV into the Clinic table."

    def add_arguments(self, parser):
        parser.add_argument("--file", type=str, default=str(DEFAULT_PATH))

    def handle(self, *args, **options):
        path = Path(options["file"])
        if not path.exists():
            self.stderr.write(self.style.ERROR(f"File not found: {path}"))
            return

        Clinic.objects.all().delete()  # fully external reference data, safe to wipe and reload

        rows, skipped = [], 0
        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if _clean(row.get("STATUS")) != "BUKA":   # skip closed facilities
                    skipped += 1
                    continue
                if not row.get("KOD_FASILITI") or not row.get("NEGERI"):
                    skipped += 1
                    continue

                lat = _clean(row.get("LATITUD"))
                lon = _clean(row.get("LONGITUD"))

                rows.append(Clinic(
                    facility_code=_clean(row["KOD_FASILITI"]),
                    name=_clean(row.get("NAMA")),
                    category=_clean(row.get("KATEGORI_FASILITI")),
                    facility_subtype=_clean(row.get("JENIS_FASILITI")),
                    sector=_clean(row.get("SEKTOR")),
                    state=_clean(row.get("NEGERI")).title(),   # JOHOR -> Johor, matches DOSM casing
                    district=_clean(row.get("DAERAH")),
                    address=_clean(row.get("ALAMAT")),
                    town=_clean(row.get("BANDAR")),
                    postcode=_clean(row.get("POSKOD")),
                    latitude=lat or None,
                    longitude=lon or None,
                ))

        Clinic.objects.bulk_create(rows, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(rows)} clinics, skipped {skipped}."))