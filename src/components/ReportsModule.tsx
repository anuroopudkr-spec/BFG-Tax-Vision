/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TaxReturn, TaxEngineResults } from "../types";
import { Printer, FileText, CheckCircle, TrendingUp, AlertTriangle } from "lucide-react";
import { STATES_LIST } from "../taxEngine";

interface ReportsModuleProps {
  taxReturn: TaxReturn;
  results: TaxEngineResults;
}

export default function ReportsModule({ taxReturn, results }: ReportsModuleProps) {
  const [activeReport, setActiveReport] = useState<
    "1040" | "fedCalcs" | "stateCalcs" | "schC" | "schE" | "vouchers" | "clientLetter"
  >("1040");

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div id="reports-section" className="space-y-6">
      {/* Selector and Print Command Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-xs print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Printable Tax Returns & Reports</h2>
          <p className="text-xs text-slate-500">
            Generate high-fidelity IRS facsimiles, Schedule summaries, and estimated tax vouchers.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transform active:scale-95 transition-all shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print Active Report
        </button>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-lg border border-slate-200 print:hidden">
        {[
          { id: "1040", label: "Form 1040 Facsimile" },
          { id: "fedCalcs", label: "Fed Worksheet" },
          { id: "stateCalcs", label: "State Worksheet" },
          { id: "schC", label: "Sch C Summary" },
          { id: "schE", label: "Sch E Summary" },
          { id: "vouchers", label: "Estimated Vouchers" },
          { id: "clientLetter", label: "Client Summary Memo" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id as any)}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeReport === tab.id
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Canvas (Has special classes for styling both on-screen and during printing) */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-4xl mx-auto shadow-xs print:border-0 print:p-0 print:shadow-none min-h-[842px] relative text-slate-950 font-sans leading-relaxed">
        
        {/* REPORT 1: Form 1040 Facsimile Layout */}
        {activeReport === "1040" && (
          <div className="space-y-6">
            <div className="border-b-4 border-black pb-2 flex justify-between items-end">
              <div>
                <span className="block text-2xl font-black tracking-tighter uppercase font-mono">Form 1040</span>
                <span className="text-[10px] uppercase font-bold text-slate-800">Department of the Treasury—Internal Revenue Service</span>
                <span className="block text-xs font-bold font-serif text-slate-700">U.S. Individual Income Tax Return</span>
              </div>
              <div className="text-right">
                <span className="block text-3xl font-extrabold font-mono text-slate-900">2026</span>
                <span className="text-[9px] block text-slate-500 uppercase font-semibold">ESTIMATE / PREPARATION</span>
              </div>
            </div>

            {/* Demographics Area */}
            <div className="grid grid-cols-2 gap-4 border border-black p-3 rounded-xs text-[11px] font-mono bg-slate-50/50">
              <div>
                <p className="border-b border-dashed border-slate-300 pb-1">
                  <strong className="text-slate-500">Taxpayer:</strong> {taxReturn.taxpayer.firstName} {taxReturn.taxpayer.lastName}
                </p>
                <p className="border-b border-dashed border-slate-300 py-1">
                  <strong className="text-slate-500">SSN:</strong> {taxReturn.taxpayer.ssn || "XXX-XX-XXXX"}
                </p>
                <p className="pt-1">
                  <strong className="text-slate-500">Occupation:</strong> {taxReturn.taxpayer.occupation}
                </p>
              </div>
              <div>
                <p className="border-b border-dashed border-slate-300 pb-1">
                  <strong className="text-slate-500">Filing Status:</strong> {taxReturn.taxpayer.filingStatus}
                </p>
                {taxReturn.taxpayer.filingStatus.includes("Married") && (
                  <>
                    <p className="border-b border-dashed border-slate-300 py-1">
                      <strong className="text-slate-500">Spouse Name:</strong> {taxReturn.taxpayer.spouseFirstName} {taxReturn.taxpayer.spouseLastName}
                    </p>
                    <p className="py-1">
                      <strong className="text-slate-500">Spouse SSN:</strong> {taxReturn.taxpayer.spouseSsn || "XXX-XX-XXXX"}
                    </p>
                  </>
                )}
                {!taxReturn.taxpayer.filingStatus.includes("Married") && (
                  <p className="pt-1 text-slate-400">No Spouse Record Filed</p>
                )}
              </div>
              <div className="col-span-2 border-t border-slate-300 pt-2 text-[10px]">
                <strong className="text-slate-500">Home Address:</strong> {taxReturn.taxpayer.address}, {taxReturn.taxpayer.city}, {taxReturn.taxpayer.state} {taxReturn.taxpayer.zipCode}
              </div>
            </div>

            {/* Dependents summary in facsimile */}
            <div>
              <p className="bg-slate-900 text-white font-mono px-2 py-1 text-xs uppercase font-bold tracking-wider">Dependents Listed</p>
              {taxReturn.dependents.length === 0 ? (
                <p className="text-xs p-2 text-slate-500 italic border border-slate-200 border-t-0 font-mono">None declared</p>
              ) : (
                <table className="w-full text-left border-collapse border border-slate-200 border-t-0 text-[10px] font-mono">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-1.5 border-r border-slate-200">Name</th>
                      <th className="p-1.5 border-r border-slate-200">SSN</th>
                      <th className="p-1.5 border-r border-slate-200">Relationship</th>
                      <th className="p-1.5 border-r border-slate-200">Months</th>
                      <th className="p-1.5">Credits Qualified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxReturn.dependents.map((dep, idx) => (
                      <tr key={dep.id || idx} className="border-b border-slate-200 last:border-0 hover:bg-slate-50/50">
                        <td className="p-1.5 border-r border-slate-200">{dep.name}</td>
                        <td className="p-1.5 border-r border-slate-200">{dep.ssn}</td>
                        <td className="p-1.5 border-r border-slate-200">{dep.relationship}</td>
                        <td className="p-1.5 border-r border-slate-200">{dep.monthsLived}</td>
                        <td className="p-1.5 font-bold text-slate-700">
                          {[
                            dep.isEligibleCTC ? "Child Tax Credit" : "",
                            dep.isEligibleODC ? "Other Dependent Credit" : "",
                            (!dep.isEligibleCTC && !dep.isEligibleODC) ? "None" : "",
                          ].filter(Boolean).join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Facsimile Form Lines Column */}
            <div>
              <p className="bg-slate-900 text-white font-mono px-2 py-1 text-xs uppercase font-bold tracking-wider mb-2">Income & Tax Calculation Summary</p>
              
              <div className="space-y-1 text-xs font-mono">
                {[
                  { line: "1a", label: "W-2 Wages, salaries, tips", val: results.totalW2Wages },
                  { line: "2a", label: "Tax-exempt interest income", val: taxReturn.interest1099s.reduce((sum, item) => sum + (Number(item.taxExemptInterest) || 0), 0) },
                  { line: "2b", label: "Taxable interest income (1099-INT)", val: results.total1099Interest },
                  { line: "3a", label: "Qualified dividends", val: results.totalQualifiedDividends },
                  { line: "3b", label: "Ordinary dividends (1099-DIV)", val: results.totalOrdinaryDividends },
                  { line: "7", label: "Capital gain or (loss). Attach standard Schedule D if required", val: results.totalCapGainIncome },
                  { line: "8", label: "Other income from Schedule 1, Part I (e.g. royalties, crypto, winnings)", val: results.totalOtherIncome },
                  { line: "8b", label: "Schedule C Net Sole Proprietorship Profit", val: results.totalScheduleCNetProfit },
                  { line: "8c", label: "Schedule E Net Rental Property Income", val: results.totalScheduleENetProfit },
                  { line: "9", label: "TOTAL INCOME. Combine lines 1 through 8c", val: results.totalIncome, bold: true },
                  { line: "10", label: "Adjustments to income from Schedule 1, Part II (e.g. SEP, IRA, 1/2 SE Tax)", val: results.totalAdjustments },
                  { line: "11", label: "ADJUSTED GROSS INCOME (AGI). Subtract line 10 from line 9", val: results.adjustedGrossIncome, bold: true, highlighted: true },
                  { line: "12", label: `${results.hasStandardDeduction ? "Standard Deduction" : "Itemized Deduction"} claimed for status`, val: results.allowedDeductionValue },
                  { line: "13", label: "Qualified Business Income (QBI) Section 199A deduction", val: results.qbiDeduction },
                  { line: "14", label: "Add deductions. Combines line 12 and 13", val: results.allowedDeductionValue + results.qbiDeduction },
                  { line: "15", label: "TAXABLE INCOME. Subtract line 14 from line 11 (if zero or less, enter 0)", val: results.taxableIncome, bold: true, highlighted: true },
                  { line: "16", label: "Tax. Calculated utilizing standard & preferential schedules", val: results.ordinaryTax + results.qualifiedDivCapGainTax },
                  { line: "23", label: "Other Taxes (e.g., self-employment tax, Additional Medicare, NIIT)", val: results.selfEmploymentTax + results.netInvestmentIncomeTax + results.additionalMedicareTax },
                  { line: "24", label: "TOTAL TAX LIABILITY. Combine lines 16 and 23", val: results.totalFederalTaxLiability, bold: true },
                  { line: "25", label: "Federal income tax withheld from Forms W-2 & 1099", val: results.totalFederalWithholding },
                  { line: "262026", label: "Estimated tax payments & prior-year credits applied", val: (Number(taxReturn.payments.estimatedQ1) || 0) + (Number(taxReturn.payments.estimatedQ2) || 0) + (Number(taxReturn.payments.estimatedQ3) || 0) + (Number(taxReturn.payments.estimatedQ4) || 0) + (Number(taxReturn.payments.priorYearOverpayment) || 0) },
                  { line: "32", label: "Refundable credits. Direct CTC refundable & EIC", val: results.totalRefundableCredits },
                  { line: "33", label: "TOTAL FEDERAL PAYMENTS & CREDITS. Combine lines 25 through 32", val: results.totalFederalPayments + results.totalRefundableCredits, bold: true },
                  { line: "34", label: "FEDERAL REFUND DUE. If line 33 is greater than line 24, subtract", val: results.isFederalRefund ? results.federalRefundOrDue : 0, isResult: true, isRefund: true },
                  { line: "37", label: "FEDERAL AMOUNT YOU OWE. If line 24 is greater than line 33, subtract", val: !results.isFederalRefund ? Math.abs(results.federalRefundOrDue) : 0, isResult: true, isRefund: false },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between border-b border-dashed border-slate-200 py-1 px-1.5 ${
                      row.bold ? "font-bold text-slate-900" : "text-slate-700"
                    } ${row.highlighted ? "bg-amber-50/75 border-b border-dashed border-amber-300" : ""} ${
                      row.isResult ? (row.isRefund ? "bg-emerald-50 text-emerald-900 font-extrabold" : "bg-red-50 text-red-900 font-extrabold") : ""
                    }`}
                  >
                    <div className="flex items-start gap-2 max-w-[70%]">
                      <span className="w-12 block shrink-0 text-slate-400 font-semibold">{row.line}</span>
                      <span>{row.label}</span>
                    </div>
                    <span className="text-right tabular-nums">
                      {row.val < 0 ? `(${Math.abs(row.val).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})` : row.val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature Block Facsimile */}
            <div className="border border-black p-3 text-[10px] space-y-2 mt-6">
              <p className="font-bold font-serif uppercase tracking-xs">Declaration & Electronic Signatures</p>
              <p className="text-slate-600 font-serif leading-tight">
                Under penalties of perjury, I declare that I have examined this return and accompanying schedules, and to the best of my knowledge and belief, they are true, correct, and complete. Declaration of preparer is based on all information of which preparer has any knowledge.
              </p>
              <div className="grid grid-cols-2 gap-4 font-mono pt-4 text-slate-800">
                <div className="border-t border-slate-400 pt-1">
                  <span>Sign Here: ________________________________</span>
                  <span className="block text-[8px] text-slate-400">Taxpayer signature & Date</span>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <span>Spouse Sign: ______________________________</span>
                  <span className="block text-[8px] text-slate-400">If joint return, both must sign</span>
                </div>
                <div className="col-span-2 border-t border-slate-300 pt-2 text-[9px] text-slate-500">
                  <span>Prepared electronically via senior software suite platform engine. Return ID: {taxReturn.id}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORT 2: Federal Tax Calculation Worksheet */}
        {activeReport === "fedCalcs" && (
          <div className="space-y-6">
            <div className="border-b border-slate-300 pb-3">
              <h2 className="text-xl font-bold uppercase tracking-wide">Federal Ordinary & Preferential Tax Calculation Worksheet</h2>
              <p className="text-xs text-slate-500">Provides step-by-step diagnostic of tax rate brackets applied.</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-800 uppercase mb-2">Step 1: Aggregate Gross Income Allocation</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 tabular-nums text-slate-700">
                  <div>W-2 Wages:</div>
                  <div className="text-right font-semibold">${results.totalW2Wages.toLocaleString()}</div>
                  <div>Taxable 1099 Interest:</div>
                  <div className="text-right font-semibold">${results.total1099Interest.toLocaleString()}</div>
                  <div>Ordinary 1099 Dividends:</div>
                  <div className="text-right font-semibold">${results.totalOrdinaryDividends.toLocaleString()}</div>
                  <div>Capital Gain or Loss:</div>
                  <div className="text-right font-semibold">${results.totalCapGainIncome.toLocaleString()}</div>
                  <div>Taxable Retirement IRA/401k:</div>
                  <div className="text-right font-semibold">${results.totalRetirementTaxable.toLocaleString()}</div>
                  <div>Taxable Social Security:</div>
                  <div className="text-right font-semibold">${results.taxableSocialSecurity.toLocaleString()}</div>
                  <div>Net Schedule C Profit:</div>
                  <div className="text-right font-semibold">${results.totalScheduleCNetProfit.toLocaleString()}</div>
                  <div>Net Schedule E Rentals:</div>
                  <div className="text-right font-semibold">${results.totalScheduleENetProfit.toLocaleString()}</div>
                  <div>Miscellaneous Other:</div>
                  <div className="text-right font-semibold">${results.totalOtherIncome.toLocaleString()}</div>
                  <div className="border-t border-slate-300 font-bold text-slate-900 pt-1">Total Gross Income:</div>
                  <div className="border-t border-slate-300 font-bold text-slate-900 pt-1 text-right">${results.totalIncome.toLocaleString()}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-800 uppercase mb-2">Step 2: Above-the-Line Adjustments to Income</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 tabular-nums text-slate-700">
                  <div>Half of Self-Employment Tax:</div>
                  <div className="text-right font-semibold">${results.deductibleSETax.toLocaleString()}</div>
                  <div>Health Savings Account (HSA):</div>
                  <div className="text-right font-semibold">${(Number(taxReturn.adjustments.hsaDeduction) || 0).toLocaleString()}</div>
                  <div>Individual Retirement Plan (IRA):</div>
                  <div className="text-right font-semibold">${(Number(taxReturn.adjustments.iraDeduction) || 0).toLocaleString()}</div>
                  <div>Student Loan Interest Paid:</div>
                  <div className="text-right font-semibold">${(Number(taxReturn.adjustments.studentLoanInterest) || 0).toLocaleString()}</div>
                  <div>Self-Employed Health Ins Premium:</div>
                  <div className="text-right font-semibold">${(Number(taxReturn.adjustments.seHealthInsurance) || 0).toLocaleString()}</div>
                  <div>SEP / SIMPLE / Solo Plan Contr:</div>
                  <div className="text-right font-semibold">
                    ${((Number(taxReturn.adjustments.sepContribution) || 0) +
                      (Number(taxReturn.adjustments.simpleIraContribution) || 0) +
                      (Number(taxReturn.adjustments.solo401kContribution) || 0)).toLocaleString()}
                  </div>
                  <div className="border-t border-slate-300 font-bold text-slate-900 pt-1">Total Adjustments applied:</div>
                  <div className="border-t border-slate-300 font-bold text-slate-900 pt-1 text-right">${results.totalAdjustments.toLocaleString()}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-800 uppercase mb-2">Step 3: Income Taxation Rates Breakdown & Safe Harbor</p>
                <div className="space-y-2 text-slate-700">
                  <p>
                    <strong>Filing Bracket Applied:</strong> {taxReturn.taxpayer.filingStatus} Brackets (2026)
                  </p>
                  <p>
                    <strong>Taxable Income:</strong> ${results.taxableIncome.toLocaleString()}
                  </p>
                  <div className="border-t border-slate-200 pt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Ordinary Tax Block:</span>
                      <span className="font-semibold">${results.ordinaryTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Qualified Dividends & Cap Gains Preferential Block:</span>
                      <span className="font-semibold">${results.qualifiedDivCapGainTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Self-Employment (FICA) Tax on Business Profit:</span>
                      <span className="font-semibold">${results.selfEmploymentTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Investment Income Tax (NIIT 3.8%):</span>
                      <span className="font-semibold">${results.netInvestmentIncomeTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Additional Employee Medicare Tax (0.9%):</span>
                      <span className="font-semibold">${results.additionalMedicareTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-300 pt-1 font-bold text-slate-900">
                      <span>Gross Federal Tax Liability:</span>
                      <span>${(results.ordinaryTax + results.qualifiedDivCapGainTax + results.selfEmploymentTax + results.netInvestmentIncomeTax + results.additionalMedicareTax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>Less Total Non-Refundable Credits Allowed:</span>
                      <span>(${results.totalNonRefundableCredits.toLocaleString()})</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-300 pt-1 font-extrabold text-slate-900 text-sm">
                      <span>Net Federal Tax Liability:</span>
                      <span>${results.totalFederalTaxLiability.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safe Harbor Analysis */}
              <div className="p-4 rounded-lg border-l-4 border-amber-500 bg-amber-50/50">
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Estimated Tax Safe Harbor Assessment
                </h4>
                <div className="grid grid-cols-2 gap-y-1 text-slate-700">
                  <div>Filing Year Adjusted Gross Income (AGI):</div>
                  <div className="text-right font-medium">${results.adjustedGrossIncome.toLocaleString()}</div>
                  <div>Prior Year Federal Tax Claimed:</div>
                  <div className="text-right font-medium">${taxReturn.priorYearTaxField.toLocaleString()}</div>
                  <div>Safe Harbor Percent Rule:</div>
                  <div className="text-right font-medium">
                    {results.adjustedGrossIncome > (taxReturn.taxpayer.filingStatus === "Married Filing Separately" ? 75000 : 150000) ? "110% of prior year tax" : "100% of prior year tax"}
                  </div>
                  <div>Safe Harbor Required Annual Payment:</div>
                  <div className="text-right font-bold text-slate-900">${Math.round(results.safeHarborTotalRequired).toLocaleString()}</div>
                  <div>Actual Withholding Credits (W2 + 1099):</div>
                  <div className="text-right font-semibold text-slate-900">${results.totalFederalWithholding.toLocaleString()}</div>
                  <div className="border-t border-amber-200 pt-2 font-bold col-span-2 flex items-center justify-between text-slate-900">
                    <span>Safe Harbor Status:</span>
                    <span>
                      {results.safeHarborMet ? (
                        <span className="text-emerald-700 font-extrabold uppercase">Met via Withholding</span>
                      ) : (
                        <span className="text-amber-700 font-extrabold uppercase">Not Met - Quarterly Payments Required</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORT 3: State Tax Calculation Worksheet */}
        {activeReport === "stateCalcs" && (
          <div className="space-y-6">
            <div className="border-b border-slate-300 pb-3">
              <h2 className="text-xl font-bold uppercase tracking-wide">
                State Allocation & Calculation Worksheet - {taxReturn.stateTax.residentState}
              </h2>
              <p className="text-xs text-slate-500">Shows calculation of state taxable income and state allocation factors.</p>
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-800">
              <div className="grid grid-cols-2 gap-4 border border-slate-200 p-3 bg-slate-50">
                <div>
                  <strong>Resident State:</strong> {taxReturn.stateTax.residentState}
                </div>
                <div>
                  <strong>Filing Status Equivalent:</strong> {taxReturn.taxpayer.filingStatus}
                </div>
                <div>
                  <strong>Resident Wages:</strong> ${results.totalW2Wages.toLocaleString()}
                </div>
                <div>
                  <strong>State Allocated Income:</strong> ${results.stateAllocatedGrossIncome.toLocaleString()}
                </div>
              </div>

              <div className="border border-slate-250 rounded-lg overflow-hidden">
                <p className="bg-slate-900 text-white font-mono px-3 py-1.5 font-bold uppercase">State Taxable Income Walk</p>
                <div className="p-3 space-y-2 tabular-nums">
                  <div className="flex justify-between">
                    <span>Federal Adjusted Gross Income (AGI):</span>
                    <span>${results.adjustedGrossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Allocated Segment:</span>
                    <span>${results.stateAllocatedGrossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-700">
                    <span>Add state-specific additions (e.g. out-of-state muni bonds):</span>
                    <span>+${(Number(taxReturn.stateTax.stateAdditions) || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Less state-specific subtractions (e.g. US treasury interest):</span>
                    <span>-${(Number(taxReturn.stateTax.stateSubtractions) || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Less State Deductions claimed:</span>
                    <span>-${(Number(taxReturn.stateTax.stateDeductions) || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 pt-1 font-bold text-slate-900">
                    <span>State Taxable Income:</span>
                    <span>${results.stateTaxableIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span>Applied Bracket Rate Method:</span>
                    <span className="font-bold uppercase text-slate-600">
                      {STATES_LIST.find(s => s.code === taxReturn.stateTax.residentState)?.type || "No Tax"} 
                      ({STATES_LIST.find(s => s.code === taxReturn.stateTax.residentState)?.flatRate ? `${(STATES_LIST.find(s => s.code === taxReturn.stateTax.residentState)!.flatRate! * 100).toFixed(2)}%` : "Brackets"})
                    </span>
                  </div>
                  
                  <div className="flex justify-between pt-1">
                    <span>Gross State Tax Liability:</span>
                    <span>${results.stateTaxLiability.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 border-b border-slate-200 pb-2">
                    <span>Less State Credits applied:</span>
                    <span>-${(Number(taxReturn.stateTax.stateCredits) || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-sm">
                    <span>Net State Tax Liability:</span>
                    <span>${results.stateTaxLiability.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800">
                    <span>State Wages income tax withheld (W-2):</span>
                    <span>-${results.stateTotalWithholding.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 border-b border-slate-200 pb-2">
                    <span>State Estimated & Extension payments:</span>
                    <span>-${((Number(taxReturn.stateTax.stateEstimatedPayments) || 0) + (Number(taxReturn.stateTax.stateExtensionPayments) || 0)).toLocaleString()}</span>
                  </div>

                  <div className={`p-2.5 rounded text-xs flex justify-between font-extrabold ${results.isStateRefund ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
                    <span>{results.isStateRefund ? "STATE REFUND DUE:" : "STATE BALANCE DUE:"}</span>
                    <span>${Math.abs(results.stateRefundOrDue).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORT 4: Schedule C Business Summary */}
        {activeReport === "schC" && (
          <div className="space-y-6">
            <div className="border-b border-black pb-2 flex justify-between items-end">
              <div>
                <span className="block text-xl font-extrabold font-mono uppercase">Schedule C (Form 1040)</span>
                <span className="text-[10px] uppercase font-bold text-slate-800 block">Department of the Treasury—Internal Revenue Service</span>
                <span className="text-xs font-bold font-serif text-slate-700">Profit or Loss From Business (Sole Proprietorship)</span>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-black font-mono">2026</span>
              </div>
            </div>

            {taxReturn.businesses.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-mono text-xs border border-dashed border-slate-200">
                <p>No Schedule C business files linked to this return.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {taxReturn.businesses.map((biz, idx) => {
                  const grossIn = (Number(biz.grossReceipts) || 0) - (Number(biz.returnsAllowances) || 0) + (Number(biz.otherIncome) || 0);
                  const totalEx = Object.values(biz.expenses || {}).reduce((s, val) => s + (Number(val) || 0), 0);
                  const netProf = grossIn - totalEx;

                  return (
                    <div key={biz.id || idx} className="space-y-4 border-b border-dashed border-slate-300 pb-6 last:border-0 last:pb-0">
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border border-slate-300 p-2.5 bg-slate-50">
                        <div><strong>Business Name:</strong> {biz.businessName || "Unnamed Business"}</div>
                        <div><strong>Type:</strong> {biz.businessType}</div>
                        <div><strong>Employer ID (EIN):</strong> {biz.ein || "N/A"}</div>
                        <div><strong>NAICS Code:</strong> {biz.naicsCode || "N/A"}</div>
                        <div><strong>Accounting Method:</strong> {biz.accountingMethod}</div>
                        <div><strong>Materially Participated:</strong> {biz.materialParticipation ? "Yes" : "No"}</div>
                      </div>

                      <div className="font-mono text-xs text-slate-800 space-y-1">
                        <div className="bg-slate-100 px-2 py-0.5 font-bold uppercase text-[10px] text-slate-600 mb-1">Part I: Profit or Loss Reconciliation</div>
                        
                        <div className="flex justify-between">
                          <span>1. Gross receipts or sales:</span>
                          <span className="tabular-nums">${(Number(biz.grossReceipts) || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-red-700">
                          <span>2. Less returns and allowances:</span>
                          <span className="tabular-nums">-${(Number(biz.returnsAllowances) || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>3. Other Business Income:</span>
                          <span className="tabular-nums">+${(Number(biz.otherIncome) || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold border-b border-slate-200 pb-1 text-slate-900">
                          <span>5. GROSS BUSINESS REVENUE:</span>
                          <span className="tabular-nums">${grossIn.toLocaleString()}</span>
                        </div>

                        <div className="bg-slate-100 px-2 py-0.5 font-bold uppercase text-[10px] text-slate-600 my-2">Part II: Operating Expenses</div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar text-slate-600">
                          {Object.entries(biz.expenses || {}).map(([key, val]) => (
                            <div key={key} className="flex justify-between text-[11px] border-b border-dashed border-slate-100 py-0.5 capitalize">
                              <span>• {key.replace(/([A-Z])/g, " $1")}:</span>
                              <span className="tabular-nums text-slate-800 font-semibold">${(Number(val) || 0).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between border-t border-slate-300 pt-1 font-bold text-slate-900 mt-2">
                          <span>Total Business Expenses:</span>
                          <span className="tabular-nums">${totalEx.toLocaleString()}</span>
                        </div>

                        <div className={`p-2 rounded mt-2 flex justify-between font-extrabold ${netProf >= 0 ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
                          <span>NET BUSINESS PROFIT/LOSS (Schedule C Line 31):</span>
                          <span className="tabular-nums">${netProf.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* REPORT 5: Schedule E Rental Property Summary */}
        {activeReport === "schE" && (
          <div className="space-y-6">
            <div className="border-b border-black pb-2 flex justify-between items-end">
              <div>
                <span className="block text-xl font-extrabold font-mono uppercase">Schedule E (Form 1040)</span>
                <span className="text-[10px] uppercase font-bold text-slate-800 block">Department of the Treasury—Internal Revenue Service</span>
                <span className="text-xs font-bold font-serif text-slate-700">Supplemental Income and Loss (Rental, Royalties, Partners)</span>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-black font-mono">2026</span>
              </div>
            </div>

            {taxReturn.properties.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-mono text-xs border border-dashed border-slate-200">
                <p>No Schedule E Rental Properties linked to this return.</p>
              </div>
            ) : (
              <div className="space-y-8 font-mono text-xs text-slate-800">
                {taxReturn.properties.map((prop, idx) => {
                  const grossRental = Number(prop.rentalIncome) || 0;
                  const totalPropExp = (Number(prop.mortgageInterest) || 0) +
                    (Number(prop.propertyTax) || 0) +
                    (Number(prop.insurance) || 0) +
                    (Number(prop.repairs) || 0) +
                    (Number(prop.hoa) || 0) +
                    (Number(prop.utilities) || 0) +
                    (Number(prop.depreciation) || 0) +
                    (Number(prop.otherExpenses) || 0);
                  const netProf = grossRental - totalPropExp;

                  return (
                    <div key={prop.id || idx} className="border border-slate-200 p-4 rounded-lg bg-slate-50/20">
                      <p className="font-bold border-b border-slate-350 pb-1 mb-2 text-slate-900 uppercase">Property Address: {prop.propertyAddress || `Rental Property #${idx + 1}`}</p>
                      
                      <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-slate-700">
                        <div>Rental Income received:</div>
                        <div className="text-right font-bold text-slate-900">${grossRental.toLocaleString()}</div>
                        
                        <div className="col-span-2 text-[10px] font-bold text-slate-500 uppercase mt-2 border-b border-slate-200 pb-0.5">Rental Expenses Breakdown</div>

                        <div>Mortgage Interest Paid:</div>
                        <div className="text-right font-semibold">${(Number(prop.mortgageInterest) || 0).toLocaleString()}</div>
                        
                        <div>Real estate taxes:</div>
                        <div className="text-right font-semibold">${(Number(prop.propertyTax) || 0).toLocaleString()}</div>
                        
                        <div>Home Insurance Premium:</div>
                        <div className="text-right font-semibold">${(Number(prop.insurance) || 0).toLocaleString()}</div>
                        
                        <div>Maintenance & Repairs:</div>
                        <div className="text-right font-semibold">${(Number(prop.repairs) || 0).toLocaleString()}</div>
                        
                        <div>HOA Fees & Assessments:</div>
                        <div className="text-right font-semibold">${(Number(prop.hoa) || 0).toLocaleString()}</div>
                        
                        <div>Utilities Paid:</div>
                        <div className="text-right font-semibold">${(Number(prop.utilities) || 0).toLocaleString()}</div>
                        
                        <div>Depreciation deduction:</div>
                        <div className="text-right font-semibold">${(Number(prop.depreciation) || 0).toLocaleString()}</div>
                        
                        <div>Other miscellaneous expenses:</div>
                        <div className="text-right font-semibold">${(Number(prop.otherExpenses) || 0).toLocaleString()}</div>

                        <div className="border-t border-slate-300 font-bold text-slate-900 pt-1 mt-2">Total Property Expenses:</div>
                        <div className="border-t border-slate-300 font-bold text-slate-900 pt-1 mt-2 text-right">${totalPropExp.toLocaleString()}</div>
                        
                        <div className={`col-span-2 py-1.5 px-2 rounded-sm font-extrabold mt-2 flex justify-between ${netProf >= 0 ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
                          <span>Supplemental Rental Net Outcome:</span>
                          <span>${netProf.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* REPORT 6: Estimated Tax Payments Vouchers (1040-ES) */}
        {activeReport === "vouchers" && (
          <div className="space-y-6">
            <div className="border-b border-slate-300 pb-3">
              <h2 className="text-xl font-bold uppercase tracking-wide">Form 1040-ES Estimated Tax Vouchers</h2>
              <p className="text-xs text-slate-500">
                Safe Harbor required payments to protect against underpayment penalties for tax year 2026.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border border-dashed border-slate-300 p-4 bg-slate-50 font-mono text-xs m-4">
              <div><strong>Projected AGI (2026):</strong> ${results.adjustedGrossIncome.toLocaleString()}</div>
              <div><strong>Required Annual Safe Harbor:</strong> ${Math.round(results.safeHarborTotalRequired).toLocaleString()}</div>
              <div><strong>Withholdings applied:</strong> ${results.totalFederalWithholding.toLocaleString()}</div>
              <div><strong>Withholdings Safe Harbor Deficit:</strong> ${results.safeHarborMet ? "$0" : `$${Math.round(Math.max(0, results.safeHarborTotalRequired - results.totalFederalWithholding)).toLocaleString()}`}</div>
            </div>

            <div className="space-y-8 font-mono text-[10px] text-slate-800">
              {[
                { q: "Q1 Voucher", due: "April 15, 2026", amount: results.estimatedQ1Required },
                { q: "Q2 Voucher", due: "June 15, 2026", amount: results.estimatedQ2Required },
                { q: "Q3 Voucher", due: "September 15, 2026", amount: results.estimatedQ3Required },
                { q: "Q4 Voucher", due: "January 15, 2027", amount: results.estimatedQ4Required },
              ].map((v, i) => (
                <div key={i} className="border border-black p-4 rounded-xs relative">
                  <div className="absolute top-1.5 right-2 font-black uppercase text-xl select-none text-slate-200">1040-ES</div>
                  <div className="flex justify-between items-start border-b border-slate-300 pb-2 mb-2 font-bold uppercase text-slate-800">
                    <div>
                      <span>Form 1045-ES</span>
                      <span className="block text-[8px] font-medium text-slate-500">Department of the Treasury — IRS</span>
                    </div>
                    <span>{v.q} - Year 2026 Payment Voucher</span>
                    <div>
                      <span>Due: {v.due}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 uppercase text-[9px] text-slate-500 space-y-1">
                      <p><strong>Taxpayer Name:</strong> {taxReturn.taxpayer.firstName} {taxReturn.taxpayer.lastName}</p>
                      <p><strong>Filing SSN:</strong> {taxReturn.taxpayer.ssn || "XXX-XX-XXXX"}</p>
                      <p><strong>Address:</strong> {taxReturn.taxpayer.address}, {taxReturn.taxpayer.city}, {taxReturn.taxpayer.state} {taxReturn.taxpayer.zipCode}</p>
                    </div>
                    <div className="border-l border-black pl-4 flex flex-col justify-center bg-slate-50">
                      <span className="text-[8px] uppercase tracking-wider font-bold">Voucher Payment Amount</span>
                      <span className="text-lg font-black tracking-tight tabular-nums text-slate-950">${v.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORT 7: Client Letter & Overview Summary Memo */}
        {activeReport === "clientLetter" && (
          <div className="space-y-6 font-serif text-[13px] text-slate-900 leading-relaxed md:px-6">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-bold font-sans text-slate-800">Tax Return Estimation Memo</h2>
                <p className="text-xs font-sans text-slate-500">Client Copy • Date Generated: {todayStr}</p>
              </div>
              <div className="text-right">
                <h3 className="font-sans font-bold text-slate-800">TAXPREP SUITE, LLC</h3>
                <p className="text-[10px] font-sans text-slate-400">Professional individual Tax Solutions</p>
              </div>
            </div>

            <div className="space-y-4">
              <p>
                Dear <strong>{taxReturn.taxpayer.firstName} {taxReturn.taxpayer.lastName}</strong>,
              </p>
              <p>
                We have prepared the preliminary draft of your U.S. Individual Income Tax Return (Form 1040) and associated state configurations for the tax year ending December 31, 2026. This letter summarizes the federal and state tax postures generated based on files, ledgers, and information submitted.
              </p>

              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm border-b border-slate-200 pb-1 mb-2 uppercase tracking-wide">Key Metrics Review</h3>
                <table className="w-full text-left font-sans text-xs border border-slate-200 rounded-lg overflow-hidden shrink-0">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                      <th className="p-2">Description</th>
                      <th className="p-2 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-2">Adjusted Gross Income (AGI)</td>
                      <td className="p-2 text-right font-mono font-semibold">${results.adjustedGrossIncome.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-2">Higher of Standard or Itemized Deduction Option</td>
                      <td className="p-2 text-right font-mono text-slate-600">${results.allowedDeductionValue.toLocaleString()} ({results.hasStandardDeduction ? "Standard" : "Itemized"})</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-2">Taxable Income</td>
                      <td className="p-2 text-right font-mono font-semibold">${results.taxableIncome.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-2">Total Federal Tax Liabilities</td>
                      <td className="p-2 text-right font-mono font-semibold text-red-700">${results.totalFederalTaxLiability.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-2">Withholdings & Credits Applied (Federal)</td>
                      <td className="p-2 text-right font-mono text-emerald-700">${(results.totalFederalPayments + results.totalRefundableCredits).toLocaleString()}</td>
                    </tr>
                    <tr className={`border-b border-slate-200 font-bold ${results.isFederalRefund ? "text-emerald-800 bg-emerald-50/50" : "text-red-800 bg-red-50/50"}`}>
                      <td className="p-2">{results.isFederalRefund ? "Federal Refund Anticipated" : "Federal Balance Due"}</td>
                      <td className="p-2 text-right font-mono text-sm">${Math.abs(results.federalRefundOrDue).toLocaleString()}</td>
                    </tr>
                    <tr className={`font-bold ${results.isStateRefund ? "text-emerald-800" : "text-red-800"}`}>
                      <td className="p-2">{taxReturn.stateTax.residentState} State {results.isStateRefund ? "Refund" : "Balance Due"}</td>
                      <td className="p-2 text-right font-mono">${Math.abs(results.stateRefundOrDue).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm border-b border-slate-200 pb-1 mb-2 uppercase tracking-wide">Next Compliance Actions</h3>
                <ul className="list-disc pl-5 font-sans text-xs text-slate-600 space-y-2">
                  <li>
                    <strong>Return Filing Status:</strong> Your return is presently set under status <strong>{taxReturn.status}</strong>. If finished editing, we will submit the return electronically to the IRS and {taxReturn.stateTax.residentState} Franchise Board.
                  </li>
                  {!results.safeHarborMet && (
                    <li>
                      <strong>Underpayment Warning:</strong> Because your withholding does not meet 2026 underpayment safe harbors, you must submit quarterly estimated tax vouchers (1040-ES) of ${results.estimatedQ1Required.toLocaleString()} every quarter on April 15, June 15, September 15, and January 15 to avoid interest penalty assessments.
                    </li>
                  )}
                  {results.safeHarborMet && (
                    <li className="text-emerald-700">
                      <strong>Good Standing:</strong> Safe-harbor thresholds are fully satisfied via employee salary withholding. No quarterly vouchers are deemed critically required for 2026.
                    </li>
                  )}
                </ul>
              </div>

              <p className="pt-4 border-t border-slate-200 text-slate-500 text-xs italic font-sans text-center">
                This calculation has been processed with professional individual tax engines and constitutes a professional estimation model. All figures must be confirmed prior to final electronic submission.
              </p>
            </div>
          </div>
        )}

        {/* Footer info stamp for printed materials */}
        <div className="absolute bottom-2 left-8 right-8 flex justify-between text-[8px] font-mono text-slate-400 border-t border-slate-100 pt-2 print:border-t print:pt-1">
          <span>Client: {taxReturn.clientName}</span>
          <span>Form 1040 Tax Calculation Suite — 2026 Draft Report</span>
          <span>Return ID: {taxReturn.id}</span>
        </div>
      </div>
    </div>
  );
}
