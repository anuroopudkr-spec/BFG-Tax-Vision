/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TaxReturn } from "../types";
import { Plus, Copy, FileCode, CheckCircle, Clock, Search, FolderOpen, RefreshCw, Upload, Trash2 } from "lucide-react";

interface ClientDashboardProps {
  clients: TaxReturn[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  onCreateNew: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onImport: (imported: TaxReturn) => void;
}

export default function ClientDashboard({
  clients,
  selectedClientId,
  onSelectClient,
  onCreateNew,
  onDuplicate,
  onDelete,
  onImport,
}: ClientDashboardProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && imported.id && imported.taxpayer) {
          onImport(imported);
          alert("Tax Return file successfully imported!");
        } else {
          alert("Invalid Tax Return format. Please upload a valid exported JSON return.");
        }
      } catch (err) {
        alert("Failed to parse file. Ensure it is a valid JSON document.");
      }
    };
    reader.readAsText(file);
  };

  const filteredClients = clients.filter(c => {
    const label = (c.clientName || "").toLowerCase();
    const ssn = (c.taxpayer.ssn || "").toLowerCase();
    const state = (c.taxpayer.state || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return label.includes(search) || ssn.includes(search) || state.includes(search);
  });

  const exportClientJson = (c: TaxReturn) => {
    const fileName = `${c.clientName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_tax_2026.json`;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(c, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 print:hidden">
      {/* Header and Import/Create shortcuts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Form 1040 Individual Tax Return Suite - 2026</h1>
          <p className="text-xs text-slate-500 mt-1">
            Engineered for high-speed professional individual income tax estimation, Schedule C business returns, and Schedule E properties.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* File input style trigger */}
          <label className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-all border border-slate-200">
            <Upload className="w-3.5 h-3.5 text-slate-505" />
            <span>Import Return</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-850 rounded-lg cursor-pointer transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Client</span>
          </button>
        </div>
      </div>

      {/* Main Client Search & Records Grid */}
      <div className="bg-white rounded-xl border border-slate-150 p-4 shadow-2xs">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client index label, SSN, or state code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 transition-all font-mono"
            />
          </div>
          <div className="text-xs font-mono text-slate-400 font-semibold shrink-0">
            {filteredClients.length} of {clients.length} Profiles
          </div>
        </div>

        {/* Dashboard Cards Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-150">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 font-mono text-slate-500 border-b border-slate-200">
                <th className="p-3 font-semibold">Client Name & Status</th>
                <th className="p-3 font-semibold">Filing Type</th>
                <th className="p-3 font-semibold">State</th>
                <th className="p-3 font-semibold">Last Modified</th>
                <th className="p-3 font-semibold text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((c) => {
                const isSelected = c.id === selectedClientId;
                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectClient(c.id)}
                    className={`border-b border-slate-100 last:border-0 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-slate-50/70 hover:bg-slate-50 font-medium border-l-4 border-slate-900"
                        : "hover:bg-slate-50 border-l-4 border-transparent"
                    }`}
                  >
                    <td className="p-3">
                      <div className="font-semibold text-slate-800 text-[13px]">
                        {c.clientName || "Unnamed Return Profile"}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-mono text-[10px] text-slate-400">{c.taxpayer.ssn || "XXX-XX-XXXX"}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {c.status === "Completed" ? (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-center bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-sm">
                              <CheckCircle className="w-2.5 h-2.5" /> Checked
                            </span>
                          ) : c.status === "Under Review" ? (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-center bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-sm">
                              <Clock className="w-2.5 h-2.5" /> Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-center bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-sm">
                              <RefreshCw className="w-2.5 h-2.5 animate-spin-reverse" /> Draft
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 font-mono text-[11px] font-medium">
                      {c.taxpayer.filingStatus}
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-150 text-slate-700 font-bold px-1.5 py-0.5 rounded-xs font-mono text-[10px]">
                        {c.stateTax.residentState}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400 text-[10px]">
                      {new Date(c.lastSavedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onDuplicate(c.id)}
                          title="Duplicate Return (Scenario Planning)"
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => exportClientJson(c)}
                          title="Export file (.json)"
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
                        >
                          <FileCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you absolutely sure you want to delete profile "${c.clientName}"? This action is permanent.`)) {
                              onDelete(c.id);
                            }
                          }}
                          title="Delete Profile"
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 italic font-mono">
                    No matching tax return records discovered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
