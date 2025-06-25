"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, CheckCircle, Mail, Clock, RotateCcw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import React, { useEffect } from "react"

interface ConfirmationDisplayProps {
  onOpenModal: () => void
  onReset: () => void
  reportHTML: string
}

const ConfirmationDisplay: React.FC<ConfirmationDisplayProps> = ({ onOpenModal, onReset, reportHTML }) => {
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <CheckCircle className="w-20 h-20 text-purple-400 mx-auto" />
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{t("confirmation.title")}</h1>
          <p className="text-base md:text-xl text-gray-400 font-medium">{t("confirmation.subtitle")}</p>
        </motion.div>

        {/* Confirmation Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 rounded-2xl p-4 md:p-8 shadow-xl backdrop-blur-sm text-sm md:text-base">
            {/* CTA Section at the top */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-purple-600/10 to-purple-400/10 rounded-xl p-4 md:p-6 border border-purple-400/20">
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-center">{t("confirmation.cta.title")}</h3>
                <p className="text-gray-300 mb-4 md:mb-6 text-center">{t("confirmation.cta.desc")}</p>
                <div className="text-center">
                  <a
                    href="https://qwavelabs.io/consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-400 hover:to-purple-600 text-white font-bold text-base md:text-lg px-4 py-2 md:px-8 md:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 w-full max-w-xs md:max-w-full mx-auto"
                  >
                    <Calendar className="w-5 h-5 mr-2 md:mr-3 text-purple-300" />
                    {t("confirmation.cta.button")}
                  </a>
                </div>
                <p className="text-xs text-gray-500 text-center mt-3 md:mt-4">{t("confirmation.cta.footer")}</p>
              </div>
            </div>
            {/* Analysis Completed Box */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{t("confirmation.completed")}</h2>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">{t("confirmation.message")}</p>
            </div>

            {/* Status Items */}
            <div className="space-y-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center p-3 md:p-4 bg-gray-800/30 rounded-xl"
              >
                <CheckCircle className="w-6 h-6 text-purple-400 mr-3 md:mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">{t("confirmation.processed")}</h3>
                  <p className="text-xs md:text-sm text-gray-400">{t("confirmation.processed.desc")}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center p-3 md:p-4 bg-gray-800/30 rounded-xl"
              >
                <Mail className="w-6 h-6 text-[#FF4D00] mr-3 md:mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">{t("confirmation.sent")}</h3>
                  <p className="text-xs md:text-sm text-gray-400">{t("confirmation.sent.desc")}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center p-3 md:p-4 bg-gray-800/30 rounded-xl"
              >
                <Clock className="w-6 h-6 text-blue-500 mr-3 md:mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">{t("confirmation.next")}</h3>
                  <p className="text-xs md:text-sm text-gray-400">{t("confirmation.next.desc")}</p>
                </div>
              </motion.div>
            </div>
            {/* Take Another Assessment Button at the bottom */}
            <div className="text-center mt-6">
              <Button
                onClick={onReset}
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white w-full max-w-xs md:max-w-md mx-auto text-base md:text-lg px-4 py-2 md:px-8 md:py-3"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("confirmation.reset")}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ConfirmationDisplay
