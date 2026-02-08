// components/admin/vehicle-create/step-navigation.tsx
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  canProceed: boolean
  isSubmitting: boolean
  onNext: () => void
  onBack: () => void
  onSubmit: () => void
}

export function StepNavigation({
  currentStep,
  totalSteps,
  canProceed,
  isSubmitting,
  onNext,
  onBack,
  onSubmit,
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6">
      <div>
        {currentStep > 1 ? (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        ) : (
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/vehicles">Cancel</Link>
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {currentStep < totalSteps ? (
          <Button 
            type="button" 
            onClick={onNext} 
            disabled={!canProceed || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? (currentStep === 2 ? "Creating Vehicle..." : "Processing...") : "Next"}
            {!isSubmitting && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        ) : (
          <Button 
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving Pricing..." : "Complete Vehicle"}
          </Button>
        )}
      </div>
    </div>
  )
}
