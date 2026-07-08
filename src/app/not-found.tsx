import Link from "next/link";
import { strings } from "@/presentation/strings";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-4xl font-black text-primary">{strings.notFound.code}</p>
      <p className="text-lg text-foreground">{strings.notFound.title}</p>
      <Link
        href="/"
        className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {strings.notFound.back}
      </Link>
    </div>
  );
}
