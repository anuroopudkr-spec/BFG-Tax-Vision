/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TaxReturn, TaxEngineResults } from "../types";
import { Landmark, Compass, HelpCircle, CheckCircle } from "lucide-react";
import { STATES_LIST } from "../taxEngine";

interface StateTaxModuleProps {
  taxReturn: TaxReturn;
  onChange: (updated: TaxReturn) => void;
  results: TaxEngineResults;
}

export default function StateTaxModule({ taxReturn, onChange, results }: StateTaxModuleProps) {
  const st = taxReturn.stateTax;

  const updateStateField = (field: keyof typeof st, value: any) => {
    onChange({
      ...taxReturn,
      stateTax: {
        ...st,
        [field]: value,
      },
    });
  };

  const selectedStateObj = STATES_LIST.find((s) => s.code === st.residentState);
  const isNoIncomeTax = selectedStateObj?.type === "none";

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-2xs space-y-4 font-sans">
        
        {/* State header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-slate-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                State Income Tax Allocation & Returns: {st.residentState}
              </h3>
              <p className="text-xs text-slate-500">
                Configure state-specific adjustments to federal Adjusted Gross Income (AGI).
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span className="bg-slate-100 font-bold px-2.5 py-1 rounded text-xs font-mono text-slate-700">
              {st.residentState} - Resident Status
            </span>
          </div>
        </div>

        {isNoIncomeTax ? (
          <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/25 p-8 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900 uppercase">No State personal Income Tax in {st.residentState}!</h4>
            <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
              States like {st.residentState} (Texas, Florida, Washington, etc.) do not levy an individual salary income tax. No state return tax calculation is required here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            {/* Part A: Residency Allocations */}
            <div className="space-y-4 border-r border-slate-100 pr-0 md:pr-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-xs flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-slate-550" />
                Residency and Factor Allocations
              </span>

              <div className="space-y-3 font-sans">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 font-bold">
                  <input
                    type="checkbox"
                    checked={st.isPartYear}
                    onChange={(e) => {
                      updateStateField("isPartYear", e.target.checked);
                      updateStateField("isNonResident", e.target.checked);
                    }}
                    className="w-4 h-4 accent-slate-900 rounded-sm"
                  />
                  <span>Is Part-Year Resident or Non-Resident of {st.residentState}?</span>
                </label>

                {st.isPartYear ? (
                  <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200 animate-fade-in font-sans text-[11px] leading-relaxed text-slate-600">
                    <p className="font-semibold text-slate-800">Dynamic Residency Allocations Enforced:</p>
                    <p>
                      The tax engine automatically filters and allocates state wages from Box 16 of your W-2 forms under {st.residentState}, plus 50% of your business profits and supplemental rental incomes.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11px] leading-relaxed font-mono">
                    💡 Taxpayer is configured as a **100% full-year resident** of {st.residentState}. All federal AGI gets fully allocated to this state first.
                  </div>
                )}

                {/* State tax brackets info brief */}
                <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-200/55 text-[11px] space-y-1">
                  <span className="font-bold text-slate-800 block">State Tax Bracket Rules Applied:</span>
                  <div className="flex justify-between text-slate-550 font-mono text-[10px]">
                    <span>Brackets Type:</span>
                    <span className="capitalize">{selectedStateObj?.type} Rate</span>
                  </div>
                  <div className="flex justify-between text-slate-550 font-mono text-[10px]">
                    <span>Filing Status Base:</span>
                    <span>{taxReturn.taxpayer.filingStatus} Equivalent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Part B: Additions & State Credits */}
            <div className="space-y-4">
              <span className="text-[11px] font-bold text-slate-404 uppercase">State Income Adjustments & Payments</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">State Additions (e.g. Muni Bond Interest)</label>
                  <input
                    type="number"
                    value={st.stateAdditions || ""}
                    onChange={(e) => updateStateField("stateAdditions", Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">State Subtractions (e.g. US US yields)</label>
                  <input
                    type="number"
                    value={st.stateSubtractions || ""}
                    onChange={(e) => updateStateField("stateSubtractions", Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-205 rounded-md focus:outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">State Specific Tax Credits</label>
                  <input
                    type="number"
                    value={st.stateCredits || ""}
                    onChange={(e) => updateStateField("stateCredits", Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono text-emerald-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">State Quarterly Estimated Paid</label>
                  <input
                    type="number"
                    value={st.stateEstimatedPayments || ""}
                    onChange={(e) => updateStateField("stateEstimatedPayments", Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono text-slate-700"
                  />
                </div>
              </div>

              {/* State calculated info brief */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>State AGIs allocated:</span>
                  <span className="font-semibold">${results.stateTaxableIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-550 border-b border-slate-100 pb-1">
                  <span>Calculated State Tax Lib:</span>
                  <span className="font-semibold">${results.stateTaxBeforeCredits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 text-slate-900 border-t border-slate-200">
                  <span>State Net result:</span>
                  <span className={results.stateRefundOrDue >= 0 ? "text-emerald-700" : "text-amber-700"}>
                    {results.stateRefundOrDue >= 0 ? `Refund $${results.stateRefundOrDue.toLocaleString()}` : `Due $${Math.abs(results.stateRefundOrDue).toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
