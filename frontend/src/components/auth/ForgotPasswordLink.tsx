export interface ForgotPasswordLinkProps {
  label: string;
  href?: string;
  onClick?: () => void;
}

/**
 * Right-aligned "Forgot password?" link placed under the password field.
 */
export function ForgotPasswordLink({
  label,
  href,
  onClick,
}: ForgotPasswordLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="rounded text-sm font-semibold text-brand-700 outline-none
        transition-colors duration-150 hover:text-brand-950 hover:underline
        focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
    >
      {label}
    </a>
  );
}
