import type { ClinicOption } from "../../types/app";
import type { ClinicResponse } from "../api/clinics";

export function clinicsToOptions(clinics: ClinicResponse[]): ClinicOption[] {
  return clinics.map((clinic) => {
    const location = [clinic.district, clinic.postcode, clinic.state]
      .filter(Boolean)
      .join(", ");

    return {
      id: String(clinic.id),
      category: "check",
      title: clinic.name,
      meta: [clinic.category, clinic.facility_subtype, location]
        .filter(Boolean)
        .join(" - "),
      query: [clinic.name, clinic.address, clinic.district, clinic.state]
        .filter(Boolean)
        .join(" "),
    };
  });
}
