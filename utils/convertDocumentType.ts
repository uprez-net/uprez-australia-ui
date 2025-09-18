import { DocumentType } from "@prisma/client";

const documentLabelMap: Partial<Record<DocumentType, string[]>> = {
  [DocumentType.CompanyConstitution]: ["Company Constitution"],
  [DocumentType.CorporateStructureChart]: ["Corporate Structure Chart"],
  [DocumentType.AuditedFinancialStatements]: ["Audited Financial Statements"],
  [DocumentType.ProFormaStatementOfFinancialPosition]: ["Reviewed Pro-Forma Statement of Financial Position"],
  [DocumentType.InvestigatingAccountantsReport]: ["Investigating Accountant's Report (IAR)"],
  [DocumentType.ShareholderSpreadAnalysisReport]: ["Shareholder Spread Analysis Report"],
  [DocumentType.FreeFloatAnalysis]: ["Share Register Analysis"],
  [DocumentType.PoliceAndBankruptcyChecks]: [ "National Police Checks" ],
  [DocumentType.ExecutedRestrictionDeeds]: [
    "Executed Restriction Deeds (Appendix 9A)",
  ],
  [DocumentType.BoardResolutionASXContact]: [
    "Board Resolution (Appointing Officer)",
  ],
  [DocumentType.SecuritiesTradingPolicy]: [
    "Securities Trading Policy Document",
  ],
  [DocumentType.CorporateGovernanceStatement]: [
    "Corporate Governance Statement",
  ],
  [DocumentType.BoardAndCommitteeCharters]: [
    "Board and Committee Charters",
  ],
  [DocumentType.RegulatoryApprovals]: [
    "Process/System Check (for future Appendix 4C/5B generation)",
  ],
  [DocumentType.WorkingCapitalStatement]: [ "Working Capital Statement" ],
  [DocumentType.RelatedPartiesAndPromotersList]: [ "List of Related Parties" ],
  [DocumentType.DirectorQuestionnaires]: [ "Completed Director Questionnaires" ],
  [DocumentType.EscrowAgreements]: [ "Escrow Agreements" ],
  [DocumentType.ShareRegisterAnalysis]: [ "Share Register Analysis" ],
  [DocumentType.BankruptcyRegisterSearches]: [ "Bankruptcy Register Searches" ],

};


// Final function
export function getAllLabelsForDocumentType(type: DocumentType): string {
  const labels = documentLabelMap[type];
  if (!labels) {
    return "";
  }
  else {
    return labels[0];
  }
}