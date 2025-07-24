import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space, Typography, Modal } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  UserOutlined,
  EditOutlined,
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { themeColors } from '../../theme/theme';
import FrameLogo from '../../../public/images/Frame.png';
import masterStore from '../../store/masterStore';
import LanguageSwitcher from '../LanguageSwitcher';
import useDirection from '../../hooks/useDirection';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  const currentUser = masterStore((state) => state.user)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Menu items for navigation
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: t('navigation.dashboard'),
    },
    {
      key: '/user-management',
      icon: <UserOutlined />,
      label: t('navigation.userManagement'),
      children: [
        {
          key: '/user-management/list',
          label: t('navigation.userList'),
        },
      ],
    },
  ];

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'edit-profile',
      icon: <EditOutlined />,
      label: t('navigation.editProfile'),
      onClick: () => navigate('/profile/edit'),
    },
    {
      key: 'change-password',
      icon: <LockOutlined />,
      label: t('navigation.changePassword'),
      onClick: () => navigate('/profile/change-password'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('common.logout'),
      onClick: () => {
        Modal.confirm({
          title: t('messages.confirmLogout'),
          okText: t('common.yes'),
          cancelText: t('common.no'),
          onOk: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            masterStore.getState().clearToken();
            masterStore.getState().clearUser();
            navigate('/auth/login');
          },
        });
      },
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    // Auto-close sidebar on mobile after navigation
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const fullName = ` ${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim() || 'John Doe'; ``

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={256}
        collapsedWidth={isMobile ? 0 : 64}
        style={{
          background: themeColors.sidebarBg,
          position: 'fixed', // Always fixed
          minHeight: '100vh',
          left: isRTL ? 'auto' : 0,
          right: isRTL ? 0 : 'auto',
          top: 0,
          bottom: 0,
          zIndex: isMobile ? 1001 : 'auto',
          transition: 'all 0.2s',
        }}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          setIsMobile(broken);
          setCollapsed(broken);
        }}
      >
        <div className="p-3 sm:p-4 text-center border-b border-gray-700">
          {collapsed ? (
            <img src={FrameLogo} alt="Tawlity Logo" className="mx-auto" style={{ height: 20, width: 'auto' }} />
          ) : (
            <img src={FrameLogo} alt="Tawlity Logo" className="mx-auto" style={{ height: 30, width: 'auto' }} />
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['/user-management']}
          style={{ background: themeColors.sidebarBg, color: themeColors.menuTextColor }}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      {/* Main layout shifted right to make space for fixed sidebar */}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : (isRTL ? 0 : (collapsed ? 64 : 256)),
          marginRight: isMobile ? 0 : (isRTL ? (collapsed ? 64 : 256) : 0),
          transition: 'margin 0.2s',
        }}
      >
        <Header
          style={{
            background: themeColors.headerBg,
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
          className="flex items-center justify-between"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 40,
              height: 64,
            }}
          />

          <Space className="hidden sm:flex" direction={isRTL ? 'rtl' : 'ltr'}>
            <LanguageSwitcher size="small" />
            <Text strong className="hidden md:inline">{t('common.welcome')} {fullName}</Text>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button type="text" className="flex items-center gap-1 sm:gap-2 px-1 sm:px-3">
                <Avatar
                  size={28}
                  style={{ backgroundColor: themeColors.primaryColor }}
                  icon={<UserOutlined />}
                  className="sm:w-8 sm:h-8"
                />
                <Text className="hidden sm:inline">{fullName}</Text>
              </Button>
            </Dropdown>
          </Space>

          {/* Mobile User Menu */}
          <div className="sm:hidden">
            <Space size="small">
              <LanguageSwitcher size="small" showIcon={false} />
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button type="text" className="flex items-center px-2">
                <Avatar
                  size={28}
                  style={{ backgroundColor: themeColors.primaryColor }}
                  icon={<UserOutlined />}
                />
              </Button>
            </Dropdown>
            </Space>
          </div>
        </Header>

        <Content
          style={{
            padding: '24px',
            background: themeColors.bgColorContainer,
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      {/* Mobile overlay */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          style={{ zIndex: 1000 }}
          onClick={() => setCollapsed(true)}
        />
      )}
    </Layout>
  );
};

export default AppLayout;