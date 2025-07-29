"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, CheckCircle, Mail, Clock, RotateCcw, Award, Sparkles, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import React, { useEffect } from "react"

interface ConfirmationDisplayProps {
  onOpenModal: () => void
  onReset: () => void
  reportHTML: string
  score: number
  isLoadingScore: boolean
  isLoadingReport: boolean
}

const ConfirmationDisplay: React.FC<ConfirmationDisplayProps> = ({ onOpenModal, onReset, reportHTML, score, isLoadingScore, isLoadingReport }) => {
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

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 rounded-2xl shadow-xl h-full p-4 md:p-6">
              {/* Score Display */}
              <div className="flex flex-col items-center mb-6 p-4 bg-black rounded-xl border border-gray-800">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-400 p-1">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                      {isLoadingScore ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader2 className="w-5 h-5 text-purple-400" />
                        </motion.div>
                      ) : (
                        <div className="text-xl font-bold text-white">
                          {score}
                          <span className="text-xs">/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Award className="absolute -top-1 -right-1 w-5 h-5 text-purple-400" />
                </div>

                <div className="text-center">
                  <h3 className="text-base font-bold mb-2 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
                    Your AI Readiness Score
                  </h3>
                  <p className="text-xs text-gray-300">
                    {!isLoadingScore && (
                      score < 30 ? "Initial Level" :
                      score < 60 ? "Developing" :
                      score < 80 ? "Advanced" : "Exceptional"
                    )}
                  </p>
                </div>
              </div>

              {/* Report HTML */}
              <div className="w-full">
                <h3 className="text-base md:text-lg font-bold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-purple-400 mr-2" />
                  Your Analysis
                </h3>

                {isLoadingReport ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="mb-4"
                    >
                      <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                    </motion.div>
                    <p className="text-gray-400 text-sm font-semibold">
                      Generating your report...
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-100 font-sans text-sm leading-relaxed">
                    {reportHTML ? (
                      <ReportFormatter report={reportHTML} />
                    ) : (
                      <p className="text-gray-400">Your detailed report has been sent to your email.</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Confirmation Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 rounded-2xl shadow-xl h-full p-4 md:p-6">
              {/* CTA Section at the top */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-purple-600/10 to-purple-400/10 rounded-xl p-4 border border-purple-400/20">
                  <h3 className="text-lg font-bold mb-2 text-center">{t("confirmation.cta.title")}</h3>
                  <p className="text-gray-300 mb-4 text-center text-sm">{t("confirmation.cta.desc")}</p>
                  <div className="text-center">
                    <a
                      href="https://qwavelabs.io/consultation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-400 hover:to-purple-600 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 w-full"
                    >
                      <Calendar className="w-4 h-4 mr-2 text-purple-300" />
                      {t("confirmation.cta.button")}
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-3">{t("confirmation.cta.footer")}</p>
                </div>
              </div>
              
              {/* Analysis Completed Box */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-3">{t("confirmation.completed")}</h2>
                <p className="text-sm text-gray-300 leading-relaxed">{t("confirmation.message")}</p>
              </div>

              {/* Status Items */}
              <div className="space-y-3 mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center p-3 bg-gray-800/30 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm">{t("confirmation.processed")}</h3>
                    <p className="text-xs text-gray-400">{t("confirmation.processed.desc")}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center p-3 bg-gray-800/30 rounded-xl"
                >
                  <Mail className="w-5 h-5 text-[#FF4D00] mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm">{t("confirmation.sent")}</h3>
                    <p className="text-xs text-gray-400">{t("confirmation.sent.desc")}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center p-3 bg-gray-800/30 rounded-xl"
                >
                  <Clock className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm">{t("confirmation.next")}</h3>
                    <p className="text-xs text-gray-400">{t("confirmation.next.desc")}</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Take Another Assessment Button */}
              <div className="text-center">
                <Button
                  onClick={onReset}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white w-full text-sm px-6 py-3"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("confirmation.reset")}
                </Button>
              </div>
            </Card>
          </motion.div>
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

export default ConfirmationDisplay
