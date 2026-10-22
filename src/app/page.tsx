import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">Truth</div>
          <nav className="flex gap-6 text-sm text-slate-300">
            <Link href="/login">Login</Link>
          </nav>
        </header>

        <section className="mt-20 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-violet-500/50 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-violet-200">
              Payment clarity
            </span>
            <h1 className="mt-6 text-5xl font-bold tracking-tight text-white md:text-6xl">
              Track every payment with confidence.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Truth gives you a clearer view of customers, invoices, and outstanding balances in one simple dashboard.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/login"
                className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-500"
              >
                Get started
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-slate-700 px-6 py-3 font-medium text-slate-200 transition hover:border-slate-500"
              >
                View dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-soft">
            <div className="grid gap-4">
              <div className="rounded-2xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">Monthly revenue</p>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-3xl font-bold">$48.2k</span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">
                    +12.8%
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-800 p-4">
                  <p className="text-sm text-slate-400">Invoices</p>
                  <p className="mt-2 text-2xl font-bold">248</p>
                </div>
                <div className="rounded-2xl bg-slate-800 p-4">
                  <p className="text-sm text-slate-400">Collected</p>
                  <p className="mt-2 text-2xl font-bold">92%</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <div className="mb-3 flex justify-between text-sm text-slate-300">
                  <span>Outstanding</span>
                  <span>$14.8k</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[68%] rounded-full bg-violet-500" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
