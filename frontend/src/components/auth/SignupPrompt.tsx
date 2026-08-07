export interface SignupPromptProps {
  promptText: string;
  ctaText: string;
  onCtaClick?: () => void;
  href?: string;
}

/**
 * "New here? Create an account" row shown under the login form.
 */
export function SignupPrompt({
  promptText,
  ctaText,
  onCtaClick,
  href,
}: SignupPromptProps) {
  return (
    <p className="text-center text-sm text-slate-500">
      {promptText}{" "}
      <a
        href={href}
        onClick={onCtaClick}
        className="rounded font-semibold text-brand-700 outline-none
          transition-colors duration-150 hover:text-brand-950 hover:underline
          focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
      >
        {ctaText}
      </a>
    </p>
  );
}
