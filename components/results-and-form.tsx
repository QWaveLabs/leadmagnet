"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Mail, Phone, Send, Award, Sparkles, CheckCircle, RotateCcw, Calendar, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface ResultsAndFormProps {
  score: number | null
  reportHTML: string
  onSubmit: (data: any) => void
  onReset: () => void
  isLoadingScore: boolean
  isLoadingReport: boolean
}

export default function ResultsAndForm({ score, reportHTML, onSubmit, onReset, isLoadingScore, isLoadingReport }: ResultsAndFormProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "+1",
    email: "",
    acceptTerms: false,
  })
  
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onOpenModal = () => setIsModalOpen(true)

  // Cargar datos del formulario desde localStorage
  useEffect(() => {
    try {
      const savedFormData = localStorage.getItem("quiz_form_data")
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData)
        setFormData(parsedData)
      }
    } catch (error) {
      console.error("Error al cargar datos del formulario:", error)
    }
  }, [])

  // Guardar datos del formulario en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem("quiz_form_data", JSON.stringify(formData))
    } catch (error) {
      console.error("Error al guardar datos del formulario:", error)
    }
  }, [formData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.acceptTerms) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const isFormValid =
    formData.firstName && formData.lastName && formData.phone && formData.email && formData.acceptTerms

  const getLevelText = () => {
    if (score === null) return ""
    if (score < 30) return t("results.level.initial")
    if (score < 60) return t("results.level.developing")
    if (score < 80) return t("results.level.advanced")
    return t("results.level.exceptional")
  }

  // Animated loading messages for report
  const loadingMessages = [t("results.loading"), "Almost there...", "Just one sec..."];
  const [loadingIndex, setLoadingIndex] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);
  // Post height to parent for iframe resizing
  useEffect(() => {
    function postHeight() {
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'iframeHeight', height: document.body.scrollHeight }, '*');
      }
    }
    postHeight();
    window.addEventListener('resize', postHeight);
    return () => window.removeEventListener('resize', postHeight);
  }, []);
  useEffect(() => {
    if (!isLoadingReport) {
      setTimeout(() => {
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'iframeHeight', height: document.body.scrollHeight }, '*');
        }
      }, 300);
    }
  }, [isLoadingReport, reportHTML]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Botón de reset */}
          {onReset && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4">
              <Button
                onClick={onReset}
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("results.reset")}
              </Button>
            </motion.div>
          )}
          
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols gap-8">
          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-black border-gray-800 rounded-2xl p-6 shadow-xl h-full min-h-[700px]">
              {/* Score Display */}
              <div className="flex flex-col items-center mb-6 p-4 bg-black rounded-xl border border-gray-800">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-400 p-1">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      {isLoadingScore ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-6 h-6 text-purple-400" />
                        </motion.div>
                      ) : (
                        <div className="text-2xl font-bold text-white">
                          {score}
                          <span className="text-sm">/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Award className="absolute -top-1 -right-1 w-6 h-6 text-purple-400" />
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-bold mb-2 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
                    {t("results.score")}
                  </h3>
                  <p className="text-sm text-gray-300">{!isLoadingScore && getLevelText()}</p>
                </div>
              </div>

              {/* Report HTML */}
              <div ref={reportRef} className="w-full md:max-w-3xl md:mx-auto min-h-[700px]">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-purple-400 mr-2" />
                  {t("results.analysis")}
                </h3>

                {isLoadingReport ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mb-4"
                    >
                      <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                    </motion.div>
                    <p className="text-gray-400 text-lg font-semibold mb-2 min-h-[2.5rem] transition-all duration-500">
                      {loadingMessages[loadingIndex]}
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-100 font-sans text-base leading-relaxed whitespace-pre-line">
                    {reportHTML
                      ? <ReportFormatter report={reportHTML} />
                      : <p>{t("results.error")}</p>}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          <div className="flex flex-col gap-4 justify-center items-center mt-6 w-full md:max-w-md md:mx-auto">
            <a
              href="https://qwavelabs.io/consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-400 hover:to-purple-600 text-white font-bold text-base md:text-lg px-4 py-2 md:px-8 md:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 w-full mx-auto"
            >
              <Calendar className="w-5 h-5 mr-2 md:mr-3 text-purple-300" />
              {t("confirmation.cta.button")}
            </a>
            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white text-base md:text-lg px-4 py-2 md:px-8 md:py-3"
              onClick={onOpenModal}
            >
              <Send className="w-4 h-4 mr-2" />
              {t("form.submit")}
            </Button>
          </div>
          <ModalForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} isFormValid={isFormValid} t={t} />
        </div>
      </div>
    </div>
  )
}

// Helper component to format plain text or simple HTML into readable blocks
function ReportFormatter({ report }: { report: string }) {
  // If the report is HTML, render as HTML. If plain text, split into paragraphs and lists.
  const isHTML = /<\w+.*?>/.test(report)
  if (isHTML) {
    return <div dangerouslySetInnerHTML={{ __html: report }} />
  }
  // Otherwise, format plain text
  const paragraphs = report.split(/\n{2,}/).map((para, idx) => para.trim()).filter(Boolean)
  return (
    <div>
      {paragraphs.map((para, idx) => {
        // Bold headings (lines ending with : or all caps)
        if (/^[A-Z\s]+:|^([A-Z][a-z]+\s*){1,3}:$/.test(para) || /^[A-Z\s]+$/.test(para)) {
          return <p key={idx} className="mb-4 font-bold text-purple-300">{para}</p>
        }
        // If looks like a list, render as ul
        if (/^[-*•0-9]/.test(para)) {
          const items = para.split(/\n/).map(line => line.replace(/^[-*•0-9.]+\s*/, '').trim()).filter(Boolean)
          return <ul key={idx} className="list-disc pl-6 mb-4">{items.map((item, i) => <li key={i} className="mb-1">{item}</li>)}</ul>
        }
        // Highlight key phrases
        let formatted = para.replace(/(Recommendation|Summary|Key Takeaways|Conclusion|Important|Next Steps|Action Items)/gi, match => `<span class='font-bold text-purple-400'>${match}</span>`)
        return <p key={idx} className="mb-4" dangerouslySetInnerHTML={{ __html: formatted }} />
      })}
    </div>
  )
}

// ModalForm component
function ModalForm({ isOpen, onClose, formData, handleInputChange, handleSubmit, isFormValid, t }: any) {
  const [submitting, setSubmitting] = useState(false);
  if (!isOpen) return null;
  const onModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !isFormValid) return;
    setSubmitting(true);
    handleSubmit(e);
    setTimeout(() => setSubmitting(false), 2000); // re-enable after 2s in case of error
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        <h2 className="text-2xl font-bold mb-2 text-white">{t("form.title")}</h2>
        <p className="text-gray-400 mb-4">{t("form.subtitle")}</p>
        <form onSubmit={onModalSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium mb-2 block">
                {t("form.firstName")} *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={e => handleInputChange("firstName", e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-10 rounded-lg focus:border-purple-400 focus:ring-purple-400"
                  placeholder={t("form.firstName")}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium mb-2 block">
                {t("form.lastName")} *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={e => handleInputChange("lastName", e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-10 rounded-lg focus:border-purple-400 focus:ring-purple-400"
                  placeholder={t("form.lastName")}
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
              {t("form.phone")} *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={e => handleInputChange("phone", e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-10 rounded-lg focus:border-purple-400 focus:ring-purple-400"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium mb-2 block">
              {t("form.email")} *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleInputChange("email", e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-10 rounded-lg focus:border-purple-400 focus:ring-purple-400"
                placeholder="tu@empresa.com"
                required
              />
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-700">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={checked => handleInputChange("acceptTerms", checked as boolean)}
              className="mt-0.5 border-gray-600 data-[state=checked]:bg-purple-400 data-[state=checked]:border-purple-400"
            />
            <Label htmlFor="terms" className="text-xs text-gray-300 leading-relaxed cursor-pointer">
              {t("form.terms")}
            </Label>
          </div>
          <Button
            type="submit"
            disabled={!isFormValid || submitting}
            className="w-full bg-white text-black hover:bg-gray-200 font-bold text-sm h-12 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <Send className="w-4 h-4 mr-2" />
            {submitting ? "Sending report..." : t("form.submit")}
          </Button>
        </form>
      </div>
    </div>
  )
}
