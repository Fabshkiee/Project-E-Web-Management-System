"use client";

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="mb-8 flex flex-col">
      <h1 className="font-teko font-bold text-[36px] leading-none text-foreground uppercase tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="font-lexend font-medium text-[15px] text-secondary opacity-70 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}
