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
      <h2 className="text-[28px] font-bold leading-tight text-ink-900 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-base leading-relaxed text-slate-500">
        {subtitle}
      </p>
    </header>
  );
}
