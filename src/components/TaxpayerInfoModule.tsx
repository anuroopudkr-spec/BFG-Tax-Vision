/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TaxReturn, FilingStatus } from "../types";
import { User, Users, Home, ClipboardList } from "lucide-react";
import { STATES_LIST } from "../taxEngine";

interface TaxpayerInfoProps {
  taxReturn: TaxReturn;
  onChange: (updated: TaxReturn) => void;
}

export default function TaxpayerInfoModule({ taxReturn, onChange }: TaxpayerInfoProps) {
  const t = taxReturn.taxpayer;

  const updateField = (field: keyof typeof t, value: any) => {
    const updatedTaxpayer = { ...t, [field]: value };
    // Automatically set client label as Last Name, First Name
    let clientName = taxReturn.clientName;
    if (field === "firstName" || field === "lastName") {
      const first = field === "firstName" ? value : t.firstName;
      const last = field === "lastName" ? value : t.lastName;
      if (first || last) {
        clientName = `${last}${last && first ? ", " : ""}${first}`;
      }
    }
    onChange({
      ...taxReturn,
      clientName,
      taxpayer: updatedTaxpayer,
    });
  };

  const isMarried =
    t.filingStatus === FilingStatus.MarriedFilingJointly ||
    t.filingStatus === FilingStatus.MarriedFilingSeparately;

  return (
    <div className="space-y-6">
      {/* Filing Status Quick Setup */}
      <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-2xs space-y-4">
        <label className="text-[13px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-slate-600" />
          Filing Status Setup (Tax Year 2026)
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { id: FilingStatus.Single, label: "Single", desc: "Unmarried individuals" },
            { id: FilingStatus.MarriedFilingJointly, label: "Married Jointly", desc: "Married couples filing together" },
            { id: FilingStatus.MarriedFilingSeparately, label: "Married Separately", desc: "Married filing distinct returns" },
            { id: FilingStatus.HeadOfHousehold, label: "Head of Household", desc: "Unmarried with qualifying dependent" },
            { id: FilingStatus.QualifyingSurvivingSpouse, label: "Surviving Spouse", desc: "Widow/Widower with child" },
          ].map((status) => {
            const isSelected = t.filingStatus === status.id;
            return (
              <button
                key={status.id}
                type="button"
                onClick={() => updateField("filingStatus", status.id)}
                className={`p-3.5 text-left rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-24 ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                    : "border-slate-200 hover:border-slate-350 hover:bg-slate-50 bg-white text-slate-700"
                }`}
              >
                <div className="font-semibold text-xs">{status.label}</div>
                <div className={`text-[10px] leading-snug ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                  {status.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Taxpayer Area */}
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4.5 h-4.5 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Primary Taxpayer Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
              <input
                type="text"
                value={t.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="Marcus"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Last Name</label>
              <input
                type="text"
                value={t.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Carter"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">SSN / ITIN (XXX-XX-XXXX)</label>
              <input
                type="text"
                value={t.ssn}
                onChange={(e) => updateField("ssn", e.target.value)}
                placeholder="319-44-3829"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Date of Birth</label>
              <input
                type="date"
                value={t.dob}
                onChange={(e) => updateField("dob", e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Occupation</label>
              <input
                type="text"
                value={t.occupation}
                onChange={(e) => updateField("occupation", e.target.value)}
                placeholder="Project Manager"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-semibold">Tax Return Year</label>
              <input
                type="number"
                value={t.taxYear}
                disabled
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-md text-slate-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Spouse Area - conditional on being married status */}
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-4.5 h-4.5 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Spouse Information</h3>
          </div>

          {!isMarried ? (
            <div className="h-44 flex flex-col items-center justify-center text-slate-400/80 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 px-4 text-center">
              <p className="text-xs italic">Spouse details not required for &quot;{t.filingStatus}&quot; filing status.</p>
              <p className="text-[10px] mt-1">To add, switch filing status status to Married Jointly or Separately above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
                <input
                  type="text"
                  value={t.spouseFirstName}
                  onChange={(e) => updateField("spouseFirstName", e.target.value)}
                  placeholder="Evelyn"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Last Name</label>
                <input
                  type="text"
                  value={t.spouseLastName}
                  onChange={(e) => updateField("spouseLastName", e.target.value)}
                  placeholder="Carter"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Spouse SSN / ITIN</label>
                <input
                  type="text"
                  value={t.spouseSsn}
                  onChange={(e) => updateField("spouseSsn", e.target.value)}
                  placeholder="411-99-3821"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Date of Birth</label>
                <input
                  type="date"
                  value={t.spouseDob}
                  onChange={(e) => updateField("spouseDob", e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Spouse Occupation</label>
                <input
                  type="text"
                  value={t.spouseOccupation}
                  onChange={(e) => updateField("spouseOccupation", e.target.value)}
                  placeholder="Registered Nurse"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Address & Contact Information Block */}
      <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Home className="w-4.5 h-4.5 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Address & Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 md:col-span-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Street Address</label>
            <input
              type="text"
              value={t.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="1840 Ridgeview Dr"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
            <input
              type="text"
              value={t.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="Denver"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">State Selection (Resident State)</label>
            <select
              value={t.state}
              onChange={(e) => {
                updateField("state", e.target.value);
                // Sync StateTax residentState configuration
                onChange({
                  ...taxReturn,
                  taxpayer: { ...t, state: e.target.value },
                  stateTax: { ...taxReturn.stateTax, residentState: e.target.value },
                });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
            >
              {STATES_LIST.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.code} - {st.name} ({st.type === "none" ? "No Income Tax" : st.type})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">ZIP Code</label>
            <input
              type="text"
              value={t.zipCode}
              onChange={(e) => updateField("zipCode", e.target.value)}
              placeholder="80205"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
            <input
              type="text"
              value={t.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="303-555-0144"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
            <input
              type="email"
              value={t.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="marcus.carter@gmail.com"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-800 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
