/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilingStatus, TaxReturn, TaxEngineResults, StateConfig } from "./types";

// Standard Deductions for Tax Year 2026
export const STANDARD_DEDUCTIONS = {
  [FilingStatus.Single]: 15350,
  [FilingStatus.MarriedFilingJointly]: 30700,
  [FilingStatus.MarriedFilingSeparately]: 15350,
  [FilingStatus.HeadOfHousehold]: 23000,
  [FilingStatus.QualifyingSurvivingSpouse]: 30700,
};

// Federal Income Tax Brackets for Tax Year 2026
// Keys are FilingStatus
export const FEDERAL_BRACKETS = {
  [FilingStatus.Single]: [
    { limit: 11925, rate: 0.10 },
    { limit: 48475, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250525, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  [FilingStatus.MarriedFilingJointly]: [
    { limit: 23850, rate: 0.10 },
    { limit: 96950, rate: 0.12 },
    { limit: 206700, rate: 0.22 },
    { limit: 394600, rate: 0.24 },
    { limit: 501050, rate: 0.32 },
    { limit: 751600, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  [FilingStatus.MarriedFilingSeparately]: [
    { limit: 11925, rate: 0.10 },
    { limit: 48475, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250525, rate: 0.32 },
    { limit: 375800, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  [FilingStatus.HeadOfHousehold]: [
    { limit: 17000, rate: 0.10 },
    { limit: 64850, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250500, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  [FilingStatus.QualifyingSurvivingSpouse]: [
    { limit: 23850, rate: 0.10 },
    { limit: 96950, rate: 0.12 },
    { limit: 206700, rate: 0.22 },
    { limit: 394600, rate: 0.24 },
    { limit: 501050, rate: 0.32 },
    { limit: 751600, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
};

// State Configurations for US
export const STATES_LIST: StateConfig[] = [
  { code: "AL", name: "Alabama", type: "progressive", brackets: [{ limit: 500, rate: 0.02 }, { limit: 3000, rate: 0.04 }, { limit: Infinity, rate: 0.05 }] },
  { code: "AK", name: "Alaska", type: "none" },
  { code: "AZ", name: "Arizona", type: "flat", flatRate: 0.025 },
  { code: "AR", name: "Arkansas", type: "progressive", brackets: [{ limit: 4400, rate: 0.02 }, { limit: 8800, rate: 0.04 }, { limit: Infinity, rate: 0.047 }] },
  { code: "CA", name: "California", type: "progressive", brackets: [{ limit: 10412, rate: 0.01 }, { limit: 24684, rate: 0.02 }, { limit: 38959, rate: 0.04 }, { limit: 54081, rate: 0.06 }, { limit: 68350, rate: 0.08 }, { limit: 349137, rate: 0.093 }, { limit: 418961, rate: 0.103 }, { limit: 698271, rate: 0.113 }, { limit: Infinity, rate: 0.133 }] },
  { code: "CO", name: "Colorado", type: "flat", flatRate: 0.044 },
  { code: "CT", name: "Connecticut", type: "progressive", brackets: [{ limit: 10000, rate: 0.03 }, { limit: 50000, rate: 0.05 }, { limit: 100000, rate: 0.055 }, { limit: 200000, rate: 0.06 }, { limit: 250000, rate: 0.065 }, { limit: 500000, rate: 0.069 }, { limit: Infinity, rate: 0.0699 }] },
  { code: "DE", name: "Delaware", type: "progressive", brackets: [{ limit: 5000, rate: 0.022 }, { limit: 10000, rate: 0.039 }, { limit: 20000, rate: 0.048 }, { limit: 25000, rate: 0.052 }, { limit: 60000, rate: 0.0555 }, { limit: Infinity, rate: 0.066 }] },
  { code: "FL", name: "Florida", type: "none" },
  { code: "GA", name: "Georgia", type: "flat", flatRate: 0.0549 },
  { code: "HI", name: "Hawaii", type: "progressive", brackets: [{ limit: 4800, rate: 0.014 }, { limit: 9600, rate: 0.032 }, { limit: 19200, rate: 0.055 }, { limit: 28800, rate: 0.064 }, { limit: 38400, rate: 0.068 }, { limit: 48000, rate: 0.072 }, { limit: 72000, rate: 0.076 }, { limit: 96000, rate: 0.079 }, { limit: 150000, rate: 0.0825 }, { limit: 200000, rate: 0.09 }, { limit: 300000, rate: 0.10 }, { limit: Infinity, rate: 0.11 }] },
  { code: "ID", name: "Idaho", type: "flat", flatRate: 0.058 },
  { code: "IL", name: "Illinois", type: "flat", flatRate: 0.0495 },
  { code: "IN", name: "Indiana", type: "flat", flatRate: 0.0305 },
  { code: "IA", name: "Iowa", type: "progressive", brackets: [{ limit: 6000, rate: 0.044 }, { limit: 30000, rate: 0.0482 }, { limit: 75000, rate: 0.057 }, { limit: Infinity, rate: 0.06 }] },
  { code: "KS", name: "Kansas", type: "progressive", brackets: [{ limit: 15000, rate: 0.031 }, { limit: 30000, rate: 0.0525 }, { limit: Infinity, rate: 0.057 }] },
  { code: "KY", name: "Kentucky", type: "flat", flatRate: 0.040 },
  { code: "LA", name: "Louisiana", type: "progressive", brackets: [{ limit: 12500, rate: 0.0185 }, { limit: 50000, rate: 0.035 }, { limit: Infinity, rate: 0.0425 }] },
  { code: "ME", name: "Maine", type: "progressive", brackets: [{ limit: 24450, rate: 0.058 }, { limit: 57900, rate: 0.0675 }, { limit: Infinity, rate: 0.0715 }] },
  { code: "MD", name: "Maryland", type: "progressive", brackets: [{ limit: 1000, rate: 0.02 }, { limit: 2000, rate: 0.03 }, { limit: 3000, rate: 0.04 }, { limit: 100000, rate: 0.0475 }, { limit: 125000, rate: 0.05 }, { limit: 150000, rate: 0.0525 }, { limit: 250000, rate: 0.055 }, { limit: Infinity, rate: 0.0575 }] },
  { code: "MA", name: "Massachusetts", type: "flat", flatRate: 0.05 },
  { code: "MI", name: "Michigan", type: "flat", flatRate: 0.0425 },
  { code: "MN", name: "Minnesota", type: "progressive", brackets: [{ limit: 35070, rate: 0.0535 }, { limit: 115160, rate: 0.068 }, { limit: 184810, rate: 0.0785 }, { limit: Infinity, rate: 0.0985 }] },
  { code: "MS", name: "Mississippi", type: "flat", flatRate: 0.047 },
  { code: "MO", name: "Missouri", type: "progressive", brackets: [{ limit: 1000, rate: 0.02 }, { limit: 2000, rate: 0.025 }, { limit: 3000, rate: 0.03 }, { limit: 4000, rate: 0.035 }, { limit: 5000, rate: 0.04 }, { limit: 6000, rate: 0.045 }, { limit: 7000, rate: 0.05 }, { limit: 8000, rate: 0.055 }, { limit: Infinity, rate: 0.0495 }] },
  { code: "MT", name: "Montana", type: "progressive", brackets: [{ limit: 20500, rate: 0.047 }, { limit: Infinity, rate: 0.059 }] },
  { code: "NE", name: "Nebraska", type: "progressive", brackets: [{ limit: 3840, rate: 0.0246 }, { limit: 22880, rate: 0.0351 }, { limit: 35880, rate: 0.0501 }, { limit: Infinity, rate: 0.0584 }] },
  { code: "NV", name: "Nevada", type: "none" },
  { code: "NH", name: "New Hampshire", type: "none" }, // strictly interest and dividends only, which is phasing out
  { code: "NJ", name: "New Jersey", type: "progressive", brackets: [{ limit: 20000, rate: 0.014 }, { limit: 35000, rate: 0.0175 }, { limit: 40000, rate: 0.035 }, { limit: 75000, rate: 0.05525 }, { limit: 500000, rate: 0.0637 }, { limit: 1000000, rate: 0.0897 }, { limit: Infinity, rate: 0.1075 }] },
  { code: "NM", name: "New Mexico", type: "progressive", brackets: [{ limit: 5500, rate: 0.017 }, { limit: 11000, rate: 0.032 }, { limit: 16000, rate: 0.047 }, { limit: Infinity, rate: 0.059 }] },
  { code: "NY", name: "New York", type: "progressive", brackets: [{ limit: 8500, rate: 0.04 }, { limit: 11700, rate: 0.045 }, { limit: 13900, rate: 0.0525 }, { limit: 21400, rate: 0.059 }, { limit: 80650, rate: 0.0633 }, { limit: 215400, rate: 0.0685 }, { limit: 1077550, rate: 0.0965 }, { limit: 5000000, rate: 0.103 }, { limit: Infinity, rate: 0.109 }] },
  { code: "NC", name: "North Carolina", type: "flat", flatRate: 0.045 },
  { code: "ND", name: "North Dakota", type: "progressive", brackets: [{ limit: 44725, rate: 0.0195 }, { limit: 108275, rate: 0.025 }, { limit: Infinity, rate: 0.029 }] },
  { code: "OH", name: "Ohio", type: "progressive", brackets: [{ limit: 26050, rate: 0.02765 }, { limit: 46100, rate: 0.03226 }, { limit: 115300, rate: 0.03688 }, { limit: Infinity, rate: 0.0399 }] },
  { code: "OK", name: "Oklahoma", type: "progressive", brackets: [{ limit: 1000, rate: 0.005 }, { limit: 2500, rate: 0.01 }, { limit: 3750, rate: 0.02 }, { limit: 4900, rate: 0.03 }, { limit: 7200, rate: 0.04 }, { limit: Infinity, rate: 0.0475 }] },
  { code: "OR", name: "Oregon", type: "progressive", brackets: [{ limit: 4050, rate: 0.0475 }, { limit: 10100, rate: 0.0675 }, { limit: 125000, rate: 0.0875 }, { limit: Infinity, rate: 0.099 }] },
  { code: "PA", name: "Pennsylvania", type: "flat", flatRate: 0.0307 },
  { code: "RI", name: "Rhode Island", type: "progressive", brackets: [{ limit: 68200, rate: 0.0375 }, { limit: 155050, rate: 0.0475 }, { limit: Infinity, rate: 0.0599 }] },
  { code: "SC", name: "South Carolina", type: "flat", flatRate: 0.064 },
  { code: "SD", name: "South Dakota", type: "none" },
  { code: "TN", name: "Tennessee", type: "none" },
  { code: "TX", name: "Texas", type: "none" },
  { code: "UT", name: "Utah", type: "flat", flatRate: 0.0455 },
  { code: "VT", name: "Vermont", type: "progressive", brackets: [{ limit: 45750, rate: 0.0335 }, { limit: 110850, rate: 0.066 }, { limit: Infinity, rate: 0.0875 }] },
  { code: "VA", name: "Virginia", type: "progressive", brackets: [{ limit: 3000, rate: 0.02 }, { limit: 17000, rate: 0.03 }, { limit: 150000, rate: 0.05 }, { limit: Infinity, rate: 0.0575 }] },
  { code: "WA", name: "Washington", type: "none" },
  { code: "WV", name: "West Virginia", type: "progressive", brackets: [{ limit: 10000, rate: 0.03 }, { limit: 25000, rate: 0.04 }, { limit: 40000, rate: 0.045 }, { limit: 60000, rate: 0.06 }, { limit: Infinity, rate: 0.065 }] },
  { code: "WI", name: "Wisconsin", type: "progressive", brackets: [{ limit: 14320, rate: 0.0354 }, { limit: 28650, rate: 0.044 }, { limit: 315310, rate: 0.053 }, { limit: Infinity, rate: 0.0765 }] },
  { code: "WY", name: "Wyoming", type: "none" },
  { code: "DC", name: "District of Columbia", type: "progressive", brackets: [{ limit: 10000, rate: 0.04 }, { limit: 40000, rate: 0.06 }, { limit: 60000, rate: 0.065 }, { limit: 250000, rate: 0.085 }, { limit: 500000, rate: 0.0925 }, { limit: 1000000, rate: 0.0975 }, { limit: Infinity, rate: 0.1075 }] },
];

/**
 * Calculates Taxable Social Security based on IRS worksheet rules.
 * Modified AGI: AGI excluding SS + tax exempt interest + adjustments.
 * Pro-rate limits based on filing status.
 */
export function calculateTaxableSocialSecurity(
  grossSS: number,
  medicarePremiums: number,
  filingStatus: FilingStatus,
  otherIncomeNoSS: number
): number {
  if (grossSS <= 0) return 0;

  // Base thresholds
  let threshold1 = 25000;
  let threshold2 = 34000;
  
  if (filingStatus === FilingStatus.MarriedFilingJointly) {
    threshold1 = 32000;
    threshold2 = 44000;
  } else if (filingStatus === FilingStatus.MarriedFilingSeparately) {
    // If married filing separately and lived with spouse, thresholds are 0.
    threshold1 = 0;
    threshold2 = 0;
  }

  // Combined income = Other Income + tax exempt interest (simplified as part of other income) + 50% of SS
  const combinedIncome = otherIncomeNoSS + (0.5 * grossSS);

  if (combinedIncome <= threshold1) {
    return 0;
  }

  let taxableAmount = 0;
  if (combinedIncome > threshold1 && combinedIncome <= threshold2) {
    // Up to 50% of combined income above threshold1
    taxableAmount = Math.min(0.5 * grossSS, 0.5 * (combinedIncome - threshold1));
  } else {
    // Above threshold2: up to 85% taxable
    const block1 = 0.5 * (threshold2 - threshold1); // 50% of the middle tier
    const temp = Math.min(block1, 0.5 * grossSS);
    const addedAmount = 0.85 * (combinedIncome - threshold2);
    taxableAmount = Math.min(0.85 * grossSS, temp + addedAmount);
  }

  return Math.max(0, Math.round(taxableAmount));
}

/**
 * Iterates through a bracket list to compute marginal taxation.
 */
export function calculateTaxFromBrackets(taxableIncome: number, brackets: { limit: number; rate: number }[]): number {
  if (taxableIncome <= 0) return 0;
  
  let remaining = taxableIncome;
  let tax = 0;
  let previousLimit = 0;

  for (let i = 0; i < brackets.length; i++) {
    const currentBracket = brackets[i];
    const currentLimit = currentBracket.limit;
    const currentRate = currentBracket.rate;

    const span = currentLimit - previousLimit;
    if (remaining > span) {
      tax += span * currentRate;
      remaining -= span;
      previousLimit = currentLimit;
    } else {
      tax += remaining * currentRate;
      remaining = 0;
      break;
    }
  }

  return Math.round(tax * 100) / 100;
}

/**
 * Calculates preferential tax rates for Qualified Dividends and Long-Term Capital Gains (Schedule D).
 * Pref tax brackets:
 * 0% rate: up to $48,475 (Single) / $96,950 (MFJ) / $64,850 (HOH)
 * 15% rate: up to $533,400 (Single) / $600,150 (MFJ) / $566,350 (HOH)
 * 20% rate: above that
 */
export function calculateQualifiedAndCapGainsTax(
  taxableIncome: number,
  ordinaryTaxable: number,
  preferentialIncome: number,
  filingStatus: FilingStatus,
  brackets: { limit: number; rate: number }[]
): { totalTax: number; ordinaryTax: number; preferentialTax: number } {
  const ordinaryTax = calculateTaxFromBrackets(ordinaryTaxable, brackets);
  
  if (preferentialIncome <= 0) {
    return {
      totalTax: ordinaryTax,
      ordinaryTax,
      preferentialTax: 0,
    };
  }

  // Define thresholds for preferential rate brackets
  let pref0Limit = 48475;
  let pref15Limit = 533400;

  if (filingStatus === FilingStatus.MarriedFilingJointly || filingStatus === FilingStatus.QualifyingSurvivingSpouse) {
    pref0Limit = 96950;
    pref15Limit = 600150;
  } else if (filingStatus === FilingStatus.HeadOfHousehold) {
    pref0Limit = 64850;
    pref15Limit = 566350;
  } else if (filingStatus === FilingStatus.MarriedFilingSeparately) {
    pref0Limit = 48475;
    pref15Limit = 266700;
  }

  let preferentialTax = 0;
  let currentBase = ordinaryTaxable;

  // We loop through the preferential income chunks
  let remainingPref = preferentialIncome;

  // Level 1: Under pref0Limit (Taxed at 0%)
  if (currentBase < pref0Limit) {
    const chunkIn0 = Math.min(pref0Limit - currentBase, remainingPref);
    preferentialTax += chunkIn0 * 0;
    remainingPref -= chunkIn0;
    currentBase += chunkIn0;
  }

  // Level 2: Between pref0Limit and pref15Limit (Taxed at 15%)
  if (remainingPref > 0 && currentBase < pref15Limit) {
    const chunkIn15 = Math.min(pref15Limit - currentBase, remainingPref);
    preferentialTax += chunkIn15 * 0.15;
    remainingPref -= chunkIn15;
    currentBase += chunkIn15;
  }

  // Level 3: Above pref15Limit (Taxed at 20%)
  if (remainingPref > 0) {
    preferentialTax += remainingPref * 0.20;
    remainingPref = 0;
  }

  return {
    totalTax: Math.round((ordinaryTax + preferentialTax) * 100) / 100,
    ordinaryTax,
    preferentialTax: Math.round(preferentialTax * 100) / 100,
  };
}

/**
 * Calculates Net Investment Income Tax (NIIT)
 * 3.8% on lesser of net investment income or modified AGI over thresholds:
 * Single: $200,000, MFJ: $250,000, MFS: $125,000
 */
export function calculateNIIT(agi: number, investmentIncome: number, filingStatus: FilingStatus): number {
  let threshold = 200000;
  if (filingStatus === FilingStatus.MarriedFilingJointly) threshold = 250000;
  if (filingStatus === FilingStatus.MarriedFilingSeparately) threshold = 125000;

  if (agi <= threshold || investmentIncome <= 0) return 0;
  const excessMAGI = agi - threshold;
  const taxableNII = Math.min(investmentIncome, excessMAGI);
  return Math.max(0, Math.round(taxableNII * 0.038 * 100) / 100);
}

/**
 * Calculates Additional Medicare Tax
 * 0.9% on wages + SE profit exceeding thresholds:
 * Single: $200,000, MFJ: $250,000, MFS: $125,000
 */
export function calculateAdditionalMedicareTax(wages: number, seProfit: number, filingStatus: FilingStatus): number {
  let threshold = 200000;
  if (filingStatus === FilingStatus.MarriedFilingJointly) threshold = 250000;
  if (filingStatus === FilingStatus.MarriedFilingSeparately) threshold = 125000;

  const totalEarned = wages + seProfit;
  if (totalEarned <= threshold) return 0;
  return Math.max(0, Math.round((totalEarned - threshold) * 0.009 * 100) / 100);
}

/**
 * Main function to solve the full return math
 */
export function runCalculator(term: TaxReturn): TaxEngineResults {
  // 1. TALLY INCOME
  const totalW2Wages = term.w2s.reduce((sum, item) => sum + (Number(item.wages) || 0), 0);
  const totalFederalWithholding = term.w2s.reduce((sum, item) => sum + (Number(item.withholding) || 0), 0) +
    term.interest1099s.reduce((sum, item) => sum + (Number(item.withholding) || 0), 0) +
    term.dividend1099s.reduce((sum, item) => sum + (Number(item.withholding) || 0), 0) +
    term.retirement1099s.reduce((sum, item) => sum + (Number(item.withholding) || 0), 0);

  const totalDividendWithholding = term.dividend1099s.reduce((sum, item) => sum + (Number(item.withholding) || 0), 0);

  const total1099Interest = term.interest1099s.reduce((sum, item) => sum + (Number(item.taxableInterest) || 0), 0);
  const total1099Dividends = term.dividend1099s.reduce((sum, item) => sum + (Number(item.ordinaryDividends) || 0), 0);
  const totalOrdinaryDividends = total1099Dividends;
  const totalQualifiedDividends = term.dividend1099s.reduce((sum, item) => sum + (Number(item.qualifiedDividends) || 0), 0);

  // Capital Gains math
  const totalShortTerm = term.capitalGains1099s
    .filter(item => !item.isLongTerm)
    .reduce((sum, item) => sum + ((Number(item.salesProceeds) || 0) - (Number(item.costBasis) || 0)), 0);
  const totalLongTerm = term.capitalGains1099s
    .filter(item => item.isLongTerm)
    .reduce((sum, item) => sum + ((Number(item.salesProceeds) || 0) - (Number(item.costBasis) || 0)), 0);
  const totalCapGainIncome = totalShortTerm + totalLongTerm; // Subject to preferential tax calculations

  const totalRetirementTaxable = term.retirement1099s.reduce((sum, item) => sum + (Number(item.taxableAmount) || 0), 0);
  const totalRetirementWithholding = term.retirement1099s.reduce((sum, item) => sum + (Number(item.withholding) || 0), 0);

  // Other Incomes
  const totalOtherIncome = (Number(term.otherIncome.unemployment) || 0) +
    (Number(term.otherIncome.gamblingWinnings) || 0) +
    (Number(term.otherIncome.cryptoIncome) || 0) +
    (Number(term.otherIncome.foreignIncome) || 0) +
    (Number(term.otherIncome.royalties) || 0) +
    (Number(term.otherIncome.miscellaneous) || 0);

  // Business income net (Schedule C)
  let totalScheduleCNetProfit = 0;
  let selfEmploymentTax = 0;
  let deductibleSETax = 0;

  term.businesses.forEach(biz => {
    const grossIncome = (Number(biz.grossReceipts) || 0) - (Number(biz.returnsAllowances) || 0) + (Number(biz.otherIncome) || 0);
    const expObj = biz.expenses || {};
    const totalExp = Object.values(expObj).reduce<number>((s, val) => s + (Number(val) || 0), 0);
    const netProfit = grossIncome - totalExp;
    totalScheduleCNetProfit += netProfit;

    // Calculate SE Tax on this business profit
    if (netProfit > 400) {
      const netEarnings = netProfit * 0.9235;
      // 12.4% for SS, limit 176100 (2026 est)
      const ssTax = Math.min(netEarnings, 176100) * 0.124;
      const medTax = netEarnings * 0.029;
      const bizSETax = ssTax + medTax;
      selfEmploymentTax += bizSETax;
    }
  });

  selfEmploymentTax = Math.round(selfEmploymentTax);
  deductibleSETax = Math.round(selfEmploymentTax * 0.5);

  // Rental Income net (Schedule E)
  let totalScheduleENetProfit = 0;
  term.properties.forEach(prop => {
    const grossRental = Number(prop.rentalIncome) || 0;
    const totalPropExp = (Number(prop.mortgageInterest) || 0) +
      (Number(prop.propertyTax) || 0) +
      (Number(prop.insurance) || 0) +
      (Number(prop.repairs) || 0) +
      (Number(prop.hoa) || 0) +
      (Number(prop.utilities) || 0) +
      (Number(prop.depreciation) || 0) +
      (Number(prop.otherExpenses) || 0);
    totalScheduleENetProfit += (grossRental - totalPropExp);
  });

  // Calculate Taxable Social Security based on preliminary sum
  const preliminarilyOtherIncome = totalW2Wages + total1099Interest + total1099Dividends +
    totalCapGainIncome + totalRetirementTaxable + totalOtherIncome +
    totalScheduleCNetProfit + totalScheduleENetProfit -
    (Number(term.adjustments.iraDeduction) || 0) -
    (Number(term.adjustments.hsaDeduction) || 0);

  const taxableSocialSecurity = calculateTaxableSocialSecurity(
    Number(term.socialSecurity.grossBenefits) || 0,
    Number(term.socialSecurity.medicarePremiums) || 0,
    term.taxpayer.filingStatus,
    preliminarilyOtherIncome
  );

  // Combine Total Income
  const totalIncome = totalW2Wages +
    total1099Interest +
    total1099Dividends +
    totalCapGainIncome +
    totalRetirementTaxable +
    taxableSocialSecurity +
    totalOtherIncome +
    totalScheduleCNetProfit +
    totalScheduleENetProfit;

  // 2. ADJUSTMENTS TO INCOME (Above the line deductions)
  const totalAdjustments = deductibleSETax +
    (Number(term.adjustments.hsaDeduction) || 0) +
    (Number(term.adjustments.iraDeduction) || 0) +
    (Number(term.adjustments.studentLoanInterest) || 0) +
    (Number(term.adjustments.sepContribution) || 0) +
    (Number(term.adjustments.simpleIraContribution) || 0) +
    (Number(term.adjustments.solo401kContribution) || 0) +
    (Number(term.adjustments.seHealthInsurance) || 0);

  const adjustedGrossIncome = Math.max(0, totalIncome - totalAdjustments);

  // 3. DEDUCTIONS (Standard vs Itemized)
  const standardDeductionsValue = STANDARD_DEDUCTIONS[term.taxpayer.filingStatus] || 15350;

  // State local taxes list cap $10,000 (SALT limitation)
  const rawSalt = (Number(term.itemizedDeductions.stateLocalIncomeTax) || 0) + (Number(term.itemizedDeductions.realEstateTaxes) || 0);
  const allowedSalt = Math.min(10000, rawSalt);

  // AGI limits on charity are usually substantial, we simplify medical floor as 7.5% of AGI
  const medicalFloorLimit = adjustedGrossIncome * 0.075;
  const allowedMedical = Math.max(0, (Number(term.itemizedDeductions.medicalExpenses) || 0) - medicalFloorLimit);

  const itemizedDeductionsValue = allowedMedical +
    allowedSalt +
    (Number(term.itemizedDeductions.mortgageInterest) || 0) +
    (Number(term.itemizedDeductions.charitableContributions) || 0) +
    (Number(term.itemizedDeductions.casualtyLosses) || 0);

  let useItemized = itemizedDeductionsValue > standardDeductionsValue;
  if (term.useItemizedDeductionForce) {
    useItemized = true;
  }

  const allowedDeductionValue = useItemized ? itemizedDeductionsValue : standardDeductionsValue;

  // 4. QBI DEDUCTION (Section 199A)
  // 20% of net QBI. Net QBI is Net Biz Income less deductible SE tax less SE Health Ins.
  let qbiBase = totalScheduleCNetProfit - deductibleSETax - (Number(term.adjustments.seHealthInsurance) || 0);
  if (qbiBase < 0) qbiBase = 0;
  let qbiDeduction = Math.round(qbiBase * 0.20);
  
  // QBI deduction is limited to 20% of (taxable income before QBI minus net capital gains)
  // Let's compute this after calculating preliminary taxable income
  const preliminaryTaxable = Math.max(0, adjustedGrossIncome - allowedDeductionValue);
  const netGainsForQbiLimit = Math.max(0, totalCapGainIncome) + totalQualifiedDividends;
  const qbiLimit = Math.max(0, Math.round(0.20 * (preliminaryTaxable - netGainsForQbiLimit)));
  qbiDeduction = Math.min(qbiDeduction, qbiLimit);

  // 5. TAXABLE INCOME
  const taxableIncome = Math.max(0, preliminaryTaxable - qbiDeduction);

  // 6. CALCULATE ORDINARY & PREFERENTIAL TAX LIABILITY
  // Separately tax ordinary, LTCG + Qual Divs
  // Preferential income is LTCG and Qualified dividends, up to taxable income.
  let prefIncomeToCalculate = Math.max(0, totalQualifiedDividends + Math.max(0, totalCapGainIncome));
  if (prefIncomeToCalculate > taxableIncome) {
    prefIncomeToCalculate = taxableIncome;
  }
  const ordinaryTaxableIncomeFraction = Math.max(0, taxableIncome - prefIncomeToCalculate);

  const brackets = FEDERAL_BRACKETS[term.taxpayer.filingStatus] || FEDERAL_BRACKETS[FilingStatus.Single];
  
  const taxResults = calculateQualifiedAndCapGainsTax(
    taxableIncome,
    ordinaryTaxableIncomeFraction,
    prefIncomeToCalculate,
    term.taxpayer.filingStatus,
    brackets
  );

  const ordinaryTax = taxResults.ordinaryTax;
  const qualifiedDivCapGainTax = taxResults.preferentialTax;
  let ordinaryCalculatedTaxLiability = taxResults.totalTax;

  // 7. NIIT & Additional Medicare Tax
  const investmentIncomes = total1099Interest + total1099Dividends + Math.max(0, totalCapGainIncome);
  const netInvestmentIncomeTax = calculateNIIT(adjustedGrossIncome, investmentIncomes, term.taxpayer.filingStatus);
  const additionalMedicareTax = calculateAdditionalMedicareTax(totalW2Wages, totalScheduleCNetProfit, term.taxpayer.filingStatus);

  // Combined preliminary tax before credits
  const totalFederalTaxBeforeCredits = ordinaryCalculatedTaxLiability + selfEmploymentTax + netInvestmentIncomeTax + additionalMedicareTax;

  // 8. CREDITS calculation
  // Dependent Credits (Child Tax Credit / Other Dependent Credit)
  let calculatedChildTaxCredit = 0;
  let calculatedOtherDependentCredit = 0;

  term.dependents.forEach(dep => {
    if (dep.isEligibleCTC) {
      calculatedChildTaxCredit += 2000;
    } else if (dep.isEligibleODC || dep.relationship !== "") {
      calculatedOtherDependentCredit += 500;
    }
  });

  // Calculate CTC / ODC Phaseout
  // Starts at $400,000 for Jointly, $200,000 for others
  let phaseoutLimit = 200000;
  if (term.taxpayer.filingStatus === FilingStatus.MarriedFilingJointly) {
    phaseoutLimit = 400000;
  }

  let totalDependentCredits = calculatedChildTaxCredit + calculatedOtherDependentCredit;
  if (adjustedGrossIncome > phaseoutLimit) {
    const excessThousands = Math.ceil((adjustedGrossIncome - phaseoutLimit) / 1000);
    const reduction = excessThousands * 50;
    totalDependentCredits = Math.max(0, totalDependentCredits - reduction);
    
    // Pro-rate between the two
    if (totalDependentCredits === 0) {
      calculatedChildTaxCredit = 0;
      calculatedOtherDependentCredit = 0;
    } else {
      const originalTotal = (calculatedChildTaxCredit + calculatedOtherDependentCredit) || 1;
      calculatedChildTaxCredit = Math.round(totalDependentCredits * (calculatedChildTaxCredit / originalTotal));
      calculatedOtherDependentCredit = Math.max(0, totalDependentCredits - calculatedChildTaxCredit);
    }
  }

  // Non-refundable credits list (limited by the income tax liability, but SE tax, NIIT, med tax usually aren't erasable by certain non-refundable credits, we limit it by tax before credits)
  const totalNonRefundableRequested = calculatedOtherDependentCredit + 
    calculatedChildTaxCredit + 
    (Number(term.credits.educationCreditLLC) || 0) +
    (Number(term.credits.childDependentCareCredit) || 0) +
    (Number(term.credits.foreignTaxCredit) || 0) +
    (Number(term.credits.retirementSavingsCredit) || 0) +
    (Number(term.credits.residentialEnergyCredit) || 0) +
    (Number(term.credits.evCredit) || 0);

  // Non-refundable credits cannot lower ordinary tax below zero
  const allowedOrdinaryTaxNonRefundables = Math.min(ordinaryCalculatedTaxLiability, totalNonRefundableRequested);
  const totalNonRefundableCredits = allowedOrdinaryTaxNonRefundables;

  // Refundable credits
  const totalRefundableCredits = (Number(term.credits.earnedIncomeCredit) || 0) +
    (Number(term.credits.educationCreditAOTC) || 0); // Include standard American Opp, up to 40% is refundable

  // Final Federal Tax liability
  const totalFederalTaxLiability = Math.round(Math.max(0, totalFederalTaxBeforeCredits - totalNonRefundableCredits));

  // 9. PAYMENTS TALLY
  const totalW2Withholding = term.w2s.reduce((sum, item) => sum + (Number(item.withholding) || 0), 0);
  const total1099Withholding = term.interest1099s.reduce((sum, item) => sum + (Number(item.withholding) || 0), 0) +
    term.dividend1099s.reduce((sum, item) => sum + (Number(item.withholding) || 0), 0) +
    term.retirement1099s.reduce((sum, item) => sum + (Number(item.withholding) || 0), 0);

  const estimatedPaymentsTotal = (Number(term.payments.estimatedQ1) || 0) +
    (Number(term.payments.estimatedQ2) || 0) +
    (Number(term.payments.estimatedQ3) || 0) +
    (Number(term.payments.estimatedQ4) || 0);

  const totalFederalPayments = totalW2Withholding +
    total1099Withholding +
    estimatedPaymentsTotal +
    (Number(term.payments.extensionPayments) || 0) +
    (Number(term.payments.priorYearOverpayment) || 0);

  // Refund or Tax Balance Due formula
  // Positive = Refund, Negative = Balance Due (we'll store value as absolute but track boolean or signed)
  // Signed result: Refundable amount + total payments - total tax liability
  const federalRefundOrDue = (totalFederalPayments + totalRefundableCredits) - totalFederalTaxLiability;
  const isFederalRefund = federalRefundOrDue >= 0;

  // 10. STATE TAX CALCULATION ENGINE
  // Support state: Resident state
  const stateCodeSelected = term.stateTax.residentState || "TX";
  const stateConfig = STATES_LIST.find(s => s.code === stateCodeSelected) || { code: "TX", name: "Texas", type: "none" };

  // Calculate allocate-able income for resident/non-resident
  // Wages, rentals, business incomes are state taxed
  let stateAllocatedGrossIncome = adjustedGrossIncome; // Resident state taxes full AGI
  if (term.stateTax.isPartYear || term.stateTax.isNonResident) {
    // Only allocated state portions
    const stateW2Wages = term.w2s.filter(w => w.stateCode === stateCodeSelected).reduce((sum, item) => sum + (Number(item.stateWages) || 0), 0);
    // Approximate business and rentals associated
    const bizAllocated = term.stateTax.isPartYear ? totalScheduleCNetProfit * 0.5 : 0;
    const rentAllocated = term.stateTax.isPartYear ? totalScheduleENetProfit * 0.5 : 0;
    stateAllocatedGrossIncome = stateW2Wages + bizAllocated + rentAllocated;
  }

  const stateDeductions = Number(term.stateTax.stateDeductions) || 0;
  const stateAdditions = Number(term.stateTax.stateAdditions) || 0;
  const stateSubtractions = Number(term.stateTax.stateSubtractions) || 0;

  const stateTaxableIncome = Math.max(0, stateAllocatedGrossIncome + stateAdditions - stateSubtractions - stateDeductions);

  let stateTaxLiability = 0;
  if (stateConfig.type === "flat" && stateConfig.flatRate) {
    stateTaxLiability = stateTaxableIncome * stateConfig.flatRate;
  } else if (stateConfig.type === "progressive" && stateConfig.brackets) {
    stateTaxLiability = calculateTaxFromBrackets(stateTaxableIncome, stateConfig.brackets);
  }

  stateTaxLiability = Math.round(Math.max(0, stateTaxLiability - (Number(term.stateTax.stateCredits) || 0)));

  // State wages withholdings plus estimated payments
  const stateWagesWithholding = term.w2s.filter(w => w.stateCode === stateCodeSelected).reduce((sum, item) => sum + (Number(item.stateWithholding) || 0), 0);
  const stateTotalPayments = stateWagesWithholding +
    (Number(term.stateTax.stateEstimatedPayments) || 0) +
    (Number(term.stateTax.stateExtensionPayments) || 0);

  const stateRefundOrDue = stateTotalPayments - stateTaxLiability;
  const isStateRefund = stateRefundOrDue >= 0;

  // 11. ESTIMATED TAX MODULE & SAFE HARBOR RULES
  // Safe Harbor rules: Required payment is 90% of current line tax, OR 100% of last year's tax (110% if AGI was >$150,000)
  const priorYearTax = Number(term.priorYearTaxField) || 0;
  const safeHarborAGILimit = term.taxpayer.filingStatus === FilingStatus.MarriedFilingSeparately ? 75000 : 150000;
  
  const priorYearPercentage = (adjustedGrossIncome > safeHarborAGILimit) ? 1.10 : 1.00;
  const priorYearRuleRequired = priorYearTax * priorYearPercentage;
  const currentYearRuleRequired = totalFederalTaxLiability * 0.90;

  // Required annual is the minimum of these two
  let safeHarborTotalRequired = 0;
  if (priorYearTax > 0) {
    safeHarborTotalRequired = Math.min(currentYearRuleRequired, priorYearRuleRequired);
  } else {
    safeHarborTotalRequired = currentYearRuleRequired;
  }

  // Safe harbor can be met by federal withholdings (W-2 + 1099). If not met, need quarterly estimateds.
  const totalFederalWithholdingActual = totalW2Withholding + total1099Withholding;
  const safeHarborMet = totalFederalWithholdingActual >= safeHarborTotalRequired;

  const estimatedShortfallRequired = Math.max(0, safeHarborTotalRequired - totalFederalWithholdingActual);
  const estimatedQuarterlyRequired = Math.round((estimatedShortfallRequired / 4) * 100) / 100;

  return {
    totalW2Wages,
    totalFederalWithholding,
    total1099Interest,
    total1099Dividends,
    totalDividendWithholding,
    totalOrdinaryDividends,
    totalQualifiedDividends,
    totalCapGainIncome,
    totalRetirementTaxable,
    totalRetirementWithholding,
    taxableSocialSecurity,
    totalOtherIncome,
    
    totalScheduleCNetProfit,
    selfEmploymentTax,
    deductibleSETax,
    qbiDeduction,
    
    totalScheduleENetProfit,
    
    totalIncome,
    totalAdjustments,
    adjustedGrossIncome,
    
    hasStandardDeduction: !useItemized,
    standardDeductionsValue,
    itemizedDeductionsValue,
    allowedDeductionValue,
    
    taxableIncome,
    
    ordinaryTax,
    qualifiedDivCapGainTax,
    netInvestmentIncomeTax,
    additionalMedicareTax,
    totalFederalTaxBeforeCredits,
    
    calculatedChildTaxCredit,
    calculatedOtherDependentCredit,
    totalNonRefundableCredits,
    totalRefundableCredits,
    
    totalFederalTaxLiability,
    totalFederalPayments,
    federalRefundOrDue: Math.round(federalRefundOrDue * 100) / 100,
    isFederalRefund,

    stateAllocatedGrossIncome,
    stateTaxableIncome,
    stateTaxLiability,
    stateTaxBeforeCredits: stateTaxLiability, // aligns with key usage in ReportsModule.tsx
    stateTotalWithholding: stateWagesWithholding,
    stateTotalPayments,
    stateRefundOrDue: Math.round(stateRefundOrDue * 100) / 100,
    isStateRefund,

    safeHarborTotalRequired,
    safeHarborMet,
    estimatedQ1Required: estimatedQuarterlyRequired,
    estimatedQ2Required: estimatedQuarterlyRequired,
    estimatedQ3Required: estimatedQuarterlyRequired,
    estimatedQ4Required: estimatedQuarterlyRequired,
  };
}

/**
 * Creates an empty, pristine tax return configuration for default use in UI
 */
export function createNewBlankReturn(id: string = "default-return"): TaxReturn {
  return {
    id,
    clientName: "New Client",
    createdAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
    status: "In Progress",
    taxpayer: {
      taxYear: 2026,
      firstName: "",
      lastName: "",
      ssn: "",
      dob: "",
      occupation: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "CA",
      zipCode: "",
      spouseFirstName: "",
      spouseLastName: "",
      spouseSsn: "",
      spouseDob: "",
      spouseOccupation: "",
      filingStatus: FilingStatus.Single,
    },
    dependents: [],
    w2s: [],
    interest1099s: [],
    dividend1099s: [],
    capitalGains1099s: [],
    retirement1099s: [],
    socialSecurity: {
      grossBenefits: 0,
      medicarePremiums: 0,
    },
    otherIncome: {
      unemployment: 0,
      gamblingWinnings: 0,
      cryptoIncome: 0,
      foreignIncome: 0,
      royalties: 0,
      miscellaneous: 0,
    },
    businesses: [],
    properties: [],
    adjustments: {
      hsaDeduction: 0,
      iraDeduction: 0,
      studentLoanInterest: 0,
      sepContribution: 0,
      simpleIraContribution: 0,
      solo401kContribution: 0,
      seHealthInsurance: 0,
    },
    useItemizedDeductionForce: false,
    itemizedDeductions: {
      medicalExpenses: 0,
      stateLocalIncomeTax: 0,
      realEstateTaxes: 0,
      mortgageInterest: 0,
      charitableContributions: 0,
      casualtyLosses: 0,
    },
    credits: {
      earnedIncomeCredit: 0,
      educationCreditAOTC: 0,
      educationCreditLLC: 0,
      childDependentCareCredit: 0,
      foreignTaxCredit: 0,
      retirementSavingsCredit: 0,
      residentialEnergyCredit: 0,
      evCredit: 0,
    },
    payments: {
      estimatedQ1: 0,
      estimatedQ2: 0,
      estimatedQ3: 0,
      estimatedQ4: 0,
      extensionPayments: 0,
      priorYearOverpayment: 0,
    },
    stateTax: {
      residentState: "CA",
      partYearStateCode: "",
      isPartYear: false,
      isNonResident: false,
      nonResidentStateCode: "",
      stateAdditions: 0,
      stateSubtractions: 0,
      stateDeductions: 0,
      stateCredits: 0,
      stateEstimatedPayments: 0,
      stateExtensionPayments: 0,
    },
    priorYearTaxField: 0,
  };
}
