from rest_framework import permissions
from rest_framework.generics import ListAPIView
from .models import Clinic
from .serializers import ClinicSerializer


class ClinicListView(ListAPIView):
    serializer_class = ClinicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Clinic.objects.filter(sector="AWAM")   # public facilities only, matches your rule text (MOH/Klinik Kesihatan)

        state = self.request.query_params.get("state")
        if state:
            qs = qs.filter(state__iexact=state)

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__iexact=category)

        return qs