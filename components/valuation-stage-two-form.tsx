import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Globe,
    Lightbulb,
    Rocket,
    ShieldCheck,
    Target,
    TrendingUp,
    Users,
} from "lucide-react";


// --- STAGE 2 COMPONENT ---
interface StageTwoProps {
  onBack: () => void;
  onSubmit: () => void;
  data: StageTwoData;
  updateData: (field: string, value: string) => void;
  isSubmitting: boolean;
}

type StageTwoData = {
  friction: string;
  solution: string;
  mission: string;
  market: string;
  growth: string;
  landscape: string;
  moat: string;
  team: string;
};

export function StageTwoCard({
  onBack,
  onSubmit,
  data,
  updateData,
  isSubmitting,
}: StageTwoProps) {
  // Data structure for the narrative fields to keep code clean
  const narrativeFields = [
    {
      id: "friction",
      label: "The Friction",
      icon: <Target className="w-4 h-4 text-rose-500" />,
      placeholder:
        "What is the single most painful problem your customers face?",
    },
    {
      id: "solution",
      label: "The Solution",
      icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
      placeholder: "How does your product solve this uniquely?",
    },
    {
      id: "mission",
      label: "The Mission",
      icon: <Globe className="w-4 h-4 text-blue-500" />,
      placeholder: "What is the 10-year vision?",
    },
    {
      id: "market",
      label: "The Market",
      icon: <TrendingUp className="w-4 h-4 text-green-500" />,
      placeholder: "What is the TAM size and CAGR?",
    },
    {
      id: "growth",
      label: "Growth Engine",
      icon: <Rocket className="w-4 h-4 text-purple-500" />,
      placeholder: "Top 3 strategies to double revenue?",
    },
    {
      id: "landscape",
      label: "The Landscape",
      icon: <Users className="w-4 h-4 text-slate-500" />,
      placeholder: "Who are your top 3 competitors?",
    },
    {
      id: "moat",
      label: "The Moat",
      icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
      placeholder: "Defensible competitive advantage (IP, Network Effects)?",
    },
    {
      id: "team",
      label: "Team Edge",
      icon: <Users className="w-4 h-4 text-cyan-500" />,
      placeholder: "Why is this management team qualified to win?",
    },
  ];

  return (
    <Card className="shadow-xl border-slate-200 bg-white min-h-screen mb-4">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <Rocket size={24} />
          </div>
          <CardTitle className="text-xl">The Narrative Interview</CardTitle>
        </div>
        <CardDescription>
          Engine inputs to calculate your "Narrative Premium." Be specific.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {narrativeFields.map((field) => (
            <div
              key={field.id}
              className="space-y-3 p-4 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors bg-slate-50/30"
            >
              <Label
                htmlFor={field.id}
                className="flex items-center gap-2 font-semibold text-slate-700"
              >
                {/* {field.icon} */}
                {field.label}
              </Label>
              <Textarea
                id={field.id}
                placeholder={field.placeholder}
                className="min-h-[100px] resize-none focus-visible:ring-indigo-500 bg-white"
                // Bind value to parent state
                value={data[field.id as keyof StageTwoData] || ""}
                // Update parent state on change
                onChange={(e) => updateData(field.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-6 pb-6 bg-white border-t border-slate-100">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="gap-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <Button
          className="gap-2 bg-green-600 hover:bg-green-700"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          Report Generate For IPO Valuation <ShieldCheck size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}
