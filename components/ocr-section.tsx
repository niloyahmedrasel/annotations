import { Button } from "@/components/ui/button"

export function OCRSection() {
  const handleOCR = () => {
    console.log("OCR process started")
  }

  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-semibold mb-4">OCR Processing</h2>
      <p className="mb-4">Click the button below to start the OCR process for this book.</p>
      <Button onClick={handleOCR}>Start OCR</Button>
    </div>
  )
}

