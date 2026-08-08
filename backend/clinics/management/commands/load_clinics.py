import csv
from pathlib import Path
from django.core.management.base import BaseCommand
from clinics.models import Clinic

DEFAULT_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "clean_facilities.csv"


class Command(BaseCommand):
    help = "Loads cleaned MOH facility data from CSV into the Clinic table."

    def add_arguments(self, parser):
        parser.add_argument("--file", type=str, default=str(DEFAULT_PATH))

    def handle(self, *args, **options):
        path = Path(options["file"])
        if not path.exists():
            self.stderr.write(self.style.ERROR(f"File not found: {path}"))
            return

        Clinic.objects.all().delete()

        rows, skipped = [], 0
        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get("STATUS") != "BUKA" or row.get("SEKTOR") != "AWAM":
                    skipped += 1
                    continue

                rows.append(Clinic(
                    facility_code=row["KOD_FASILITI"].strip(),
                    name=row["NAMA"].strip(),
                    category=row["KATEGORI_FASILITI"].strip(),
                    facility_subtype=row.get("JENIS_FASILITI", "").strip(),
                    state=row["NEGERI"].strip().title(),
                    district=row.get("DAERAH", "").strip(),
                    address=row["ALAMAT"].strip(),
                    postcode=row.get("POSKOD", "").strip(),
                ))

        Clinic.objects.bulk_create(rows, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(rows)} clinics, skipped {skipped}."))