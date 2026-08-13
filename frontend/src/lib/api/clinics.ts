import { authenticatedRequest } from "./client";

export interface ClinicResponse {
  id: number;
  name: string;
  category: string;
  facility_subtype: string;
  address: string;
  district: string;
  postcode: string;
  state: string;
}

export async function listClinics(state: string) {
  const params = new URLSearchParams({ state });
  return authenticatedRequest<ClinicResponse[]>(`/clinics/?${params}`);
}
