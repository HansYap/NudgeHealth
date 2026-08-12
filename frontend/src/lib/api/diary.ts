import type { Mood } from "../../types/app";
import { clearAuthTokens, getAuthTokens } from "../auth/tokens";
import { ApiError } from "./auth";
import { API_BASE_URL } from "./config";

export interface DiaryEntryResponse {
  id: number;
  feeling: Mood;
  note: string;
  logged_at: string;
}

export interface ReassessmentPromptResponse {
  should_prompt_reassessment: boolean;
  not_great_count: number;
}

export async function listDiaryEntries() {
  return authenticatedRequest<DiaryEntryResponse[]>("/diary/");
}

export async function createDiaryEntry(input: { feeling: Mood; note: string }) {
  return authenticatedRequest<DiaryEntryResponse>("/diary/", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getReassessmentPrompt() {
  return authenticatedRequest<ReassessmentPromptResponse>(
    "/diary/reassessment-check/"
  );
}

async function authenticatedRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const tokens = getAuthTokens();
  if (!tokens) {
    throw new ApiError(401, { detail: "Authentication required." });
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokens.access}`,
      ...init.headers,
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
