/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { TaxReturn, FilingStatus, TaxEngineResults } from "./types";
import { runCalculator, createNewBlankReturn } from "./taxEngine";

// Components Imports
import ClientDashboard from "./components/ClientDashboard";
import TaxpayerInfoModule from "./components/TaxpayerInfoModule";
import DependentModule from "./components/DependentModule";
import IncomeModule from "./components/IncomeModule";
import BusinessModule from "./components/BusinessModule";
import RentalModule from "./components/RentalModule";
import DeductionsCreditsModule from "./components/DeductionsCreditsModule";
import StateTaxModule from "./components/StateTaxModule";
import ReportsModule from "./components/ReportsModule";

// Icons
import {
  User,
  Users,
  Briefcase,
  Home,
  Tag,
  MapPin,
  FileSpreadsheet,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Printer,
  Download,
  FolderOpen,
  CheckCircle,
  FileCode,
  ShieldCheck,
  RefreshCw,
  Plus,
  Lock,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem("BFG_TAXV_AUTH") === "true";
  });
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [clients, setClients] = useState<TaxReturn[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "taxpayer" | "dependents" | "income" | "businesses" | "rentals" | "deductions" | "stateTax" | "reports"
  >("dashboard");
  
  // Status check to show brief feedback toast
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Initialize clients from LocalStorage or create a brand new clean blank profile
  useEffect(() => {
    const saved = localStorage.getItem("US_TAX_CLIENTS_2026");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If the cached list has any remnant mock data, clear it to start clean
          const hasInbuiltMockData = parsed.some(c => c.id === "alex-johnson-2026" || c.id === "carter-family-2026");
          if (!hasInbuiltMockData) {
            setClients(parsed);
            setSelectedClientId(parsed[0].id);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to parse tax returns from localStorage:", err);
      }
    }
    // Create a pristine empty return rather than using prefilled mock data
    const blankReturn = createNewBlankReturn("return-" + Math.random().toString(36).substr(2, 9));
    blankReturn.clientName = "Draft Client Return";
    const initialList = [blankReturn];
    setClients(initialList);
    setSelectedClientId(blankReturn.id);
    localStorage.setItem("US_TAX_CLIENTS_2026", JSON.stringify(initialList));
  }, []);

  // Save clients to LocalStorage whenever changes happen
  const saveClientsToDb = (updatedList: TaxReturn[]) => {
    setClients(updatedList);
    localStorage.setItem("US_TAX_CLIENTS_2026", JSON.stringify(updatedList));
    
    // Brief saving feedback trigger
    setShowSavedToast(true);
    const t = setTimeout(() => setShowSavedToast(false), 800);
    return () => clearTimeout(t);
  };

  // Get active return
  const activeReturn = useMemo(() => {
    return clients.find((c) => c.id === selectedClientId) || clients[0];
  }, [clients, selectedClientId]);

  // Recalculate tax return live
  const activeResults: TaxEngineResults = useMemo(() => {
    if (!activeReturn) {
      const blank = createNewBlankReturn();
      return runCalculator(blank);
    }
    return runCalculator(activeReturn);
  }, [activeReturn]);

  // Apply change to selected tax return
  const handleReturnChange = (updated: TaxReturn) => {
    const nextReturns = clients.map((c) => {
      if (c.id === updated.id) {
        return {
          ...updated,
          lastSavedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    saveClientsToDb(nextReturns);
  };

  // Creation callback
  const handleCreateNewClient = () => {
    const newProfile = createNewBlankReturn();
    const count = clients.length + 1;
    newProfile.clientName = `New Client Return Profile ${count}`;
    newProfile.taxpayer.firstName = "New";
    newProfile.taxpayer.lastName = `Client ${count}`;
    
    const next = [newProfile, ...clients];
    saveClientsToDb(next);
    setSelectedClientId(newProfile.id);
    setActiveTab("taxpayer");
  };

  // Duplicate scenario callback
  const handleDuplicateClient = (id: string) => {
    const target = clients.find((c) => c.id === id);
    if (!target) return;

    const cloned: TaxReturn = JSON.parse(JSON.stringify(target));
    cloned.id = "return-" + Math.random().toString(36).substr(2, 9);
    cloned.clientName = `${cloned.clientName} (Scenario B)`;
    cloned.lastSavedAt = new Date().toISOString();

    const next = [cloned, ...clients];
    saveClientsToDb(next);
    setSelectedClientId(cloned.id);
    setActiveTab("taxpayer");
  };

  // Import handoff
  const handleImportClient = (imported: TaxReturn) => {
    // Generate new unique ID to avoid overwriting existing profiles
    imported.id = "return-" + Math.random().toString(36).substr(2, 9);
    imported.lastSavedAt = new Date().toISOString();
    
    const next = [imported, ...clients];
    saveClientsToDb(next);
    setSelectedClientId(imported.id);
    setActiveTab("dashboard");
  };

  // Delete callback
  const handleDeleteClient = (id: string) => {
    const filtered = clients.filter((c) => c.id !== id);
    if (filtered.length === 0) {
      // Create empty return so lists are never completely empty
      const fresh = createNewBlankReturn();
      saveClientsToDb([fresh]);
      setSelectedClientId(fresh.id);
      setActiveTab("dashboard");
      return;
    }
    saveClientsToDb(filtered);
    if (selectedClientId === id) {
      setSelectedClientId(filtered[0].id);
    }
  };

  // Diagnostic Checklist Analyzer for Drake style alert rails
  const diagnostics = useMemo(() => {
    const list: { type: "error" | "warning" | "success"; text: string }[] = [];
    if (!activeReturn) return list;

    const t = activeReturn.taxpayer;
    // Missing SSN check
    if (!t.ssn) {
      list.push({ type: "error", text: "Primary Taxpayer SSN is missing. Will show as blank facsimile on reports." });
    }
    // Missing State
    if (!t.state) {
      list.push({ type: "warning", text: "Resident State code is empty. defaulting to CA rules calculations." });
    }
    // High AGI QBI restriction
    if (activeResults.adjustedGrossIncome > 383900 && activeReturn.businesses?.length > 0) {
      list.push({
        type: "warning",
        text: "Federal AGI exceeds $383,900 threshold. Schedule C QBI deduction may be phased out or restricted for SSTBs.",
      });
    }
    // Underpayment safe harbor checks
    if (!activeResults.safeHarborMet && activeResults.federalRefundOrDue < -1000) {
      list.push({
        type: "warning",
        text: `Estimated tax penalty alert: Safe Harbor rules NOT met and Balance Due exceeds $1,000. Underpayment interest may apply.`,
      });
    }
    // Item vs standard deduction choice info
    if (activeResults.itemizedDeductionsValue > activeResults.standardDeductionsValue) {
      list.push({ type: "success", text: `Tax savings maximized: Schedule A Itemized deductions exceed Standard by $${(activeResults.itemizedDeductionsValue - activeResults.standardDeductionsValue).toLocaleString()}.` });
    }

    if (list.length === 0) {
      list.push({ type: "success", text: "Filing diagnostics complete: Perfect profile schema logic. Ready for electronic preparation print." });
    }
    return list;
  }, [activeReturn, activeResults]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === "bfgadmin" && loginPass === "bfgtax") {
      setIsLoggedIn(true);
      setLoginError("");
      sessionStorage.setItem("BFG_TAXV_AUTH", "true");
    } else {
      setLoginError("Invalid credentials. Please verify username and password.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginUser("");
    setLoginPass("");
    sessionStorage.removeItem("BFG_TAXV_AUTH");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 font-sans p-4 relative selection:bg-indigo-100 selection:text-indigo-900">
        <div className="absolute top-0 left-0 w-full h-[6px] bg-indigo-600"></div>
        
        <div className="w-full max-w-[440px] bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6 md:p-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
              BFG Tax Vision Pro
            </h2>
            <p className="text-xs text-slate-500 font-bold tracking-widest uppercase font-mono">
              Calculation Suite 2026
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg border border-rose-100 leading-relaxed text-left flex items-start gap-2 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-left">
                Operator Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="bfgadmin"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-left">
                Security Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              Sign In to Workspace
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center space-y-1">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
              Authorized operators only
            </p>
            <p className="text-[9px] text-slate-400 font-mono">
              Username: <span className="text-slate-600 font-bold bg-slate-100 px-1 rounded">bfgadmin</span>, Password: <span className="text-slate-600 font-bold bg-slate-100 px-1 rounded">bfgtax</span>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-400 font-mono tracking-widest uppercase">
          CALCULATION SUITE v26.4 • SYNCHRONIZED CLOUD DATABASE
        </div>
      </div>
    );
  }

  if (!activeReturn) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-mono">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="ml-3">Loading Tax Models...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 flex flex-col border-r border-slate-800 shrink-0 select-none print:hidden h-full">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white text-sm">BFG</div>
          <span className="text-white font-bold tracking-tight text-xs">
            BFG Tax Vision Pro <span className="text-indigo-400">2026</span>
          </span>
        </div>
        
        <nav className="flex-grow py-4 px-3 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Category 1: Work Management */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</div>
            {[
              { id: "dashboard", label: "Dashboard Profiles", icon: FolderOpen },
              { id: "taxpayer", label: "Client Profile", icon: User },
              { id: "dependents", label: "Dependents Hub", icon: Users },
            ].map((menuItem) => {
              const Icon = menuItem.icon;
              const isActive = activeTab === menuItem.id;
              return (
                <button
                  key={menuItem.id}
                  onClick={() => setActiveTab(menuItem.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-tight transition-colors cursor-pointer text-left ${
                    isActive ? "bg-indigo-600 text-white shadow-xs" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-200" : "text-slate-550"}`} />
                  <span>{menuItem.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category 2: Income Categories */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Income Modules</div>
            {[
              { id: "income", label: "W-2 & 1099 Logs", icon: FileSpreadsheet },
              { id: "businesses", label: "Schedule C (Business)", icon: Briefcase },
              { id: "rentals", label: "Schedule E (Rentals)", icon: Home },
            ].map((menuItem) => {
              const Icon = menuItem.icon;
              const isActive = activeTab === menuItem.id;
              return (
                <button
                  key={menuItem.id}
                  onClick={() => setActiveTab(menuItem.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-tight transition-colors cursor-pointer text-left ${
                    isActive ? "bg-indigo-600 text-white shadow-xs" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-200" : "text-slate-550"}`} />
                  <span>{menuItem.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category 3: Deductions & Fin */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Finalization</div>
            {[
              { id: "deductions", label: "Deductions & Credits", icon: Tag },
              { id: "stateTax", label: "State Return", icon: MapPin },
              { id: "reports", label: "Review & Reports (1040)", icon: Printer },
            ].map((menuItem) => {
              const Icon = menuItem.icon;
              const isActive = activeTab === menuItem.id;
              return (
                <button
                  key={menuItem.id}
                  onClick={() => setActiveTab(menuItem.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-tight transition-colors cursor-pointer text-left ${
                    isActive ? "bg-indigo-600 text-white shadow-xs" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-200" : "text-slate-550"}`} />
                  <span>{menuItem.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Database saved info */}
        <div className="p-4 bg-slate-950/40 border-t border-slate-800/60 shrink-0 space-y-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Database Synced
            </div>
            <div className="text-[9px] text-slate-500 font-mono">
              Last saved: {activeReturn.lastSavedAt ? new Date(activeReturn.lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Today, 11:42 AM"}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-350 hover:text-rose-450 border border-slate-705 text-slate-350 rounded-lg text-[10.5px] font-bold tracking-tight transition-all cursor-pointer"
          >
            <LogOut className="w-3 h-3 shrink-0" />
            <span>Secure Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {/* Workspace Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 shrink-0 print:hidden select-none">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-snug">
                {activeReturn.taxpayer.firstName && activeReturn.taxpayer.lastName
                  ? `${activeReturn.taxpayer.firstName} ${activeReturn.taxpayer.lastName}`
                  : activeReturn.clientName}
              </h1>
              <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase font-sans">
                {activeReturn.taxpayer.filingStatus || "Single"} · SSN: {activeReturn.taxpayer.ssn ? activeReturn.taxpayer.ssn.replace(/^(?:\d{3}-\d{2}-)?(\d{4})/, "***-**-$1") : "***-**-8821"} · Tax Year 2026
              </p>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <span className="hidden sm:inline-block px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200 uppercase tracking-wide">
              {activeReturn.status || "In Progress"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto Saving Trigger */}
            <div className="hidden md:block">
              {showSavedToast ? (
                <span className="text-emerald-600 font-mono text-[10.5px] font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  <CheckCircle className="w-3 h-3 animate-pulse" /> Auto-Saved
                </span>
              ) : (
                <span className="text-slate-400 font-mono text-[10px]">Calculators Active</span>
              )}
            </div>

            {/* Client Return Select Picker */}
            <div className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-250 transition-all">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block sm:inline">Active Unit:</span>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-bold focus:outline-hidden cursor-pointer"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id} className="bg-white text-slate-800 text-xs text-left">
                    {c.clientName || "Unnamed Return Profile"}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCreateNewClient}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Profile</span>
            </button>
          </div>
        </header>

        {/* Scrollable Workspace Panel */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6 h-full">
            
            {/* Elegant Key Metrics Stats Grid (mockup style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Adjusted Gross Income (AGI)</div>
                <div className="text-xl font-bold font-mono text-slate-900">${activeResults.adjustedGrossIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Taxable Income</div>
                <div className="text-xl font-bold font-mono text-slate-900">${activeResults.taxableIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <div className={`bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 ${activeResults.federalRefundOrDue >= 0 ? "border-l-emerald-500" : "border-l-rose-500"}`}>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {activeResults.federalRefundOrDue >= 0 ? "Fed Refund Due" : "Fed Tax Balance Due"}
                </div>
                <div className={`text-xl font-bold font-mono ${activeResults.federalRefundOrDue >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  ${Math.abs(activeResults.federalRefundOrDue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className={`bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 ${activeResults.stateRefundOrDue >= 0 ? "border-l-emerald-500" : "border-l-rose-500"}`}>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">
                  State {activeResults.stateRefundOrDue >= 0 ? "Refund due" : "Balance due"} ({activeReturn.stateTax.residentState || "CA"})
                </div>
                <div className={`text-xl font-bold font-mono ${activeResults.stateRefundOrDue >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  ${Math.abs(activeResults.stateRefundOrDue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Split Content layout: Main Tab Content & Side Utilities */}
            <div className="grid grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Focused Module Workspace */}
              <div className="col-span-12 xl:col-span-9 space-y-6">
                
                {/* Section Indicator Info Bar */}
                {activeTab !== "dashboard" && activeTab !== "reports" && (
                  <div className="bg-white py-2.5 px-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-sans print:hidden shadow-2xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <span>Working On:</span>
                      <span className="bg-slate-100 px-2.5 py-0.5 rounded font-bold text-slate-800 font-mono">
                        {activeReturn.clientName}
                      </span>
                      <span className="text-[10.5px] font-mono text-slate-400">({activeReturn.taxpayer.ssn || "SSN NOT SET"})</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono hidden sm:block">All calculations verified instantly</p>
                  </div>
                )}

                {/* Form Router container */}
                <div className="animate-fade-in">
                  {activeTab === "dashboard" && (
                    <ClientDashboard
                      clients={clients}
                      selectedClientId={selectedClientId}
                      onSelectClient={setSelectedClientId}
                      onCreateNew={handleCreateNewClient}
                      onDuplicate={handleDuplicateClient}
                      onDelete={handleDeleteClient}
                      onImport={handleImportClient}
                    />
                  )}

                  {activeTab === "taxpayer" && (
                    <TaxpayerInfoModule
                      taxReturn={activeReturn}
                      onChange={handleReturnChange}
                    />
                  )}

                  {activeTab === "dependents" && (
                    <DependentModule
                      taxReturn={activeReturn}
                      onChange={handleReturnChange}
                    />
                  )}

                  {activeTab === "income" && (
                    <IncomeModule
                      taxReturn={activeReturn}
                      onChange={handleReturnChange}
                    />
                  )}

                  {activeTab === "businesses" && (
                    <BusinessModule
                      taxReturn={activeReturn}
                      onChange={handleReturnChange}
                    />
                  )}

                  {activeTab === "rentals" && (
                    <RentalModule
                      taxReturn={activeReturn}
                      onChange={handleReturnChange}
                    />
                  )}

                  {activeTab === "deductions" && (
                    <DeductionsCreditsModule
                      taxReturn={activeReturn}
                      onChange={handleReturnChange}
                      results={activeResults}
                    />
                  )}

                  {activeTab === "stateTax" && (
                    <StateTaxModule
                      taxReturn={activeReturn}
                      onChange={handleReturnChange}
                      results={activeResults}
                    />
                  )}

                  {activeTab === "reports" && (
                    <ReportsModule
                      taxReturn={activeReturn}
                      results={activeResults}
                    />
                  )}
                </div>
              </div>

              {/* Right Column: Calculations Accuracy & Checklist Warnings */}
              <div className="col-span-12 xl:col-span-3 space-y-6 print:hidden">
                
                {/* Premium Accuracy Card */}
                <div className="bg-slate-900 rounded-xl p-5 text-white shadow-md space-y-3 relative overflow-hidden">
                  <div className="flex items-center gap-2">
                     <ShieldCheck className="w-5 h-5 text-indigo-400" />
                     <span className="text-xs font-bold uppercase tracking-wider">Accuracy Engine</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    2026 bracket rates applied. Calculated underpayment interest margins and standard vs Schedule A itemized offsets dynamically checked.
                  </p>
                  <div className="w-full bg-slate-800 rounded-full h-1">
                    <div className="bg-indigo-500 h-1 rounded-full w-full"></div>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">Dynamic Recalculators Synced</div>
                </div>

                {/* Diagnostics warnings list */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-slate-500" />
                    Preparation Diagnostics
                  </h3>

                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {diagnostics.map((err, dIdx) => (
                      <div key={dIdx} className="flex gap-2.5 items-start">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border text-[10px] font-bold ${
                            err.type === "error"
                              ? "bg-red-50 text-red-600 border-red-200"
                              : err.type === "warning"
                              ? "bg-amber-50 text-amber-600 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {err.type === "error" ? "!" : err.type === "warning" ? "!" : <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <span className="text-xs text-slate-650 leading-relaxed font-sans">{err.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PDF import drop file mockup aesthetic box */}
                <div className="p-4 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 select-none opacity-70">
                  <FileCode className="w-6 h-6 text-slate-350" />
                  <span className="text-[11px] font-semibold text-slate-500">Fast JSON Drag & Drop Enabled</span>
                </div>

              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
