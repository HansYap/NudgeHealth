from django.db import models


class Clinic(models.Model):
    facility_code = models.CharField(max_length=30, unique=True)   # KOD_FASILITI
    name = models.CharField(max_length=255)                        # NAMA
    category = models.CharField(max_length=100)                    # KATEGORI_FASILITI — e.g. HOSPITAL
    facility_subtype = models.CharField(max_length=150, blank=True) # JENIS_FASILITI
    sector = models.CharField(max_length=20, blank=True)            # SEKTOR — AWAM (public) / SWASTA (private)
    state = models.CharField(max_length=40)                         # NEGERI, normalized to title case
    district = models.CharField(max_length=60, blank=True)          # DAERAH
    address = models.TextField()                                    # ALAMAT
    town = models.CharField(max_length=100, blank=True)             # BANDAR
    postcode = models.CharField(max_length=10, blank=True)          # POSKOD
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["state"]), models.Index(fields=["category"])]

    def __str__(self):
        return f"{self.name} ({self.state})"