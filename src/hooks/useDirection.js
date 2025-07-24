import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const useDirection = () => {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState('ltr');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const currentLang = i18n.language;
    const newDirection = currentLang === 'ar' ? 'rtl' : 'ltr';
    const newIsRTL = currentLang === 'ar';
    
    setDirection(newDirection);
    setIsRTL(newIsRTL);
    
    // Update document attributes
    document.documentElement.setAttribute('dir', newDirection);
    document.documentElement.setAttribute('lang', currentLang);
    
    // Update body class for RTL styling
    if (newIsRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // Store in localStorage
    localStorage.setItem('direction', newDirection);
    localStorage.setItem('language', currentLang);
    
  }, [i18n.language]);

  return { direction, isRTL };
};

export default useDirection;