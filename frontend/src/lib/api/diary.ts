import type { Mood } from "../../types/app";
import { authenticatedRequest } from "./client";

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
