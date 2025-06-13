"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "es"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Traducciones embebidas directamente en el contexto
const translations = {
  es: {
    // Quiz Component
    "quiz.title": "TECH ASSESSMENT",
    "quiz.subtitle": "Descubre la solución perfecta para tu empresa",
    "quiz.reset": "Empezar de nuevo",
    "quiz.question": "Pregunta",
    "quiz.of": "de",
    "quiz.previous": "Anterior",
    "quiz.next": "Siguiente",
    "quiz.seeResult": "Ver mi resultado",
    "quiz.processing": "Procesando tus respuestas...",
    "quiz.analyzing": "Estamos analizando tu perfil tecnológico",

    // Results and Form
    "results.title": "TU ANÁLISIS",
    "results.subtitle": "Revisa tus resultados y completa tus datos para recibir el reporte completo",
    "results.reset": "Empezar de nuevo",
    "results.score": "Tu Puntuación Tecnológica",
    "results.level.initial": "Etapas iniciales - Grandes oportunidades de mejora",
    "results.level.developing": "Base sólida - Áreas clave por optimizar",
    "results.level.advanced": "Nivel avanzado - En el camino correcto",
    "results.level.exceptional": "Nivel excepcional - ¡Felicidades!",
    "results.analysis": "Análisis Detallado",
    "results.error": "No se pudo generar el reporte. Por favor, intenta nuevamente.",

    // Form
    "form.title": "OBTÉN TU REPORTE COMPLETO",
    "form.subtitle": "Completa tus datos para recibir el análisis detallado por email",
    "form.firstName": "Nombre",
    "form.lastName": "Apellido",
    "form.phone": "Teléfono",
    "form.email": "Email",
    "form.terms":
      "Acepto los Términos y Condiciones y autorizo el tratamiento de mis datos personales para recibir información comercial.",
    "form.submit": "OBTENER REPORTE COMPLETO",

    // Confirmation
    "confirmation.title": "¡PERFECTO!",
    "confirmation.subtitle": "Tu análisis ha sido procesado exitosamente",
    "confirmation.reset": "Realizar nuevo análisis",
    "confirmation.completed": "Análisis Completado",
    "confirmation.message":
      "Hemos procesado tu evaluación tecnológica y enviado el reporte detallado a tu email. Nuestro equipo de expertos revisará tu perfil y te contactará con recomendaciones personalizadas.",
    "confirmation.processed": "Análisis Procesado",
    "confirmation.processed.desc": "Tu evaluación tecnológica ha sido completada",
    "confirmation.sent": "Reporte Enviado",
    "confirmation.sent.desc": "Revisa tu email para el análisis detallado",
    "confirmation.next": "Próximos Pasos",
    "confirmation.next.desc": "Nuestro equipo te contactará en las próximas 24 horas",
    "confirmation.cta.title": "¿Quieres acelerar el proceso?",
    "confirmation.cta.desc":
      "Agenda una consulta estratégica gratuita con nuestros expertos para discutir tu roadmap tecnológico inmediatamente.",
    "confirmation.cta.button": "AGENDAR CONSULTA GRATUITA",
    "confirmation.cta.footer": "Consulta de 30 minutos • Sin compromiso • Análisis personalizado",

    // Language Switcher
    "language.switch": "English",
  },
  en: {
    // Quiz Component
    "quiz.title": "TECH ASSESSMENT",
    "quiz.subtitle": "Discover the perfect solution for your company",
    "quiz.reset": "Start over",
    "quiz.question": "Question",
    "quiz.of": "of",
    "quiz.previous": "Previous",
    "quiz.next": "Next",
    "quiz.seeResult": "See my result",
    "quiz.processing": "Processing your answers...",
    "quiz.analyzing": "We are analyzing your technology profile",

    // Results and Form
    "results.title": "YOUR ANALYSIS",
    "results.subtitle": "Review your results and complete your information to receive the full report",
    "results.reset": "Start over",
    "results.score": "Your Technology Score",
    "results.level.initial": "Initial stages - Great opportunities for improvement",
    "results.level.developing": "Solid foundation - Key areas to optimize",
    "results.level.advanced": "Advanced level - On the right track",
    "results.level.exceptional": "Exceptional level - Congratulations!",
    "results.analysis": "Detailed Analysis",
    "results.error": "The report could not be generated. Please try again.",

    // Form
    "form.title": "GET YOUR COMPLETE REPORT",
    "form.subtitle": "Complete your information to receive the detailed analysis by email",
    "form.firstName": "First Name",
    "form.lastName": "Last Name",
    "form.phone": "Phone",
    "form.email": "Email",
    "form.terms":
      "I accept the Terms and Conditions and authorize the processing of my personal data to receive commercial information.",
    "form.submit": "GET COMPLETE REPORT",

    // Confirmation
    "confirmation.title": "PERFECT!",
    "confirmation.subtitle": "Your analysis has been successfully processed",
    "confirmation.reset": "Take a new assessment",
    "confirmation.completed": "Analysis Completed",
    "confirmation.message":
      "We have processed your technology assessment and sent the detailed report to your email. Our team of experts will review your profile and contact you with personalized recommendations.",
    "confirmation.processed": "Analysis Processed",
    "confirmation.processed.desc": "Your technology assessment has been completed",
    "confirmation.sent": "Report Sent",
    "confirmation.sent.desc": "Check your email for the detailed analysis",
    "confirmation.next": "Next Steps",
    "confirmation.next.desc": "Our team will contact you within the next 24 hours",
    "confirmation.cta.title": "Want to speed up the process?",
    "confirmation.cta.desc":
      "Schedule a free strategic consultation with our experts to discuss your technology roadmap immediately.",
    "confirmation.cta.button": "SCHEDULE FREE CONSULTATION",
    "confirmation.cta.footer": "30-minute consultation • No commitment • Personalized analysis",

    // Language Switcher
    "language.switch": "Español",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar el idioma desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("quiz_language")
      if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
        setLanguageState(savedLanguage as Language)
      }
    } catch (error) {
      console.error("Error al cargar idioma:", error)
    }
    setIsLoaded(true)
  }, [])

  // Guardar el idioma en localStorage cuando cambie
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    try {
      localStorage.setItem("quiz_language", newLanguage)
    } catch (error) {
      console.error("Error al guardar idioma:", error)
    }
  }

  // Función de traducción simple
  const t = (key: string): string => {
    if (!isLoaded) return key

    const translation = translations[language]?.[key as keyof (typeof translations)[typeof language]]
    return translation || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
