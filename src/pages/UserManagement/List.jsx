import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Avatar, Input, Card, Typography, Popconfirm, message } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  MailOutlined,
  PhoneOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getUserList, blockUnblockUser, removeUser } from '../../api/services/UserService';
import useDebounce from '../../hooks/useDebounce';

const { Search } = Input;
const { Title } = Typography;

const UserList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 500);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await removeUser({ userId: id });
      if (response.success) {
        await fetchUserList();
        // Show the actual API response message if available, otherwise fallback
        message.success(
          (response.data && response.data.message) || 'User deleted successfully'
        );
      } else {
        message.error(response.error || (response.data && response.data.message) || 'Failed to delete user');
      }
    } catch (error) {
      message.error(
        (error.response && error.response.data && error.response.data.message) || error.message || 'Failed to delete user'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    navigate(`/user-management/edit/${user?.id}`, { state: { user } });
  };

  const handleView = (user) => {
    navigate(`/user-management/view/${user?.id}`, { state: { user } });
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            src={record.profile_image}
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
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => gender ? gender.charAt(0) + gender.slice(1).toLowerCase() : '-',
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => (
        <span>{[record.address, record.city, record.state, record.country, record.postal_code].filter(Boolean).join(', ')}</span>
      ),
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: 'No. of Bookings',
      dataIndex: ['_count', 'bookings'],
      key: 'bookings',
      render: (_, record) => record._count?.bookings ?? 0,
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) => (
        <Tag color={is_active ? 'success' : 'default'}>
          {is_active ? 'Active' : 'Inactive'}
        </Tag>
      ),
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Verified',
      dataIndex: 'is_verify',
      key: 'is_verify',
      render: (is_verify) => (
        <Tag color={is_verify ? 'blue' : 'default'}>
          {is_verify ? 'Verified' : 'Not Verified'}
        </Tag>
      ),
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: 'Joining Date',
      dataIndex: 'joining_date',
      key: 'joining_date',
      responsive: ['lg', 'xl'],
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            View
          </Button>

          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title={record.is_active ? 'Deactivate user' : 'Activate user'}
            description={`Are you sure you want to ${record.is_active ? 'deactivate' : 'activate'} this user?`}
            onConfirm={() => handleDeactivate(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger={record.is_active}
              size="small"
            >
              {record.is_active ? 'Deactivate' : 'Activate'}
            </Button>
          </Popconfirm>
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
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 180,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  ];

  // Add handlers for deactivate/ban (dummy for now)
  const handleDeactivate = async (user) => {
    setLoading(true);
    try {
      const response = await blockUnblockUser({ userId: user.id, isActive: !user.is_active });
      if (response.success) {
        await fetchUserList();
        message.success(`${user.is_active ? 'Deactivated' : 'Activated'} user: ${user.full_name}`);

      } else {
        message.error(response.error || 'Failed to update user status');
      }
    } catch (error) {
      message.error('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserList = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getUserList({
        search: debouncedSearch,
        page: params.page || pagination.current,
        limit: params.pageSize || pagination.pageSize,
      });
      if (response.success) {
        const apiData = response.data.data;
        setUsers(apiData.data || []);
        setPagination(prev => ({
          ...prev,
          total: apiData.total,
          current: apiData.page,
          pageSize: apiData.pageSize,
        }));
      } else {
        message.error(response.error);
      }
    } catch (error) {
      message.error('Failed to fetch user list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
    // eslint-disable-next-line
  }, [debouncedSearch, pagination.current, pagination.pageSize]);

  const handleTableChange = (pag) => {
    setPagination(prev => ({ ...prev, current: pag.current, pageSize: pag.pageSize }));
  };

  return (
    <div className="space-y-6">
      {/* Admin description */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <Title level={2} className="!mb-1 sm:!mb-2">User Management</Title>
          <div className="text-gray-500 text-sm sm:text-base">Manage and monitor user accounts</div>
        </div>

      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col gap-3 sm:gap-4">
          <Search
            placeholder="Search users..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            total: pagination.total,
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
            responsive: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: 600 }}
          size="small"
          className="[&_.ant-table]:text-xs [&_.ant-table]:sm:text-sm"
        />
      </Card>
    </div>
  );
};

export default UserList;