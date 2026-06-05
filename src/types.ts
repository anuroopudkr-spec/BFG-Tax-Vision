/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Filing Status Enum
export enum FilingStatus {
  Single = "Single",
  MarriedFilingJointly = "Married Filing Jointly",
  MarriedFilingSeparately = "Married Filing Separately",
  HeadOfHousehold = "Head of Household",
  QualifyingSurvivingSpouse = "Qualifying Surviving Spouse"
}

// Business Type Enum
export enum BusinessType {
  SoleProprietor = "Sole Proprietor",
  SingleMemberLLC = "Single Member LLC",
  IndependentContractor = "Independent Contractor",
  Freelancer = "Freelancer",
  Consultant = "Consultant",
  RealEstateAgent = "Real Estate Agent",
  TruckDriver = "Truck Driver",
  UberLyft = "Uber/Lyft Driver",
  DoorDash = "DoorDash Delivery",
  Ecommerce = "E-commerce",
  AmazonFBA = "Amazon FBA",
  Construction = "Construction",
  HVAC = "HVAC / Trades",
  Medical = "Medical Practice",
  Legal = "Legal Services",
  Other = "Other/Miscellaneous"
}

// State Type
export interface StateConfig {
  code: string;
  name: string;
  type: "none" | "flat" | "progressive";
  flatRate?: number; // e.g. 0.045 for 4.5%
  brackets?: { limit: number; rate: number }[];
}

export interface TaxpayerInfo {
  taxYear: number;
  firstName: string;
  lastName: string;
  ssn: string;
  dob: string;
  occupation: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  // Spouse details
  spouseFirstName: string;
  spouseLastName: string;
  spouseSsn: string;
  spouseDob: string;
  spouseOccupation: string;
  filingStatus: FilingStatus;
}

export interface Dependent {
  id: string;
  name: string;
  ssn: string;
  dob: string;
  relationship: string;
  monthsLived: number;
  isFullTimeStudent: boolean;
  isDisabled: boolean;
  isEligibleCTC: boolean; // Child Tax Credit
  isEligibleODC: boolean; // Other Dependent Credit
}

export interface W2Entry {
  id: string;
  employerName: string;
  employerEin: string;
  wages: number;
  withholding: number;
  ssWages: number;
  ssWithholding: number;
  medWages: number;
  medWithholding: number;
  stateCode: string;
  stateWages: number;
  stateWithholding: number;
  localWages: number;
  localWithholding: number;
}

export interface Interest1099INT {
  id: string;
  payerName: string;
  taxableInterest: number;
  taxExemptInterest: number;
  withholding: number;
  stateWithholding: number;
}

export interface Dividend1099DIV {
  id: string;
  payerName: string;
  ordinaryDividends: number;
  qualifiedDividends: number;
  capitalGains: number;
  withholding: number;
  stateWithholding: number;
}

export interface CapitalGain1099B {
  id: string;
  description: string;
  dateAcquired: string;
  dateSold: string;
  salesProceeds: number;
  costBasis: number;
  isLongTerm: boolean;
}

export interface Retirement1099R {
  id: string;
  payerName: string;
  grossDistribution: number;
  taxableAmount: number;
  withholding: number;
  stateWithholding: number;
}

export interface SocialSecurityBenefits {
  grossBenefits: number;
  medicarePremiums: number;
}

export interface OtherIncome {
  unemployment: number;
  gamblingWinnings: number;
  cryptoIncome: number;
  foreignIncome: number;
  royalties: number;
  miscellaneous: number;
}

export interface ScheduleCBusiness {
  id: string;
  businessName: string;
  businessType: BusinessType;
  ein: string;
  businessAddress: string;
  naicsCode: string;
  accountingMethod: "Cash" | "Accrual" | "Other";
  materialParticipation: boolean;
  
  // Income
  grossReceipts: number;
  returnsAllowances: number;
  otherIncome: number;

  // Expenses
  expenses: {
    advertising: number;
    carTruck: number;
    commissions: number;
    contractLabor: number;
    insurance: number;
    interest: number;
    legalProfessional: number;
    officeExpense: number;
    rent: number;
    repairs: number;
    supplies: number;
    taxesLicenses: number;
    travel: number;
    meals: number;
    utilities: number;
    wages: number;
    depreciation: number;
    homeOffice: number;
    otherExpenses: number;
  };
}

export interface ScheduleEProperty {
  id: string;
  propertyAddress: string;
  rentalIncome: number;
  
  // Expenses
  mortgageInterest: number;
  propertyTax: number;
  insurance: number;
  repairs: number;
  hoa: number;
  utilities: number;
  depreciation: number;
  otherExpenses: number;
}

export interface AdjustmentsToIncome {
  hsaDeduction: number;
  iraDeduction: number;
  studentLoanInterest: number;
  sepContribution: number;
  simpleIraContribution: number;
  solo401kContribution: number;
  seHealthInsurance: number;
}

export interface ItemizedDeductions {
  medicalExpenses: number; // Subject to AGI Floor
  stateLocalIncomeTax: number; // Subject to SALT limit ($10,000)
  realEstateTaxes: number;
  mortgageInterest: number;
  charitableContributions: number;
  casualtyLosses: number;
}

export interface InputCredits {
  childTaxCreditOverride?: number; // Calculated normally but can override
  earnedIncomeCredit: number;
  educationCreditAOTC: number; // American Opportunity
  educationCreditLLC: number;  // Lifetime Learning
  childDependentCareCredit: number;
  foreignTaxCredit: number;
  retirementSavingsCredit: number;
  residentialEnergyCredit: number;
  evCredit: number;
}

export interface InputPayments {
  estimatedQ1: number;
  estimatedQ2: number;
  estimatedQ3: number;
  estimatedQ4: number;
  extensionPayments: number;
  priorYearOverpayment: number;
}

// Comprehensive State Income details
export interface StateTaxInput {
  residentState: string;
  partYearStateCode: string;
  isPartYear: boolean;
  isNonResident: boolean;
  nonResidentStateCode: string;

  // Direct State adjustments (if applicable)
  stateAdditions: number;
  stateSubtractions: number;
  stateDeductions: number;
  stateCredits: number;
  stateEstimatedPayments: number;
  stateExtensionPayments: number;
}

// Complete return structure saved in SQLite or LocalStorage
export interface TaxReturn {
  id: string; // Unique Identifier
  clientName: string; // Quick label, e.g. "Smith, John"
  createdAt: string;
  lastSavedAt: string;
  status: "In Progress" | "Completed" | "Under Review";
  
  taxpayer: TaxpayerInfo;
  dependents: Dependent[];
  
  // Incomes
  w2s: W2Entry[];
  interest1099s: Interest1099INT[];
  dividend1099s: Dividend1099DIV[];
  capitalGains1099s: CapitalGain1099B[];
  retirement1099s: Retirement1099R[];
  socialSecurity: SocialSecurityBenefits;
  otherIncome: OtherIncome;

  // Business Modules
  businesses: ScheduleCBusiness[];
  properties: ScheduleEProperty[];

  // Adjustments & Deductions
  adjustments: AdjustmentsToIncome;
  useItemizedDeductionForce: boolean; // toggle to enforce itemized even if standard is larger
  itemizedDeductions: ItemizedDeductions;

  // Credits & Payments
  credits: InputCredits;
  payments: InputPayments;

  // State returns configurations
  stateTax: StateTaxInput;

  // Prior Year Federal info for Safe Harbor estimation
  priorYearTaxField: number;
}

export interface TaxEngineResults {
  // Income tallies
  totalW2Wages: number;
  totalFederalWithholding: number;
  total1099Interest: number;
  total1099Dividends: number;
  totalDividendWithholding: number;
  totalOrdinaryDividends: number;
  totalQualifiedDividends: number;
  totalCapGainIncome: number;
  totalRetirementTaxable: number;
  totalRetirementWithholding: number;
  taxableSocialSecurity: number;
  totalOtherIncome: number;
  
  // Schedule C tallies
  totalScheduleCNetProfit: number;
  selfEmploymentTax: number;
  deductibleSETax: number;
  qbiDeduction: number;
  
  // Schedule E tallies
  totalScheduleENetProfit: number;

  totalIncome: number;
  totalAdjustments: number; // Includes deductible SE tax + SE health + IRA etc
  adjustedGrossIncome: number;

  // Deductions
  hasStandardDeduction: boolean;
  standardDeductionsValue: number;
  itemizedDeductionsValue: number;
  allowedDeductionValue: number; // Greater of standard/itemized

  taxableIncome: number;

  // Tax breakdown
  ordinaryTax: number;
  qualifiedDivCapGainTax: number; // Calculated at lower rates
  alternativeMinimumTax?: number; 
  netInvestmentIncomeTax: number;
  additionalMedicareTax: number;
  totalFederalTaxBeforeCredits: number;

  // Credits
  calculatedChildTaxCredit: number; // Non-refundable part
  calculatedOtherDependentCredit: number;
  totalNonRefundableCredits: number;
  totalRefundableCredits: number; // e.g. Earned income credit, refundable CTC if any
  
  // Final calculations
  totalFederalTaxLiability: number; // Net federal tax after credits + SE tax etc.
  totalFederalPayments: number; // Withholdings + Estimated states
  federalRefundOrDue: number; // Positive = Refund, Negative = Due
  isFederalRefund: boolean;

  // State Tax tallies
  stateAllocatedGrossIncome: number;
  stateTaxableIncome: number;
  stateTaxLiability: number;
  stateTaxBeforeCredits: number;
  stateTotalWithholding: number;
  stateTotalPayments: number;
  stateRefundOrDue: number; // Positive = Refund, Negative = Due
  isStateRefund: boolean;

  // Safe Harbor calculations
  safeHarborTotalRequired: number;
  safeHarborMet: boolean;
  estimatedQ1Required: number;
  estimatedQ2Required: number;
  estimatedQ3Required: number;
  estimatedQ4Required: number;
}
