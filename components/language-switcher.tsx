"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

interface LanguageSwitcherProps {
  onLanguageChange: (lang: string) => void;
  currentLanguage: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  onLanguageChange, 
  currentLanguage 
}) => {
  const { t } = useLanguage()

  const toggleLanguage = () => {
    const newLang = currentLanguage === "en" ? "es" : "en"
    onLanguageChange(newLang)
  }

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="fixed top-4 right-4 z-50 bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800 hover:text-white backdrop-blur-sm"
    >
      <Globe className="w-4 h-4 mr-2" />
      {t("language.switch")}
    </Button>
  )
}

export default LanguageSwitcher