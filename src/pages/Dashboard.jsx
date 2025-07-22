import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Button, Divider } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: 1128,
      prefix: <UserOutlined />,
      suffix: <ArrowUpOutlined style={{ color: '#3f8600' }} />,
      valueStyle: { color: '#3f8600' },
    },
    {
      title: 'Active Sessions',
      value: 893,
      prefix: <TeamOutlined />,
      suffix: <ArrowUpOutlined style={{ color: '#3f8600' }} />,
      valueStyle: { color: '#3f8600' },
    },
    {
      title: 'Orders',
      value: 234,
      prefix: <ShoppingCartOutlined />,
      suffix: <ArrowDownOutlined style={{ color: '#cf1322' }} />,
      valueStyle: { color: '#cf1322' },
    },
    {
      title: 'Revenue',
      value: 11280,
      prefix: <DollarOutlined />,
      suffix: <ArrowUpOutlined style={{ color: '#3f8600' }} />,
      valueStyle: { color: '#3f8600' },
      precision: 2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-4 sm:mb-6">
        <Title level={2} className="!mb-2">Dashboard</Title>
        <Text type="secondary" className="text-sm sm:text-base">
          Welcome to your admin dashboard. Here's an overview of your system.
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[12, 12]} className="mb-4 sm:mb-6">
        {stats.map((stat, index) => (
          <Col xs={12} sm={12} md={6} key={index}>
            <Card className="text-center sm:text-left">
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={stat.precision}
                valueStyle={stat.valueStyle}
                prefix={stat.prefix}
                suffix={stat.suffix}
                className="[&_.ant-statistic-title]:text-xs [&_.ant-statistic-title]:sm:text-sm [&_.ant-statistic-content-value]:text-lg [&_.ant-statistic-content-value]:sm:text-2xl"
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Row gutter={[12, 12]}>
        <Col xs={24} lg={14} xl={16}>
          <Card title="Recent Activity" className="h-full">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded gap-2">
                <Space className="flex-1">
                  <UserOutlined className="text-blue-500" />
                  <div>
                    <Text strong className="text-sm sm:text-base">New user registered</Text>
                    <div>
                      <Text type="secondary" className="text-xs sm:text-sm break-all">sarah.wilson@example.com</Text>
                    </div>
                  </div>
                </Space>
                <Text type="secondary" className="text-xs sm:text-sm whitespace-nowrap">2 min ago</Text>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded gap-2">
                <Space className="flex-1">
                  <ShoppingCartOutlined className="text-green-500" />
                  <div>
                    <Text strong className="text-sm sm:text-base">Order completed</Text>
                    <div>
                      <Text type="secondary" className="text-xs sm:text-sm">Order #12345</Text>
                    </div>
                  </div>
                </Space>
                <Text type="secondary" className="text-xs sm:text-sm whitespace-nowrap">15 min ago</Text>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded gap-2">
                <Space className="flex-1">
                  <TeamOutlined className="text-purple-500" />
                  <div>
                    <Text strong className="text-sm sm:text-base">User updated profile</Text>
                    <div>
                      <Text type="secondary" className="text-xs sm:text-sm break-all">john.doe@example.com</Text>
                    </div>
                  </div>
                </Space>
                <Text type="secondary" className="text-xs sm:text-sm whitespace-nowrap">1 hr ago</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10} xl={8}>
          <Card title="Quick Actions" className="h-full">
            <div className="grid grid-cols-1 gap-3">
              <Button type="primary" block size="large" className="h-12">
                <UserOutlined />
                <span className="ml-2">Add New User</span>
              </Button>
              <Button block size="large" className="h-12">
                <TeamOutlined />
                <span className="ml-2">Manage Roles</span>
              </Button>
              <Button block size="large" className="h-12">
                <ShoppingCartOutlined />
                <span className="ml-2">View Orders</span>
              </Button>
              <Button block size="large" className="h-12">
                <PlusOutlined />
                <span className="ml-2">Generate Report</span>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* System Status */}
      <Card title="System Status" className="mt-4 sm:mt-6">
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={8} className="mb-4 sm:mb-0">
            <div className="text-center p-3 sm:p-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 sm:mb-3"></div>
              <Text strong className="text-sm sm:text-base">Database</Text>
              <div><Text type="secondary" className="text-xs sm:text-sm">Operational</Text></div>
            </div>
          </Col>
          <Col xs={24} sm={8} className="mb-4 sm:mb-0">
            <div className="text-center p-3 sm:p-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 sm:mb-3"></div>
              <Text strong className="text-sm sm:text-base">API Server</Text>
              <div><Text type="secondary" className="text-xs sm:text-sm">Operational</Text></div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="text-center p-3 sm:p-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2 sm:mb-3"></div>
              <Text strong className="text-sm sm:text-base">Cache Server</Text>
              <div><Text type="secondary" className="text-xs sm:text-sm">Maintenance</Text></div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard;