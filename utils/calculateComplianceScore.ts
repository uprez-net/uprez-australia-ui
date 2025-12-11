import { Document, DocumentType } from "@prisma/client";
import { ReportSummary } from "./convertReport";
import { documentCategories } from "./calculateFileProgress";

interface DocumentReport {
    id: string;
    report: string;
    summary: ReportSummary;
    status: string;
}

interface ComplianceScore {
    overallScore: number;
    categoryScores: {
        name: CategoryNames;
        score: number;
        findings: number;
    }[]
}

type CategoryNames = Exclude<
    keyof typeof documentCategories,
    "Risk Management & Due Diligence" | "Company Narrative & Growth Strategy"
>;

const TOTAL_REQUIRED_DOCUMENTS = Object.entries(documentCategories).reduce((acc, [key, category]) => {
    if (key === "Risk Management & Due Diligence" || key === "Company Narrative & Growth Strategy") {
        return acc;
    }
    return acc + category.length;
}, 0);

const REQUIRED_DOCUMENTS_BY_CATEGORY: Record<CategoryNames, number> = Object.entries(documentCategories).reduce((acc, [key, category]) => {
    if (key === "Risk Management & Due Diligence" || key === "Company Narrative & Growth Strategy") {
        return acc;
    }
    acc[key as CategoryNames] = category.length;
    return acc;
}, {} as Record<CategoryNames, number>);

export function calculateComplianceScore(report: DocumentReport[], documents: Document[]): ComplianceScore {
    console.log(report);
    console.log(documents);

    const complianceWeight: Record<string, number> = {
        "compliant": 1,
        "partially-compliant": 0.5,
        "non-compliant": 0,
    };

    // Initialize category map for only the required categories
    const categoryMap: Record<CategoryNames, { name: CategoryNames; weightSum: number; findings: number }> =
        Object.keys(REQUIRED_DOCUMENTS_BY_CATEGORY).reduce((acc, key) => {
            acc[key as CategoryNames] = { name: key as CategoryNames, weightSum: 0, findings: 0 };
            return acc;
        }, {} as Record<CategoryNames, { name: CategoryNames; weightSum: number; findings: number }>);

    // Build lookup: document id -> documentType (string like "CompanyConstitution")
    const docTypeById = new Map<string, string>();
    for (const doc of documents) {
        // your Document objects use the field `documentType`
        const id = (doc as any).id;
        const docType = (doc as any).documentType ?? (doc as any).type ?? null;
        if (id && docType) docTypeById.set(String(id), String(docType));
    }

    // For each report, we should match using report.id -> document.id
    for (const r of report) {
        const reportId = String(r.id); // this is the report id which matches Document.id in your logs
        const docType = docTypeById.get(reportId);
        if (!docType) {
            // no matching document (or different id mapping) — skip
            continue;
        }

        // find which category contains this docType (only among required categories)
        let matchedCategory: CategoryNames | null = null;
        for (const categoryName of Object.keys(documentCategories) as Array<keyof typeof documentCategories>) {
            if (categoryName === "Risk Management & Due Diligence" || categoryName === "Company Narrative & Growth Strategy") continue;
            const typesInCategory = documentCategories[categoryName];
            if (typesInCategory && typesInCategory.includes((docType as unknown) as any)) {
                matchedCategory = categoryName as CategoryNames;
                break;
            }
        }

        if (!matchedCategory) continue;

        // Normalize status: handle "partially_compliant" and "partially-compliant"
        const rawStatus = r.summary && (r.summary.compliance_status as string);
        const normalized = rawStatus ? String(rawStatus).replace(/_/g, "-").toLowerCase().trim() : "non-compliant";
        const weight = complianceWeight[normalized] ?? 0;

        categoryMap[matchedCategory].weightSum += weight;
        categoryMap[matchedCategory].findings += 1;
    }

    // Build results
    const categoryScores: ComplianceScore["categoryScores"] = [];
    let totalWeightSum = 0;

    for (const catName of Object.keys(REQUIRED_DOCUMENTS_BY_CATEGORY) as CategoryNames[]) {
        const requiredCount = REQUIRED_DOCUMENTS_BY_CATEGORY[catName] || 0;
        const { weightSum, findings } = categoryMap[catName] ?? { weightSum: 0, findings: 0 };
        const rawScore = requiredCount > 0 ? (weightSum / requiredCount) * 100 : 0;
        const score = Math.round(rawScore * 100) / 100;
        categoryScores.push({ name: catName, score, findings });
        totalWeightSum += weightSum;
    }

    const overallRaw = TOTAL_REQUIRED_DOCUMENTS > 0 ? (totalWeightSum / TOTAL_REQUIRED_DOCUMENTS) * 100 : 0;
    const overallScore = Math.round(overallRaw * 100) / 100;

    console.log(`Final Score: ${overallScore}`);
    console.log("Categories Score");
    console.log(categoryScores);

    return {
        overallScore,
        categoryScores,
    };
}
