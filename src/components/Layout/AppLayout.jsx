import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space, Typography } from 'antd';
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
import { themeColors } from '../../theme/theme';
import FrameLogo from '../../../public/images/Frame.png';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
      label: 'Dashboard',
    },
    {
      key: '/user-management',
      icon: <UserOutlined />,
      label: 'User Management',
      children: [
        {
          key: '/user-management/list',
          label: 'User List',
        },
        {
          key: '/user-management/create',
          label: 'Add User',
        },
      ],
    },
  ];

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'edit-profile',
      icon: <EditOutlined />,
      label: 'Edit Profile',
      onClick: () => navigate('/profile/edit'),
    },
    {
      key: 'change-password',
      icon: <LockOutlined />,
      label: 'Change Password',
      onClick: () => navigate('/profile/change-password'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {
        // Handle logout logic here
        console.log('Logging out...');
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
          left: 0,
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
          marginLeft: isMobile ? 0 : (collapsed ? 64 : 256),
          transition: 'margin-left 0.2s',
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

          <Space className="hidden sm:flex">
            <Text strong className="hidden md:inline">Welcome back, John Doe</Text>
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
                <Text className="hidden sm:inline">John Doe</Text>
              </Button>
            </Dropdown>
          </Space>

          {/* Mobile User Menu */}
          <div className="sm:hidden">
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