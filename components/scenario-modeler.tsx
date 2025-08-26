"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export function ScenarioModeler() {
  const [capitalRaise, setCapitalRaise] = useState([20000000])
  const [issuePrice, setIssuePrice] = useState([1.68])

  const preIpoShares = 38095238

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const newShares = capitalRaise[0] / issuePrice[0]
  const totalShares = preIpoShares + newShares
  const dilution = (newShares / totalShares) * 100
  const postMoneyValuation = totalShares * issuePrice[0]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div>
          <div className="flex justify-between items-center">
            <Label className="font-medium text-gray-700">Target Capital Raise</Label>
            <span className="font-bold text-lg text-blue-600">{formatCurrency(capitalRaise[0])}</span>
          </div>
          <Slider
            value={capitalRaise}
            onValueChange={setCapitalRaise}
            max={30000000}
            min={10000000}
            step={500000}
            className="mt-2"
          />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <Label className="font-medium text-gray-700">Issue Price Per Share</Label>
            <span className="font-bold text-lg text-blue-600">{formatPrice(issuePrice[0])}</span>
          </div>
          <Slider value={issuePrice} onValueChange={setIssuePrice} max={1.94} min={1.43} step={0.01} className="mt-2" />
        </div>
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-100 rounded">
          <tr>
            <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider rounded-l-lg">
              Metric
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider text-right rounded-r-lg">
              Calculated Value
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 font-medium text-gray-700">New Shares to be Issued</td>
            <td className="px-6 py-4 font-mono text-right text-gray-900">
              {new Intl.NumberFormat("en-US").format(Math.round(newShares))}
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 font-medium text-gray-700">Implied Post-Money Valuation</td>
            <td className="px-6 py-4 font-mono text-right text-gray-900">
              {formatCurrency(Math.round(postMoneyValuation))}
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 font-medium text-gray-700 sm:font-bold">Company Stake Sold (Dilution)</td>
            <td className="px-6 py-4 font-mono text-right text-gray-900 font-bold text-lg">{dilution.toFixed(1)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
