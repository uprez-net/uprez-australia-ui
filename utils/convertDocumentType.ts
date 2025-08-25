import { DocumentType } from "@prisma/client";

const documentLabelMap: Partial<Record<DocumentType, string[]>> = {
  // Corporate Structure
  [DocumentType.CompanyConstitution]: ["constitution", "company constitution"],
  [DocumentType.CorporateStructureChart]: ["corporate structure chart", "org chart"],
  [DocumentType.BoardResolutionConstitution]: ["board resolution constitution"],
  [DocumentType.BoardResolutionASXContact]: ["board resolution asx contact"],

  // Financial Documents
  [DocumentType.AuditedFinancialStatements]: ["audited financial statement", "audited financials"],
  [DocumentType.ProFormaStatementOfFinancialPosition]: ["pro forma financial position"],
  [DocumentType.InvestigatingAccountantsReport]: ["investigating accountants report", "IAR"],
  [DocumentType.WorkingCapitalStatement]: ["working capital statement"],

  // Market Integrity
  [DocumentType.ShareholderSpreadAnalysisReport]: ["shareholder spread analysis", "shareholder analysis"],
  [DocumentType.FreeFloatAnalysis]: ["free float analysis"],
  [DocumentType.RelatedPartiesAndPromotersList]: ["related parties", "promoters list"],

  // Governance & Personnel
  [DocumentType.DirectorConsentForms]: ["director consent form"],
  [DocumentType.DirectorQuestionnaires]: ["director questionnaire"],
  [DocumentType.PoliceAndBankruptcyChecks]: ["police check", "bankruptcy check"],
  [DocumentType.ASXListingRuleCourseCertificate]: ["asx listing rule course certificate"],
  [DocumentType.SecuritiesTradingPolicy]: ["securities trading policy"],
  [DocumentType.CorporateGovernanceStatement]: ["corporate governance statement"],
  [DocumentType.BoardAndCommitteeCharters]: ["board charter", "committee charter"],

  // Escrow & Restricted Securities
  [DocumentType.ExecutedRestrictionDeeds]: ["restriction deed", "executed restriction"],

  // The Offer
  [DocumentType.FinalProspectusDocument]: ["final prospectus"],
  [DocumentType.DueDiligenceCommitteeDocuments]: ["due diligence committee", "ddc documents"],
  [DocumentType.ExpertConsentLetters]: ["expert consent letter"],

  // Capital Structure
  [DocumentType.OptionAndPerformanceRightTerms]: ["option terms", "performance right terms"],
  [DocumentType.CompanyOptionSecurityRegister]: ["option register", "security register"],

  // Legal & Agreements
  [DocumentType.LegalDueDiligenceReport]: ["legal due diligence report"],
  [DocumentType.SummaryOfMaterialContracts]: ["material contracts", "summary of material contracts"],
  [DocumentType.RelatedPartyAgreements]: ["related party agreements"],
  [DocumentType.AdvisorMandates]: ["advisor mandate"],

  // Asset Ownership & Tax
  [DocumentType.AssetTitleDocuments]: ["asset title", "title deed"],
  [DocumentType.IPAssignmentDeeds]: ["ip assignment deed", "intellectual property assignment"],
  [DocumentType.SpecialistTaxDueDiligenceReport]: ["specialist tax due diligence report"],
  [DocumentType.CompanyTaxReturns]: ["company tax return"],

  // Sector-Specific
  [DocumentType.IndependentGeologistsReport]: ["independent geologist report"],
  [DocumentType.TherapeuticGoodsAdministrationApprovals]: ["tga approval", "therapeutic goods administration"],
  [DocumentType.AustralianFinancialServicesLicence]: ["afsl", "australian financial services licence"],

  // Legacy / Original types (still in system)
  [DocumentType.CertificateOfIncorporation]: ["certificate of incorporation", "COI"],
  [DocumentType.MemorandumOfAssociation]: ["memorandum of association", "moa"],
  [DocumentType.ArticlesOfAssociation]: ["articles of association", "aoa"],
  [DocumentType.ShareholderAgreements]: ["shareholder agreement"],
  [DocumentType.IntellectualPropertyDocuments]: ["intellectual property", "ip documents"],
  [DocumentType.TaxComplianceCertificates]: ["tax compliance certificate", "legal compliance certificates"],
  [DocumentType.RegulatoryApprovals]: ["regulatory approval"],
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