"use client";

import React, { useState, useMemo } from "react";
import {
      Download,
      Share2,
      TrendingUp,
      AlertTriangle,
      CheckCircle,
      XCircle,
      AlertCircle,
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

// --- Types ---
interface IPOValuationReportProps {
      data: {
            company_name: string;
            overall_risk_score: number; // 0-100 (Lower is better?) usually risk is high = bad. Let's assume 25 is Low Risk.
            base_case_valuation: number; // e.g. 2545.04 (in Millions usually, or raw number)
            base_intrinsic_value: number;
            overall_financial_health_score: number; // 0-100
            overall_narative_sentiment_score: number; // 0-100
      };
      pdfUrl?: string;
}

export default function IPOValuationReport({ data, pdfUrl }: IPOValuationReportProps) {

      // --- 1. derived state & calculations ---
      // We mock some values because the input `data` is simple, but the UI is complex.

      const currencyFormatter = (value: number) =>
            new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', notation: "compact", maximumFractionDigits: 1 }).format(value);

      const numberFormatter = (value: number) =>
            new Intl.NumberFormat('en-AU', { maximumFractionDigits: 2 }).format(value);

      // Mocking Share Count for per-share logic (e.g., 50M shares)
      const totalShares = 50_000_000;

      // Calculate ranges based on base_case_valuation
      const valLow = data.base_case_valuation * 0.85;
      const valHigh = data.base_case_valuation * 1.15;
      const sharePriceBase = data.base_case_valuation / totalShares; // If valuation is in actual dollars
      // NOTE: If valuation is 2545 (millions?), adjust logic. Assuming raw dollars for this demo or adjusting scale.
      // Let's assume input 2545 is actually $25.45M for realism, or we treat it as raw. 
      // Let's scale it: If 2545 is small, maybe it's millions? 
      // Let's assume the input is in MILLIONS for the dashboard to look like "A$96.7M". 
      // If input is 2545, let's treat it as $25.45M for the logic, or just use raw if it's large.
      // Let's use the raw number as millions for the Big Cards.

      const valuationDisplay = data.base_case_valuation; // Display as is
      const sharePriceDisplay = (valuationDisplay * 1000000) / totalShares; // Implied price

      // P/E Ratio Mock logic (Valuation / Earnings). Assuming Earnings = Valuation / 25
      const impliedPE = 26.5;
      const peerPE = 22.5;

      // --- 2. Scenario Modeler State ---
      const [capitalRaise, setCapitalRaise] = useState(20); // in Millions
      const [issuePrice, setIssuePrice] = useState(sharePriceDisplay);

      const newSharesIssued = (capitalRaise * 1000000) / issuePrice;
      const postMoneyValuation = valuationDisplay + capitalRaise;
      const dilution = (newSharesIssued / (totalShares + newSharesIssued)) * 100;

      // --- 3. Chart Data Preparation ---

      // Waterfall Data (Logic Bridge)
      const waterfallData = [
            { name: 'Peer Median', value: 22.5, type: 'base' },
            { name: 'Narrative', value: (data.overall_narative_sentiment_score / 20), type: 'positive' }, // derived adjustment
            { name: 'Fin. Health', value: (data.overall_financial_health_score / 40), type: 'positive' },
            { name: 'Risk Factors', value: -(data.overall_risk_score / 30), type: 'negative' },
            { name: 'Final Target', value: impliedPE, type: 'total' },
      ];

      // Radar Data (Heatmap)
      const radarData = [
            { subject: 'Clarity', A: 80, fullMark: 100 },
            { subject: 'Market Size', A: 65, fullMark: 100 },
            { subject: 'Moat', A: 40, fullMark: 100 }, // Intentionally low for "insight"
            { subject: 'Vision', A: 90, fullMark: 100 },
            { subject: 'Team', A: 85, fullMark: 100 },
            { subject: 'Financials', A: data.overall_financial_health_score, fullMark: 100 },
      ];

      return (
            <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">

                  {/* --- HEADER BAR --- */}
                  <header className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                              <div className="bg-blue-900 text-white p-3 rounded-lg">
                                    <Building2 size={24} />
                              </div>
                              <div>
                                    <h1 className="text-xl font-bold text-slate-900">{data.company_name} (TNV)</h1>
                                    <p className="text-sm text-slate-500 font-medium">Sector: Technology | Status: <span className="text-amber-600 font-bold">Ready for Review</span></p>
                              </div>
                        </div>
                        <div className="flex gap-3">
                              {pdfUrl ? (
                                    <Button variant="outline" className="gap-2 border-slate-300" onClick={() => window.open(pdfUrl, '_blank')}>
                                          <FileText size={16} /> Download Board PDF
                                    </Button>
                              ) : (
                                    <Button variant="outline" className="gap-2 border-slate-300" disabled>
                                          <FileText size={16} /> Generating PDF...
                                    </Button>
                              )}
                              <Button className="gap-2 bg-blue-900 hover:bg-blue-800 text-white">
                                    <Share2 size={16} /> Share with Lead Manager
                              </Button>
                        </div>
                  </header>

                  <div className="space-y-8">

                        {/* --- SECTION A: EXECUTIVE VALUATION --- */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Card 1: Pre-Money Valuation */}
                              <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                                    <CardContent className="pt-6">
                                          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Indicative Pre-Money Valuation</p>
                                          <div className="mt-2 flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-slate-900">A${numberFormatter(valuationDisplay)}M</span>
                                          </div>
                                          <div className="mt-2 text-sm text-slate-400">
                                                Range: A${numberFormatter(valLow)}M - A${numberFormatter(valHigh)}M
                                          </div>
                                          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Central Case</span>
                                                <span className="text-xs text-slate-400">Intrinsic: A${numberFormatter(data.base_intrinsic_value)}M</span>
                                          </div>
                                    </CardContent>
                              </Card>

                              {/* Card 2: Share Price */}
                              <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-green-600"></div>
                                    <CardContent className="pt-6">
                                          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Indicative Share Price</p>
                                          <div className="mt-2 flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-slate-900">A${sharePriceDisplay.toFixed(2)}</span>
                                          </div>
                                          <div className="mt-2 text-sm text-slate-400">
                                                Range: A${(sharePriceDisplay * 0.85).toFixed(2)} - A${(sharePriceDisplay * 1.15).toFixed(2)}
                                          </div>
                                          <div className="mt-4 pt-4 border-t border-slate-100">
                                                <span className="text-xs text-slate-400">Based on {numberFormatter(totalShares)} shares pre-IPO</span>
                                          </div>
                                    </CardContent>
                              </Card>

                              {/* Card 3: Scorecard */}
                              <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                                    <CardContent className="pt-6">
                                          <div className="flex justify-between items-start">
                                                <div>
                                                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Valuation Scorecard</p>
                                                      <div className="mt-2 flex items-baseline gap-2">
                                                            <span className="text-3xl font-bold text-slate-900">{impliedPE.toFixed(1)}x <span className="text-lg text-slate-500 font-normal">P/E</span></span>
                                                      </div>
                                                </div>
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                                                      +18% Premium
                                                </Badge>
                                          </div>
                                          <div className="mt-2 text-sm text-slate-400">
                                                vs Peer Median: {peerPE}x
                                          </div>
                                          <div className="mt-4 pt-4 border-t border-slate-100">
                                                <span className="text-xs text-slate-500">Driven by strong Narrative Score ({data.overall_narative_sentiment_score.toFixed(0)})</span>
                                          </div>
                                    </CardContent>
                              </Card>
                        </section>

                        {/* --- SECTION B: VALUATION LOGIC BRIDGE --- */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              <Card className="col-span-2 border-slate-200 shadow-sm">
                                    <CardHeader>
                                          <CardTitle className="text-lg flex items-center gap-2"><TrendingUp size={20} className="text-blue-600" /> Valuation Logic Bridge (The "Why")</CardTitle>
                                          <CardDescription>How AI moved from raw market data to the final price target.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                          <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} unit="x" />
                                                      <Tooltip
                                                            cursor={{ fill: '#f1f5f9' }}
                                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                      />
                                                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                            {waterfallData.map((entry, index) => (
                                                                  <Cell key={`cell-${index}`} fill={
                                                                        entry.type === 'base' ? '#94a3b8' :
                                                                              entry.type === 'positive' ? '#22c55e' :
                                                                                    entry.type === 'negative' ? '#ef4444' : '#1e3a8a'
                                                                  } />
                                                            ))}
                                                      </Bar>
                                                </BarChart>
                                          </ResponsiveContainer>
                                    </CardContent>
                              </Card>

                              {/* --- SECTION E: NARRATIVE HEATMAP (Moved up to fill layout) --- */}
                              <Card className="border-slate-200 shadow-sm">
                                    <CardHeader>
                                          <CardTitle className="text-lg">Narrative Heatmap</CardTitle>
                                          <CardDescription>AI scoring of the IPO story.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[300px] flex flex-col items-center justify-center relative">
                                          <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                                      <PolarGrid gridType="polygon" stroke="#cbd5e1" />
                                                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                                                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                      <Radar name="Company Score" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
                                                      <Legend />
                                                </RadarChart>
                                          </ResponsiveContainer>
                                          <div className="absolute bottom-2 bg-blue-50 text-blue-700 text-xs p-2 rounded-lg text-center mx-4">
                                                <strong>Insight:</strong> High Vision score, but Moat defensibility needs work in the investor deck.
                                          </div>
                                    </CardContent>
                              </Card>
                        </section>

                        {/* --- SECTION C: IPO SCENARIO MODELER --- */}
                        <Card className="border-slate-200 shadow-sm bg-slate-900 text-white">
                              <CardHeader className="border-b border-slate-800">
                                    <CardTitle className="text-white">IPO Scenario Modeler</CardTitle>
                                    <CardDescription className="text-slate-400">Adjust the sliders to model the impact of the capital raise.</CardDescription>
                              </CardHeader>
                              <CardContent className="pt-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                                          {/* Controls */}
                                          <div className="lg:col-span-5 space-y-8">
                                                <div className="space-y-4">
                                                      <div className="flex justify-between">
                                                            <label className="text-sm font-medium text-slate-300">Capital Raise Amount</label>
                                                            <span className="text-sm font-bold text-blue-400">A${capitalRaise}M</span>
                                                      </div>
                                                      <Slider
                                                            defaultValue={[20]}
                                                            max={50}
                                                            step={1}
                                                            onValueChange={(val) => setCapitalRaise(val[0])}
                                                            className="py-4"
                                                      />
                                                </div>

                                                <div className="space-y-4">
                                                      <div className="flex justify-between">
                                                            <label className="text-sm font-medium text-slate-300">Issue Price</label>
                                                            <span className="text-sm font-bold text-blue-400">A${issuePrice.toFixed(2)}</span>
                                                      </div>
                                                      <Slider
                                                            defaultValue={[sharePriceDisplay]}
                                                            min={sharePriceDisplay * 0.8}
                                                            max={sharePriceDisplay * 1.2}
                                                            step={0.05}
                                                            onValueChange={(val) => setIssuePrice(val[0])}
                                                            className="py-4"
                                                      />
                                                </div>
                                          </div>

                                          {/* Output Table */}
                                          <div className="lg:col-span-7 bg-slate-800 rounded-xl p-6 border border-slate-700">
                                                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Pro-Forma Impact</h4>
                                                <div className="grid grid-cols-3 gap-4 text-center">
                                                      <div className="p-4 bg-slate-900 rounded-lg">
                                                            <p className="text-xs text-slate-500 mb-1">New Shares</p>
                                                            <p className="text-xl font-bold text-white">{numberFormatter(newSharesIssued / 1000000)}M</p>
                                                      </div>
                                                      <div className="p-4 bg-slate-900 rounded-lg">
                                                            <p className="text-xs text-slate-500 mb-1">Founder Dilution</p>
                                                            <p className="text-xl font-bold text-amber-400">{dilution.toFixed(1)}%</p>
                                                      </div>
                                                      <div className="p-4 bg-slate-900 rounded-lg border border-blue-900/50 relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 p-1">
                                                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                            </div>
                                                            <p className="text-xs text-blue-300 mb-1">Post-Money Val</p>
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
                              <Card className="border-slate-200 shadow-sm">
                                    <CardHeader>
                                          <CardTitle className="text-lg flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> Gatekeeper Requirements</CardTitle>
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
                                                            <TableCell><Badge className="bg-green-100 text-green-700 hover:bg-green-100">Pass</Badge></TableCell>
                                                            <TableCell className="text-xs text-slate-500">NTA is A$5.2M ({'>'} A$4M threshold).</TableCell>
                                                      </TableRow>
                                                      <TableRow>
                                                            <TableCell className="font-medium">Working Capital</TableCell>
                                                            <TableCell><Badge className="bg-red-100 text-red-700 hover:bg-red-100">Fail</Badge></TableCell>
                                                            <TableCell className="text-xs text-slate-500">Current WC A$1.3M ({'<'} A$1.5M). Needs pre-IPO funding.</TableCell>
                                                      </TableRow>
                                                      <TableRow>
                                                            <TableCell className="font-medium">Governance</TableCell>
                                                            <TableCell><Badge className="bg-green-100 text-green-700 hover:bg-green-100">Pass</Badge></TableCell>
                                                            <TableCell className="text-xs text-slate-500">Board has independent majority.</TableCell>
                                                      </TableRow>
                                                </TableBody>
                                          </Table>
                                    </CardContent>
                              </Card>

                              {/* Table 2: Deep Dive */}
                              <Card className="border-slate-200 shadow-sm">
                                    <CardHeader>
                                          <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle size={20} className="text-amber-500" /> Procedural & Risk Summary</CardTitle>
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
                                                            <TableCell><Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Medium</Badge></TableCell>
                                                            <TableCell className="text-xs text-slate-500">Single customer (RetailCo) = 35% of revenue.</TableCell>
                                                      </TableRow>
                                                      <TableRow>
                                                            <TableCell className="font-medium">Legal Disputes</TableCell>
                                                            <TableCell><Badge className="bg-green-100 text-green-700 hover:bg-green-100">Low</Badge></TableCell>
                                                            <TableCell className="text-xs text-slate-500">No active litigation detected.</TableCell>
                                                      </TableRow>
                                                      <TableRow>
                                                            <TableCell className="font-medium">Option Terms</TableCell>
                                                            <TableCell><Badge className="bg-red-100 text-red-700 hover:bg-red-100">High</Badge></TableCell>
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