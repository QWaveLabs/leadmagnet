"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import QuizComponent from "@/components/quiz-component"
import ResultsAndForm from "@/components/results-and-form"
import ConfirmationDisplay from "@/components/confirmation-display"
import CalendlyModal from "@/components/calendly-modal"
import BackgroundEffects from "@/components/background-effects"
import LanguageSwitcher from "@/components/language-switcher"

// Webhook URLs from environment variables
const WEBHOOK_1_URL = process.env.NEXT_PUBLIC_WEBHOOK_1_URL!
const WEBHOOK_2_URL = process.env.NEXT_PUBLIC_WEBHOOK_2_URL!

// Claves para localStorage
const STORAGE_KEYS = {
  CURRENT_STEP: "quiz_current_step",
  QUIZ_ANSWERS: "quiz_answers",
  QUIZ_RESULTS: "quiz_results",
  FORM_DATA: "quiz_form_data",
}

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<"quiz" | "results-form" | "confirmation">("quiz")
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [isFirstQuestion, setIsFirstQuestion] = useState(true) // Añade este estado
  const [quizResults, setQuizResults] = useState<{
    score: number
    reportHTML: string
  } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP)
        if (savedStep && ["quiz", "results-form", "confirmation"].includes(savedStep)) {
          setCurrentStep(savedStep as "quiz" | "results-form" | "confirmation")
        }
        const savedAnswers = localStorage.getItem(STORAGE_KEYS.QUIZ_ANSWERS)
        if (savedAnswers) {
          setQuizAnswers(JSON.parse(savedAnswers))
        }
        const savedResults = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS)
        if (savedResults) {
          setQuizResults(JSON.parse(savedResults))
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
  }

  // Función para guardar en localStorage
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Error al guardar en localStorage:", error)
    }
  }

  // Actualizar localStorage cuando cambie el paso
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep)
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
    try {
      console.log("Enviando respuestas al webhook:", answers)
      const response = await fetch(WEBHOOK_1_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      // Get response as text
      const responseText = await response.text()
      
      try {
        // Try to parse the JSON directly first
        const data = JSON.parse(responseText)
        console.log("Respuesta del webhook (parseada):", data)
        
        setQuizResults({
          score: data.score || 0,
          reportHTML: data.reportHTML || ""
        })
        setCurrentStep("results-form")
      } catch (parseError) {
        console.error("Error al parsear JSON:", parseError)
        
        // If parsing fails, try to clean the response
        try {
          // Remove newlines and properly escape quotes
          const cleanedResponse = responseText
            .replace(/\n/g, '')
            .replace(/\r/g, '')
            .replace(/\\/g, '\\\\')
            .replace(/\\"/g, '\\"')
          
          const data = JSON.parse(cleanedResponse)
          
          setQuizResults({
            score: data.score || 0,
            reportHTML: data.reportHTML || ""
          })
          setCurrentStep("results-form")
        } catch (secondError) {
          console.error("Error en segundo intento de parsing:", secondError)
          // Use regex as last resort
          const scoreMatch = responseText.match(/"score":\s*(\d+)/)
          const reportMatch = responseText.match(/"reportHTML":\s*"([\s\S]+?)(?="\n})/)
          
          if (scoreMatch && reportMatch) {
            setQuizResults({
              score: parseInt(scoreMatch[1]),
              reportHTML: reportMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
            })
            setCurrentStep("results-form")
          } else {
            throw new Error("No se pudo extraer la información necesaria")
          }
        }
      }
    } catch (error) {
      console.error("Error al enviar respuestas:", error)
      // Fallback to simulation
      const simulatedScore = calculateSimulatedScore(answers)
      const simulatedReportHTML = generateSimulatedReport(answers, simulatedScore)
      setQuizResults({ score: simulatedScore, reportHTML: simulatedReportHTML })
      setCurrentStep("results-form")
    }
  }

  const handleFormSubmit = async (leadData: any) => {
    saveToStorage(STORAGE_KEYS.FORM_DATA, leadData)
    try {
      console.log("Enviando datos al webhook 2:", {
        leadInfo: leadData,
        score: quizResults?.score || 0,
        reportHTML: quizResults?.reportHTML || "",
      })
      const response = await fetch(WEBHOOK_2_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadInfo: leadData,
          score: quizResults?.score || 0,
          reportHTML: quizResults?.reportHTML || "",
        }),
      })
      if (!response.ok) throw new Error("Error al procesar el formulario")
      const data = await response.json()
      console.log("Respuesta del webhook 2:", data)
      setQuizResults({
        score: data.score,
        reportHTML: data.reportHTML,
      })
      setCurrentStep("confirmation")
    } catch (error) {
      console.error("Error al enviar formulario:", error)
      setCurrentStep("confirmation")
    }
  }

  const handleResetQuiz = () => {
    clearStorage()
    setCurrentStep("quiz")
    setQuizAnswers({})
    setQuizResults(null)
  }

  // Funciones auxiliares
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
                onQuestionChange={(isFirst: boolean) => setIsFirstQuestion(isFirst)} // Añade esta prop
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
                score={quizResults?.score || 0}
                reportHTML={quizResults?.reportHTML || ""}
                onSubmit={handleFormSubmit}
                onReset={handleResetQuiz}
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
                reportHTML={quizResults?.reportHTML || ""}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CalendlyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
