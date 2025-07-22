// Customizable theme configuration for Ant Design
export const themeColors = {
  // Primary brand colors
  primaryColor: '#06402B',
  primaryColorHover: '#40a9ff',
  primaryColorActive: '#096dd9',
  
  // Layout colors
  sidebarBg: '#F7F8F8',
  headerBg: '#ffffff',
  contentBg: '#f0f2f5',
  
  // Menu colors
  menuItemActiveBg: '#1890ff',
  menuItemHoverBg: 'rgba(255, 255, 255, 0.1)',
  menuTextColor: 'rgba(255, 255, 255, 0.85)',
  menuTextColorActive: '#ffffff',
  
  // Status colors
  successColor: '#52c41a',
  warningColor: '#faad14',
  errorColor: '#f5222d',
  infoColor: '#1890ff',
  
  // Text colors
  textColorPrimary: '#000000d9',
  textColorSecondary: '#00000073',
  textColorDisabled: '#00000040',
  
  // Border colors
  borderColor: '#d9d9d9',
  borderColorSplit: '#f0f0f0',
  
  // Background colors
  bgColorContainer: '#ffffff',
  bgColorElevated: '#ffffff',
  bgColorLayout: '#f5f5f5',
};

export const getAntdTheme = () => ({
  token: {
    colorPrimary: themeColors.primaryColor,
    colorSuccess: themeColors.successColor,
    colorWarning: themeColors.warningColor,
    colorError: themeColors.errorColor,
    colorInfo: themeColors.infoColor,
    colorTextBase: themeColors.textColorPrimary,
    colorBgBase: '#ffffff',
    colorBgContainer: themeColors.bgColorContainer,
    colorBgElevated: themeColors.bgColorElevated,
    colorBgLayout: themeColors.bgColorLayout,
    colorBorder: themeColors.borderColor,
    colorBorderSecondary: themeColors.borderColorSplit,
    borderRadius: 6,
    fontSize: 14,
    lineHeight: 1.5,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Layout: {
      siderBg: themeColors.sidebarBg,
      headerBg: themeColors.headerBg,
      bodyBg: themeColors.contentBg,
      headerHeight: 64,
      headerPadding: '0 24px',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: themeColors.menuItemActiveBg,
      itemHoverBg: themeColors.menuItemHoverBg,
      itemColor: themeColors.menuTextColor,
      itemSelectedColor: themeColors.menuTextColorActive,
      itemHoverColor: '#ffffff',
      iconSize: 16,  
    },
    Button: {
      borderRadius: 6,
      fontWeight: 500,
    },
    Table: {
      borderRadius: 8,
      headerBg: '#fafafa',
    },
    Card: {
      borderRadius: 8,
    },
    Input: {
      borderRadius: 6,
    },
  },
});

// Utility function to update theme colors dynamically
export const updateThemeColors = (newColors) => {
  Object.assign(themeColors, newColors);
};