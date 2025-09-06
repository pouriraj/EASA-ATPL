
import { MainDashboard } from '@/components/main-dashboard'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ATPL Questions Extraction System
          </h1>
          <p className="text-lg text-gray-600">
            Professional tool for extracting aviation theory questions from atplquestions.com
          </p>
        </div>
        <MainDashboard />
      </main>
    </div>
  )
}
