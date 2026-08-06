import { Lock } from "lucide-react";

export interface SecurityNoteProps {
  message: string;
}

/**
 * Small reassurance line under the form (lock icon + message),
 * e.g. "Your health data is encrypted and stays private".
 */
export function SecurityNote({ message }: SecurityNoteProps) {
  return (
    <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-sm text-slate-500">
      <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}
