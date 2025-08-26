import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { ValuationChart } from "@/components/valuation-chart";
import { ScenarioModeler } from "@/components/scenario-modeler";

export default function ValuationReportPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      {/* Report Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Indicative IPO Valuation Report
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            For: AussieHealth AI Pty Ltd
          </p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0 flex-shrink-0">
          <p className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-md">
            Generated: 18-Aug-2025
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center shadow-sm">
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </Button>
        </div>
      </header>

      {/* At-a-Glance Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardDescription className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Indicative Pre-Money Valuation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 my-2">
              A$71.5M - A$96.7M
            </p>
            <p className="text-gray-500 text-sm">
              Central valuation estimate: A$84.1M
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardDescription className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Indicative Price Per Share
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 my-2">
              A$1.43 - A$1.94
            </p>
            <p className="text-gray-500 text-sm">
              Based on 50,000,000 shares post-IPO
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardDescription className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              AI-Calculated P/E Multiple
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 my-2">26.5x</p>
            <p className="text-gray-500 text-sm">
              <span className="text-green-600 font-semibold">+17.8%</span> vs.
              Peer Median of 22.5x
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Valuation Bridge Chart */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Valuation Multiple Analysis</CardTitle>
          <CardDescription>
            This chart illustrates how we adjusted the baseline peer multiple
            based on company-specific factors and market conditions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ValuationChart />
        </CardContent>
      </Card>

      {/* Interactive Scenario Modeler */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Interactive IPO Scenario Modeler</CardTitle>
        </CardHeader>
        <CardContent>
          <ScenarioModeler />
        </CardContent>
      </Card>

      {/* AI Analysis Deep Dive */}
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Deep Dive</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="growth" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="growth">Growth & Narrative</TabsTrigger>
              <TabsTrigger value="risk">Risk Factors</TabsTrigger>
              <TabsTrigger value="peers">Comparable Peers Data</TabsTrigger>
            </TabsList>

            <TabsContent value="growth" className="mt-6">
              <p className="mb-4 text-gray-700">
                Analysis of qualitative factors from supporting documents. A
                strong narrative and clear growth path contribute positively to
                the valuation multiple.
              </p>
              <table className="rounded-lg border border-gray-200 divide-y divide-gray-200 w-full">
                <thead className="bg-white">
                  <tr className="hover:bg-gray-50">
                    <th className="p-4 text-left text-gray-800">Key Driver</th>
                    <th className="p-4 text-left text-gray-800">
                      Source Evidence / AI Finding
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-600">
                      Geographic Expansion
                    </td>
                    <td className="p-4 text-gray-700">
                      "Clear plan to enter New Zealand market in FY+2, followed
                      by UK in FY+3." <br />
                      <em>(Source: Investor_Deck.pptx)</em>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-600">
                      Product Roadmap
                    </td>
                    <td className="p-4 text-gray-700">
                      "Launch of predictive analytics module for preventative
                      care scheduled for Q4." <br />
                      <em>(Source: Business_Plan.pdf)</em>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-600">
                      Market Positioning
                    </td>
                    <td className="p-4 text-gray-700">
                      "Narrative strongly positions company as a 'first mover'
                      in AI-driven preventative health screening for hospitals."
                    </td>
                  </tr>
                </tbody>
              </table>
            </TabsContent>

            <TabsContent value="risk" className="mt-6">
              <p className="mb-4 text-gray-700">
                Identification and assessment of key risks. Unmitigated risks
                result in a valuation discount.
              </p>
              <table className="rounded-lg border border-gray-200 divide-y divide-gray-200 w-full">
                <thead className="bg-white">
                  <tr className="hover:bg-gray-50">
                    <th className="p-4 text-left text-gray-800">Risk Factor</th>
                    <th className="p-4 text-left text-gray-800">
                      Mitigation Status & Evidence
                    </th>
                    <th className="p-4 text-center text-gray-800">
                      Severity Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-600">
                      Customer Concentration
                    </td>
                    <td className="p-4 text-gray-700">
                      <strong>Mitigated:</strong> "New contracts signed in Q3
                      reduce top customer dependency from 60% to 35% of
                      revenue."
                      <br />
                      <em>(Source: Board_Minutes_Aug.pdf)</em>
                    </td>
                    <td className="p-4 text-center font-medium text-yellow-600">
                      Medium
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-600">
                      Regulatory Changes
                    </td>
                    <td className="p-4 text-gray-700">
                      <strong>Monitoring:</strong> "Ongoing monitoring of TGA
                      guidelines for AI software. No immediate changes
                      anticipated."
                    </td>
                    <td className="p-4 text-center font-medium text-yellow-600">
                      Medium
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-600">
                      Key Person Risk (CTO)
                    </td>
                    <td className="p-4 text-gray-700">
                      <strong>Partially Mitigated:</strong> "Key person
                      insurance in place. Knowledge transfer protocols
                      initiated."
                      <br />
                      <em>(Source: Risk_Register.xlsx)</em>
                    </td>
                    <td className="p-4 text-center font-medium text-red-600">
                      High
                    </td>
                  </tr>
                </tbody>
              </table>
            </TabsContent>

            <TabsContent value="peers" className="mt-6">
              <p className="mb-4 text-gray-700">
                The raw data used to calculate the baseline peer multiples. This
                allows for expert verification of the peer set.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                  <thead className="bg-gray-100 rounded">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider rounded-l-lg">
                        Company (Ticker)
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider text-right">
                        Market Cap (M)
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider text-right">
                        P/E Ratio
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider text-right rounded-r-lg">
                        EV/EBITDA
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">
                        HealthCo Global (XRO)
                      </td>
                      <td className="px-4 py-3 font-mono text-right">
                        A$1,200
                      </td>
                      <td className="px-4 py-3 font-mono text-right">28.5x</td>
                      <td className="px-4 py-3 font-mono text-right">14.2x</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">
                        NextGen Med (NXT)
                      </td>
                      <td className="px-4 py-3 font-mono text-right">A$850</td>
                      <td className="px-4 py-3 font-mono text-right">24.1x</td>
                      <td className="px-4 py-3 font-mono text-right">11.9x</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">
                        Pro Medicus (PME)
                      </td>
                      <td className="px-4 py-3 font-mono text-right">
                        A$10,500
                      </td>
                      <td className="px-4 py-3 font-mono text-right">
                        120.0x (Outlier)
                      </td>
                      <td className="px-4 py-3 font-mono text-right">85.0x</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">
                        Pulse Diagnostics (PDI)
                      </td>
                      <td className="px-4 py-3 font-mono text-right">A$450</td>
                      <td className="px-4 py-3 font-mono text-right">21.0x</td>
                      <td className="px-4 py-3 font-mono text-right">10.5x</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">
                        VisionTech (VSI)
                      </td>
                      <td className="px-4 py-3 font-mono text-right">A$600</td>
                      <td className="px-4 py-3 font-mono text-right">22.5x</td>
                      <td className="px-4 py-3 font-mono text-right">11.5x</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
