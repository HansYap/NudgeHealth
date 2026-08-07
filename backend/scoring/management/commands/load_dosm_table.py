import csv
from pathlib import Path
from django.core.management.base import BaseCommand
from scoring.models import DosmLifeExpectancy

# CSV uses full words, our model uses single letters — map between them
SEX_MAP = {"Male": "M", "Female": "F"}

DEFAULT_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "dosm_life_expectancy.csv"


class Command(BaseCommand):
    help = "Loads the DOSM life expectancy table from CSV into the database."

    def add_arguments(self, parser):
        parser.add_argument("--file", type=str, default=str(DEFAULT_PATH))

    def handle(self, *args, **options):
        path = Path(options["file"])
        if not path.exists():
            self.stderr.write(self.style.ERROR(f"File not found: {path}"))
            return

        DosmLifeExpectancy.objects.all().delete()  # this table is 100% external data — safe to wipe and reload

        rows = []
        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(DosmLifeExpectancy(
                    age_band=int(row["Age"]),
                    e_x=row["ex"],
                    sex=SEX_MAP[row["Sex"]],
                    state=row["State"],
                ))

        DosmLifeExpectancy.objects.bulk_create(rows)
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(rows)} DOSM rows."))