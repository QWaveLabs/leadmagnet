"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Mail, Phone, Send, Award, Sparkles, CheckCircle, RotateCcw, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import CalendlyModal from "./calendly-modal"

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">{t("results.title")}</h1>
          <p className="text-xl text-gray-400 font-medium">{t("results.subtitle")}</p>

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
            <Card className="bg-gray-900/50 border-gray-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm h-full min-h-[700px]">
              {/* Score Display */}
              <div className="flex flex-col items-center mb-6 p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-r from-[#FF4D00] to-[#FF6F3C] p-1">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      <div className="text-2xl font-bold text-white">
                        {score}
                        <span className="text-sm">/100</span>
                      </div>
                    </div>
                  </div>
                  <Award className="absolute -top-1 -right-1 w-6 h-6 text-[#FF4D00]" />
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-bold mb-2 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#FF4D00] mr-2" />
                    {t("results.score")}
                  </h3>
                  <p className="text-sm text-gray-300">{getLevelText()}</p>
                </div>
              </div>

              {/* Report HTML */}
              <div className="max-h-96 overflow-y-auto min-h-[700px]">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#FF4D00] mr-2" />
                  {t("results.analysis")}
                </h3>

                <div
                  className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: reportHTML || `<p>${t("results.error")}</p>`,
                  }}
                />
              </div>
            </Card>
          </motion.div>

                  <div className="text-center">
                  <Button
                    onClick={onOpenModal}
                    className="bg-gradient-to-r from-[#FF4D00] to-[#FF6F3C] hover:from-[#FF6F3C] hover:to-[#FF4D00] text-white font-bold text-lg px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    {t("confirmation.cta.button")}
                  </Button>
                   <h2 className="text-2xl font-bold mt-2">{t("form.separation")}</h2>
                </div>
          

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm h-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{t("form.title")}</h2>
                <p className="text-gray-400">{t("form.subtitle")}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="firstName" className="text-sm font-medium mb-2 block">
                      {t("form.firstName")} *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-10 rounded-lg focus:border-[#FF4D00] focus:ring-[#FF4D00]"
                        placeholder={t("form.firstName")}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Label htmlFor="lastName" className="text-sm font-medium mb-2 block">
                      {t("form.lastName")} *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-10 rounded-lg focus:border-[#FF4D00] focus:ring-[#FF4D00]"
                        placeholder={t("form.lastName")}
                        required
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Contact Fields */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                    {t("form.phone")} *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-10 rounded-lg focus:border-[#FF4D00] focus:ring-[#FF4D00]"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                    {t("form.email")} *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-10 rounded-lg focus:border-[#FF4D00] focus:ring-[#FF4D00]"
                      placeholder="tu@empresa.com"
                      required
                    />
                  </div>
                </motion.div>

                {/* Terms Checkbox */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-gray-700"
                >
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                    className="mt-0.5 border-gray-600 data-[state=checked]:bg-[#FF4D00] data-[state=checked]:border-[#FF4D00]"
                  />
                  <Label htmlFor="terms" className="text-xs text-gray-300 leading-relaxed cursor-pointer">
                    {t("form.terms")}
                  </Label>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    disabled={!isFormValid}
                    className="w-full bg-white text-black hover:bg-gray-200 font-bold text-sm h-12 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {t("form.submit")}
                  </Button>
                </motion.div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
