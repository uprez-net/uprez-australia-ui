"use client";

import React, { useState } from "react";
import {
  Share2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Building2,
  FileText
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";

// --- Mock ShadCN UI Components ---
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// --- Theme Helper ---
// Primary Color: rgb(2, 112, 85)
const THEME_RGB = "2, 112, 85";

const getThemeColor = (opacity: number = 1) => `rgba(${THEME_RGB}, ${opacity})`;

// --- Types ---
interface IPOValuationReportProps {
  data: {
    ticker: string;
    sector: string;
    company_name: string;
    overall_risk_score: number;
    base_case_valuation: number;
    base_intrinsic_value: number;
    overall_financial_health_score: number;
    overall_narative_sentiment_score: number;
  };
  pdfUrl?: string;
}

export default function IPOValuationReport({ data, pdfUrl }: IPOValuationReportProps) {

  // --- 1. derived state & calculations ---
  const numberFormatter = (value: number) =>
    new Intl.NumberFormat('en-AU', { maximumFractionDigits: 2 }).format(value);

  const totalShares = 50_000_000;
  const valLow = data.base_case_valuation * 0.85;
  const valHigh = data.base_case_valuation * 1.15;
  const sharePriceBase = data.base_case_valuation / totalShares;
  const valuationDisplay = data.base_case_valuation;
  const sharePriceDisplay = (valuationDisplay * 1000000) / totalShares;

  const impliedPE = 26.5;
  const peerPE = 22.5;

  // --- 2. Scenario Modeler State ---
  const [capitalRaise, setCapitalRaise] = useState(20);
  const [issuePrice, setIssuePrice] = useState(sharePriceDisplay);

  const newSharesIssued = (capitalRaise * 1000000) / issuePrice;
  const postMoneyValuation = valuationDisplay + capitalRaise;
  const dilution = (newSharesIssued / (totalShares + newSharesIssued)) * 100;

  // --- 3. Chart Data Preparation ---
  const waterfallData = [
    { name: 'Peer Median', value: 22.5, type: 'base' },
    { name: 'Narrative', value: (data.overall_narative_sentiment_score / 20), type: 'positive' },
    { name: 'Fin. Health', value: (data.overall_financial_health_score / 40), type: 'positive' },
    { name: 'Risk Factors', value: -(data.overall_risk_score / 30), type: 'negative' },
    { name: 'Final Target', value: impliedPE, type: 'total' },
  ];

  const radarData = [
    { subject: 'Clarity', A: 80, fullMark: 100 },
    { subject: 'Market Size', A: 65, fullMark: 100 },
    { subject: 'Moat', A: 40, fullMark: 100 },
    { subject: 'Vision', A: 90, fullMark: 100 },
    { subject: 'Team', A: 85, fullMark: 100 },
    { subject: 'Financials', A: data.overall_financial_health_score, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans text-slate-900" style={{ backgroundColor: getThemeColor(0.02) }}>

      {/* --- HEADER BAR --- */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border" style={{ borderColor: getThemeColor(0.1) }}>
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="text-white p-3 rounded-lg" style={{ backgroundColor: getThemeColor(1) }}>
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: getThemeColor(1) }}>{data.company_name} <span className="text-slate-400 font-medium">| {data.ticker}</span></h1>
            <p className="text-sm text-slate-500 font-medium">Sector: {data.sector} | Status: <span className="font-bold" style={{ color: getThemeColor(1) }}>Ready for Review</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          {pdfUrl ? (
            <Button variant="outline" className="gap-2" style={{ borderColor: getThemeColor(0.3), color: getThemeColor(1) }} onClick={() => window.open(pdfUrl, '_blank')}>
              <FileText size={16} /> Download Board PDF
            </Button>
          ) : (
            <Button variant="outline" className="gap-2 border-slate-200 text-slate-400 cursor-not-allowed">
              <FileText size={16} /> Generating PDF...
            </Button>
          )}
          <Button className="gap-2 text-white hover:opacity-90" style={{ backgroundColor: getThemeColor(1) }}>
            <Share2 size={16} /> Share with Lead Manager
          </Button>
        </div>
      </header>

      <div className="space-y-8">

        {/* --- SECTION A: EXECUTIVE VALUATION --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Pre-Money Valuation */}
          <Card className="bg-white shadow-sm relative overflow-hidden border" style={{ borderColor: getThemeColor(0.15) }}>
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: getThemeColor(1) }}></div>
            <CardContent className="pt-6">
              <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: getThemeColor(0.7) }}>Indicative Pre-Money Valuation</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">A${numberFormatter(valuationDisplay)}M</span>
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Range: A${numberFormatter(valLow)}M - A${numberFormatter(valHigh)}M
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: getThemeColor(0.1), color: getThemeColor(1) }}>Central Case</span>
                <span className="text-xs text-slate-400">Intrinsic: A${numberFormatter(data.base_intrinsic_value)}M</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Share Price */}
          <Card className="bg-white shadow-sm relative overflow-hidden border" style={{ borderColor: getThemeColor(0.15) }}>
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: getThemeColor(0.6) }}></div>
            <CardContent className="pt-6">
              <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: getThemeColor(0.7) }}>Indicative Share Price</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">A${sharePriceDisplay.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Range: A${(sharePriceDisplay * 0.85).toFixed(2)} - A${(sharePriceDisplay * 1.15).toFixed(2)}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <span className="text-xs text-slate-400">Based on {numberFormatter(totalShares)} shares pre-IPO</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Scorecard */}
          <Card className="bg-white shadow-sm relative overflow-hidden border" style={{ borderColor: getThemeColor(0.15) }}>
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: getThemeColor(0.8) }}></div>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: getThemeColor(0.7) }}>Valuation Scorecard</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{impliedPE.toFixed(1)}x <span className="text-lg text-slate-500 font-normal">P/E</span></span>
                  </div>
                </div>
                <Badge className="border" style={{ backgroundColor: getThemeColor(0.1), color: getThemeColor(1), borderColor: getThemeColor(0.2) }}>
                  +18% Premium
                </Badge>
              </div>
              <div className="mt-2 text-sm text-slate-400">
                vs Peer Median: {peerPE}x
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <span className="text-xs text-slate-500">Driven by strong Narrative Score ({data.overall_narative_sentiment_score.toFixed(0)})</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* --- SECTION B: VALUATION LOGIC BRIDGE --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-2 shadow-sm border" style={{ borderColor: getThemeColor(0.15) }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2" style={{ color: getThemeColor(1) }}>
                <TrendingUp size={20} /> Valuation Logic Bridge (The "Why")
              </CardTitle>
              <CardDescription>How AI moved from raw market data to the final price target.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={getThemeColor(0.1)} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} unit="x" />
                  <Tooltip
                    cursor={{ fill: getThemeColor(0.05) }}
                    contentStyle={{ borderRadius: '8px', border: `1px solid ${getThemeColor(0.2)}`, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.type === 'base' ? '#94a3b8' :
                          entry.type === 'positive' ? getThemeColor(0.8) :
                            entry.type === 'negative' ? '#ef4444' : getThemeColor(1)
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* --- SECTION E: NARRATIVE HEATMAP --- */}
          <Card className="shadow-sm border" style={{ borderColor: getThemeColor(0.15) }}>
            <CardHeader>
              <CardTitle className="text-lg" style={{ color: getThemeColor(1) }}>Narrative Heatmap</CardTitle>
              <CardDescription>AI scoring of the IPO story.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex flex-col items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid gridType="polygon" stroke={getThemeColor(0.2)} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: getThemeColor(0.8), fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Company Score" dataKey="A" stroke={getThemeColor(1)} fill={getThemeColor(1)} fillOpacity={0.4} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
              <div className="bottom-2 text-xs p-2 rounded-lg text-center mx-4 mb-2" style={{ backgroundColor: getThemeColor(0.05), color: getThemeColor(1) }}>
                <strong>Insight:</strong> High Vision score, but Moat defensibility needs work in the investor deck.
              </div>
            </CardContent>
          </Card>
        </section>

        {/* --- SECTION C: IPO SCENARIO MODELER --- */}
        <Card className="shadow-sm text-white border-0" style={{ backgroundColor: getThemeColor(1) }}>
          <CardHeader className="border-b" style={{ borderColor: getThemeColor(0.8) }}>
            <CardTitle className="text-white">IPO Scenario Modeler</CardTitle>
            <CardDescription className="text-white/70">Adjust the sliders to model the impact of the capital raise.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

              {/* Controls */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-white/90">Capital Raise Amount</label>
                    <span className="text-sm font-bold text-white">A${capitalRaise}M</span>
                  </div>
                  <Slider
                    defaultValue={[20]}
                    max={50}
                    step={1}
                    onValueChange={(val) => setCapitalRaise(val[0])}
                    className="py-4 cursor-grab"
                    // Note: You might need to customize Slider primitive CSS to match perfectly, 
                    // but usually it adapts to current text color or primary color context
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-white/90">Issue Price</label>
                    <span className="text-sm font-bold text-white">A${issuePrice.toFixed(2)}</span>
                  </div>
                  <Slider
                    defaultValue={[sharePriceDisplay]}
                    min={sharePriceDisplay * 0.8}
                    max={sharePriceDisplay * 1.2}
                    step={0.05}
                    onValueChange={(val) => setIssuePrice(val[0])}
                    className="py-4 cursor-grab"
                  />
                </div>
              </div>

              {/* Output Table */}
              <div className="lg:col-span-7 rounded-xl p-6 border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/80">Pro-Forma Impact</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <p className="text-xs text-white/60 mb-1">New Shares</p>
                    <p className="text-xl font-bold text-white">{numberFormatter(newSharesIssued / 1000000)}M</p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <p className="text-xs text-white/60 mb-1">Founder Dilution</p>
                    <p className="text-xl font-bold text-white">{dilution.toFixed(1)}%</p>
                  </div>
                  <div className="p-4 rounded-lg border relative overflow-hidden" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                    <div className="absolute top-0 right-0 p-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs text-white/80 mb-1">Post-Money Val</p>
                    <p className="text-xl font-bold text-white">A${numberFormatter(postMoneyValuation)}M</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- SECTION D: IPO READINESS & COMPLIANCE --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Table 1: Gatekeeper */}
          <Card className="shadow-sm border" style={{ borderColor: getThemeColor(0.15) }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2" style={{ color: getThemeColor(1) }}>
                <CheckCircle size={20} /> Gatekeeper Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>AI Finding</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Assets Test (Rule 1.3)</TableCell>
                    <TableCell>
                      <Badge className="border" style={{ backgroundColor: getThemeColor(0.1), color: getThemeColor(1), borderColor: getThemeColor(0.2) }}>Pass</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">NTA is A$5.2M ({'>'} A$4M threshold).</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Working Capital</TableCell>
                    <TableCell>
                      <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 border">Fail</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">Current WC A$1.3M ({'<'} A$1.5M). Needs pre-IPO funding.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Governance</TableCell>
                    <TableCell>
                      <Badge className="border" style={{ backgroundColor: getThemeColor(0.1), color: getThemeColor(1), borderColor: getThemeColor(0.2) }}>Pass</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">Board has independent majority.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Table 2: Deep Dive */}
          <Card className="shadow-sm border" style={{ borderColor: getThemeColor(0.15) }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
                <AlertTriangle size={20} /> Procedural & Risk Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead className="w-[100px]">Risk</TableHead>
                    <TableHead>Insight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Material Contracts</TableCell>
                    <TableCell><Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200 border">Medium</Badge></TableCell>
                    <TableCell className="text-xs text-slate-500">Single customer (RetailCo) = 35% of revenue.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Legal Disputes</TableCell>
                    <TableCell>
                      <Badge className="border" style={{ backgroundColor: getThemeColor(0.1), color: getThemeColor(1), borderColor: getThemeColor(0.2) }}>Low</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">No active litigation detected.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Option Terms</TableCell>
                    <TableCell><Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 border">High</Badge></TableCell>
                    <TableCell className="text-xs text-slate-500">Founder exercise price ($0.15) {'<'} $0.20 rule.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}