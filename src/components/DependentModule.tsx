/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TaxReturn, Dependent } from "../types";
import { Plus, Trash, ShieldCheck, HelpCircle, GraduationCap } from "lucide-react";

interface DependentModuleProps {
  taxReturn: TaxReturn;
  onChange: (updated: TaxReturn) => void;
}

export default function DependentModule({ taxReturn, onChange }: DependentModuleProps) {
  const deps = taxReturn.dependents || [];

  const addDependent = () => {
    const newDep: Dependent = {
      id: "dep-" + Math.random().toString(36).substr(2, 9),
      name: "",
      ssn: "",
      dob: "",
      relationship: "Child",
      monthsLived: 12,
      isFullTimeStudent: false,
      isDisabled: false,
      isEligibleCTC: true,
      isEligibleODC: false,
    };
    onChange({
      ...taxReturn,
      dependents: [...deps, newDep],
    });
  };

  const removeDependent = (id: string) => {
    onChange({
      ...taxReturn,
      dependents: deps.filter((d) => d.id !== id),
    });
  };

  const updateDependent = (id: string, field: keyof Dependent, value: any) => {
    onChange({
      ...taxReturn,
      dependents: deps.map((d) => {
        if (d.id === id) {
          const updatedDep = { ...d, [field]: value };
          // Standard IRS rule optimization: if eligible for Child Tax Credit, they can't also get Other Dependent Credit.
          if (field === "isEligibleCTC" && value === true) {
            updatedDep.isEligibleODC = false;
          } else if (field === "isEligibleODC" && value === true) {
            updatedDep.isEligibleCTC = false;
          }
          return updatedDep;
        }
        return d;
      }),
    });
  };

  return (
    <div className="space-y-4">
      {/* Description header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-4 rounded-xl border border-slate-150">
        <div>
          <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Dependents & Qualifying Children</h3>
          <p className="text-xs text-slate-500">
            Define household dependents to qualify for the Child Tax Credit (CTC) ($2,000) or Other Dependent Credit (ODC) ($500).
          </p>
        </div>
        
        <button
          onClick={addDependent}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Dependent</span>
        </button>
      </div>

      {/* Dependents list */}
      {deps.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl border border-slate-150 border-dashed text-slate-450 text-xs font-mono">
          <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          No dependents or qualifying dependents listed on this return yet.
        </div>
      ) : (
        <div className="space-y-4">
          {deps.map((dep, index) => (
            <div
              key={dep.id}
              className="bg-white p-5 rounded-xl border border-slate-205 shadow-2xs relative space-y-4 hover:border-slate-350 transition-all font-sans"
            >
              {/* Header inside specific dependent block */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-extrabold text-slate-700 uppercase font-mono bg-slate-100 px-2 py-0.5 rounded-sm">
                  Dependent #{index + 1}
                </span>
                <button
                  onClick={() => removeDependent(dep.id)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition-all cursor-pointer"
                >
                  <Trash className="w-3 h-3" />
                  <span>Remove Record</span>
                </button>
              </div>

              {/* Form entries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Dependent Full Name</label>
                  <input
                    type="text"
                    value={dep.name}
                    onChange={(e) => updateDependent(dep.id, "name", e.target.value)}
                    placeholder="Chloe Carter"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">SSN / ITIN (XXX-XX-XXXX)</label>
                  <input
                    type="text"
                    value={dep.ssn}
                    onChange={(e) => updateDependent(dep.id, "ssn", e.target.value)}
                    placeholder="319-55-9011"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Date of Birth</label>
                  <input
                    type="date"
                    value={dep.dob}
                    onChange={(e) => updateDependent(dep.id, "dob", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Relationship</label>
                  <select
                    value={dep.relationship}
                    onChange={(e) => updateDependent(dep.id, "relationship", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-medium"
                  >
                    <option value="Daughter">Daughter</option>
                    <option value="Son">Son</option>
                    <option value="Foster Child">Foster Child</option>
                    <option value="Stepchild">Stepchild</option>
                    <option value="Grandchild">Grandchild</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Parent">Parent</option>
                    <option value="Other">Other / Relative</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Months lived in home</label>
                  <input
                    type="number"
                    min={0}
                    max={12}
                    value={dep.monthsLived}
                    onChange={(e) => updateDependent(dep.id, "monthsLived", parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                  />
                </div>

                <div className="col-span-1 sm:col-span-3 flex flex-wrap gap-4 items-center pt-4 md:pt-6">
                  {/* Student, disabled, CTC flags */}
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dep.isFullTimeStudent}
                      onChange={(e) => updateDependent(dep.id, "isFullTimeStudent", e.target.checked)}
                      className="w-4 h-4 accent-slate-900 rounded-sm"
                    />
                    <span>Full-Time Student</span>
                  </label>

                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dep.isDisabled}
                      onChange={(e) => updateDependent(dep.id, "isDisabled", e.target.checked)}
                      className="w-4 h-4 accent-slate-900 rounded-sm"
                    />
                    <span>Permanently Disabled</span>
                  </label>

                  <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dep.isEligibleCTC}
                      onChange={(e) => updateDependent(dep.id, "isEligibleCTC", e.target.checked)}
                      className="w-4 h-4 accent-slate-900 rounded-sm"
                    />
                    <span className="flex items-center gap-0.5 text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-xs text-[10px]">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Child Tax Credit ($2000)
                    </span>
                  </label>

                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dep.isEligibleODC}
                      onChange={(e) => updateDependent(dep.id, "isEligibleODC", e.checked || e.target.checked)}
                      className="w-4 h-4 accent-slate-900 rounded-sm"
                    />
                    <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-xs text-[10px]">
                      Other Dependent ($500)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
