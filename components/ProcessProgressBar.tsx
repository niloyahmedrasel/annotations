import type React from "react"
import { Check, FileText, Layers, UserCheck, Edit, CheckCircle } from "lucide-react"

const steps = [
  { id: "OCR", icon: FileText, label: "OCR" },
  { id: "ChapterFootnote", icon: Layers, label: "Chapter and Footnote" },
  { id: "NER", icon: UserCheck, label: "Named Entity Recognition" },
  { id: "Diacritics", icon: Edit, label: "Diacritics" },
  { id: "Review", icon: CheckCircle, label: "Review & Completion" },
]

interface ProcessProgressBarProps {
  currentStep: string
  completedSteps: string[]
}

const ProcessProgressBar: React.FC<ProcessProgressBarProps> = ({ currentStep, completedSteps }) => {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className="w-full max-w-4xl mx-auto p-4 mt-8 bg-gray-900 rounded-lg shadow-md">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 transform -translate-y-1/2">
          <div
            className="h-full bg-green-500 transition-all duration-500 ease-in-out"
            style={{ width: `${(completedSteps.length / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {/* Steps */}
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = step.id === currentStep
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out border-2 ${
                    isCompleted
                      ? "border-green-500 bg-green-500 bg-opacity-20"
                      : isCurrent
                        ? "border-yellow-500 bg-yellow-500 bg-opacity-20 animate-pulse"
                        : "border-gray-600 bg-gray-800"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-8 h-8 text-green-500" />
                  ) : (
                    <step.icon className={`w-8 h-8 ${isCurrent ? "text-yellow-500" : "text-gray-400"}`} />
                  )}
                </div>
                <div
                  className={`mt-2 text-sm font-bold ${
                    isCurrent ? "text-yellow-500" : isCompleted ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProcessProgressBar

