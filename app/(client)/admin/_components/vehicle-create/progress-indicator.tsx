// components/admin/vehicle-create/progress-indicator.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"

interface Step {
  id: number
  title: string
  description: string
}

interface ProgressIndicatorProps {
  steps: Step[]
  currentStep: number
  canProceedToStep: (step: number) => boolean
  onStepClick: (step: number) => void
}

export function ProgressIndicator({
  steps,
  currentStep,
  canProceedToStep,
  onStepClick,
}: ProgressIndicatorProps) {
  const progress = (currentStep / steps.length) * 100

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id
              const canNavigate = step.id < currentStep || canProceedToStep(step.id)

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (canNavigate) {
                      onStepClick(step.id)
                    }
                  }}
                  disabled={!canNavigate}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    isCurrent || isCompleted ? "text-primary" : "text-muted-foreground"
                  } ${
                    canNavigate
                      ? "cursor-pointer hover:text-primary/80 hover:scale-105"
                      : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      isCompleted
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : isCurrent
                          ? "border-2 border-primary text-primary bg-background"
                          : "border-2 border-muted text-muted-foreground bg-background"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className={`text-sm font-medium ${isCurrent ? "text-primary" : ""}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
