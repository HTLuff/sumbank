import data from "../data/admin.json";
import Header from "../components/Header";
import Footer from "../components/Footer";

type SvcStatus = "healthy" | "degraded" | "down";
type SyntheticStatus = "ok" | "warn" | "down";

// Formatters
const fmtNum = (n: number) => n.toLocaleString();
const fmtPct = (n: number) => `${n.toFixed(2)}%`;
const fmtMs = (n: number) => `${Math.round(n)} ms`;
const fmtTimeShort = (iso: string) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(iso));
const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));

// Helpers
function durationMinutes(aIso: string, bIso: string) {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  return Math.max(0, Math.round((b - a) / 60000));
}

function badgeColorByStatus(status: SvcStatus | string) {
  if (status === "healthy" || status === "ok")
    return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (status === "degraded" || status === "warn")
    return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-rose-700 bg-rose-50 border-rose-200";
}

function kpiTone(label: string, value: number) {
  // Simple thresholds you can later externalize to config
  switch (label) {
    case "p95LatencyMs":
      return value <= 200
        ? "text-emerald-700"
        : value <= 350
        ? "text-amber-700"
        : "text-rose-700";
    case "errorRatePct":
      return value < 1
        ? "text-emerald-700"
        : value < 3
        ? "text-amber-700"
        : "text-rose-700";
    case "projectorLagSec":
      return value <= 5
        ? "text-emerald-700"
        : value <= 15
        ? "text-amber-700"
        : "text-rose-700";
    case "reconMismatchesToday":
      return value === 0 ? "text-emerald-700" : "text-rose-700";
    default:
      return "text-neutral-900";
  }
}

export default function Admin() {
  const {
    updatedAt,
    kpis,
    slos,
    ledgerConsistency,
    synthetics,
    services,
    incidents,
    recentEvents,
    auditLog,
  } = data;

  const mttrs = incidents
    .filter((i) => i.resolvedAt)
    .map((i) => durationMinutes(i.detectedAt, i.resolvedAt));
  const avgMttr = mttrs.length
    ? Math.round(mttrs.reduce((a, b) => a + b, 0) / mttrs.length)
    : 0;

  const mttds = incidents
    .filter((i) => i.ackAt)
    .map((i) => durationMinutes(i.detectedAt, i.ackAt));
  const avgMttd = mttds.length
    ? Math.round(mttds.reduce((a, b) => a + b, 0) / mttds.length)
    : 0;

  const kpiCards = [
    {
      key: "activeUsers",
      label: "Active users",
      value: fmtNum(kpis.activeUsers),
    },
    {
      key: "p95LatencyMs",
      label: "P95 latency",
      value: fmtMs(kpis.p95LatencyMs),
      tone: kpiTone("p95LatencyMs", kpis.p95LatencyMs),
    },
    {
      key: "errorRatePct",
      label: "Error rate",
      value: fmtPct(kpis.errorRatePct),
      tone: kpiTone("errorRatePct", kpis.errorRatePct),
    },
    {
      key: "apiReqPerMin",
      label: "API req/min",
      value: fmtNum(kpis.apiReqPerMin),
    },
    {
      key: "lambdaInvocationsPerMin",
      label: "Lambda inv/min",
      value: fmtNum(kpis.lambdaInvocationsPerMin),
    },
    {
      key: "ddbReadRCU",
      label: "DDB read RCU",
      value: fmtNum(kpis.ddbReadRCU),
    },
    {
      key: "ddbWriteWCU",
      label: "DDB write WCU",
      value: fmtNum(kpis.ddbWriteWCU),
    },
    {
      key: "projectorLagSec",
      label: "Projector lag",
      value: `${kpis.projectorLagSec}s`,
      tone: kpiTone("projectorLagSec", kpis.projectorLagSec),
    },
    {
      key: "reconMismatchesToday",
      label: "Recon mismatches",
      value: fmtNum(kpis.reconMismatchesToday),
      tone: kpiTone("reconMismatchesToday", kpis.reconMismatchesToday),
    },

    {
      key: "transfersPerMin",
      label: "Transfers/min",
      value: fmtNum(kpis.transfersPerMin),
    },
    {
      key: "transferSuccessRatePct",
      label: "Transfer success",
      value: fmtPct(kpis.transferSuccessRatePct),
    },
    {
      key: "transferRejectedToday",
      label: "Rejected today",
      value: fmtNum(kpis.transferRejectedToday),
    },
  ];

  return (
    <div className="min-h-dvh bg-white text-neutral-900">
      <Header />

      <main className="mx-auto max-w-md px-6 pb-24">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Updated {fmtDateTime(updatedAt)}
        </p>

        {/* Key metrics */}
        <section className="mt-6">
          <h2 className="text-base font-semibold">Key metrics</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {kpiCards.map((k) => (
              <div
                key={k.key}
                className="rounded-xl border border-neutral-200 bg-white p-3 text-center shadow-sm"
              >
                <p
                  className={`text-sm font-semibold ${
                    k.tone ?? "text-neutral-900"
                  }`}
                >
                  {k.value}
                </p>
                <p className="mt-0.5 text-xs text-neutral-600">{k.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reliability and SLOs */}
        <section className="mt-8">
          <h2 className="text-base font-semibold">Reliability & SLOs</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-neutral-600">Uptime (7d)</p>
              <p className="text-lg font-semibold">
                {fmtPct(slos.uptime7dPct)}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-neutral-600">Error budget remaining</p>
              <p
                className={`text-lg font-semibold ${
                  slos.errorBudgetRemainingPct > 70
                    ? "text-emerald-700"
                    : slos.errorBudgetRemainingPct > 40
                    ? "text-amber-700"
                    : "text-rose-700"
                }`}
              >
                {fmtPct(slos.errorBudgetRemainingPct)}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-neutral-600">Burn rate (24h)</p>
              <p
                className={`text-lg font-semibold ${
                  slos.burnRate24h < 1
                    ? "text-emerald-700"
                    : slos.burnRate24h < 2
                    ? "text-amber-700"
                    : "text-rose-700"
                }`}
              >
                {slos.burnRate24h.toFixed(2)}x
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-neutral-600">Avg MTTR</p>
              <p className="text-lg font-semibold">{avgMttr} min</p>
              <p className="mt-1 text-xs text-neutral-600">
                Avg MTTD {avgMttd} min
              </p>
            </div>
          </div>
        </section>

        {/* Ledger consistency */}
        <section className="mt-8">
          <h2 className="text-base font-semibold">Ledger consistency</h2>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm">Discrepancies</p>
              <p
                className={`text-lg font-semibold ${
                  ledgerConsistency.totalDiscrepancies === 0
                    ? "text-emerald-700"
                    : "text-rose-700"
                }`}
              >
                {ledgerConsistency.totalDiscrepancies}
              </p>
              <p className="text-xs text-neutral-600">
                Last check {fmtDateTime(ledgerConsistency.lastCheckAt)}
              </p>
            </div>
            <span
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${badgeColorByStatus(
                ledgerConsistency.totalDiscrepancies === 0 ? "ok" : "down"
              )}`}
            >
              {ledgerConsistency.totalDiscrepancies === 0
                ? "in sync"
                : "mismatch"}
            </span>
          </div>
        </section>

        {/* Service health */}
        <section className="mt-8">
          <h2 className="text-base font-semibold">Service health</h2>
          <ul className="mt-3 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white shadow-sm">
            {services.map((svc) => (
              <li
                key={svc.name}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm font-medium">{svc.name}</span>
                <span
                  className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${badgeColorByStatus(
                    svc.status as SvcStatus
                  )}`}
                >
                  {svc.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Synthetic checks */}
        <section className="mt-8">
          <h2 className="text-base font-semibold">Synthetic checks</h2>
          <ul className="mt-3 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white shadow-sm">
            {synthetics.map((s, i) => (
              <li
                key={`${s.endpoint}-${s.region}-${i}`}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {s.endpoint} • {s.region}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-600">
                    Latency {fmtMs(s.latencyMs)}
                  </p>
                </div>
                <span
                  className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${badgeColorByStatus(
                    s.status as SyntheticStatus
                  )}`}
                >
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Incidents */}
        <section className="mt-8">
          <h2 className="text-base font-semibold">Recent incidents</h2>
          <ul className="mt-3 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white shadow-sm">
            {incidents.map((inc) => {
              const mttr = inc.resolvedAt
                ? durationMinutes(inc.detectedAt, inc.resolvedAt)
                : null;
              const mttd = inc.ackAt
                ? durationMinutes(inc.detectedAt, inc.ackAt)
                : null;
              return (
                <li key={inc.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{inc.id}</p>
                    <span
                      className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${
                        inc.severity === "high"
                          ? "text-rose-700 bg-rose-50 border-rose-200"
                          : inc.severity === "medium"
                          ? "text-amber-700 bg-amber-50 border-amber-200"
                          : "text-neutral-700 bg-neutral-50 border-neutral-200"
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-700">{inc.summary}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                    <span>Detected {fmtTimeShort(inc.detectedAt)}</span>
                    {inc.ackAt && (
                      <span>
                        Ack {fmtTimeShort(inc.ackAt)} (MTTD {mttd}m)
                      </span>
                    )}
                    {inc.resolvedAt && (
                      <span>
                        Resolved {fmtTimeShort(inc.resolvedAt)} (MTTR {mttr}m)
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Recent system events */}
        <section className="mt-8">
          <h2 className="text-base font-semibold">Recent system events</h2>
          <ul className="mt-3 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white shadow-sm">
            {recentEvents.map((evt) => (
              <li key={evt.ts} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{evt.type}</p>
                  <span
                    className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${
                      evt.status === "SETTLED"
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                        : evt.status === "PENDING"
                        ? "text-amber-700 bg-amber-50 border-amber-200"
                        : evt.status === "REJECTED"
                        ? "text-rose-700 bg-rose-50 border-rose-200"
                        : "text-neutral-700 bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-neutral-600">
                  <span>
                    {evt.accountId !== "-" ? `Acct ${evt.accountId}` : "System"}
                  </span>
                  <span>{fmtTimeShort(evt.ts)}</span>
                </div>
                {evt.amount !== 0 && (
                  <p className="mt-1 text-sm font-medium">
                    {evt.amount < 0 ? "-" : "+"}£
                    {Math.abs(evt.amount).toFixed(2)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Audit log */}
        <section className="mt-8 mb-4">
          <h2 className="text-base font-semibold">Audit log</h2>
          <ul className="mt-3 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white shadow-sm">
            {auditLog.map((a, i) => (
              <li
                key={i}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.action}</p>
                  <p className="mt-0.5 text-xs text-neutral-600">{a.admin}</p>
                </div>
                <span className="text-xs text-neutral-600">
                  {fmtTimeShort(a.ts)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
