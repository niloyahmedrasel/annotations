"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { OCRSection } from "@/components/ocr-section"
import { ReviewSection } from "@/components/review-section"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const processingSteps = [
  { id: "OCR", title: "OCR" },
  { id: "ChapterFootnote", title: "Chapter and Footnote Identification" },
  { id: "NER", title: "Named Entity Recognition (NER)" },
  { id: "Diacritics", title: "Diacritics" },
  { id: "Review", title: "Review & Complete" },
]

export default function ProcessBookPage({ params }: { params: { id: string } }) {
  const [activeStep, setActiveStep] = useState("OCR")
  const router = useRouter()

  const isReviewStep = activeStep === "Review"

  const handleBackFromReview = () => {
    setActiveStep(processingSteps[processingSteps.length - 2].id)
  }

  if (isReviewStep) {
    return <ReviewSection onBack={handleBackFromReview} bookId={params.id} />
  }

  return (
    <div className="h-screen flex">
      <div className="w-80 bg-gray-800 p-4 border-r border-gray-700 overflow-y-auto">
        <Button variant="ghost" onClick={() => router.push("/dashboard/books")} className="mb-4 w-full justify-start">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to All Books
        </Button>
        <h2 className="text-xl font-bold mb-4">Processing Steps</h2>
        <nav>
          <ul className="space-y-3">
            {processingSteps.map((step) => (
              <li key={step.id}>
                <Button
                  variant={activeStep === step.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-between text-left px-5 py-3 h-auto text-base",
                    activeStep === step.id ? "bg-gray-700 text-white" : "text-gray-300",
                  )}
                  onClick={() => setActiveStep(step.id)}
                >
                  <span>{step.title}</span>
                  {activeStep === step.id && <ChevronRight className="h-4 w-4" />}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Process Book: {params.id}</h1>
        <Separator className="my-4" />

        {activeStep === "OCR" && <OCRSection />}
        {/* Placeholder for other steps */}
        {(activeStep === "ChapterFootnote" || activeStep === "NER" || activeStep === "Diacritics") && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-4">
              {processingSteps.find((step) => step.id === activeStep)?.title}
            </h2>
            <p>This feature is not yet implemented.</p>
          </div>
        )}
      </div>
    </div>
  )
}

