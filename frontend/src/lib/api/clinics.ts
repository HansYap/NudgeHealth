import { clearAuthTokens, getAuthTokens } from "../auth/tokens";
import { ApiError } from "./auth";

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

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "https://nudgehealth-3g61.onrender.com/api";

export async function listClinics(state: string) {
  const params = new URLSearchParams({ state });
  return authenticatedRequest<ClinicResponse[]>(`/clinics/?${params}`);
}

async function authenticatedRequest<T>(path: string): Promise<T> {
  const tokens = getAuthTokens();
  if (!tokens) {
    throw new ApiError(401, { detail: "Authentication required." });
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokens.access}`,
    },
  });
  const payload = await parseJson(response);

  if (!response.ok) {
    if (response.status === 401) clearAuthTokens();
    throw new ApiError(response.status, payload);
  }

  return payload as T;
}

function parseJson(response: Response) {
  return response.text().then((text) => (text ? JSON.parse(text) : null));
}
