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
import { useTranslation } from 'react-i18next';
import { getUserList, blockUnblockUser, removeUser } from '../../api/services/UserService';
import useDebounce from '../../hooks/useDebounce';

const { Search } = Input;
const { Title } = Typography;

const UserList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      title: t('userManagement.fullName'),
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
      title: t('userManagement.gender'),
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => gender ? gender.charAt(0) + gender.slice(1).toLowerCase() : '-',
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: t('userManagement.address'),
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => (
        <span>{[record.address, record.city, record.state, record.country, record.postal_code].filter(Boolean).join(', ')}</span>
      ),
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: t('userManagement.bookings'),
      dataIndex: ['_count', 'bookings'],
      key: 'bookings',
      render: (_, record) => record._count?.bookings ?? 0,
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: t('userManagement.status'),
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) => (
        <Tag color={is_active ? 'success' : 'default'}>
          {is_active ? t('common.active') : t('common.inactive')}
        </Tag>
      ),
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: t('userManagement.verified'),
      dataIndex: 'is_verify',
      key: 'is_verify',
      render: (is_verify) => (
        <Tag color={is_verify ? 'blue' : 'default'}>
          {is_verify ? t('common.verified') : t('common.notVerified')}
        </Tag>
      ),
      responsive: ['md', 'lg', 'xl'],
    },
    {
      title: t('userManagement.joiningDate'),
      dataIndex: 'joining_date',
      key: 'joining_date',
      responsive: ['lg', 'xl'],
    },
    {
      title: t('userManagement.actions'),
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
            {t('common.view')}
          </Button>

          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            {t('common.edit')}
          </Button>
          <Popconfirm
            title={record.is_active ? t('userManagement.deactivateUser') : t('userManagement.activateUser')}
            description={record.is_active ? t('userManagement.confirmDeactivate') : t('userManagement.confirmActivate')}
            onConfirm={() => handleDeactivate(record)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button
              type="text"
              danger={record.is_active}
              size="small"
            >
              {record.is_active ? t('userManagement.deactivate') : t('userManagement.activate')}
            </Button>
          </Popconfirm>
          <Popconfirm
            title={t('userManagement.deleteUser')}
            description={t('userManagement.confirmDelete')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              {t('userManagement.remove')}
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
        message.success(`${user.is_active ? t('userManagement.userDeactivated') : t('userManagement.userActivated')}: ${user.full_name}`);

      } else {
        message.error(response.error || t('messages.failedToUpdate'));
      }
    } catch (error) {
      message.error(t('messages.failedToUpdate'));
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
          <Title level={2} className="!mb-1 sm:!mb-2">{t('userManagement.title')}</Title>
          <div className="text-gray-500 text-sm sm:text-base">{t('userManagement.description')}</div>
        </div>

      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col gap-3 sm:gap-4">
          <Search
            placeholder={t('userManagement.searchUsers')}
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
              `${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('common.users')}`,
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