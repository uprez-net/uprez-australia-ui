"use client"
import React, { useState } from "react"
import { Upload, X, CheckCircle, AlertCircle, FileText, Scale, Shield, Eye, Loader2, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Progress Step Component
interface ProgressStepProps {
  title: string
  substeps: string[]
  isActive: boolean
  isCompleted: boolean
  delay?: number
}

const ProgressStep = ({ title, substeps, isActive, isCompleted, delay = 0 }: ProgressStepProps) => {
  const [completedSubsteps, setCompletedSubsteps] = useState<number[]>([])
  const [activeSubstep, setActiveSubstep] = useState(-1)

  React.useEffect(() => {
    if (isActive) {
      substeps.forEach((_, index) => {
        setTimeout(
          () => {
            setActiveSubstep(index)
            setTimeout(() => {
              setCompletedSubsteps((prev) => [...prev, index])
              if (index === substeps.length - 1) {
                setActiveSubstep(-1)
              }
            }, 2000)
          },
          delay + index * 2500,
        )
      })
    }
  }, [isActive, substeps, delay])

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {isCompleted || completedSubsteps.length === substeps.length ? (
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
        ) : isActive ? (
          <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/25 flex-shrink-0" />
        )}
        <h4 className="font-semibold">{title}</h4>
      </div>
      <div className="ml-8 space-y-1.5">
        {substeps.map((substep, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {completedSubsteps.includes(index) ? (
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            ) : activeSubstep === index ? (
              <Loader2 className="h-4 w-4 text-primary animate-spin flex-shrink-0" />
            ) : (
              <div className="h-4 w-4 rounded-full border border-muted-foreground/25 flex-shrink-0" />
            )}
            <span className={completedSubsteps.includes(index) ? "text-foreground" : "text-muted-foreground"}>
              {substep}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Agent Card Component
type Agent = {
  id: AgentId
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
}

interface AgentCardProps {
  agent: Agent
  onSelect?: () => void
}

// A single sub-step string
type Substep = string

// A step within an agent's workflow
interface AgentStep {
  title: string
  substeps: Substep[]
}

// Allowed agent IDs
type AgentId = "fairness" | "privacy" | "transparency"

// The full structure for agent steps
type AgentSteps = Record<AgentId, AgentStep[]>

const AgentCard = ({ agent, onSelect }: AgentCardProps) => {
  const [cardState, setCardState] = useState("idle") // idle, upload, uploading, processing, complete
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const Icon = agent.icon

  const agentSteps: AgentSteps = {
    fairness: [
      {
        title: "Data Quality & Representativeness Analysis",
        substeps: [
          "Evaluating dataset completeness and accuracy",
          "Assessing demographic representation",
          "Analyzing data collection methodology",
          "Identifying data gaps",
        ],
      },
      {
        title: "Bias Detection & Analysis",
        substeps: ["Testing for disparate impact", "Analyzing model performance across populations"],
      },
      {
        title: "Fairness Metrics & Monitoring",
        substeps: ["Defining context-appropriate fairness criteria", "Implementing multiple fairness metrics"],
      },
      {
        title: "Mitigation Strategy Development",
        substeps: ["Recommending data augmentation strategies", "Suggesting algorithmic bias correction techniques"],
      },
    ],
    privacy: [
      {
        title: "Privacy Impact Assessment (PIA)",
        substeps: [
          "Analyzing data flow lifecycle",
          "Classifying personal and sensitive information",
          "Assessing privacy risks",
        ],
      },
      {
        title: "Security Assessment",
        substeps: ["Evaluating technical security controls", "Reviewing operational security practices"],
      },
      {
        title: "Regulatory Compliance Verification",
        substeps: ["Verifying PPIP Act compliance", "Assessing adherence to other relevant privacy legislation"],
      },
      {
        title: "Data Governance & Consent Management",
        substeps: ["Evaluating consent framework", "Reviewing data governance structure"],
      },
    ],
    transparency: [
      {
        title: "Explainability Assessment",
        substeps: ["Assessing model interpretability", "Evaluating user-centered explainability"],
      },
      {
        title: "Public Disclosure & Transparency",
        substeps: ["Analyzing public disclosure of AI system usage", "Verifying GIPA Act compliance"],
      },
      {
        title: "Decision Review & Challenge Mechanisms",
        substeps: ["Evaluating appeal process accessibility", "Assessing the contestability framework"],
      },
      {
        title: "Documentation & Communication",
        substeps: ["Reviewing technical documentation", "Assessing public communication strategy"],
      },
    ],
  }

  const steps = agentSteps[agent.id] || []

  const validateFiles = (filesToValidate: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = []
    const errors: string[] = []
    const maxSize = 30 * 1024 * 1024 // 30MB in bytes
    const allowedTypes = [
      "text/csv",
      "application/json",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ]

    filesToValidate.forEach((file) => {
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds 30MB limit`)
      } else if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|json|xlsx|xls)$/i)) {
        errors.push(`${file.name} is not a valid file type (CSV, JSON, or Excel only)`)
      } else {
        valid.push(file)
      }
    })

    return { valid, errors }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (cardState === "idle" || cardState === "upload") {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (cardState === "idle" || cardState === "upload") {
      const droppedFiles = Array.from(e.dataTransfer.files)
      const { valid, errors } = validateFiles(droppedFiles)

      if (errors.length > 0) {
        setError(errors.join("; "))
        setTimeout(() => setError(null), 5000)
      }

      if (valid.length > 0) {
        setFiles((prev) => [...prev, ...valid])
        setCardState("upload")
        setError(null)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const { valid, errors } = validateFiles(selectedFiles)

    if (errors.length > 0) {
      setError(errors.join("; "))
      setTimeout(() => setError(null), 5000)
    }

    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid])
      setCardState("upload")
      setError(null)
    }

    e.target.value = ""
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    if (files.length === 1) {
      setCardState("idle")
      setError(null)
    }
  }

  const handleStartAnalysis = () => {
    if (files.length === 0) {
      setError("Please upload at least one file")
      return
    }

    setCardState("uploading")
    setTimeout(() => {
      setCardState("processing")
      startProcessing()
    }, 1500)
  }

  const startProcessing = () => {
    const totalSubsteps = steps.reduce((acc, step) => acc + step.substeps.length, 0)
    const totalTime = totalSubsteps * 2500 + steps.length * 500

    steps.forEach((_, index) => {
      const previousStepsTime = steps.slice(0, index).reduce((acc, step) => acc + step.substeps.length * 2500, 0)

      setTimeout(() => {
        setCurrentStep(index)
      }, previousStepsTime)
    })

    setTimeout(() => {
      setCardState("complete")
    }, totalTime)
  }

  const handleReset = () => {
    setCardState("idle")
    setFiles([])
    setCurrentStep(0)
    setError(null)
  }

  const handleCardClick = () => {
    if (cardState === "idle") {
      setCardState("upload")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Card
      className={`transition-all ${cardState === "idle" ? "hover:shadow-lg cursor-pointer" : ""} ${
        cardState === "processing" || cardState === "complete" ? "col-span-3" : ""
      }`}
      onClick={cardState === "idle" ? handleCardClick : undefined}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{agent.title}</CardTitle>
              {cardState === "idle" && <CardDescription className="mt-1">{agent.description}</CardDescription>}
            </div>
          </div>
          {(cardState === "upload" || cardState === "uploading") && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {cardState === "idle" && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".csv,.json,.xlsx,.xls"
              onClick={(e) => e.stopPropagation()}
            />
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium mb-1">Click or Drop Files</p>
            <p className="text-xs text-muted-foreground">CSV, JSON, or Excel (Max 30 MB)</p>
          </div>
        )}

        {(cardState === "upload" || cardState === "uploading") && (
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              } ${cardState === "uploading" ? "pointer-events-none opacity-50" : ""}`}
            >
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".csv,.json,.xlsx,.xls"
                disabled={cardState === "uploading"}
              />
              <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Add More Files</p>
              <p className="text-xs text-muted-foreground">Click or drop additional files here</p>
            </div>

            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  {cardState !== "uploading" && (
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="flex-shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleStartAnalysis}
              disabled={cardState === "uploading" || files.length === 0}
            >
              {cardState === "uploading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Analysis...
                </>
              ) : (
                `Start Analysis (${files.length} file${files.length !== 1 ? "s" : ""})`
              )}
            </Button>
          </div>
        )}

        {cardState === "processing" && (
          <div className="space-y-6">
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Analysis in progress. This may take a few minutes...</AlertDescription>
            </Alert>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <ProgressStep
                  key={index}
                  title={step.title}
                  substeps={step.substeps}
                  isActive={currentStep === index}
                  isCompleted={currentStep > index}
                  delay={0}
                />
              ))}
            </div>
          </div>
        )}

        {cardState === "complete" && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>Analysis complete! Your assessment report is ready for review.</AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button className="flex-1">View Report</Button>
              <Button variant="outline" onClick={handleReset}>
                Start New Assessment
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Main Component
export default function AgentUploadSystem() {
  const agents: Agent[] = [
    {
      id: "fairness",
      icon: Scale,
      title: "Fairness Assessment Agent",
      description: "Evaluate your AI system for bias and fairness across different demographic groups and populations.",
    },
    {
      id: "privacy",
      icon: Shield,
      title: "Privacy & Security Assessment Agent",
      description: "Audit your AI system for privacy compliance, data security, and adherence to PPIP Act regulations.",
    },
    {
      id: "transparency",
      icon: Eye,
      title: "Transparency Assessment Agent",
      description: "Analyze the explainability and transparency of your AI system and its decision-making processes.",
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Advanced AI Assessment Agents</h1>
          <p className="text-muted-foreground">
            Select an agent to analyze your AI system for compliance and best practices
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  )
}
