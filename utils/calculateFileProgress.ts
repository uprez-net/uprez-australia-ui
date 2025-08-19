import { documentCategories as dc } from "@/app/interface/interface";
import { splitCamelCase } from "@/components/document-upload-dialog";
import { DocumentType, Document } from "@prisma/client";

export const documentCategories = {
  "Corporate Structure": [
    DocumentType.CompanyConstitution,
    DocumentType.CorporateStructureChart,
    DocumentType.BoardResolutionConstitution,
    DocumentType.BoardResolutionASXContact,
  ],
  "Financial Documents": [
    DocumentType.AuditedFinancialStatements,
    DocumentType.ProFormaStatementOfFinancialPosition,
    DocumentType.InvestigatingAccountantsReport,
    DocumentType.WorkingCapitalStatement,
  ],
  "Market Integrity": [
    DocumentType.ShareholderSpreadAnalysisReport,
    DocumentType.FreeFloatAnalysis,
    DocumentType.RelatedPartiesAndPromotersList,
  ],
  "Governance & Personnel": [
    DocumentType.DirectorConsentForms,
    DocumentType.DirectorQuestionnaires,
    DocumentType.PoliceAndBankruptcyChecks,
    DocumentType.ASXListingRuleCourseCertificate,
    DocumentType.SecuritiesTradingPolicy,
    DocumentType.CorporateGovernanceStatement,
    DocumentType.BoardAndCommitteeCharters,
  ],
  "Escrow & Restricted Securities": [
    DocumentType.ExecutedRestrictionDeeds,
  ],
  "The Offer": [
    DocumentType.FinalProspectusDocument,
    DocumentType.DueDiligenceCommitteeDocuments,
    DocumentType.ExpertConsentLetters,
  ],
  "Capital Structure": [
    DocumentType.OptionAndPerformanceRightTerms,
    DocumentType.CompanyOptionSecurityRegister,
  ],
  "Legal & Agreements": [
    DocumentType.LegalDueDiligenceReport,
    DocumentType.SummaryOfMaterialContracts,
    DocumentType.RelatedPartyAgreements,
    DocumentType.AdvisorMandates,
  ],
  "Asset Ownership & Tax": [
    DocumentType.AssetTitleDocuments,
    DocumentType.IPAssignmentDeeds,
    DocumentType.SpecialistTaxDueDiligenceReport,
    DocumentType.CompanyTaxReturns,
  ],
  "Sector-Specific": [
    DocumentType.IndependentGeologistsReport,
    DocumentType.TherapeuticGoodsAdministrationApprovals,
    DocumentType.AustralianFinancialServicesLicence,
  ],
  "Legacy / Generic Documents": [
    DocumentType.CertificateOfIncorporation,
    DocumentType.MemorandumOfAssociation,
    DocumentType.ArticlesOfAssociation,
    DocumentType.ShareholderAgreements,
    DocumentType.IntellectualPropertyDocuments,
    DocumentType.TaxComplianceCertificates,
    DocumentType.RegulatoryApprovals,
  ],
};

export type CategoryProgress = {
  category: string;
  uploadedCount: number;
  requiredCount: number;
  percentage: number;
};

export function getDocumentUploadProgress(uploadedDocs: Document[]): CategoryProgress[] {
  const uploadedTypes = new Set(uploadedDocs.map(d => splitCamelCase(d.documentType)));

  const result: CategoryProgress[] = [];

  let totalUploaded = 0;
  let totalRequired = 0;


for (const category of dc) {
  const requiredTypes = category.required || [];
  const uploadedCount = requiredTypes.filter(type => uploadedTypes.has(type)).length;
  const requiredCount = requiredTypes.length;
  const percentage = requiredCount === 0 ? 100 : Math.round((uploadedCount / requiredCount) * 100);

  result.push({
    category: category.name,
    uploadedCount,
    requiredCount,
    percentage,
  });

  totalUploaded += uploadedCount;
  totalRequired += requiredCount;
}

  // Add "Overall" category summary
  result.push({
    category: "Overall",
    uploadedCount: totalUploaded,
    requiredCount: totalRequired,
    percentage: Math.round((totalUploaded / totalRequired) * 100)
  });

  return result;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(2)} ${sizes[i]}`;
}
