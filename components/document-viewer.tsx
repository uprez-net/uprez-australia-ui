"use client";

import {
  prospectusData,
  companyInfo,
  offerDetails,
  financialData,
  type ProspectusSubsection,
} from "@/lib/prospectus-data";
import { Button } from "./ui/button";
import { Bot, Pencil, Upload } from "lucide-react";

interface DocumentViewerProps {
  onEditSection: (subsection: ProspectusSubsection) => void;
  onUploadBrief: (subsectionId: string) => void;
  onGenerateAll: () => void;
}

export function DocumentViewer({
  onEditSection,
  onUploadBrief,
  onGenerateAll,
}: DocumentViewerProps) {
  const renderSubsectionContent = (subsection: ProspectusSubsection) => {
    // For demo purposes, we'll render some sample content based on the subsection
    switch (subsection.id) {
      case "disclaimer":
        return (
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                ASIC Disclaimer
              </h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {subsection.content}
                </p>
              </div>
            </div>
          </div>
        );
      case "the-issuer":
        return (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg mr-3 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              The Issuer
            </h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>{companyInfo.name}</strong> (ACN {companyInfo.acn}) is
                an Australian public company incorporated on March 15, 2018. The
                Company is headquartered in {companyInfo.headquarters}, and is a
                leading provider of innovative enterprise software solutions.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Industry</div>
                  <div className="font-semibold text-gray-900">
                    {companyInfo.industry}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Employees</div>
                  <div className="font-semibold text-gray-900">
                    {companyInfo.employees}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Markets</div>
                  <div className="font-semibold text-gray-900">
                    {companyInfo.markets}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Founded</div>
                  <div className="font-semibold text-gray-900">
                    {companyInfo.founded}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "offer-statistics":
        return (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Offer Statistics
            </h3>
            <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl p-8 text-white">
              <div className="grid grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-black mb-2">
                    {offerDetails.offerPrice}
                  </div>
                  <div className="text-sm opacity-75">
                    Offer Price per Share
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black mb-2">
                    {offerDetails.sharesOnOffer}
                  </div>
                  <div className="text-sm opacity-75">Shares on Offer</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black mb-2">
                    {offerDetails.totalFundsRaised}
                  </div>
                  <div className="text-sm opacity-75">Total Funds Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black mb-2">
                    {offerDetails.marketCap}
                  </div>
                  <div className="text-sm opacity-75">Market Cap (est.)</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "historical-financials":
        return (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Historical Financial Performance
            </h3>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
                <h4 className="font-bold text-gray-900">
                  Three-Year Financial Summary
                </h4>
              </div>
              <div className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 font-bold text-gray-900">
                          (000 AUD)
                        </th>
                        <th className="text-right py-4 font-bold text-gray-900">
                          FY2025
                        </th>
                        <th className="text-right py-4 font-bold text-gray-900">
                          FY2024
                        </th>
                        <th className="text-right py-4 font-bold text-gray-900">
                          FY2023
                        </th>
                        <th className="text-right py-4 font-bold text-green-600">
                          Growth %
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 font-semibold text-gray-900">
                          Revenue
                        </td>
                        <td className="text-right py-4 font-bold text-gray-900">
                          {financialData.revenue.fy2025}
                        </td>
                        <td className="text-right py-4 text-gray-600">
                          {financialData.revenue.fy2024}
                        </td>
                        <td className="text-right py-4 text-gray-600">
                          {financialData.revenue.fy2023}
                        </td>
                        <td className="text-right py-4 font-bold text-green-600">
                          {financialData.revenue.growth}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 font-semibold text-gray-900">
                          EBITDA
                        </td>
                        <td className="text-right py-4 font-bold text-gray-900">
                          {financialData.ebitda.fy2025}
                        </td>
                        <td className="text-right py-4 text-gray-600">
                          {financialData.ebitda.fy2024}
                        </td>
                        <td className="text-right py-4 text-gray-600">
                          {financialData.ebitda.fy2023}
                        </td>
                        <td className="text-right py-4 font-bold text-green-600">
                          {financialData.ebitda.growth}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 font-semibold text-gray-900">
                          Net Profit
                        </td>
                        <td className="text-right py-4 font-bold text-gray-900">
                          {financialData.netProfit.fy2025}
                        </td>
                        <td className="text-right py-4 text-gray-600">
                          {financialData.netProfit.fy2024}
                        </td>
                        <td className="text-right py-4 text-gray-600">
                          {financialData.netProfit.fy2023}
                        </td>
                        <td className="text-right py-4 font-bold text-green-600">
                          {financialData.netProfit.growth}
                        </td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="py-4 font-bold text-green-900">
                          Total Assets
                        </td>
                        <td className="text-right py-4 font-bold text-green-900">
                          {financialData.totalAssets.fy2025}
                        </td>
                        <td className="text-right py-4 text-green-700">
                          {financialData.totalAssets.fy2024}
                        </td>
                        <td className="text-right py-4 text-green-700">
                          {financialData.totalAssets.fy2023}
                        </td>
                        <td className="text-right py-4 font-bold text-green-600">
                          {financialData.totalAssets.growth}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {subsection.title}
            </h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {subsection.content}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Document Viewer - Scrollable */}
      <div
        className="flex-1 overflow-y-auto bg-gray-50"
        id="document-container"
      >
        {/* Floating Generate All Button */}
        <div className="sticky top-6 z-20 flex justify-center mb-8">
          <button
            onClick={onGenerateAll}
            className="floating-action px-8 py-4 rounded-2xl hover-lift"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="font-bold text-gray-900">
                Generate All Sections
              </span>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                AI Powered
              </div>
            </div>
          </button>
        </div>

        {/* PDF-like Document Pages */}
        <div className="max-w-5xl mx-auto px-6 pb-12 space-y-8">
          {prospectusData.map((section) => (
            <div
              key={section.id}
              className="pdf-page rounded-2xl p-12 relative content-section"
              id={section.id}
            >
              <div className="section-badge">
                <div className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
                  {section.title}
                </div>
              </div>

              {/* Document Header for first section */}
              {section.id === "important-notices" && (
                <div className="text-center mb-12 pb-8 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 mb-3">
                    {companyInfo.name}
                  </h1>
                  <h2 className="text-xl font-semibold text-gray-600 mb-4">
                    Initial Public Offering Prospectus
                  </h2>
                  <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-5 8V9a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2h2m-4 0V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h4"
                        />
                      </svg>
                      <span>ASIC Lodged: {companyInfo.lodgeDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{companyInfo.headquarters}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Title for non-first sections */}
              {section.id !== "important-notices" && (
                <h1 className="text-3xl font-black text-gray-900 mb-8">
                  {section.title}
                </h1>
              )}

              {/* Subsections */}
              {section.subsections.map((subsection) => (
                <div
                  key={subsection.id}
                  id={subsection.id}
                  className="content-section mb-10 relative group"
                >
                  <div className="absolute top-0 right-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                      variant="outline"
                      size="icon"
                      title="Edit Section"
                      onClick={() => onEditSection(subsection)}
                      className="h-8 w-8 bg-green-50 text-green-600 hover:bg-green-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      title="Upload/Brief"
                      onClick={() => onUploadBrief(subsection.id)}
                      className="h-8 w-8 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      title="Request AI Rewrite"
                      onClick={() => onUploadBrief(subsection.id)}
                      className="h-8 w-8 bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      <Bot className="h-4 w-4" />
                    </Button>
                  </div>
                  {renderSubsectionContent(subsection)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
