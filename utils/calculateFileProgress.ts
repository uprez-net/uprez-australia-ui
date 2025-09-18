import { documentCategories as dc } from "@/app/interface/interface";
import { splitCamelCase } from "@/components/document-upload-dialog";
import { DocumentType, Document } from "@prisma/client";

export const documentCategories = {
  "Corporate Governance & Formation": [
    DocumentType.CompanyConstitution,
    DocumentType.CorporateStructureChart,
    DocumentType.CorporateGovernanceStatement,
    DocumentType.SecuritiesTradingPolicy,
    DocumentType.BoardAndCommitteeCharters,
  ],
  "Financial Reporting & Analysis": [
    DocumentType.AuditedFinancialStatements,
    DocumentType.ProFormaStatementOfFinancialPosition,
    DocumentType.InvestigatingAccountantsReport,
    DocumentType.WorkingCapitalStatement,
    DocumentType.RegulatoryApprovals,
  ],
  "Shareholders & Related Parties Information": [
    DocumentType.ShareholderSpreadAnalysisReport,
    DocumentType.RelatedPartiesAndPromotersList,
    DocumentType.ExecutedRestrictionDeeds,
    DocumentType.EscrowAgreements,
    DocumentType.ShareRegisterAnalysis,
  ],
  "Directors & Officers Compliance": [
    DocumentType.DirectorQuestionnaires,
    DocumentType.PoliceAndBankruptcyChecks,
    DocumentType.BankruptcyRegisterSearches,
    DocumentType.BoardResolutionASXContact,
  ]
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
