export interface FormHeaderProps {
  title: string;
  subtitle: string;
}

/**
 * Title + subtitle block at the top of the login form.
 */
export function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <header>
      <h2 className="font-sora text-h2 text-brand-800">{title}</h2>
      <p className="mt-2 text-body text-slate-500">{subtitle}</p>
    </header>
  );
}
