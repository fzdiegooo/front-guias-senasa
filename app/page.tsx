"use client";

import { useState, useEffect } from "react";
import { AGRICULTORES, GUIA_BASE, TOTAL_REGISTROS, Agricultor } from "./data/agricultores";

interface Item {
  id: string;
  item: string;
  cantidad: string;
  descripcion: string;
  producto: string;
  detalle: string;
}

/* ─── Editable inline input ─────────────────────────────────────────── */
function Editable({
  value,
  onChange,
  placeholder = "",
  className = "",
  align = "left",
  readOnly = false,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
  align?: "left" | "center" | "right";
  readOnly?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      style={{ textAlign: align }}
      className={`bg-transparent outline-none w-full text-sm font-mono px-1 py-0.5
        ${readOnly
          ? "text-[#a8c4b0] cursor-default select-all"
          : "text-[#dce8e0] placeholder-[#3a4e40] border-b border-dotted border-[#3a4e40] focus:border-solid focus:border-[#4a7c59] transition-colors"
        } ${className}`}
    />
  );
}

/* ─── Field row: label + editable ───────────────────────────────────── */
function Field({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center border-b border-[#263428] px-2 py-1.5 gap-2 min-h-[34px]">
      <span className="font-semibold whitespace-nowrap text-[#6a9478] text-[12px] shrink-0">{label}</span>
      <Editable value={value} onChange={onChange} readOnly={readOnly} placeholder={placeholder} />
    </div>
  );
}

/* ─── Table header cell ─────────────────────────────────────────────── */
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border border-[#263428] font-bold py-1 px-2 text-center text-[11px] tracking-wider text-[#7aaa88]">
      {children}
    </th>
  );
}

/* ─── Table body cell ───────────────────────────────────────────────── */
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`border border-[#263428] p-0 ${className}`}>{children}</td>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  /* Guide search */
  const [serieGuia] = useState("001");
  const [nroGuia, setNroGuia] = useState("3927");
  const [agricultor, setAgricultor] = useState<Agricultor | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  /* Form fields */
  const [fecha, setFecha] = useState("");
  const [fletero, setFletero] = useState("ELMER ORE");
  const [placa, setPlaca] = useState("C5P-799");
  const [organico, setOrganico] = useState(true);
  const [globalGap, setGlobalGap] = useState(true);
  const [nombreNativa, setNombreNativa] = useState("VARGAS");
  const [nombreTransportista, setNombreTransportista] = useState("ELMER ORE");

  /* Items */
  const [items, setItems] = useState<Item[]>([
    { id: "1", item: "01", cantidad: "230", descripcion: "jabas", producto: "jengibre", detalle: "3450" },
  ]);

  /* Set today's date once on mount */
  useEffect(() => {
    const t = new Date();
    const dd = String(t.getDate()).padStart(2, "0");
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    setFecha(`${dd}/${mm}/${t.getFullYear()}`);
  }, []);

  /* Auto-fill farmer from guide number */
  useEffect(() => {
    const clean = nroGuia.trim();
    if (!clean) { setAgricultor(null); setSearchError("Ingrese un número de guía"); return; }
    const n = Number(clean);
    if (isNaN(n)) { setAgricultor(null); setSearchError("Solo se aceptan números"); return; }
    if (n < GUIA_BASE) { setAgricultor(null); setSearchError(`Mínimo permitido: ${GUIA_BASE}`); return; }
    const idx = (n - GUIA_BASE) % TOTAL_REGISTROS;
    setAgricultor(AGRICULTORES[idx]);
    setNombreTransportista(fletero); // keep transport name in sync
    setSearchError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nroGuia]);

  /* Item helpers */
  const updateItem = (id: string, field: keyof Item, value: string) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const addRow = () =>
    setItems((prev) => {
      const next = prev.length + 1;
      return [
        ...prev,
        {
          id: Math.random().toString(36).slice(2),
          item: String(next).padStart(2, "0"),
          cantidad: "",
          descripcion: "jabas",
          producto: "jengibre",
          detalle: "",
        },
      ];
    });

  const removeRow = (id: string) =>
    setItems((prev) =>
      prev
        .filter((it) => it.id !== id)
        .map((it, idx) => ({ ...it, item: String(idx + 1).padStart(2, "0") }))
    );

  const guiaFormatted = (() => {
    const n = Number(nroGuia);
    return isNaN(n) ? nroGuia : String(n).padStart(5, "0");
  })();

  const visibleItems = items.filter(
    (it) => it.item || it.cantidad || it.descripcion || it.producto || it.detalle
  );

  /* ──────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0d1410] text-[#dce8e0] font-sans text-sm antialiased">

      {/* ══ TOP BAR ══════════════════════════════════════════════════════ */}
      <header className="no-print sticky top-0 z-50 bg-[#0d1410]/95 backdrop-blur border-b border-[#1e2e20] px-4 py-2.5 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div style={{ height: 26, overflow: "hidden", display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-nativa-organics.png"
              alt="Nativa Peru Organics"
              style={{ height: "100%", filter: "invert(1) brightness(0.9)", mixBlendMode: "screen" }}
            />
          </div>
          <div className="hidden sm:block w-px h-6 bg-[#1e2e20] mx-1" />
          <span className="hidden sm:block text-[13px] text-[#5a7a62]">Guía de Recepción de Carga</span>
        </div>

        {/* Guide search + print */}
        <div className="flex items-center gap-2">
          {/* Series */}
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-[11px] text-[#4a6452] font-semibold">Serie</span>
            <input
              type="text"
              value={serieGuia}
              readOnly
              className="w-12 bg-[#151e17] border border-[#263428] rounded px-2 py-1 text-xs font-mono text-[#7aaa88] outline-none"
            />
          </div>

          {/* N° Guía */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#4a6452] font-semibold whitespace-nowrap">N° Guía</span>
            <div className="relative">
              <input
                type="text"
                value={nroGuia}
                onChange={(e) => setNroGuia(e.target.value)}
                placeholder={String(GUIA_BASE)}
                className={`w-24 bg-[#151e17] border rounded px-2 py-1 text-xs font-mono font-bold outline-none transition-colors ${searchError
                  ? "border-[#7a3030] text-[#b07070] focus:border-[#a04040]"
                  : "border-[#263428] text-[#a8c4b0] focus:border-[#4a7c59]"
                  }`}
              />
            </div>
          </div>

          {searchError && (
            <span className="hidden lg:block text-[10px] text-[#8a5050] font-medium">{searchError}</span>
          )}

          <button
            onClick={() => window.print()}
            disabled={!agricultor}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            style={{ background: "#1a2a1c", borderColor: "#2d7d3f", color: "#6aaa78" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1e3520"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1a2a1c"; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm-1 9H8v2h4v-2z" clipRule="evenodd" />
            </svg>
            Imprimir
          </button>
        </div>
      </header>

      {/* ══ MAIN CONTENT ═════════════════════════════════════════════════ */}
      <main className="max-w-3xl mx-auto px-3 py-6 flex flex-col gap-4">

        {/* ════════════════════════════════════════════════════════════════
            DOCUMENT FORM — dark version of the ticket grid
        ════════════════════════════════════════════════════════════════ */}
        <div className="no-print flex flex-col gap-2">

          {/* Search feedback pill */}
          {searchError && (
            <div className="flex items-center gap-2 text-[11px] text-[#8a5050] bg-[#1a1212] border border-[#3a1e1e] rounded px-3 py-1.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {searchError} — El mínimo es guía <strong>{GUIA_BASE}</strong>
            </div>
          )}

          {/* ── Document card ── */}
          <div className="border-2 border-[#263428] rounded-sm overflow-hidden shadow-2xl shadow-black/60">

            {/* ── Header: Logo | Title | Guia N° ── */}
            <div className="grid grid-cols-12 border-b-2 border-[#263428]">

              {/* Logo col */}
              <div className="col-span-3 border-r-2 border-[#263428] p-2 flex items-center justify-center bg-[#0f1810]">
                <div style={{ height: 38, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-nativa-organics.png"
                    alt="Nativa Peru Organics"
                    style={{ height: "100%", filter: "invert(1) brightness(0.9)", mixBlendMode: "screen" }}
                  />
                </div>
              </div>

              {/* Title col */}
              <div className="col-span-6 flex items-center justify-center p-3 bg-[#0d1410]">
                <h1 className="text-lg font-bold tracking-wide text-[#c8d8cc] text-center">
                  GUIA DE RECEPCION DE CARGA
                </h1>
              </div>

              {/* Guia N° col */}
              <div className="col-span-3 border-l-2 border-[#263428] flex flex-col bg-[#0f1810]">
                <div className="flex-1 flex items-center justify-between px-3 border-b border-[#263428]">
                  <span className="font-bold text-[11px] text-[#5a7a62]">GUIA {serieGuia}-</span>
                  <span className="font-bold text-[11px] text-[#6a4040]">N°</span>
                </div>
                <div className="flex-1 flex items-center justify-end px-3">
                  <span className="font-black text-[22px] font-mono leading-none" style={{ color: "#b04040" }}>
                    {guiaFormatted}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Info grid: 2 columns ── */}
            <div className="grid grid-cols-2" style={{ background: "#0f1912" }}>

              {/* Left col */}
              <div className="border-r-2 border-[#263428]">
                <Field
                  label="Agricultor:"
                  value={agricultor ? agricultor.nombre_agricultor : ""}
                  readOnly
                  placeholder="— ingrese guía —"
                />
                <Field
                  label="DNI:"
                  value={agricultor ? agricultor.dni_agricultor : ""}
                  readOnly
                  placeholder="—"
                />
                <Field
                  label="Fletero:"
                  value={fletero}
                  onChange={(v) => { setFletero(v.toUpperCase()); setNombreTransportista(v.toUpperCase()); }}
                  placeholder="Nombre transportista"
                />
                <Field
                  label="Placa Vehículo:"
                  value={placa}
                  onChange={(v) => setPlaca(v.toUpperCase())}
                  placeholder="XXX-000"
                />
              </div>

              {/* Right col */}
              <div>
                <Field
                  label="Fecha:"
                  value={fecha}
                  onChange={setFecha}
                  placeholder="DD/MM/AAAA"
                />
                <Field
                  label="Codigo:"
                  value={agricultor ? agricultor.codigo : ""}
                  readOnly
                  placeholder="—"
                />
                <Field
                  label="Zona:"
                  value={agricultor ? agricultor.zona : ""}
                  readOnly
                  placeholder="—"
                />

                {/* Checkboxes row */}
                <div className="flex items-center border-b border-[#263428] px-2 py-1.5 gap-5 min-h-[34px]">
                  <label className="flex items-center gap-2 cursor-pointer select-none group">
                    <div
                      onClick={() => setOrganico((v) => !v)}
                      className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 rounded-sm transition-colors cursor-pointer ${organico ? "border-[#2d7d3f] bg-[#2d7d3f]" : "border-[#3a5040] bg-transparent"
                        }`}
                    >
                      {organico && (
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[12px] text-[#6a9478] group-hover:text-[#8ab898] transition-colors font-semibold">Orgánico</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none group">
                    <div
                      onClick={() => setGlobalGap((v) => !v)}
                      className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 rounded-sm transition-colors cursor-pointer ${globalGap ? "border-[#2d7d3f] bg-[#2d7d3f]" : "border-[#3a5040] bg-transparent"
                        }`}
                    >
                      {globalGap && (
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[12px] text-[#6a9478] group-hover:text-[#8ab898] transition-colors font-semibold">Global Gap</span>
                  </label>
                </div>
              </div>
            </div>

            {/* ── Se recepcionó ── */}
            <div className="px-2 py-1.5 border-b-2 border-[#263428] border-t-2 text-[12px] font-medium text-[#8ab898] bg-[#0d1410]">
              Se recepcionó lo siguiente:
            </div>

            {/* ── Items table ── */}
            <div style={{ background: "#0d1410" }}>
              <table className="w-full border-collapse">
                <thead style={{ background: "#111e14" }}>
                  <tr>
                    <Th>ITEM</Th>
                    <Th>CANTIDAD</Th>
                    <Th>DESCRIPCION</Th>
                    <Th>PRODUCTO</Th>
                    <Th>DETALLE</Th>
                    <th className="border border-[#263428] w-8 print:hidden" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="hover:bg-[#111e14] transition-colors group">
                      <Td className="w-10 text-center">
                        <Editable value={it.item} onChange={(v) => updateItem(it.id, "item", v)} align="center" className="text-[#6a9478] font-bold" />
                      </Td>
                      <Td>
                        <Editable value={it.cantidad} onChange={(v) => updateItem(it.id, "cantidad", v)} align="center" placeholder="0" />
                      </Td>
                      <Td>
                        <Editable value={it.descripcion} onChange={(v) => updateItem(it.id, "descripcion", v)} align="center" placeholder="descripción" />
                      </Td>
                      <Td>
                        <Editable value={it.producto} onChange={(v) => updateItem(it.id, "producto", v)} align="center" placeholder="producto" />
                      </Td>
                      <Td>
                        <Editable value={it.detalle} onChange={(v) => updateItem(it.id, "detalle", v)} align="center" placeholder="0" />
                      </Td>
                      <td className="border border-[#263428] text-center w-8 print:hidden">
                        <button
                          onClick={() => removeRow(it.id)}
                          className="text-[#4a3030] hover:text-[#a06060] transition-colors px-2 py-0.5 cursor-pointer text-base leading-none"
                          title="Eliminar fila"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Add row button */}
              <div className="p-2 print:hidden border-b-2 border-t border-[#1e2e20] border-b-[#263428]">
                <button
                  onClick={addRow}
                  className="text-[11px] px-3 py-1 rounded border border-[#263428] text-[#5a7a62] hover:text-[#7aaa88] hover:border-[#2d7d3f] bg-[#0f1912] hover:bg-[#111e14] transition-all cursor-pointer font-semibold"
                >
                  + Agregar fila
                </button>
              </div>
            </div>

            {/* ── Signatures ── */}
            <div className="grid grid-cols-2 border-t-2 border-[#263428]">
              <div className="border-r-2 border-[#263428] p-3 bg-[#0d1410]">
                <div className="font-bold mb-2 text-[11px] tracking-wider text-[#5a7a62] uppercase">
                  Responsable Nativa
                </div>
                <div className="flex gap-2 mb-3 items-center">
                  <span className="font-semibold text-[12px] whitespace-nowrap text-[#6a9478] shrink-0">Nombre:</span>
                  <Editable value={nombreNativa} onChange={(v) => setNombreNativa(v.toUpperCase())} placeholder="NOMBRE" />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold text-[12px] text-[#6a9478] shrink-0">Firma:</span>
                  <span className="flex-1 border-b border-dotted border-[#2a3828] h-5" />
                </div>
              </div>
              <div className="p-3 bg-[#0d1410]">
                <div className="font-bold mb-2 text-[11px] tracking-wider text-[#5a7a62] uppercase">
                  Transportista
                </div>
                <div className="flex gap-2 mb-3 items-center">
                  <span className="font-semibold text-[12px] whitespace-nowrap text-[#6a9478] shrink-0">Nombre:</span>
                  <Editable value={nombreTransportista} onChange={(v) => setNombreTransportista(v.toUpperCase())} placeholder="NOMBRE" />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold text-[12px] text-[#6a9478] shrink-0">Firma:</span>
                  <span className="flex-1 border-b border-dotted border-[#2a3828] h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Large Print Button */}
          <button
            onClick={() => window.print()}
            disabled={!agricultor}
            className="w-full py-3 mt-4 text-sm font-bold tracking-wider rounded border transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2"
            style={{ background: "#111e14", borderColor: "#2d7d3f", color: "#6aaa78" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#162214"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#111e14"; }}
          >
            🖨 Imprimir boleta térmica 80mm
          </button>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="no-print border-t border-[#1a2410] py-3 text-center text-[11px] text-[#2d4030] select-none">
        © 2026 Nativa Peru Organics · Sistema de Recepción de Carga
      </footer>

      {/* ══ THERMAL RECEIPT — only visible when printing ══════════════════
          Exact same structure as the on-screen preview, but rendered via
          CSS @media print so only THIS div is shown on paper.
      ══════════════════════════════════════════════════════════════════ */}
      <div className="thermal-receipt">
        <style>{`
          .thermal-receipt { display: none; }
          @media print {
            @page { size: 80mm auto; margin: 0; }
            html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
            body * { visibility: hidden !important; }
            .thermal-receipt, .thermal-receipt * { visibility: visible !important; }
            .thermal-receipt {
              display: block !important;
              position: absolute; left: 0; top: 0;
              width: 80mm;
              padding: 4mm 4mm;
              box-sizing: border-box;
              font-family: 'Courier New', Courier, monospace;
              font-size: 11px;
              line-height: 1.5;
              color: #000;
            }
            .thermal-receipt .tc  { text-align: center; }
            .thermal-receipt .b   { font-weight: 700; }
            .thermal-receipt .big { font-size: 16px; font-weight: 900; }
            .thermal-receipt .row { display: flex; justify-content: space-between; }
            .thermal-receipt .sep { color: #444; display: block; margin: 4px 0; }
            .thermal-receipt table { width: 100%; border-collapse: collapse; font-size: 10px; }
            .thermal-receipt th   { border-bottom: 1px solid #000; padding: 2px 0; text-align: left; font-weight: 700; }
            .thermal-receipt td   { border-bottom: 1px dotted #888; padding: 2px 0; vertical-align: top; word-break: break-word; }
            .thermal-receipt .th-right { text-align: right; }
            .thermal-receipt .td-right { text-align: right; }
            .thermal-receipt .sig-line  { border-top: 1px solid #000; text-align: center; padding-top: 3px; font-size: 10px; margin-top: 18px; }
          }
        `}</style>

        {/* Logo image — cropped top+bottom whitespace, centered */}
        <div style={{ overflow: 'hidden', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-nativa-organics.png"
            alt="Nativa Peru Organics"
            style={{ width: '90%', maxWidth: 200, display: 'block', WebkitPrintColorAdjust: 'exact' }}
          />
        </div>
        <span className="sep">{'-'.repeat(41)}</span>

        <div className="tc b">GUIA DE RECEPCION DE CARGA</div>
        <div className="tc">GUIA {serieGuia}-N° {guiaFormatted}</div>
        <span className="sep">{'-'.repeat(41)}</span>

        <div><span className="b">Fecha:</span> {fecha || '—'}</div>
        <div><span className="b">Codigo:</span> {agricultor?.codigo ?? '—'}</div>
        <div><span className="b">Zona:</span> {agricultor?.zona ?? '—'}</div>
        <span className="sep">{'-'.repeat(41)}</span>

        <div><span className="b">Agricultor:</span> {agricultor?.nombre_agricultor ?? '—'}</div>
        <div><span className="b">DNI:</span> {agricultor?.dni_agricultor ?? '—'}</div>
        <div><span className="b">Fletero:</span> {fletero || '—'}</div>
        <div><span className="b">Placa:</span> {placa || '—'}</div>
        <div className="row">
          <span>Organico: {organico ? '[X]' : '[ ]'}</span>
          <span>Global Gap: {globalGap ? '[X]' : '[ ]'}</span>
        </div>
        <span className="sep">{'-'.repeat(41)}</span>

        <div className="b">Se recepcionó lo siguiente:</div>
        <table>
          <thead>
            <tr>
              <th style={{ width: '10%' }}>#</th>
              <th style={{ width: '16%' }}>CANT</th>
              <th style={{ width: '24%' }}>DESC</th>
              <th style={{ width: '30%' }}>PROD</th>
              <th className="th-right" style={{ width: '20%' }}>DET</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((it, i) => (
              <tr key={i}>
                <td>{it.item}</td>
                <td>{it.cantidad || '0'}</td>
                <td>{it.descripcion}</td>
                <td>{it.producto}</td>
                <td className="td-right">{it.detalle || '0'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <span className="sep">{'-'.repeat(41)}</span>

        <div className="b">RESPONSABLE NATIVA</div>
        <div>Nombre: {nombreNativa || '___________'}</div>
        <div className="sig-line">Firma</div>

        <div style={{ height: 8 }} />
        <div className="b">TRANSPORTISTA</div>
        <div>Nombre: {nombreTransportista || '___________'}</div>
        <div className="sig-line">Firma</div>
        <div style={{ height: 14 }} />
      </div>
    </div>
  );
}
