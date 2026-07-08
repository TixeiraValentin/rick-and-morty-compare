import Link from "next/link";
import { dictionaries } from "@/presentation/i18n/dictionaries";

export default function NotFound() {
  const t = dictionaries.es;

  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-4xl font-black text-primary">{t.notFound.code}</p>
      <p className="text-lg text-foreground">{t.notFound.title}</p>
      <Link
        href="/"
        className="cursor-pointer rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {t.notFound.back}
      </Link>
    </div>
  );
}
