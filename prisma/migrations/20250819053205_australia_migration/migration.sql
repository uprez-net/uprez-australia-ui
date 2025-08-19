/*
  Warnings:

  - The values [BalanceSheet,ProfitAndLossStatement,CashFlowStatement,AnnualReport,TaxReturns,ManagementDiscussionAndAnalysis,BoardResolutions,MaterialContracts,ROCFilings,GSTReturns,EnvironmentalClearances,LaborComplianceCertificates,StatutoryAuditReports,BoardMeetingMinutes,AuditCommitteeMinutes,CodeOfConduct,WhistleblowerPolicy,RelatedPartyTransactionPolicy,RiskManagementPolicy,NominationCommitteeMinutes] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DocumentType_new" AS ENUM ('CompanyConstitution', 'CorporateStructureChart', 'BoardResolutionConstitution', 'BoardResolutionASXContact', 'AuditedFinancialStatements', 'ProFormaStatementOfFinancialPosition', 'InvestigatingAccountantsReport', 'WorkingCapitalStatement', 'ShareholderSpreadAnalysisReport', 'FreeFloatAnalysis', 'RelatedPartiesAndPromotersList', 'DirectorConsentForms', 'DirectorQuestionnaires', 'PoliceAndBankruptcyChecks', 'ASXListingRuleCourseCertificate', 'SecuritiesTradingPolicy', 'CorporateGovernanceStatement', 'BoardAndCommitteeCharters', 'ExecutedRestrictionDeeds', 'FinalProspectusDocument', 'DueDiligenceCommitteeDocuments', 'ExpertConsentLetters', 'OptionAndPerformanceRightTerms', 'CompanyOptionSecurityRegister', 'LegalDueDiligenceReport', 'SummaryOfMaterialContracts', 'RelatedPartyAgreements', 'AdvisorMandates', 'AssetTitleDocuments', 'IPAssignmentDeeds', 'SpecialistTaxDueDiligenceReport', 'CompanyTaxReturns', 'IndependentGeologistsReport', 'TherapeuticGoodsAdministrationApprovals', 'AustralianFinancialServicesLicence', 'CertificateOfIncorporation', 'MemorandumOfAssociation', 'ArticlesOfAssociation', 'ShareholderAgreements', 'IntellectualPropertyDocuments', 'TaxComplianceCertificates', 'RegulatoryApprovals');
ALTER TABLE "Document" ALTER COLUMN "documentType" TYPE "DocumentType_new" USING ("documentType"::text::"DocumentType_new");
ALTER TYPE "DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "DocumentType_old";
COMMIT;
