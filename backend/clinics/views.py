from django.db.models import Q
from rest_framework import permissions
from rest_framework.generics import ListAPIView
from .models import Clinic
from .serializers import ClinicSerializer

STATE_ALIASES = {
    "WP Kuala Lumpur": "Wilayah Persekutuan Kuala Lumpur",
    "Kuala Lumpur": "Wilayah Persekutuan Kuala Lumpur",
    "WP Labuan": "Wilayah Persekutuan Labuan",
    "Labuan": "Wilayah Persekutuan Labuan",
    "WP Putrajaya": "Wilayah Persekutuan Putrajaya",
    "Putrajaya": "Wilayah Persekutuan Putrajaya",
}


class ClinicListView(ListAPIView):
    serializer_class = ClinicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Clinic.objects.all()

        state = self.request.query_params.get("state")
        if state:
            state_values = {state, STATE_ALIASES.get(state, state)}
            state_filter = Q()
            for state_value in state_values:
                state_filter |= Q(state__iexact=state_value)
            qs = qs.filter(state_filter)

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__iexact=category)

        return qs
