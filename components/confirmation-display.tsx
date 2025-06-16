"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, CheckCircle, Mail, Clock, RotateCcw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import React from "react"

interface ConfirmationDisplayProps {
  onOpenModal: () => void
  onReset: () => void
  reportHTML: string
}

const ConfirmationDisplay: React.FC<ConfirmationDisplayProps> = ({ onOpenModal, onReset, reportHTML }) => {
  const { t } = useLanguage()

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
            <CheckCircle className="w-20 h-20 text-[#FF4D00] mx-auto" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">{t("confirmation.title")}</h1>
          <p className="text-xl text-gray-400 font-medium">{t("confirmation.subtitle")}</p>

          {/* Botón de reset */}
          {onReset && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4">
              <Button
                onClick={onReset}
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("confirmation.reset")}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Confirmation Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">{t("confirmation.completed")}</h2>
              <p className="text-lg text-gray-300 leading-relaxed">{t("confirmation.message")}</p>
            </div>

            {/* Status Items */}
            <div className="space-y-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center p-4 bg-gray-800/30 rounded-xl"
              >
                <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">{t("confirmation.processed")}</h3>
                  <p className="text-sm text-gray-400">{t("confirmation.processed.desc")}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center p-4 bg-gray-800/30 rounded-xl"
              >
                <Mail className="w-6 h-6 text-[#FF4D00] mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">{t("confirmation.sent")}</h3>
                  <p className="text-sm text-gray-400">{t("confirmation.sent.desc")}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center p-4 bg-gray-800/30 rounded-xl"
              >
                <Clock className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">{t("confirmation.next")}</h3>
                  <p className="text-sm text-gray-400">{t("confirmation.next.desc")}</p>
                </div>
              </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="border-t border-gray-700 pt-8"
            >
              <div className="bg-gradient-to-r from-[#FF4D00]/10 to-[#FF6F3C]/10 rounded-xl p-6 border border-[#FF4D00]/20">
                <h3 className="text-xl font-bold mb-3 text-center">{t("confirmation.cta.title")}</h3>
                <p className="text-gray-300 mb-6 text-center">{t("confirmation.cta.desc")}</p>

                <div className="text-center">
                  <Button
                    onClick={onOpenModal}
                    className="bg-gradient-to-r from-[#FF4D00] to-[#FF6F3C] hover:from-[#FF6F3C] hover:to-[#FF4D00] text-white font-bold text-lg px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    {t("confirmation.cta.button")}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">{t("confirmation.cta.footer")}</p>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        <div className="actions">
          <button onClick={onOpenModal} className="btn-primary">
            {t("confirmation.cta.button")}
          </button>
          <button onClick={onReset} className="btn-secondary">
            {t("confirmation.reset")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDisplay
