/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TaxReturn, ScheduleEProperty } from "../types";
import { Plus, Trash, Home, DollarSign, Wallet } from "lucide-react";

interface RentalModuleProps {
  taxReturn: TaxReturn;
  onChange: (updated: TaxReturn) => void;
}

export default function RentalModule({ taxReturn, onChange }: RentalModuleProps) {
  const properties = taxReturn.properties || [];

  const addProperty = () => {
    const freshProp: ScheduleEProperty = {
      id: "prop-" + Math.random().toString(36).substr(2, 9),
      propertyAddress: "",
      rentalIncome: 0,
      mortgageInterest: 0,
      propertyTax: 0,
      insurance: 0,
      repairs: 0,
      hoa: 0,
      utilities: 0,
      depreciation: 0,
      otherExpenses: 0,
    };
    onChange({
      ...taxReturn,
      properties: [...properties, freshProp],
    });
  };

  const removeProperty = (id: string) => {
    onChange({
      ...taxReturn,
      properties: properties.filter((p) => p.id !== id),
    });
  };

  const updateProperty = (id: string, field: keyof ScheduleEProperty, value: any) => {
    onChange({
      ...taxReturn,
      properties: properties.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  return (
    <div className="space-y-4">
      {/* Intro header block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-150">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Schedule E Supplemental Income (Rentals)</h3>
          <p className="text-xs text-slate-500">
            For individual landlords, multifamily units owners, or short-term vacation rental operators (e.g. Airbnb).
          </p>
        </div>
        <button
          onClick={addProperty}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Rental</span>
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-slate-205 text-xs text-slate-400 font-mono">
          <Home className="w-8 h-8 text-slate-350 mx-auto mb-2" />
          No Schedule E rental properties registered on this return yet.
        </div>
      ) : (
        <div className="space-y-6">
          {properties.map((prop, idx) => {
            const grossRental = Number(prop.rentalIncome) || 0;
            const totalPropExp = (Number(prop.mortgageInterest) || 0) +
              (Number(prop.propertyTax) || 0) +
              (Number(prop.insurance) || 0) +
              (Number(prop.repairs) || 0) +
              (Number(prop.hoa) || 0) +
              (Number(prop.utilities) || 0) +
              (Number(prop.depreciation) || 0) +
              (Number(prop.otherExpenses) || 0);
            
            const netRentProfit = grossRental - totalPropExp;

            return (
              <div
                key={prop.id}
                className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden font-sans hover:border-slate-350 transition-all space-y-4"
              >
                {/* Individual panel header bar */}
                <div className="bg-slate-50 border-b border-secondary/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Home className="w-4.5 h-4.5 text-slate-700" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {prop.propertyAddress || "New Real Estate Rental Property"}
                      </h4>
                      <p className="text-[10px] text-slate-450 font-mono">ID: {prop.id} • Schedule E Supplemental Income</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${netRentProfit >= 0 ? "bg-emerald-55 text-emerald-800" : "bg-red-55 text-red-800"}`}>
                      Net Supplemental Rent: ${netRentProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => removeProperty(prop.id)}
                      className="text-[10px] bg-red-50 text-red-650 hover:bg-red-100 hover:text-red-700 font-extrabold px-2 py-0.5 rounded transition-all shrink-0 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left: Demographics & Rental Income */}
                    <div className="space-y-4 md:col-span-1 border-r border-slate-100 pr-0 md:pr-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Property Physical Description / Address</label>
                        <input
                          type="text"
                          value={prop.propertyAddress}
                          onChange={(e) => updateProperty(prop.id, "propertyAddress", e.target.value)}
                          placeholder="e.g. 712 Walnut St, Fort Collins, CO"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Gross Rents Gathered (Annual)</label>
                        <div className="relative">
                          <DollarSign className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                          <input
                            type="number"
                            value={prop.rentalIncome || ""}
                            onChange={(e) => updateProperty(prop.id, "rentalIncome", Number(e.target.value) || 0)}
                            className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-205 rounded-md focus:outline-hidden font-mono font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50/30 rounded-lg text-slate-700 font-mono text-[10px] leading-relaxed border border-amber-200/50">
                        ⚠️ <strong>Depreciation Tip:</strong> Land value is NEVER depreciable. Only buildings and structural improvements can be depreciated over the standard residential 27.5-year timeline.
                      </div>
                    </div>

                    {/* Right: Expenses breakdown (2 columns span) */}
                    <div className="md:col-span-2 space-y-3">
                      <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Supplemental Rental Operating Expenses</h5>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase">Mortgage Interest Paid</label>
                          <input
                            type="number"
                            value={prop.mortgageInterest || ""}
                            onChange={(e) => updateProperty(prop.id, "mortgageInterest", Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase">Real Estate Property Tax</label>
                          <input
                            type="number"
                            value={prop.propertyTax || ""}
                            onChange={(e) => updateProperty(prop.id, "propertyTax", Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase">Landlord Insurance Premium</label>
                          <input
                            type="number"
                            value={prop.insurance || ""}
                            onChange={(e) => updateProperty(prop.id, "insurance", Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase">Maintenance & Repairs</label>
                          <input
                            type="number"
                            value={prop.repairs || ""}
                            onChange={(e) => updateProperty(prop.id, "repairs", Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase">HOA / Property Management Fees</label>
                          <input
                            type="number"
                            value={prop.hoa || ""}
                            onChange={(e) => updateProperty(prop.id, "hoa", Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase">Utilities paid by owner</label>
                          <input
                            type="number"
                            value={prop.utilities || ""}
                            onChange={(e) => updateProperty(prop.id, "utilities", Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase">Building Depreciation deduction</label>
                          <input
                            type="number"
                            value={prop.depreciation || ""}
                            onChange={(e) => updateProperty(prop.id, "depreciation", Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-450 uppercase">Other Property expenses</label>
                          <input
                            type="number"
                            value={prop.otherExpenses || ""}
                            onChange={(e) => updateProperty(prop.id, "otherExpenses", Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-205 rounded-md focus:outline-hidden font-mono"
                          />
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-2 font-mono text-[11px] font-bold text-slate-500">
                        <span>Aggregate Property Expenses:</span>
                        <span className="text-slate-900 font-extrabold text-[12px]">${totalPropExp.toLocaleString()}</span>
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
