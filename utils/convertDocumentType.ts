import { DocumentType } from "@prisma/client";

const documentLabelMap: Partial<Record<DocumentType, string[]>> = {
  [DocumentType.AuditedFinancialStatements]: [
    "audited financial statement",
    "Audited financial",
  ],
  [DocumentType.ProfitAndLossStatement]: ["profit loss"],
  [DocumentType.BalanceSheet]: ["balance sheet", "Net_tangible_assets"],
  [DocumentType.CashFlowStatement]: ["cashflow"],
  [DocumentType.AnnualReport]: ["Annual report"],
  [DocumentType.ManagementDiscussionAndAnalysis]: [
    "Management discussion and analysis",
  ],
  [DocumentType.CertificateOfIncorporation]: [
    "COI",
    "Commencement_of_business_certificate",
  ],
  [DocumentType.MemorandumOfAssociation]: ["MOA_AOA"],
  [DocumentType.ArticlesOfAssociation]: ["MOA_AOA"],
  [DocumentType.BoardResolutions]: ["Board_Resolutions"],
  [DocumentType.ShareholderAgreements]: ["Share_Capital"],
  [DocumentType.MaterialContracts]: ["MATERIAL_CONTRACTS"],
  [DocumentType.ROCFilings]: ["Shareholding_Pattern"],
  [DocumentType.TaxComplianceCertificates]: ["Legal_Compliance_Certificates"],
  [DocumentType.StatutoryAuditReports]: ["Corporate_governance"],
  [DocumentType.BoardMeetingMinutes]: ["Board_Composition"],
  [DocumentType.RelatedPartyTransactionPolicy]: [
    "Declaration_of_Related_Party_Transactions",
  ],
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