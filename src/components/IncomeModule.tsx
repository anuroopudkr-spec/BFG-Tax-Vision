/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TaxReturn, W2Entry, Interest1099INT, Dividend1099DIV, CapitalGain1099B, Retirement1099R } from "../types";
import { Plus, Trash, HelpCircle, FileText, Globe, Landmark, CircleDollarSign, Percent } from "lucide-react";
import { STATES_LIST } from "../taxEngine";

interface IncomeModuleProps {
  taxReturn: TaxReturn;
  onChange: (updated: TaxReturn) => void;
}

export default function IncomeModule({ taxReturn, onChange }: IncomeModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<"w2" | "int" | "div" | "capGains" | "retirement" | "ssOther">("w2");

  // --- W-2 Handlers ---
  const addW2 = () => {
    const entry: W2Entry = {
      id: "w2-" + Math.random().toString(36).substr(2, 9),
      employerName: "",
      employerEin: "",
      wages: 0,
      withholding: 0,
      ssWages: 0,
      ssWithholding: 0,
      medWages: 0,
      medWithholding: 0,
      stateCode: taxReturn.taxpayer.state || "CA",
      stateWages: 0,
      stateWithholding: 0,
      localWages: 0,
      localWithholding: 0,
    };
    onChange({ ...taxReturn, w2s: [...(taxReturn.w2s || []), entry] });
  };

  const removeW2 = (id: string) => {
    onChange({ ...taxReturn, w2s: taxReturn.w2s.filter((w) => w.id !== id) });
  };

  const updateW2 = (id: string, field: keyof W2Entry, val: any) => {
    onChange({
      ...taxReturn,
      w2s: taxReturn.w2s.map((w) => {
        if (w.id === id) {
          const num = Number(val) || 0;
          const updated = { ...w, [field]: val };
          // Smart values automation if wages or withholding edited: standard Social Security wages is equal to wages up to the maximum limit.
          if (field === "wages") {
            updated.ssWages = Math.min(val, 176100);
            updated.medWages = val;
            updated.stateWages = val;
            // standard withholding estimation (6.2% ss rate, 1.45% med rate)
            updated.ssWithholding = Math.round(updated.ssWages * 0.062);
            updated.medWithholding = Math.round(updated.medWages * 0.0145);
          }
          return updated;
        }
        return w;
      }),
    });
  };

  // --- 1099-INT Handlers ---
  const add1099INT = () => {
    const entry: Interest1099INT = {
      id: "int-" + Math.random().toString(36).substr(2, 9),
      payerName: "",
      taxableInterest: 0,
      taxExemptInterest: 0,
      withholding: 0,
      stateWithholding: 0,
    };
    onChange({ ...taxReturn, interest1099s: [...(taxReturn.interest1099s || []), entry] });
  };

  const update1099INT = (id: string, field: keyof Interest1099INT, val: any) => {
    onChange({
      ...taxReturn,
      interest1099s: taxReturn.interest1099s.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    });
  };

  // --- 1099-DIV Handlers ---
  const add1099DIV = () => {
    const entry: Dividend1099DIV = {
      id: "div-" + Math.random().toString(36).substr(2, 9),
      payerName: "",
      ordinaryDividends: 0,
      qualifiedDividends: 0,
      capitalGains: 0,
      withholding: 0,
      stateWithholding: 0,
    };
    onChange({ ...taxReturn, dividend1099s: [...(taxReturn.dividend1099s || []), entry] });
  };

  const update1099DIV = (id: string, field: keyof Dividend1099DIV, val: any) => {
    onChange({
      ...taxReturn,
      dividend1099s: taxReturn.dividend1099s.map((item) => {
        if (item.id === id) {
          const num = Number(val) || 0;
          const updated = { ...item, [field]: val };
          // Auto ordinary dividends >= qualified dividends
          if (field === "qualifiedDividends" && num > Number(item.ordinaryDividends)) {
            updated.ordinaryDividends = num;
          }
          return updated;
        }
        return item;
      }),
    });
  };

  // --- 1099-B Capital Gains Handlers ---
  const add1099B = () => {
    const entry: CapitalGain1099B = {
      id: "b-" + Math.random().toString(36).substr(2, 9),
      description: "",
      dateAcquired: "",
      dateSold: "",
      salesProceeds: 0,
      costBasis: 0,
      isLongTerm: true,
    };
    onChange({ ...taxReturn, capitalGains1099s: [...(taxReturn.capitalGains1099s || []), entry] });
  };

  const update1099B = (id: string, field: keyof CapitalGain1099B, val: any) => {
    onChange({
      ...taxReturn,
      capitalGains1099s: taxReturn.capitalGains1099s.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          // Automate Long Term checkbox checking if date acquired and date sold are input
          if ((field === "dateAcquired" || field === "dateSold") && updated.dateAcquired && updated.dateSold) {
            const acq = new Date(updated.dateAcquired);
            const sold = new Date(updated.dateSold);
            const diffTime = Math.abs(sold.getTime() - acq.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            updated.isLongTerm = diffDays > 365;
          }
          return updated;
        }
        return item;
      }),
    });
  };

  // --- 1099-R Retirement Handlers ---
  const add1099R = () => {
    const entry: Retirement1099R = {
      id: "r-" + Math.random().toString(36).substr(2, 9),
      payerName: "",
      grossDistribution: 0,
      taxableAmount: 0,
      withholding: 0,
      stateWithholding: 0,
    };
    onChange({ ...taxReturn, retirement1099s: [...(taxReturn.retirement1099s || []), entry] });
  };

  const update1099R = (id: string, field: keyof Retirement1099R, val: any) => {
    onChange({
      ...taxReturn,
      retirement1099s: taxReturn.retirement1099s.map((item) => {
        if (item.id === id) {
          const num = Number(val) || 0;
          const updated = { ...item, [field]: val };
          if (field === "grossDistribution" && num < Number(item.taxableAmount)) {
            updated.taxableAmount = num;
          }
          return updated;
        }
        return item;
      }),
    });
  };

  // --- Other incomes Update helper ---
  const updateOtherIncome = (field: keyof typeof taxReturn.otherIncome, value: any) => {
    onChange({
      ...taxReturn,
      otherIncome: {
        ...taxReturn.otherIncome,
        [field]: value,
      },
    });
  };

  // --- Social Security Update helper ---
  const updateSocialSecurity = (field: keyof typeof taxReturn.socialSecurity, value: any) => {
    onChange({
      ...taxReturn,
      socialSecurity: {
        ...taxReturn.socialSecurity,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Sub tabs picker */}
      <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        {[
          { id: "w2", icon: FileText, label: "W-2 Salary Wages" },
          { id: "int", icon: Landmark, label: "1099-INT Interest" },
          { id: "div", icon: Percent, label: "1099-DIV Dividend" },
          { id: "capGains", icon: CircleDollarSign, label: "1099-B Capital Gains" },
          { id: "retirement", icon: Globe, label: "1099-R Retirement" },
          { id: "ssOther", icon: CircleDollarSign, label: "SS & Other Incomes" },
        ].map((subTab) => {
          const Icon = subTab.icon;
          return (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id as any)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeSubTab === subTab.id
                  ? "bg-white text-slate-800 shadow-3xs border border-slate-250/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{subTab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB PANELS */}
      {/* --- PANEL 1: W-2 Wages --- */}
      {activeSubTab === "w2" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-xl border border-slate-150">
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Wage Income filings (Form W-2)</h4>
              <p className="text-xs text-slate-500">Record all employer hourly and salary W-2 compensation statements.</p>
            </div>
            <button
              onClick={addW2}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add W-2 Ledger</span>
            </button>
          </div>

          {(taxReturn.w2s || []).length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl border border-dashed border-slate-200 text-xs font-mono text-slate-400">
              No employer W-2 statements created. Click Add W-2 above to begin.
            </div>
          ) : (
            <div className="space-y-4">
              {taxReturn.w2s.map((w, idx) => (
                <div
                  key={w.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs hover:border-slate-350 transition-all space-y-4 font-sans"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase font-mono">Form W-2 #{idx + 1}</span>
                    <button
                      onClick={() => removeW2(w.id)}
                      className="inline-flex items-center gap-1 text-[10px] text-red-500 bg-red-50 hover:bg-red-100 font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer"
                    >
                      <Trash className="w-3 h-3" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-405 uppercase">Employer Corporate Name</label>
                      <input
                        type="text"
                        value={w.employerName}
                        onChange={(e) => updateW2(w.id, "employerName", e.target.value)}
                        placeholder="Google LLC"
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-405 uppercase">Employer EIN (XX-XXXXXXX)</label>
                      <input
                        type="text"
                        value={w.employerEin}
                        onChange={(e) => updateW2(w.id, "employerEin", e.target.value)}
                        placeholder="94-2831201"
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-405 uppercase">Box 1: Fed Wages / Salary</label>
                      <input
                        type="number"
                        value={w.wages || ""}
                        onChange={(e) => updateW2(w.id, "wages", Number(e.target.value) || 0)}
                        placeholder="110,000"
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-405 uppercase">Box 2: Fed Income Tax Withheld</label>
                      <input
                        type="number"
                        value={w.withholding || ""}
                        onChange={(e) => updateW2(w.id, "withholding", Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-405 uppercase">Box 3: SS Wages (max $176k)</label>
                      <input
                        type="number"
                        value={w.ssWages || ""}
                        onChange={(e) => updateW2(w.id, "ssWages", Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-405 uppercase">Box 4: SS Taxes Withheld</label>
                      <input
                        type="number"
                        value={w.ssWithholding || ""}
                        onChange={(e) => updateW2(w.id, "ssWithholding", Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono text-slate-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-405 uppercase">Box 5: Medicare Wages</label>
                      <input
                        type="number"
                        value={w.medWages || ""}
                        onChange={(e) => updateW2(w.id, "medWages", Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase">Box 6: Medicare Tax Paid</label>
                      <input
                        type="number"
                        value={w.medWithholding || ""}
                        onChange={(e) => updateW2(w.id, "medWithholding", Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono text-slate-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase font-semibold">Box 15: State Code</label>
                      <select
                        value={w.stateCode}
                        onChange={(e) => updateW2(w.id, "stateCode", e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                      >
                        {STATES_LIST.map(st => (
                          <option key={st.code} value={st.code}>{st.code}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase">Box 16: State Wages Reported</label>
                      <input
                        type="number"
                        value={w.stateWages || ""}
                        onChange={(e) => updateW2(w.id, "stateWages", Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase">Box 17: State Tax Withheld</label>
                      <input
                        type="number"
                        value={w.stateWithholding || ""}
                        onChange={(e) => updateW2(w.id, "stateWithholding", Number(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- PANEL 2: Interest Income (1099-INT) --- */}
      {activeSubTab === "int" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-xl border border-slate-150">
            <div>
              <h4 className="text-sm font-bold text-slate-850 uppercase tracking-wide">Taxable & Exempt Interest Income (Form 1099-INT)</h4>
              <p className="text-xs text-slate-550">Report all bank account yields, municipal bonds, and Treasury yields.</p>
            </div>
            <button
              onClick={add1099INT}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add 1099-INT</span>
            </button>
          </div>

          {(taxReturn.interest1099s || []).length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl border border-dashed border-slate-200 text-xs font-mono text-slate-400">
              No Form 1099-INT returns listed. Click Add 1099-INT to append interest records.
            </div>
          ) : (
            <div className="space-y-3">
              {taxReturn.interest1099s.map((int, idx) => (
                <div key={int.id} className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-6 gap-3.5 items-end">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Payer / Financial Institution</label>
                    <input
                      type="text"
                      value={int.payerName}
                      onChange={(e) => update1099INT(int.id, "payerName", e.target.value)}
                      placeholder="Chase Bank NA"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Box 1: Taxable Interest</label>
                    <input
                      type="number"
                      value={int.taxableInterest || ""}
                      onChange={(e) => update1099INT(int.id, "taxableInterest", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Box 3: Tax Exempt Muni</label>
                    <input
                      type="number"
                      value={int.taxExemptInterest || ""}
                      onChange={(e) => update1099INT(int.id, "taxExemptInterest", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Box 4: Fed Backup Tax</label>
                    <input
                      type="number"
                      value={int.withholding || ""}
                      onChange={(e) => update1099INT(int.id, "withholding", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => onChange({ ...taxReturn, interest1099s: taxReturn.interest1099s.filter(i => i.id !== int.id) })}
                      className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 bg-white border border-red-200 w-full rounded-md cursor-pointer transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- PANEL 3: Dividend Income (1099-DIV) --- */}
      {activeSubTab === "div" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-xl border border-slate-150">
            <div>
              <h4 className="text-sm font-bold text-slate-850 uppercase tracking-wide">Dividend Declarations (Form 1099-DIV)</h4>
              <p className="text-xs text-slate-550">Record stocks returns ordinary dividends, qualified dividends, and capital distributions.</p>
            </div>
            <button
              onClick={add1099DIV}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add 1099-DIV</span>
            </button>
          </div>

          {(taxReturn.dividend1099s || []).length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl border border-dashed border-slate-200 text-xs font-mono text-slate-400">
              No Form 1099-DIV logs created. Click Add 1099-DIV above.
            </div>
          ) : (
            <div className="space-y-3">
              {taxReturn.dividend1099s.map((div, idx) => (
                <div key={div.id} className="bg-white p-4 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Payer / Fund Issuer</label>
                    <input
                      type="text"
                      value={div.payerName}
                      onChange={(e) => update1099DIV(div.id, "payerName", e.target.value)}
                      placeholder="Vanguard ETF Funds"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Box 1a: Ordinary Dividends</label>
                    <input
                      type="number"
                      value={div.ordinaryDividends || ""}
                      onChange={(e) => update1099DIV(div.id, "ordinaryDividends", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono font-semibold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase text-emerald-800">Box 1b: Qualified Dividends</label>
                    <input
                      type="number"
                      value={div.qualifiedDividends || ""}
                      onChange={(e) => update1099DIV(div.id, "qualifiedDividends", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-850 focus:bg-white transition-all font-mono font-semibold text-emerald-800 border-emerald-200 bg-emerald-50/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Box 2a: Cap Gain Distrib</label>
                    <input
                      type="number"
                      value={div.capitalGains || ""}
                      onChange={(e) => update1099DIV(div.id, "capitalGains", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => onChange({ ...taxReturn, dividend1099s: taxReturn.dividend1099s.filter(d => d.id !== div.id) })}
                      className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-750 hover:bg-red-50 bg-white border border-red-200 w-full rounded-md cursor-pointer transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- PANEL 4: Capital Gains (1099-B / Schedule D) --- */}
      {activeSubTab === "capGains" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-xl border border-slate-150">
            <div>
              <h4 className="text-sm font-bold text-slate-850 uppercase tracking-wide">Stock / Real Estate / Crypto Dispositions (Form 1099-B)</h4>
              <p className="text-xs text-slate-550">Identify Short Term (held &le; 1 year) or Long Term (held &gt; 1 year) capital asset dispositions.</p>
            </div>
            <button
              onClick={add1099B}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Transaction</span>
            </button>
          </div>

          {(taxReturn.capitalGains1099s || []).length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl border border-dashed border-slate-200 text-xs font-mono text-slate-400">
              No transactions recorded yet. Click Add Transaction above to register Schedule D gains.
            </div>
          ) : (
            <div className="space-y-4">
              {taxReturn.capitalGains1099s.map((item, idx) => {
                const gain = (Number(item.salesProceeds) || 0) - (Number(item.costBasis) || 0);
                return (
                  <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-350 transition-all font-sans space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5 items-end">
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Property Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => update1099B(item.id, "description", e.target.value)}
                          placeholder="20 shares Nvidia (NVDA)"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Date Acquired</label>
                        <input
                          type="date"
                          value={item.dateAcquired}
                          onChange={(e) => update1099B(item.id, "dateAcquired", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Date Sold</label>
                        <input
                          type="date"
                          value={item.dateSold}
                          onChange={(e) => update1099B(item.id, "dateSold", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Box 1d: Sales Proceeds</label>
                        <input
                          type="number"
                          value={item.salesProceeds || ""}
                          onChange={(e) => update1099B(item.id, "salesProceeds", Number(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Box 1e: Cost Basis</label>
                        <input
                          type="number"
                          value={item.costBasis || ""}
                          onChange={(e) => update1099B(item.id, "costBasis", Number(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="inline-flex items-center gap-1 cursor-pointer select-none text-[11px] font-semibold text-slate-600">
                          <input
                            type="checkbox"
                            checked={item.isLongTerm}
                            onChange={(e) => update1099B(item.id, "isLongTerm", e.target.checked)}
                            className="w-3.5 h-3.5 accent-slate-900 rounded-xs"
                          />
                          <span>Long Term</span>
                        </label>
                        <button
                          onClick={() => onChange({ ...taxReturn, capitalGains1099s: taxReturn.capitalGains1099s.filter(b => b.id !== item.id) })}
                          className="text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 px-2 py-1 rounded w-full transition-all text-center cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    {/* Gain/loss indicator */}
                    <div className="flex items-center gap-1 text-[11px] font-mono justify-end">
                      <span className="text-slate-400">Calculated Net Result:</span>
                      <span className={`font-bold ${gain >= 0 ? "text-emerald-700" : "text-amber-700"}`}>
                        {gain >= 0 ? `+ $${gain.toLocaleString()}` : `- $${Math.abs(gain).toLocaleString()}`}
                        <span className="text-[9px] font-semibold ml-1 text-slate-400 uppercase">
                          ({item.isLongTerm ? "Long Term Tax Preferred" : "Short Term Ordinary"})
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- PANEL 5: Retirement IRA / Pension (1099-R) --- */}
      {activeSubTab === "retirement" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-xl border border-slate-150">
            <div>
              <h4 className="text-sm font-bold text-slate-850 uppercase tracking-wide">Pensions, Annuities, traditional IRA (Form 1099-R)</h4>
              <p className="text-xs text-slate-550">Log all distributions from 401(k), traditional IRA, and Roth conversions.</p>
            </div>
            <button
              onClick={add1099R}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add 1099-R</span>
            </button>
          </div>

          {(taxReturn.retirement1099s || []).length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl border border-dashed border-slate-200 text-xs font-mono text-slate-400">
              No retirement distributions log entered. Click Add 1099-R below.
            </div>
          ) : (
            <div className="space-y-3">
              {taxReturn.retirement1099s.map((r, idx) => (
                <div key={r.id} className="bg-white p-4 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Trustee / Retirement Payer</label>
                    <input
                      type="text"
                      value={r.payerName}
                      onChange={(e) => update1099R(r.id, "payerName", e.target.value)}
                      placeholder="Fidelity Investments Trust"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Box 1: Gross Distribution</label>
                    <input
                      type="number"
                      value={r.grossDistribution || ""}
                      onChange={(e) => update1099R(r.id, "grossDistribution", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase font-mono text-red-800">Box 2a: Taxable Amount</label>
                    <input
                      type="number"
                      value={r.taxableAmount || ""}
                      onChange={(e) => update1099R(r.id, "taxableAmount", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono border-red-100 bg-red-50/10 focus:bg-white text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Box 4: Fed Tax Withheld</label>
                    <input
                      type="number"
                      value={r.withholding || ""}
                      onChange={(e) => update1099R(r.id, "withholding", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono text-slate-600"
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => onChange({ ...taxReturn, retirement1099s: taxReturn.retirement1099s.filter(item => item.id !== r.id) })}
                      className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 bg-white border border-red-205 w-full rounded-md cursor pointer transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- PANEL 6: Social Security & Supplementary Incomes --- */}
      {activeSubTab === "ssOther" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Social Security */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs space-y-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Social Security Benefits (SSA-1099)</h4>
            
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-450 uppercase">Box 5: Gross Social Security Benefits</label>
                <input
                  type="number"
                  value={taxReturn.socialSecurity.grossBenefits || ""}
                  onChange={(e) => updateSocialSecurity("grossBenefits", Number(e.target.value) || 0)}
                  placeholder="24,000"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-450 uppercase">Medicare Premiums Paid (deducted automatically)</label>
                <input
                  type="number"
                  value={taxReturn.socialSecurity.medicarePremiums || ""}
                  onChange={(e) => updateSocialSecurity("medicarePremiums", Number(e.target.value) || 0)}
                  placeholder="1,950"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-[11px] font-semibold text-slate-500 border border-slate-200 leading-relaxed font-mono">
                💡 <strong>Taxable SS rule:</strong> SS benefits can be taxable up to 0%, 50%, or 85% based on your modified AGI combined ledger limits.
              </div>
            </div>
          </div>

          {/* Supplementary Incomes list */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs space-y-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Supplementary & Miscellaneous Incomes</h4>
            
            <div className="grid grid-cols-2 gap-3 font-sans">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Unemployment Compensation</label>
                <input
                  type="number"
                  value={taxReturn.otherIncome.unemployment || ""}
                  onChange={(e) => updateOtherIncome("unemployment", Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Gambling Winnings</label>
                <input
                  type="number"
                  value={taxReturn.otherIncome.gamblingWinnings || ""}
                  onChange={(e) => updateOtherIncome("gamblingWinnings", Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase text-amber-800">Crypto Gains / Staking yield</label>
                <input
                  type="number"
                  value={taxReturn.otherIncome.cryptoIncome || ""}
                  onChange={(e) => updateOtherIncome("cryptoIncome", Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-amber-50/15 border border-amber-250/20 rounded-md focus:outline-hidden font-mono text-amber-950 focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Foreign Sourced Income</label>
                <input
                  type="number"
                  value={taxReturn.otherIncome.foreignIncome || ""}
                  onChange={(e) => updateOtherIncome("foreignIncome", Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Royalties (Schedule E Part I)</label>
                <input
                  type="number"
                  value={taxReturn.otherIncome.royalties || ""}
                  onChange={(e) => updateOtherIncome("royalties", Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Miscellaneous / Form 1099-MISC</label>
                <input
                  type="number"
                  value={taxReturn.otherIncome.miscellaneous || ""}
                  onChange={(e) => updateOtherIncome("miscellaneous", Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
