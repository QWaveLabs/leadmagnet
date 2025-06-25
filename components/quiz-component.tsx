"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight, ChevronLeft, Loader2, RotateCcw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface QuizComponentProps {
  onComplete: (answers: Record<string, string>) => void
  savedAnswers: Record<string, string>
  onReset: () => void
  onQuestionChange: (isFirst: boolean) => void
}

const questions = [
  {
    id: "q1",
    question: {
      es: "¿Qué tan familiarizado estás con herramientas de IA como ChatGPT, Gemini o Midjourney?",
      en: "How familiar are you with AI tools like ChatGPT, Gemini, or Midjourney?",
    },
    options: {
      es: ["Nada", "Algo", "Mucho", "Extremadamente"],
      en: ["Not at all", "Somewhat", "Very", "Extremely"],
    },
  },
  {
    id: "q2",
    question: {
      es: "¿Actualmente utilizas alguna herramienta de IA en tus operaciones comerciales?",
      en: "Do you currently use any AI tools in your business operations?",
    },
    options: {
      es: ["Sí", "No", "No estoy seguro"],
      en: ["Yes", "No", "Not Sure"],
    },
  },
  {
    id: "q3",
    question: {
      es: "¿Qué tan seguro estás de identificar tareas en tu negocio que la IA podría apoyar?",
      en: "How confident are you in identifying tasks in your business that AI could support?",
    },
    options: {
      es: ["Nada", "Algo", "Mucho", "Extremadamente"],
      en: ["Not at all", "Somewhat", "Very", "Extremely"],
    },
  },
  {
    id: "q4",
    question: {
      es: "¿Has evaluado previamente tu negocio para oportunidades de automatización?",
      en: "Have you previously evaluated your business for automation opportunities?",
    },
    options: {
      es: ["Sí", "No"],
      en: ["Yes", "No"],
    },
  },
  {
    id: "q5",
    question: {
      es: "¿Tienes un miembro del equipo o contratista dedicado a la IA o automatización?",
      en: "Do you have a dedicated team member or contractor focused on AI or automation?",
    },
    options: {
      es: ["Sí", "No"],
      en: ["Yes", "No"],
    },
  },
  {
    id: "q6",
    question: {
      es: "¿Dónde gastas actualmente más tiempo manualmente?",
      en: "Where do you currently spend the most time manually?",
    },
    options: {
      es: ["Generación de leads", "Incorporación de nuevos clientes", "RRHH", "Varias operaciones", "Otro"],
      en: ["Lead gen", "Onboarding new clients", "HR", "Various operations", "Other"],
    },
  },
  {
    id: "q7",
    question: {
      es: "¿Qué área de tu negocio se siente más embotellada?",
      en: "Which area of your business feels the most bottlenecked?",
    },
    options: {
      es: ["Operaciones", "Marketing/Ventas", "RRHH", "Finanzas"],
      en: ["Operations", "Marketing/Sales", "HR", "Finance"],
    },
  },
  {
    id: "q8",
    question: {
      es: "¿Con qué frecuencia haces seguimiento manual a los leads?",
      en: "How often do you follow up with leads manually?",
    },
    options: {
      es: ["Nunca", "Raramente", "A veces", "A menudo", "Siempre"],
      en: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    },
  },
  {
    id: "q9",
    question: {
      es: "¿Están documentados tus POEs (procedimientos operativos estándar)?",
      en: "Are your SOPs (standard operating procedures) documented?",
    },
    options: {
      es: ["Nunca", "Raramente", "A veces", "A menudo", "Siempre"],
      en: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    },
  },
  {
    id: "q10",
    question: {
      es: "¿Repites la misma tarea más de 3 veces a la semana manualmente?",
      en: "Do you repeat the same task more than 3 times a week manually?",
    },
    options: {
      es: ["Sí", "No"],
      en: ["Yes", "No"],
    },
  },
  {
    id: "q11",
    question: {
      es: "¿Qué herramientas o aplicaciones forman parte de tu stack tecnológico actual?",
      en: "Which tools or apps are part of your current tech stack?",
    },
    options: {
      es: [
        "Google Workspace (Gmail, Drive, Docs, etc.)",
        "Slack / Teams / Discord",
        "CRM (ej., HubSpot, Salesforce, GoHighLevel)",
        "Programación (ej., Calendly, Acuity)",
        "Plataforma de email marketing (ej., ActiveCampaign, Mailchimp)",
        "Gestión de proyectos (ej., Asana, ClickUp, Trello)",
        "Herramientas de automatización (ej., Zapier, Make.com)",
        "Herramientas contables (ej., QuickBooks, Xero)",
        "Herramientas de propuestas / firma electrónica (ej., PandaDoc, DocuSign)",
        "Herramientas de IA (Agentes IA, ChatGPT, Gemini, Claude)",
        "Ninguna de las anteriores",
      ],
      en: [
        "Google Workspace (Gmail, Drive, Docs, etc.)",
        "Slack / Teams / Discord",
        "CRM (e.g., HubSpot, Salesforce, GoHighLevel)",
        "Scheduling (e.g., Calendly, Acuity)",
        "Email marketing platform (e.g., ActiveCampaign, Mailchimp)",
        "Project management (e.g., Asana, ClickUp, Trello)",
        "Automation tools (e.g., Zapier, Make.com)",
        "Accounting tools (e.g., QuickBooks, Xero)",
        "Proposal / e-signature tools (e.g., PandaDoc, DocuSign)",
        "AI tools (AI Agents, ChatGPT, Gemini, Claude)",
        "None of the above",
      ],
    },
  },
  {
    id: "q12",
    question: {
      es: "¿Qué tan consistente es tu proceso de conversión de lead a cliente?",
      en: "How consistent is your lead-to-client conversion process?",
    },
    options: {
      es: ["Nada consistente", "Algo consistente", "Consistente"],
      en: ["Not at all", "Somewhat consistent", "Consistent"],
    },
  },
  {
    id: "q13",
    question: {
      es: "¿Qué describe mejor tu modelo de negocio?",
      en: "What best describes your business model?",
    },
    options: {
      es: [
        "SaaS",
        "Agencia",
        "E-commerce",
        "Servicios",
        "Coaching",
        "Franquicia",
        "Retail",
        "DTC (Directo al Consumidor)",
        "Info (para productos de información o educación)",
        "Tienda física",
        "Suscripción",
        "Otro",
      ],
      en: [
        "SaaS",
        "Agency",
        "E-commerce",
        "Services",
        "Coaching",
        "Franchise",
        "Retail",
        "DTC (Direct-to-Consumer)",
        "Info (for info products or education)",
        "Brick-and-Mortar",
        "Subscription",
        "Other",
      ],
    },
  },
  {
    id: "q14",
    question: {
      es: "¿En qué estrategia de crecimiento confías más actualmente?",
      en: "Which growth strategy are you currently relying on most?",
    },
    options: {
      es: ["Anuncios", "Referencias", "Alcance en frío", "Orgánico", "Redes Sociales"],
      en: ["Ads", "Referrals", "Cold outreach", "Organic", "Social Media"],
    },
    multi: true,
  },
  {
    id: "q15",
    question: {
      es: "¿Cuántas personas hay en tu equipo (incluyendo contratistas)?",
      en: "How many people are on your team (including contractors)?",
    },
    options: {
      es: ["2–5", "6–15", "16–50", "50+"],
      en: ["2–5", "6–15", "16–50", "50+"],
    },
  },
  {
    id: "q16",
    question: {
      es: "¿Cuál es tu rango de ingresos mensuales promedio?",
      en: "What's your average monthly revenue range?",
    },
    options: {
      es: ["<$10K", "$10K–$20K", "$20K–$100K", "$100K+", "$200K+","$200K-$500K","$500K"],
      en: ["<$10K", "$10K–$20K", "$20K–$100K", "$100K+", "$200K+","$200K-$500K","$500K"],
    },
  },
  {
    id: "q17",
    question: {
      es: "¿Cómo incorporas actualmente a clientes o consumidores?",
      en: "How do you currently onboard clients or customers?",
    },
    options: {
      es: [
        "Manualmente por email o llamadas",
        "Usando un formulario o cuestionario de admisión",
        "Automatizado a través de CRM o flujo de trabajo",
        "No realmente incorporamos — simplemente sucede",
      ],
      en: [
        "Manually via email or calls",
        "Using a form or intake questionnaire",
        "Automated via CRM or workflow",
        "We don't really onboard — it just happens",
      ],
    },
  },
  {
    id: "q18",
    question: {
      es: "¿Cuál es tu proceso actual para la creación de contenido o producción de marketing?",
      en: "What's your current process for content creation or marketing output?",
    },
    options: {
      es: [
        "Creo todo el contenido manualmente",
        "Uso freelancers o un pequeño equipo",
        "Usamos herramientas de IA (ej., ChatGPT, Jasper)",
        "Tenemos POEs o plantillas, pero sigue siendo manual",
        "Hemos automatizado partes de ello (programación, reutilización, etc.)",
        "No producimos contenido regularmente",
      ],
      en: [
        "I create all content manually",
        "I use freelancers or a small team",
        "We use AI tools (e.g., ChatGPT, Jasper)",
        "We have SOPs or templates, but still manual",
        "We've automated parts of it (scheduling, repurposing, etc.)",
        "We don't produce content regularly",
      ],
    },
    multi: true,
  },
  {
    id: "q19",
    question: {
      es: "¿Aproximadamente cuántas horas por semana pasas en tareas administrativas o repetitivas?",
      en: "Roughly how many hours per week do you spend on admin or repetitive tasks?",
    },
    options: {
      es: ["0–5 hrs", "6–10 hrs", "11–20 hrs", "20+ hrs", "No lo sé"],
      en: ["0–5 hrs", "6–10 hrs", "11–20 hrs", "20+ hrs", "Don't know"],
    },
  },
  {
    id: "q20",
    question: {
      es: "¿Cuál es tu costo de adquisición de clientes (si lo conoces)?",
      en: "What is your customer acquisition cost (if known)?",
    },
    options: {
      es: [
        "No tengo idea / no lo rastreo",
        "Es bajo (principalmente referencias u orgánico)",
        "Es moderado (pagamos por leads o ejecutamos anuncios)",
        "Es alto (anuncios + costo del equipo por cierre es sustancial)",
        "Varía demasiado para estimarlo",
      ],
      en: [
        "I have no idea / don't track it",
        "It's low (mostly referrals or organic)",
        "It's moderate (we pay for leads or run ads",
        "It's high (ads + team cost per close is substantial)",
        "It varies too much to estimate",
      ],
    },
  },
  {
    id: "q21",
    question: {
      es: "¿Rastrean el tiempo que tu equipo dedica a procesos manuales?",
      en: "Do you track the time spent by your team on manual processes?",
    },
    options: {
      es: ["Nunca", "Raramente", "A veces", "A menudo", "Siempre"],
      en: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    },
  },
  {
    id: "q22",
    question: {
      es: "¿Conoces el valor de vida (LTV) de tu cliente promedio?",
      en: "Do you know the lifetime value (LTV) of your average client?",
    },
    options: {
      es: [
        "Sí — lo rastreo regularmente",
        "Tengo una estimación aproximada",
        "Lo calculé una vez, pero no lo consulto",
        "No — nunca lo he calculado",
      ],
      en: [
        "Yes — I track it regularly",
        "I have a rough estimate",
        "I calculated it once, but don't reference it",
        "No — I've never calculated it",
      ],
    },
  },
  {
    id: "q23",
    question: {
      es: "¿Has calculado recientemente el ROI de tus herramientas o sistemas operativos?",
      en: "Have you recently calculated the ROI of your operational tools or systems?",
    },
    options: {
      es: ["Nunca lo he pensado", "No recientemente", "Sí — rastreamos el ROI", "Tenemos un proceso formal"],
      en: ["Never thought about it", "Not recently", "Yes — we track ROI", "We have a formal process"],
    },
  },
  {
    id: "q24",
    question: {
      es: "Si se te muestra un ROI claro, ¿qué tan pronto querrías implementar una solución de IA?",
      en: "If shown a clear ROI, how soon would you want to implement an AI solution?",
    },
    options: {
      es: [
        "Inmediatamente",
        "Dentro de los próximos 30 días",
        "Dentro de los próximos 3 meses",
        "En algún momento de este año",
        "No estoy seguro",
      ],
      en: ["Immediately", "Within the next 30 days", "Within the next 3 months", "Sometime this year", "Not sure"],
    },
  },
  {
    id: "q25",
    question: {
      es: "¿Estarías abierto a una breve llamada para explorar posibles sistemas de IA para tu negocio?",
      en: "Would you be open to a short call to explore possible AI systems for your business?",
    },
    options: {
      es: ["Nada", "Algo", "Mucho", "Extremadamente"],
      en: ["Not at all", "Somewhat", "Very", "Extremely"],
    },
  },
  {
    id: "q26",
    question: {
      es: "¿Has intentado trabajar con un consultor de IA o automatización antes?",
      en: "Have you tried working with an AI or automation consultant before?",
    },
    options: {
      es: ["Sí", "No"],
      en: ["Yes", "No"],
    },
  },
  {
    id: "q27",
    question: {
      es: "¿Tienes un presupuesto asignado para mejoras tecnológicas o IA en los próximos 3 meses?",
      en: "Do you have a budget allocated for tech improvements or AI in the next 3 months?",
    },
    options: {
      es: ["No asignado", "Menos de $10k", "$10k–$25k", "$25k+"],
      en: ["Not allocated", "Less than $10k", "$10-$25k", "$25k+"],
    },
  },
  {
    id: "q28",
    question: {
      es: "¿Cuál es tu nivel de comodidad al adoptar nueva tecnología en tu flujo de trabajo actual?",
      en: "What's your comfort level in adopting new technology in your current workflow?",
    },
    options: {
      es: ["Muy incómodo", "Algo incómodo", "Neutral", "Cómodo", "Muy cómodo"],
      en: ["Very uncomfortable", "Somewhat uncomfortable", "Neutral", "Comfortable", "Very comfortable"],
    },
  },
]

export default function QuizComponent({
  onComplete,
  savedAnswers = {},
  onReset,
  onQuestionChange,
}: QuizComponentProps) {
  const { t, language } = useLanguage()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(savedAnswers)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const current = questions[currentQuestion]
  const isMultiSelect = !!current.multi;

  useEffect(() => {
    if (Object.keys(savedAnswers).length > 0) {
      setAnswers(savedAnswers)
      const answeredQuestions = Object.keys(savedAnswers).length
      setCurrentQuestion(
        answeredQuestions < questions.length ? answeredQuestions : questions.length - 1
      )
    }
  }, [savedAnswers])

  useEffect(() => {
    onQuestionChange(currentQuestion === 0)
  }, [currentQuestion, onQuestionChange])

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [current.id]: value,
    }))
  }

  const toggleMultiSelectOption = (option: string) => {
    const prev = answers[current.id] ? answers[current.id].split("||") : []
    const updated = prev.includes(option)
      ? prev.filter((item) => item !== option)
      : [...prev, option]
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [current.id]: updated.join("||"),
    }))
  }

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return
    setIsSubmitting(true)
    onComplete(answers)
  }, [isSubmitting, answers, onComplete])

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }, [currentQuestion, questions.length, handleSubmit])

  // Auto-advance for single choice questions
  useEffect(() => {
    if (!isMultiSelect && answers[current.id]) {
      handleNext()
    }
  }, [answers[current.id], isMultiSelect, handleNext])

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isAnswered = isMultiSelect
    ? answers[current.id]?.split("||").length > 0
    : !!answers[current.id]

  return (
    <div className="min-h-screen flex items-center justify-center pt-[10px] pb-4 px-2 md:pt-8 md:px-4">
      <div className="w-full max-w-2xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {Object.keys(savedAnswers).length > 0 && onReset && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4">
              <Button
                onClick={onReset}
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("quiz.reset")}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {isSubmitting ? (
          <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Loader2 className="w-16 h-16 text-[#a259ff]" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-4">{t("quiz.processing")}</h3>
            <p className="text-gray-400 text-lg">{t("quiz.analyzing")}</p>
          </motion.div>
        ) : (
          <>
            <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>
                  {t("quiz.question")} {currentQuestion + 1} {t("quiz.of")} {questions.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-[#a259ff] to-[#c084fc] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-gray-900/50 border-gray-800 rounded-2xl p-3 md:p-8 shadow-xl backdrop-blur-sm">
                <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-8 leading-tight">
                  {current.question[language]}
                </h2>

                {isMultiSelect ? (
                  <div className="space-y-2 md:space-y-4">
                    {current.options[language].map((option, index) => {
                      const selected = answers[current.id]?.split("||") || []
                      const checked = selected.includes(option)
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group"
                        >
                          <div
                            onClick={() => toggleMultiSelectOption(option)}
                            className={`flex items-center space-x-3 md:space-x-4 p-2 md:p-4 rounded-xl border border-gray-700 hover:border-[#a259ff] transition-all duration-300 cursor-pointer hover:bg-gray-800/30 ${checked ? 'bg-gray-800/60' : ''}`}
                          >
                            <span className={`inline-block w-5 h-5 md:w-6 md:h-6 rounded border border-gray-600 flex items-center justify-center transition-colors duration-200 ${checked ? 'bg-white' : 'bg-transparent'}`}></span>
                            <Label className="text-base md:text-lg font-medium cursor-pointer flex-1 group-hover:text-[#a259ff] transition-colors">
                              {option}
                            </Label>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <RadioGroup
                    value={answers[current.id] || ""}
                    onValueChange={handleAnswer}
                    className="space-y-2 md:space-y-4"
                  >
                    {current.options[language].map((option, index) => {
                      const checked = answers[current.id] === option;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group"
                        >
                          <div
                            className={`flex items-center space-x-3 md:space-x-4 p-2 md:p-4 rounded-xl border border-gray-700 hover:border-[#a259ff] transition-all duration-300 cursor-pointer hover:bg-gray-800/30 ${checked ? 'bg-gray-800/60' : ''}`}
                            onClick={() => handleAnswer(option)}
                          >
                            <span className={`inline-block w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-600 flex items-center justify-center transition-colors duration-200 ${checked ? 'bg-white' : 'bg-transparent'}`}></span>
                            <Label
                              htmlFor={option}
                              className="text-base md:text-lg font-medium cursor-pointer flex-1 group-hover:text-[#a259ff] transition-colors"
                            >
                              {option}
                            </Label>
                          </div>
                        </motion.div>
                      )
                    })}
                  </RadioGroup>
                )}
              </Card>
            </motion.div>

            <motion.div
              className="flex justify-between mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
                className="bg-transparent border-gray-700 text-white hover:bg-gray-800 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t("quiz.previous")}
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isAnswered}
                className="bg-white text-black hover:bg-gray-200 font-bold px-8 disabled:opacity-50"
              >
                {currentQuestion === questions.length - 1 ? t("quiz.seeResult") : t("quiz.next")}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}