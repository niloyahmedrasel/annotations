"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { OCRSection } from "@/components/ocr-section"
import { ReviewSection } from "@/components/review-section"
import ProcessProgressBar from "@/components/ProcessProgressBar"
import { ChevronLeft, ChevronRight } from "lucide-react"

const processingSteps = [
  { id: "OCR", title: "OCR" },
  { id: "ChapterFootnote", title: "Chapter and Footnote Identification" },
  { id: "NER", title: "Named Entity Recognition (NER)" },
  { id: "Diacritics", title: "Diacritics" },
  { id: "Review", title: "Review & Complete" },
]

export default function ProcessBookPage({ params }: { params: { id: string } }) {
  const [activeStep, setActiveStep] = useState(processingSteps[0].id)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const router = useRouter()

  const currentStepIndex = processingSteps.findIndex((step) => step.id === activeStep)

  const handleNext = () => {
    if (currentStepIndex < processingSteps.length - 1) {
      const newCompletedSteps = [...completedSteps, activeStep]
      setCompletedSteps(newCompletedSteps)
      setActiveStep(processingSteps[currentStepIndex + 1].id)
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const newCompletedSteps = completedSteps.filter((step) => step !== processingSteps[currentStepIndex - 1].id)
      setCompletedSteps(newCompletedSteps)
      setActiveStep(processingSteps[currentStepIndex - 1].id)
    }
  }

  const isReviewStep = activeStep === processingSteps[processingSteps.length - 1].id

  if (isReviewStep) {
    return <ReviewSection onBack={handlePrevious} bookId={params.id} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard/books")} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to All Books
        </Button>
        <h1 className="text-4xl font-bold mb-6 text-center">Process Book: {params.id}</h1>
        <ProcessProgressBar currentStep={activeStep} completedSteps={completedSteps} />

        <div className="mt-12 bg-gray-800 rounded-lg shadow-lg p-8 animate-fadeIn">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {processingSteps.find((step) => step.id === activeStep)?.title}
          </h2>
          {activeStep === "OCR" && <OCRSection />}
          {/* Placeholder for other steps */}
          {(activeStep === "ChapterFootnote" || activeStep === "NER" || activeStep === "Diacritics") && (
            <div className="text-center py-8">
              <p className="text-xl">This feature is not yet implemented.</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStepIndex === processingSteps.length - 1}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

