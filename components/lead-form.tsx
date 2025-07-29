"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Mail, Phone, Send, FileText, RotateCcw, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface LeadFormProps {
  onSubmit: (data: any) => void
  onReset: () => void
  isLoading: boolean
}

export default function LeadForm({ onSubmit, onReset, isLoading }: LeadFormProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "+1",
    email: "",
    acceptTerms: false,
  })

  // Load form data from localStorage
  useEffect(() => {
    try {
      const savedFormData = localStorage.getItem("quiz_form_data")
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData)
        setFormData(parsedData)
      }
    } catch (error) {
      console.error("Error loading form data:", error)
    }
  }, [])

  // Save form data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("quiz_form_data", JSON.stringify(formData))
    } catch (error) {
      console.error("Error saving form data:", error)
    }
  }, [formData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.acceptTerms && !isLoading) {
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
    formData.firstName && 
    formData.lastName && 
    formData.phone && 
    formData.email && 
    formData.acceptTerms

  return (
    <div className="min-h-screen flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {onReset && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3 }} 
              className="mb-6"
            >
              <Button
                onClick={onReset}
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
                disabled={isLoading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("quiz.reset")}
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <FileText className="w-16 h-16 text-purple-400 mx-auto" />
          </motion.div>
          
          <h1 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
            Get Your Detailed AI Readiness Report
          </h1>
          <p className="text-sm md:text-lg text-gray-400 font-medium max-w-lg mx-auto">
            Enter your information below to receive your personalized analysis and detailed recommendations via email.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 rounded-2xl p-4 md:p-8 shadow-xl backdrop-blur-sm">
            {isLoading ? (
              <div className="text-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <Loader2 className="w-16 h-16 text-purple-400" />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">Generating Your Report</h3>
                <p className="text-gray-400 text-sm md:text-lg">
                  We're analyzing your responses and creating your personalized AI readiness report...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium mb-2 block">
                      First Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-12 rounded-lg focus:border-purple-400 focus:ring-purple-400"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium mb-2 block">
                      Last Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-12 rounded-lg focus:border-purple-400 focus:ring-purple-400"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-12 rounded-lg focus:border-purple-400 focus:ring-purple-400"
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-12 rounded-lg focus:border-purple-400 focus:ring-purple-400"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-700 bg-gray-800/20">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                    className="mt-0.5 border-gray-600 data-[state=checked]:bg-purple-400 data-[state=checked]:border-purple-400"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed cursor-pointer">
                    I agree to receive my AI readiness report and occasional updates about AI automation opportunities via email. 
                    I can unsubscribe at any time.
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white font-bold text-lg px-8 py-4 h-14 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <Send className="w-5 h-5 mr-3" />
                  Get My Detailed Report via Email
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Your report will be generated and sent to your email within a few minutes.
                </p>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}