"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import QuizComponent from "@/components/quiz-component"
import ResultsAndForm from "@/components/results-and-form"
import ConfirmationDisplay from "@/components/confirmation-display"
import CalendlyModal from "@/components/calendly-modal"
import BackgroundEffects from "@/components/background-effects"
import LanguageSwitcher from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"

// Webhook URLs from environment variables
const WEBHOOK_1_URL = process.env.NEXT_PUBLIC_WEBHOOK_1_URL! // Report Generation
const WEBHOOK_2_URL = process.env.NEXT_PUBLIC_WEBHOOK_2_URL! // Lead Submission
const WEBHOOK_3_URL = process.env.NEXT_PUBLIC_WEBHOOK_3_URL! // Score Calculation

// Claves para localStorage
const STORAGE_KEYS = {
  CURRENT_STEP: "quiz_current_step",
  QUIZ_ANSWERS: "quiz_answers",
  QUIZ_RESULTS: "quiz_results",
  FORM_DATA: "quiz_form_data",
}

// Debug logging utility
const debugLog = (action: string, data: any) => {
  console.log(`[DEBUG] ${action}:`, data)
}

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<"quiz" | "results-form" | "confirmation">("quiz")
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [isFirstQuestion, setIsFirstQuestion] = useState(true)
  const [quizResults, setQuizResults] = useState<{
    score: number
    reportHTML: string
  } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Separate loading states for better UX
  const [isLoadingScore, setIsLoadingScore] = useState(false)
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [reportHTML, setReportHTML] = useState<string>("")
  
  // Use language context instead of local state
  const { language } = useLanguage()

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        debugLog("Loading from localStorage", "Starting...")
        
        const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP)
        if (savedStep && ["quiz", "results-form", "confirmation"].includes(savedStep)) {
          setCurrentStep(savedStep as "quiz" | "results-form" | "confirmation")
          debugLog("Loaded step from storage", savedStep)
        }
        
        const savedAnswers = localStorage.getItem(STORAGE_KEYS.QUIZ_ANSWERS)
        if (savedAnswers) {
          const parsedAnswers = JSON.parse(savedAnswers)
          setQuizAnswers(parsedAnswers)
          debugLog("Loaded answers from storage", parsedAnswers)
        }
        
        const savedResults = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS)
        if (savedResults) {
          const parsedResults = JSON.parse(savedResults)
          setQuizResults(parsedResults)
          setScore(parsedResults.score)
          setReportHTML(parsedResults.reportHTML)
          debugLog("Loaded results from storage", parsedResults)
        }
      } catch (error) {
        console.error("Error al cargar datos del localStorage:", error)
        clearStorage()
      }
      setIsLoading(false)
    }
    loadFromStorage()
  }, [])

  // Función para limpiar el localStorage
  const clearStorage = () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
    debugLog("Storage cleared", "All keys removed")
  }

  // Función para guardar en localStorage
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      debugLog(`Saved to storage: ${key}`, data)
    } catch (error) {
      console.error("Error al guardar en localStorage:", error)
    }
  }

  // Actualizar localStorage cuando cambie el paso
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep)
      debugLog("Step updated in storage", currentStep)
    }
  }, [currentStep, isLoading])

  // Actualizar localStorage cuando cambien las respuestas
  useEffect(() => {
    if (!isLoading && Object.keys(quizAnswers).length > 0) {
      saveToStorage(STORAGE_KEYS.QUIZ_ANSWERS, quizAnswers)
    }
  }, [quizAnswers, isLoading])

  // Actualizar localStorage cuando cambien los resultados
  useEffect(() => {
    if (!isLoading && quizResults) {
      saveToStorage(STORAGE_KEYS.QUIZ_RESULTS, quizResults)
    }
  }, [quizResults, isLoading])

  const handleQuizComplete = async (answers: Record<string, string>) => {
    setQuizAnswers(answers)
    debugLog("Quiz completed with answers", answers)
    
    // FIRST CALL - Get Score (Webhook 3) - Fast response expected
    setIsLoadingScore(true)
    debugLog("Starting score request", { webhook: WEBHOOK_3_URL, answers, lang: language })
    
    try {
      const scoreResponse = await fetch(WEBHOOK_3_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          answers,
          lang: language || "en"
        }),
      })

      debugLog("Score response received", { 
        status: scoreResponse.status, 
        ok: scoreResponse.ok 
      })

      if (!scoreResponse.ok) {
        throw new Error(`Error HTTP: ${scoreResponse.status}`)
      }

      const scoreData = await scoreResponse.json()
      debugLog("Score data parsed", scoreData)
      
      const calculatedScore = scoreData.score || 0
      setScore(calculatedScore)
      setIsLoadingScore(false)
      
      // Navigate to results immediately with score
      setCurrentStep("results-form")
      debugLog("Navigation to results-form with score", calculatedScore)

      // SECOND CALL - Get Report (Webhook 1) - Background loading
      setIsLoadingReport(true)
      debugLog("Starting report request", { 
        webhook: WEBHOOK_1_URL, 
        answers, 
        lang: language, 
        score: calculatedScore 
      })

      try {
        const reportResponse = await fetch(WEBHOOK_1_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            answers,
            lang: language,
            score: calculatedScore
          })
        })

        const reportText = await reportResponse.text()

        try {
          const parsed = JSON.parse(reportText)
          debugLog("Report data parsed", parsed)
          setReportHTML(parsed.reportHTML || "")
          setQuizResults({
            score: calculatedScore,
            reportHTML: parsed.reportHTML || ""
          })
          setIsLoadingReport(false)
        } catch (parseError) {
          console.error("Error parsing report JSON:", parseError)
          debugLog("Trying to clean the response and parse again", parseError)
          try {
            const cleanedResponse = reportText
              .replace(/\n/g, '')
              .replace(/\r/g, '')
              .replace(/\\/g, '\\\\')
              .replace(/\\"/g, '\\"')

            const fallbackParsed = JSON.parse(cleanedResponse)
            setReportHTML(fallbackParsed.reportHTML || "")
            setQuizResults({
              score: calculatedScore,
              reportHTML: fallbackParsed.reportHTML || ""
            })
            setIsLoadingReport(false)
          } catch (secondError) {
            console.error("Second parsing attempt failed:", secondError)
            const reportMatch = reportText.match(/"reportHTML":\s*"([\s\S]+?)"(?=\n?})/)
            const fallbackReport = reportMatch ? reportMatch[1].replace(/\\"/g, '"') : ""
            setReportHTML(fallbackReport)
            setQuizResults({
              score: calculatedScore,
              reportHTML: fallbackReport
            })
            setIsLoadingReport(false)
          }
        }
      } catch (reportError) {
        console.error("Error al obtener el reporte:", reportError)
        debugLog("Report request failed, using fallback", reportError)
        
        // MOCK DATA FALLBACK - Commented out for production
        /*
        const simulatedReportHTML = generateSimulatedReport(answers, calculatedScore)
        setReportHTML(simulatedReportHTML)
        setQuizResults({
          score: calculatedScore,
          reportHTML: simulatedReportHTML
        })
        */
        
        setIsLoadingReport(false)
      }

    } catch (scoreError) {
      console.error("Error al obtener el score:", scoreError)
      debugLog("Score request failed, using fallback", scoreError)
      
      // MOCK DATA FALLBACK - Commented out for production
      /*
      const simulatedScore = calculateSimulatedScore(answers)
      setScore(simulatedScore)
      setIsLoadingScore(false)
      setCurrentStep("results-form")
      
      // Continue with report request using simulated score
      setIsLoadingReport(true)
      try {
        const reportResponse = await fetch(WEBHOOK_1_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            answers,
            lang: language,
            score: simulatedScore.toString()
          }),
        })

        if (!reportResponse.ok) {
          throw new Error(`Error HTTP: ${reportResponse.status}`)
        }

        const reportData = await reportResponse.json()
        setReportHTML(reportData.reportHTML || "")
        setQuizResults({
          score: simulatedScore,
          reportHTML: reportData.reportHTML || ""
        })
        setIsLoadingReport(false)
        
      } catch (reportError) {
        console.error("Error al obtener el reporte con score simulado:", reportError)
        const simulatedReportHTML = generateSimulatedReport(answers, simulatedScore)
        setReportHTML(simulatedReportHTML)
        setQuizResults({
          score: simulatedScore,
          reportHTML: simulatedReportHTML
        })
        setIsLoadingReport(false)
      }
      */
      
      // For now, just show error state
      setIsLoadingScore(false)
      setIsLoadingReport(false)
    }
  }

  const handleFormSubmit = async (leadData: any) => {
    saveToStorage(STORAGE_KEYS.FORM_DATA, leadData)
    
    const submitData = {
      leadInfo: {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        phone: leadData.phone,
        email: leadData.email,
        acceptTerms: leadData.acceptTerms
      },
      score: quizResults?.score || score || 0,
      reportHTML: quizResults?.reportHTML || reportHTML || "",
      lang: language
    }
    
    debugLog("Starting form submission", { webhook: WEBHOOK_2_URL, data: submitData })
    
    try {
      const response = await fetch(WEBHOOK_2_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      debugLog("Form submission response", { 
        status: response.status, 
        ok: response.ok 
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const responseData = await response.json()
      debugLog("Form submission successful", responseData)
      
      setCurrentStep("confirmation")
      
    } catch (error) {
      console.error("Error al enviar formulario:", error)
      debugLog("Form submission failed", error)
      
      // Continue to confirmation even on error for better UX
      setCurrentStep("confirmation")
    }
  }

  const handleResetQuiz = () => {
    debugLog("Resetting quiz", "Clearing all data")
    clearStorage()
    setCurrentStep("quiz")
    setQuizAnswers({})
    setQuizResults(null)
    setScore(null)
    setReportHTML("")
    setIsLoadingScore(false)
    setIsLoadingReport(false)
  }

  // MOCK DATA FUNCTIONS - Commented out for production use
  /*
  const calculateSimulatedScore = (answers: Record<string, string>): number => {
    const positiveKeywords = [
      "Avanzado", "Experto", "Crítica", "Data-driven",
      "Automatización", "Microservicios", "Nube",
      "Testing continuo", "Agile", "Backups automáticos",
    ]
    let score = 50
    Object.values(answers).forEach((answer) => {
      positiveKeywords.forEach((keyword) => {
        if (answer.includes(keyword)) score += 2
      })
      if (
        answer.includes("Principiante") ||
        answer.includes("No tenemos") ||
        answer.includes("Mínima") ||
        answer.includes("Poco importante")
      ) {
        score -= 3
      }
    })
    return Math.min(Math.max(score, 0), 100)
  }

  const generateSimulatedReport = (answers: Record<string, string>, score: number): string => {
    const strengths: string[] = []
    const weaknesses: string[] = []
    const recommendations: string[] = []

    if (answers.q1?.includes("Automatización")) {
      strengths.push("Enfoque en automatización de procesos")
      recommendations.push("Implementar herramientas de RPA (Robotic Process Automation) para tareas repetitivas")
    } else {
      weaknesses.push("Falta de automatización en procesos clave")
      recommendations.push("Comenzar con la automatización de procesos repetitivos de alto volumen")
    }

    if (answers.q12?.includes("Data-driven")) {
      strengths.push("Cultura data-driven bien establecida")
      recommendations.push("Explorar modelos predictivos avanzados para anticipar tendencias del mercado")
    } else {
      weaknesses.push("Estrategia de datos subdesarrollada")
      recommendations.push("Implementar un data warehouse centralizado y dashboards de KPIs")
    }

    if (answers.q17?.includes("Microservicios")) {
      strengths.push("Arquitectura moderna y escalable")
      recommendations.push("Implementar CI/CD completo para acelerar el despliegue de microservicios")
    } else {
      weaknesses.push("Arquitectura potencialmente rígida o difícil de escalar")
      recommendations.push("Evaluar la migración gradual hacia microservicios para componentes críticos")
    }

    if (answers.q9?.includes("Protección")) {
      strengths.push("Conciencia sobre la importancia de la protección de datos")
      recommendations.push("Implementar encriptación end-to-end para datos sensibles")
    } else {
      weaknesses.push("Posibles vulnerabilidades en seguridad de datos")
      recommendations.push("Realizar un audit de seguridad completo y establecer políticas de protección de datos")
    }

    return `
      <h4 class="text-xl font-bold mb-4 text-[#FF4D00]">Resumen Ejecutivo</h4>
      <p class="mb-6">Basado en tus respuestas, tu organización muestra un nivel de madurez tecnológica ${
        score < 30 ? "inicial" : score < 60 ? "en desarrollo" : score < 80 ? "avanzado" : "excepcional"
      }. ${
        score < 50
          ? "Hay oportunidades significativas para mejorar y optimizar tu infraestructura tecnológica."
          : "Tu enfoque tecnológico está bien alineado con las mejores prácticas de la industria."
      }</p>
      <h4 class="text-lg font-bold mb-3 text-white">Fortalezas Identificadas</h4>
      <ul class="list-disc pl-5 mb-6 space-y-2">
        ${strengths.map((str) => `<li>${str}</li>`).join("")}
        ${strengths.length === 0 ? "<li>Disposición para evaluar y mejorar la infraestructura tecnológica</li>" : ""}
      </ul>
      <h4 class="text-lg font-bold mb-3 text-white">Áreas de Mejora</h4>
      <ul class="list-disc pl-5 mb-6 space-y-2">
        ${weaknesses.map((wk) => `<li>${wk}</li>`).join("")}
        ${weaknesses.length === 0 ? "<li>Mantener el ritmo de innovación frente a nuevas tecnologías emergentes</li>" : ""}
      </ul>
      <h4 class="text-lg font-bold mb-3 text-[#FF4D00]">Recomendaciones Estratégicas</h4>
      <ul class="list-disc pl-5 mb-4 space-y-2">
        ${recommendations.map((rec) => `<li>${rec}</li>`).join("")}
        <li>Establecer un roadmap tecnológico claro con objetivos a corto, mediano y largo plazo</li>
        <li>Invertir en capacitación continua del equipo en tecnologías emergentes</li>
      </ul>
    `
  }
  */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
        <BackgroundEffects />
        <div className="relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <div className="w-16 h-16 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
          </motion.div>
          <p className="text-xl text-gray-400 text-center">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <BackgroundEffects />
      {isFirstQuestion && <LanguageSwitcher />} 
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          
          {currentStep === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <QuizComponent 
                onComplete={handleQuizComplete} 
                savedAnswers={quizAnswers} 
                onReset={handleResetQuiz}
                onQuestionChange={(isFirst: boolean) => setIsFirstQuestion(isFirst)}
              />
            </motion.div>
          )}
          
          {currentStep === "results-form" && (
            <motion.div
              key="results-form"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <ResultsAndForm
                score={score}
                reportHTML={reportHTML}
                onSubmit={handleFormSubmit}
                onReset={handleResetQuiz}
                isLoadingScore={isLoadingScore}
                isLoadingReport={isLoadingReport}
              />
            </motion.div>
          )}
          
          {currentStep === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <ConfirmationDisplay 
                onOpenModal={() => setIsModalOpen(true)} 
                onReset={handleResetQuiz} 
                reportHTML={quizResults?.reportHTML || reportHTML || ""}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CalendlyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}