import React, { useEffect, useState } from "react";

export default function ReportPanel({ backendBase = "http://localhost:5256" }) {
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${backendBase}/health/report`);
      const data = await res.json();
      setReport(data);
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchReport();
    const id = setInterval(fetchReport, 5000);
    return () => clearInterval(id);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          right: 16,
          bottom: 0,
          zIndex: 999,
          background: "linear-gradient(135deg,#ffd166,#fca311)",
          color: "#5c1a1b",
          border: "none",
          borderRadius: 14,
          padding: "10px 14px",
          fontWeight: "700",
          boxShadow: "0 8px 18px rgba(0,0,0,.15)",
          cursor: "pointer"
        }}
        title="Arka plan raporu"
      >
        📊 Rapor
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.35)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(900px, 92vw)",
              maxHeight: "80vh",
              overflow: "auto",
              background: "rgba(255,255,255,.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,.6)",
              boxShadow: "0 8px 26px rgba(0,0,0,.2)",
              borderRadius: 16,
              padding: 18
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>Sunucu Raporu</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={fetchReport}>Yenile</button>
                <button onClick={() => setOpen(false)}>Kapat</button>
              </div>
            </div>

            {loading && <div>Yükleniyor…</div>}
            {err && <div style={{ color: "crimson" }}>{err}</div>}

            {report && (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  background: "rgba(0,0,0,.05)",
                  padding: 12,
                  borderRadius: 10
                }}
              >
{JSON.stringify(report, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </>
  );
}
