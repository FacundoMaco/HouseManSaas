import { NewLoadForm } from "@/components/NewLoadForm";

export default function NewLoadPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          HouseMen
        </p>
        <h1 className="text-xl font-semibold text-zinc-900">
          Nueva carga
        </h1>
      </header>
      <NewLoadForm />
    </div>
  );
}
