/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TaxReturn, TaxEngineResults } from "../types";
import { Landmark, Sparkles, Receipt, Calculator, Percent, Sparkle, Tag } from "lucide-react";

interface DeductionsCreditsModuleProps {
  taxReturn: TaxReturn;
  onChange: (updated: TaxReturn) => void;
  results: TaxEngineResults;
}

export default function DeductionsCreditsModule({ taxReturn, onChange, results }: DeductionsCreditsModuleProps) {
  const [panelTab, setPanelTab] = useState<"adjustments" | "deductions" | "credits" | "payments">("adjustments");

  const updateAdjustments = (field: keyof typeof taxReturn.adjustments, value: number) => {
    onChange({
      ...taxReturn,
      adjustments: {
        ...taxReturn.adjustments,
        [field]: value,
      },
    });
  };

  const updateItemized = (field: keyof typeof taxReturn.itemizedDeductions, value: number) => {
    onChange({
      ...taxReturn,
      itemizedDeductions: {
        ...taxReturn.itemizedDeductions,
        [field]: value,
      },
    });
  };

  const updateCredits = (field: keyof typeof taxReturn.credits, value: number) => {
    onChange({
      ...taxReturn,
      credits: {
        ...taxReturn.credits,
        [field]: value,
      },
    });
  };

  const updatePayments = (field: keyof typeof taxReturn.payments, value: number) => {
    onChange({
      ...taxReturn,
      payments: {
        ...taxReturn.payments,
        [field]: value,
      },
    });
  };

  const toggleItemizedForce = () => {
    onChange({
      ...taxReturn,
      useItemizedDeductionForce: !taxReturn.useItemizedDeductionForce,
    });
  };

  return (
    <div className="space-y-4">
      {/* Navigation panel tab bar */}
      <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        {[
          { id: "adjustments", icon: Landmark, label: "above-the-line Adjustments" },
          { id: "deductions", icon: Receipt, label: "Deductions (Item vs Std)" },
          { id: "credits", icon: Sparkles, label: "Federal Credits Modules" },
          { id: "payments", icon: Calculator, label: "Estimated Tax Payments" },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setPanelTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                panelTab === tab.id
                  ? "bg-white text-slate-900 shadow-3xs border border-slate-250/30"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-SECTION RENDER */}

      {/* TAB A: Above-the-line Adjustments */}
      {panelTab === "adjustments" && (
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-2xs space-y-4 font-sans">
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Adjustments to Income (Schedule 1 Part II)</h4>
            <p className="text-xs text-slate-500">Above-the-line deductions applied directly to gross incomes to formulate AGI (Adjusted Gross Income).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Health Savings Account (HSA) contribution deduction</label>
                <input
                  type="number"
                  value={taxReturn.adjustments.hsaDeduction || ""}
                  placeholder="0"
                  onChange={(e) => updateAdjustments("hsaDeduction", Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">traditional Individual Retirement Account (IRA)</label>
                <input
                  type="number"
                  value={taxReturn.adjustments.iraDeduction || ""}
                  placeholder="0"
                  onChange={(e) => updateAdjustments("iraDeduction", Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Student Loan Interest paid (max $2,500)</label>
                <input
                  type="number"
                  value={taxReturn.adjustments.studentLoanInterest || ""}
                  placeholder="0"
                  onChange={(e) => updateAdjustments("studentLoanInterest", Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-205 rounded-md focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase text-slate-800">Self-Employed Health Insurance Premiums</label>
                <input
                  type="number"
                  value={taxReturn.adjustments.seHealthInsurance || ""}
                  placeholder="0"
                  onChange={(e) => updateAdjustments("seHealthInsurance", Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-xs">Business SEP/SIMPLE Retirement plans</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-0.5 col-span-1">
                    <span className="text-[9px] font-semibold text-slate-400 uppercase">SEP IRA</span>
                    <input
                      type="number"
                      value={taxReturn.adjustments.sepContribution || ""}
                      onChange={(e) => updateAdjustments("sepContribution", Number(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-md font-mono"
                    />
                  </div>
                  <div className="space-y-0.5 col-span-1">
                    <span className="text-[9px] font-semibold text-slate-400 uppercase">SIMPLE IRA</span>
                    <input
                      type="number"
                      value={taxReturn.adjustments.simpleIraContribution || ""}
                      onChange={(e) => updateAdjustments("simpleIraContribution", Number(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-md font-mono"
                    />
                  </div>
                  <div className="space-y-0.5 col-span-1">
                    <span className="text-[9px] font-semibold text-slate-400 uppercase">Solo 401(k)</span>
                    <input
                      type="number"
                      value={taxReturn.adjustments.solo401kContribution || ""}
                      onChange={(e) => updateAdjustments("solo401kContribution", Number(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-md font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Display Deductible half of SE tax */}
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-dashed border-slate-250 font-mono text-[11px] leading-snug">
                <div>
                  <span className="block font-bold text-slate-700">Self-Employment Tax Adjustment:</span>
                  <span className="text-[10px] text-slate-400">Calculated automatically from Schedule C Net Profits (50% block)</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900">${results.deductibleSETax.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: Standard vs Itemized Deductions Comparison */}
      {panelTab === "deductions" && (
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-2xs space-y-4 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Deductions Selection (Itemized vs. Standard)</h4>
              <p className="text-xs text-slate-500">IRS rules compares itemized deductions to the legal standard for your filing status, defaulting to the higher.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-extrabold text-slate-700 capitalize">Force Itemized Deductions?</label>
              <button
                onClick={toggleItemizedForce}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  taxReturn.useItemizedDeductionForce
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-slate-100 text-slate-650 hover:bg-slate-200"
                }`}
              >
                {taxReturn.useItemizedDeductionForce ? "Yes (Enforced)" : "No (Auto Switch)"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Itemized inputs */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-xs">List Itemized Receipts (Schedule A)</span>
              
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-550">Medical & Dental Expenses (Subj to AGI Floor)</label>
                  <input
                    type="number"
                    value={taxReturn.itemizedDeductions.medicalExpenses || ""}
                    onChange={(e) => updateItemized("medicalExpenses", Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">State/Local Income Taxes</label>
                    <input
                      type="number"
                      value={taxReturn.itemizedDeductions.stateLocalIncomeTax || ""}
                      onChange={(e) => updateItemized("stateLocalIncomeTax", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Real Estate Property Taxes</label>
                    <input
                      type="number"
                      value={taxReturn.itemizedDeductions.realEstateTaxes || ""}
                      onChange={(e) => updateItemized("realEstateTaxes", Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-550">Qualifying Home Mortgage Interest Paid</label>
                  <input
                    type="number"
                    value={taxReturn.itemizedDeductions.mortgageInterest || ""}
                    onChange={(e) => updateItemized("mortgageInterest", Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-550">Charitable Contributions (cash + non-cash asset)</label>
                  <input
                    type="number"
                    value={taxReturn.itemizedDeductions.charitableContributions || ""}
                    onChange={(e) => updateItemized("charitableContributions", Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-550">Casualty & Theft Losses (Qualified federal emergency)</label>
                  <input
                    type="number"
                    value={taxReturn.itemizedDeductions.casualtyLosses || ""}
                    onChange={(e) => updateItemized("casualtyLosses", Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Comparative Dashboard */}
            <div className="space-y-3.5 bg-slate-50 rounded-xl p-4.5 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Live Comparison Breakdown</span>
              
              <div className="space-y-3 font-mono text-xs text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-semibold">Filing Standard Deduction (Static):</span>
                  <span className="font-bold text-slate-900">${results.standardDeductionsValue.toLocaleString()}</span>
                </div>
                
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>SALT Tax Allowed (capped $10k):</span>
                    <span>${Math.min(10000, (Number(taxReturn.itemizedDeductions.stateLocalIncomeTax) || 0) + (Number(taxReturn.itemizedDeductions.realEstateTaxes) || 0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Charitable allowed total:</span>
                    <span>${(Number(taxReturn.itemizedDeductions.charitableContributions) || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mortgage Interest allowed:</span>
                    <span>${(Number(taxReturn.itemizedDeductions.mortgageInterest) || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Medical above AGI floor (7.5% floor: ${Math.round(results.adjustedGrossIncome * 0.075).toLocaleString()}):</span>
                    <span>${Math.round(Math.max(0, (Number(taxReturn.itemizedDeductions.medicalExpenses) || 0) - (results.adjustedGrossIncome * 0.075))).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-slate-200 pt-1.5 text-slate-850">
                    <span>Calculated Schedule A Itemized sum:</span>
                    <span>${results.itemizedDeductionsValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Auto-calculated Winner</span>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-black text-slate-900">
                      {results.hasStandardDeduction ? "Standard Deduction Claimed" : "Itemized Deductions Claimed"}
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 font-black text-[13px] px-2 py-0.5 rounded-xs font-mono">
                      ${results.allowedDeductionValue.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-450 leading-snug pt-1">
                    Using the {results.hasStandardDeduction ? "Standard" : "Itemized"} method reduces your taxable income by an extra <strong>${Math.abs(results.standardDeductionsValue - results.itemizedDeductionsValue).toLocaleString()}</strong> compared to the alternative!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB C: Federal Credits Setup */}
      {panelTab === "credits" && (
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-2xs space-y-4 font-sans">
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Federal Credits Configuration</h4>
            <p className="text-xs text-slate-500">Record refundable and non-refundable tax credits. Dependent credits are evaluated automatically.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            <div className="space-y-4 border-r border-slate-100 pr-0 md:pr-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Refundable Credits</span>
              
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Earned Income Tax Credit (EIC) amount</label>
                  <input
                    type="number"
                    value={taxReturn.credits.earnedIncomeCredit || ""}
                    placeholder="0"
                    onChange={(e) => updateCredits("earnedIncomeCredit", Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-205 rounded-md focus:outline-hidden font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">American Opportunity Credit (AOTC Education - Part Refundable)</label>
                  <input
                    type="number"
                    value={taxReturn.credits.educationCreditAOTC || ""}
                    placeholder="0"
                    onChange={(e) => updateCredits("educationCreditAOTC", Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-205 rounded-md focus:outline-hidden font-mono"
                  />
                </div>

                <div className="p-3 bg-emerald-50/20 text-emerald-900 border border-emerald-100 rounded-lg text-[11px] font-mono leading-relaxed space-y-1">
                  <strong className="block border-b border-emerald-200 pb-0.5">Dependent credits calculated:</strong>
                  <div className="flex justify-between">
                    <span>Child Tax Credit (Non-Refundable):</span>
                    <span>${results.calculatedChildTaxCredit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Dependent Credit:</span>
                    <span>${results.calculatedOtherDependentCredit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Non-Refundable Credits list</span>
              
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Child/Dependent Care</label>
                  <input
                    type="number"
                    value={taxReturn.credits.childDependentCareCredit || ""}
                    onChange={(e) => updateCredits("childDependentCareCredit", Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Lifetime Learning Credit (LLC)</label>
                  <input
                    type="number"
                    value={taxReturn.credits.educationCreditLLC || ""}
                    onChange={(e) => updateCredits("educationCreditLLC", Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Foreign Tax Credit Code</label>
                  <input
                    type="number"
                    value={taxReturn.credits.foreignTaxCredit || ""}
                    onChange={(e) => updateCredits("foreignTaxCredit", Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Saver&apos;s Retirement Credit</label>
                  <input
                    type="number"
                    value={taxReturn.credits.retirementSavingsCredit || ""}
                    onChange={(e) => updateCredits("retirementSavingsCredit", Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-805 uppercase">Residential Solar/Energy</label>
                  <input
                    type="number"
                    value={taxReturn.credits.residentialEnergyCredit || ""}
                    onChange={(e) => updateCredits("residentialEnergyCredit", Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono bg-emerald-50/10 text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-805 uppercase">Electric Vehicle Credit (EV)</label>
                  <input
                    type="number"
                    value={taxReturn.credits.evCredit || ""}
                    onChange={(e) => updateCredits("evCredit", Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono bg-emerald-50/10 text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB D: Estimated Tax Payments */}
      {panelTab === "payments" && (
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-2xs space-y-4 font-sans">
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Federal Estimated tax payments & Offsets</h4>
            <p className="text-xs text-slate-500">Log tax payments submitted quarterly to the IRS during tax year 2026, or state extension pay files.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1 font-sans">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Q1 Payment (April 15, 2026)</label>
              <input
                type="number"
                value={taxReturn.payments.estimatedQ1 || ""}
                placeholder="0"
                onChange={(e) => updatePayments("estimatedQ1", Number(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-455 uppercase">Q2 Payment (June 15, 2026)</label>
              <input
                type="number"
                value={taxReturn.payments.estimatedQ2 || ""}
                placeholder="0"
                onChange={(e) => updatePayments("estimatedQ2", Number(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-455 uppercase">Q3 Payment (Sept 15, 2026)</label>
              <input
                type="number"
                value={taxReturn.payments.estimatedQ3 || ""}
                placeholder="0"
                onChange={(e) => updatePayments("estimatedQ3", Number(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-455 uppercase">Q4 Payment (Jan 15, 2027)</label>
              <input
                type="number"
                value={taxReturn.payments.estimatedQ4 || ""}
                placeholder="0"
                onChange={(e) => updatePayments("estimatedQ4", Number(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Prior Year Overpayment offset Carryover</label>
              <input
                type="number"
                value={taxReturn.payments.priorYearOverpayment || ""}
                placeholder="0"
                onChange={(e) => updatePayments("priorYearOverpayment", Number(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono font-medium text-slate-800"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Extension Payment submitted explicitly</label>
              <input
                type="number"
                value={taxReturn.payments.extensionPayments || ""}
                placeholder="0"
                onChange={(e) => updatePayments("extensionPayments", Number(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono text-slate-700"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-mono flex items-center justify-between">
            <div>
              <span className="font-bold">Gross Federal Salary Withholding (W-2/1099):</span>
              <p className="text-[10px] text-slate-400 pt-0.5">Calculated from your W2 and 1099 entries lists automatically.</p>
            </div>
            <span className="text-sm font-extrabold text-slate-900">${results.totalFederalWithholding.toLocaleString()}</span>
          </div>
        </div>
      )}

    </div>
  );
}
