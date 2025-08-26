"use client"

export function ValuationChart() {
  return (
    <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 relative overflow-hidden">
      <div className="flex items-end space-x-4 p-4 h-full w-full justify-center">
        <div className="text-center w-1/5">
          <p className="text-xs text-gray-500 font-medium">Peer Median</p>
          <div className="bg-blue-500 rounded-t" style={{ height: "225px" }}></div>
          <p className="text-sm font-bold text-gray-800 mt-1">22.5x</p>
        </div>
        <div className="text-center w-1/5">
          <p className="text-xs text-green-600 font-medium">Growth Premium</p>
          <div className="bg-green-500 rounded-t" style={{ height: "42px", marginBottom: "225px" }}></div>
          <p className="text-sm font-bold text-green-600 mt-1">+4.2x</p>
        </div>
        <div className="text-center w-1/5">
          <p className="text-xs text-red-600 font-medium">Risk Discount</p>
          <div className="bg-red-500 rounded-b" style={{ height: "40px", marginTop: "227px" }}></div>
          <p className="text-sm font-bold text-red-600 mt-1">-4.0x</p>
        </div>
        <div className="text-center w-1/5">
          <p className="text-xs text-green-600 font-medium">Market Tailwind</p>
          <div className="bg-green-500 rounded-t" style={{ height: "38px", marginBottom: "227px" }}></div>
          <p className="text-sm font-bold text-green-600 mt-1">+3.8x</p>
        </div>
        <div className="text-center w-1/5 border-l border-dashed border-gray-400 pl-4">
          <p className="text-xs text-gray-800 font-medium">Final Target</p>
          <div className="bg-blue-700 rounded-t" style={{ height: "265px" }}></div>
          <p className="text-sm font-bold text-blue-700 mt-1">26.5x</p>
        </div>
      </div>
    </div>
  )
}
