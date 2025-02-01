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
            const labelPosition = ["ChapterFootnote", "Diacritics"].includes(step.id) ? "top" : "bottom"

            return (
              <div key={step.id} className="flex flex-col items-center">
                {labelPosition === "top" && (
                  <div
                    className={`mb-2 text-sm font-bold ${
                      isCurrent ? "text-amber-400" : isCompleted ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </div>
                )}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out border-2 ${
                    isCompleted
                      ? "border-green-500 bg-green-500"
                      : isCurrent
                        ? "border-amber-400 bg-amber-400 bg-opacity-20 animate-smooth-pulse"
                        : "border-gray-600 bg-gray-800"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-8 h-8 text-white" />
                  ) : (
                    <step.icon className={`w-8 h-8 ${isCurrent ? "text-amber-400" : "text-gray-400"}`} />
                  )}
                </div>
                {labelPosition === "bottom" && (
                  <div
                    className={`mt-2 text-sm font-bold ${
                      isCurrent ? "text-amber-400" : isCompleted ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProcessProgressBar

const styles = `
  @keyframes smooth-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .animate-smooth-pulse {
    animation: smooth-pulse 2s ease-in-out infinite;
  }
  .flex-col-reverse {
    flex-direction: column-reverse;
  }
`

const styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

