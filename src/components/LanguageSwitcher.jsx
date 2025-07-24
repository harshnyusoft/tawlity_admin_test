import React from 'react';
import { Select, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const LanguageSwitcher = ({ size = 'middle', showIcon = true, style = {} }) => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    
    // Update document direction and language
    const isRTL = language === 'ar';
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    
    // Store language preference
    localStorage.setItem('language', language);
    localStorage.setItem('direction', isRTL ? 'rtl' : 'ltr');
    
    // Force re-render of Ant Design components for RTL
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  };

  const languages = [
    {
      code: 'en',
      name: t('common.english'),
      flag: '🇺🇸'
    },
    {
      code: 'ar',
      name: t('common.arabic'),
      flag: '🇸🇦'
    }
  ];

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      size={size}
      style={{ minWidth: 120, ...style }}
      suffixIcon={showIcon ? <GlobalOutlined /> : null}
      dropdownMatchSelectWidth={false}
    >
      {languages.map((lang) => (
        <Option key={lang.code} value={lang.code}>
          <Space>
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </Space>
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSwitcher;