import React, { useState } from 'react';
import { Table, Button, Space, Tag, Avatar, Input, Card, Typography, Popconfirm, message } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Title } = Typography;

const UserList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample data - in real app, this would come from API
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8900',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-15 10:30 AM',
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1 234 567 8901',
      role: 'User',
      status: 'active',
      lastLogin: '2024-01-15 09:45 AM',
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '+1 234 567 8902',
      role: 'Moderator',
      status: 'inactive',
      lastLogin: '2024-01-14 03:20 PM',
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+1 234 567 8903',
      role: 'User',
      status: 'active',
      lastLogin: '2024-01-15 11:15 AM',
    },
    {
      id: '5',
      name: 'David Johnson',
      email: 'david.johnson@example.com',
      phone: '+1 234 567 8904',
      role: 'User',
      status: 'active',
      lastLogin: '2024-01-14 08:30 AM',
    },
  ]);

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
    message.success('User deleted successfully');
  };

  const handleEdit = (user) => {
    message.info(`Edit user: ${user.name}`);
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            src={record.avatar}
            style={{ backgroundColor: '#1890ff' }}
            icon={<UserOutlined />}
          />
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="flex items-center text-gray-500 text-sm">
              <MailOutlined className="mr-1" />
              {record.email}
            </div>
          </div>
        </div>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <div className="flex items-center text-gray-600">
          <PhoneOutlined className="mr-1" />
          {phone}
        </div>
      ),
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const color = role === 'Admin' ? 'red' : role === 'Moderator' ? 'blue' : 'green';
        return <Tag color={color}>{role}</Tag>;
      },
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      responsive: ['lg', 'xl'],
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete user"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 120,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.role.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <Title level={2} className="!mb-1 sm:!mb-2">User Management</Title>
          <div className="text-gray-500 text-sm sm:text-base">Manage and monitor user accounts</div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/user-management/create')}
          size="large" 
          className="w-full sm:w-auto"
        >
          Add New User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col gap-3 sm:gap-4">
          <Search
            placeholder="Search users..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large" 
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
            responsive: true,
          }}
          scroll={{ x: 600 }}
          size="small"
          className="[&_.ant-table]:text-xs [&_.ant-table]:sm:text-sm"
        />
      </Card>
    </div>
  );
};

export default UserList;