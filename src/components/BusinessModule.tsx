/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TaxReturn, ScheduleCBusiness, BusinessType } from "../types";
import { Plus, Trash, Store, AlertCircle, TrendingUp, Calculator } from "lucide-react";

interface BusinessModuleProps {
  taxReturn: TaxReturn;
  onChange: (updated: TaxReturn) => void;
}

export default function BusinessModule({ taxReturn, onChange }: BusinessModuleProps) {
  const businesses = taxReturn.businesses || [];

  const addBusiness = () => {
    const freshBiz: ScheduleCBusiness = {
      id: "biz-" + Math.random().toString(36).substr(2, 9),
      businessName: "",
      businessType: BusinessType.Consultant,
      ein: "",
      businessAddress: "",
      naicsCode: "541511",
      accountingMethod: "Cash",
      materialParticipation: true,
      
      grossReceipts: 0,
      returnsAllowances: 0,
      otherIncome: 0,
      
      expenses: {
        advertising: 0,
        carTruck: 0,
        commissions: 0,
        contractLabor: 0,
        insurance: 0,
        interest: 0,
        legalProfessional: 0,
        officeExpense: 0,
        rent: 0,
        repairs: 0,
        supplies: 0,
        taxesLicenses: 0,
        travel: 0,
        meals: 0,
        utilities: 0,
        wages: 0,
        depreciation: 0,
        homeOffice: 0,
        otherExpenses: 0,
      },
    };
    onChange({
      ...taxReturn,
      businesses: [...businesses, freshBiz],
    });
  };

  const removeBusiness = (id: string) => {
    onChange({
      ...taxReturn,
      businesses: businesses.filter((b) => b.id !== id),
    });
  };

  const updateBusiness = (id: string, field: keyof ScheduleCBusiness, value: any) => {
    onChange({
      ...taxReturn,
      businesses: businesses.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    });
  };

  const updateBusinessExpense = (id: string, expName: keyof ScheduleCBusiness["expenses"], value: number) => {
    onChange({
      ...taxReturn,
      businesses: businesses.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            expenses: {
              ...b.expenses,
              [expName]: value,
            },
          };
        }
        return b;
      }),
    });
  };

  return (
    <div className="space-y-4">
      {/* Intro strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-150">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Schedule C Business Profits & Losses</h3>
          <p className="text-xs text-slate-500">
            For sole proprietors, freelancers, independent contractors, single-member LLCs, and gig economy workers.
          </p>
        </div>
        <button
          onClick={addBusiness}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Business</span>
        </button>
      </div>

      {businesses.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 font-mono">
          <Store className="w-8 h-8 text-slate-350 mx-auto mb-2" />
          No Schedule C businesses filed yet. Click Add Business above to launch.
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {businesses.map((biz, index) => {
            const grossRev = (Number(biz.grossReceipts) || 0) - (Number(biz.returnsAllowances) || 0) + (Number(biz.otherIncome) || 0);
            const totalExp = Object.values(biz.expenses || {}).reduce((s, val) => s + (Number(val) || 0), 0);
            const netProfit = grossRev - totalExp;

            // Direct estimation logic displayed live inside each widget box! Very comforting for taxpayers!
            const seEarnings = netProfit * 0.9235;
            const approxSE = netProfit > 400 ? Math.round(Math.min(seEarnings, 176100) * 0.124 + seEarnings * 0.029) : 0;
            const approxQbi = Math.round(Math.max(0, netProfit - approxSE * 0.5) * 0.2);

            return (
              <div
                key={biz.id}
                className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden font-sans hover:border-slate-350 transition-all"
              >
                {/* Collapsible header */}
                <div className="bg-slate-50 border-b border-secondary/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Store className="w-4.5 h-4.5 text-slate-700" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {biz.businessName || "New Business sole proprietorship"}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {biz.id} • NAICS: {biz.naicsCode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-bold px-2 py-1 rounded font-mono ${netProfit >= 0 ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                      Net profit: ${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => removeBusiness(biz.id)}
                      className="text-[10px] bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold px-2 py-1 rounded transition-all shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Main body divided into Details, Income, Expenses */}
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Part A: Settings */}
                    <div className="space-y-4 border-r border-slate-100 pr-0 md:pr-4">
                      <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Business profile</h5>
                      
                      <div className="space-y-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Business Trading Name</label>
                          <input
                            type="text"
                            value={biz.businessName}
                            onChange={(e) => updateBusiness(biz.id, "businessName", e.target.value)}
                            placeholder="My Consulting Firm"
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-semibold"
                          />
                        </div>

                        <div className="space-y-1 font-sans">
                          <label className="text-[10px] font-bold text-slate-500">Business Sector Category</label>
                          <select
                            value={biz.businessType}
                            onChange={(e) => updateBusiness(biz.id, "businessType", e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-medium"
                          >
                            {Object.values(BusinessType).map((bt) => (
                              <option key={bt} value={bt}>{bt}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1 font-sans">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Employer EIN</label>
                            <input
                              type="text"
                              value={biz.ein}
                              onChange={(e) => updateBusiness(biz.id, "ein", e.target.value)}
                              placeholder="XX-XXXXXXX"
                              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                            />
                          </div>
                          <div className="space-y-1 font-sans">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">NAICS Code</label>
                            <input
                              type="text"
                              value={biz.naicsCode}
                              onChange={(e) => updateBusiness(biz.id, "naicsCode", e.target.value)}
                              placeholder="541511"
                              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 font-sans">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Business Physical Address</label>
                          <input
                            type="text"
                            value={biz.businessAddress}
                            onChange={(e) => updateBusiness(biz.id, "businessAddress", e.target.value)}
                            placeholder="123 Corporate Dr, San Jose CA"
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <label className="inline-flex flex-col text-[10px] font-bold text-slate-500 uppercase font-sans">
                            <span>Accounting Method</span>
                            <select
                              value={biz.accountingMethod}
                              onChange={(e) => updateBusiness(biz.id, "accountingMethod", e.target.value)}
                              className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md mt-1"
                            >
                              <option value="Cash">Cash Method</option>
                              <option value="Accrual">Accrual Method</option>
                              <option value="Other">Other Mode</option>
                            </select>
                          </label>

                          <label className="inline-flex flex-col text-[10px] font-bold text-slate-550 uppercase select-none font-sans justify-center">
                            <span>Participated?</span>
                            <div className="flex gap-2 items-center mt-2.5">
                              <input
                                type="checkbox"
                                checked={biz.materialParticipation}
                                onChange={(e) => updateBusiness(biz.id, "materialParticipation", e.target.checked)}
                                className="w-4 h-4 accent-slate-900 rounded-xs cursor-pointer"
                              />
                              <span className="text-xs text-slate-700 capitalize font-medium">{biz.materialParticipation ? "Materially" : "Passive"}</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Part B: Income Ledgers */}
                    <div className="space-y-4 border-r border-slate-100 pr-0 md:pr-4">
                      <h5 className="text-[11px] font-bold text-slate-405 uppercase tracking-wider">Gross business revenues</h5>
                      
                      <div className="space-y-3 font-sans">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-550">Line 1: Gross receipts or sales volume</label>
                          <input
                            type="number"
                            value={biz.grossReceipts || ""}
                            onChange={(e) => updateBusiness(biz.id, "grossReceipts", Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-550 text-red-700">Line 2: Less returns and client allowances</label>
                          <input
                            type="number"
                            value={biz.returnsAllowances || ""}
                            onChange={(e) => updateBusiness(biz.id, "returnsAllowances", Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 text-xs bg-red-50/10 border border-red-200 rounded-md focus:outline-hidden font-mono font-medium text-red-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-550">Line 6: Other miscellaneous business income</label>
                          <input
                            type="number"
                            value={biz.otherIncome || ""}
                            onChange={(e) => updateBusiness(biz.id, "otherIncome", Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                          />
                        </div>

                        <div className="mt-6 p-3 bg-slate-50 rounded-lg text-slate-750 font-mono text-[11px]">
                          <div className="flex justify-between border-b border-slate-200 pb-1 font-bold">
                            <span>Computed Gross Rev:</span>
                            <span>${grossRev.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between pt-1 text-[10px]">
                            <span>Approx. FICA SE due:</span>
                            <span className="font-semibold">${approxSE.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-emerald-800 font-semibold">
                            <span>Approx. QBI deduction (20%):</span>
                            <span>${approxQbi.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Part C: Operating Expenses (19 inputs) */}
                    <div className="space-y-3 font-sans">
                      <h5 className="text-[11px] font-bold text-slate-405 uppercase tracking-wider">operating Expenses (Part II)</h5>
                      
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar text-slate-700">
                        {[
                          { key: "advertising", label: "Advertising" },
                          { key: "carTruck", label: "Car & Truck Expenses" },
                          { key: "commissions", label: "Commissions / Fees" },
                          { key: "contractLabor", label: "Contract Labor" },
                          { key: "insurance", label: "Insurance (non-health)" },
                          { key: "interest", label: "Mortgage/Business Interest" },
                          { key: "legalProfessional", label: "Legal & Professional" },
                          { key: "officeExpense", label: "Office Expense" },
                          { key: "rent", label: "Rent / Lease (vehicles/machinery)" },
                          { key: "repairs", label: "Repairs & Maintenance" },
                          { key: "supplies", label: "Supplies (materials)" },
                          { key: "taxesLicenses", label: "Taxes & Licenses" },
                          { key: "travel", label: "Travel lodging" },
                          { key: "meals", label: "Meals entertainment (50%)" },
                          { key: "utilities", label: "Utilities (power, tech)" },
                          { key: "wages", label: "Wages (W-2 paid)" },
                          { key: "depreciation", label: "Depreciation Section 179" },
                          { key: "homeOffice", label: "Business use of home" },
                          { key: "otherExpenses", label: "Other Business Expenses" },
                        ].map((exp) => (
                          <div key={exp.key} className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1">
                            <label className="text-[11px] text-slate-600 capitalize shrink-0 font-medium">
                              {exp.label}
                            </label>
                            <input
                              type="number"
                              value={biz.expenses[exp.key as keyof ScheduleCBusiness["expenses"]] || ""}
                              placeholder="0"
                              onChange={(e) => updateBusinessExpense(biz.id, exp.key as any, Number(e.target.value) || 0)}
                              className="w-24 text-right px-2 py-0.5 text-xs bg-slate-50 border border-slate-205 rounded-sm focus:outline-hidden font-mono"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Total operational Expenses:</span>
                        <span className="font-mono text-xs font-black text-slate-900">${totalExp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
