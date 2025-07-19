import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import UserProfileModal from './components/UserProfileModal';
import AddUserModal from './components/AddUserModal';
import MobileUserCard from './components/MobileUserCard';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Mock data
  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+91-9876543210',
      role: 'admin',
      department: 'admin',
      status: 'active',
      lastLogin: new Date(Date.now() - 300000),
      projects: ['Skyline Residences', 'Marina Heights']
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@company.com',
      phone: '+91-9876543211',
      role: 'project_manager',
      department: 'sales',
      status: 'active',
      lastLogin: new Date(Date.now() - 600000),
      projects: ['Skyline Residences', 'Garden View Apartments']
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit.patel@company.com',
      phone: '+91-9876543212',
      role: 'sales_executive',
      department: 'sales',
      status: 'active',
      lastLogin: new Date(Date.now() - 1800000),
      projects: ['Marina Heights', 'Downtown Plaza']
    },
    {
      id: 4,
      name: 'Neha Joshi',
      email: 'neha.joshi@company.com',
      phone: '+91-9876543213',
      role: 'sales_executive',
      department: 'sales',
      status: 'active',
      lastLogin: new Date(Date.now() - 3600000),
      projects: ['Skyline Residences']
    },
    {
      id: 5,
      name: 'Rohit Singh',
      email: 'rohit.singh@company.com',
      phone: '+91-9876543214',
      role: 'telecaller',
      department: 'sales',
      status: 'active',
      lastLogin: new Date(Date.now() - 7200000),
      projects: ['Marina Heights', 'Garden View Apartments']
    },
    {
      id: 6,
      name: 'Kavita Reddy',
      email: 'kavita.reddy@company.com',
      phone: '+91-9876543215',
      role: 'telecaller',
      department: 'sales',
      status: 'inactive',
      lastLogin: new Date(Date.now() - 86400000),
      projects: ['Downtown Plaza']
    },
    {
      id: 7,
      name: 'Suresh Gupta',
      email: 'suresh.gupta@company.com',
      phone: '+91-9876543216',
      role: 'sales_executive',
      department: 'marketing',
      status: 'active',
      lastLogin: new Date(Date.now() - 172800000),
      projects: ['Skyline Residences', 'Marina Heights', 'Garden View Apartments']
    },
    {
      id: 8,
      name: 'Meera Devi',
      email: 'meera.devi@company.com',
      phone: '+91-9876543217',
      role: 'telecaller',
      department: 'sales',
      status: 'active',
      lastLogin: new Date(Date.now() - 259200000),
      projects: ['Downtown Plaza']
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchUsers = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    let filtered = [...users];

    // Apply filters
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(searchLower)
      );
    }

    if (newFilters.role) {
      filtered = filtered.filter(user => user.role === newFilters.role);
    }

    if (newFilters.status) {
      filtered = filtered.filter(user => user.status === newFilters.status);
    }

    if (newFilters.department) {
      filtered = filtered.filter(user => user.department === newFilters.department);
    }

    if (newFilters.project) {
      filtered = filtered.filter(user => 
        user.projects?.some(project => 
          project.toLowerCase().includes(newFilters.project.replace('_', ' '))
        )
      );
    }

    if (newFilters.lastLogin) {
      const now = new Date();
      filtered = filtered.filter(user => {
        if (!user.lastLogin) return newFilters.lastLogin === 'older';
        const lastLogin = new Date(user.lastLogin);
        const diff = now - lastLogin;
        
        switch (newFilters.lastLogin) {
          case 'today':
            return diff < 24 * 60 * 60 * 1000;
          case 'week':
            return diff < 7 * 24 * 60 * 60 * 1000;
          case 'month':
            return diff < 30 * 24 * 60 * 60 * 1000;
          case 'older':
            return diff > 30 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }

    setFilteredUsers(filtered);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleUserDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      const updatedUsers = users.filter(u => u.id !== user.id);
      setUsers(updatedUsers);
      setFilteredUsers(filteredUsers.filter(u => u.id !== user.id));
    }
  };

  const handleAddUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      lastLogin: null
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setFilteredUsers([...filteredUsers, newUser]);
  };

  const handleUpdateUser = (userData) => {
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? { ...user, ...userData } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(filteredUsers.map(user => 
      user.id === selectedUser.id ? { ...user, ...userData } : user
    ));
  };

  const handleBulkAction = (action, userIds) => {
    switch (action) {
      case 'activate':
        setUsers(users.map(user => 
          userIds.includes(user.id) ? { ...user, status: 'active' } : user
        ));
        break;
      case 'deactivate':
        setUsers(users.map(user => 
          userIds.includes(user.id) ? { ...user, status: 'inactive' } : user
        ));
        break;
      case 'export':
        console.log('Exporting users:', userIds);
        break;
      default:
        break;
    }
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Role', 'Department', 'Status', 'Last Login', 'Projects'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone,
        user.role,
        user.department,
        user.status,
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
        user.projects?.join('; ') || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="section-padding page-padding">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-text-primary mb-2">User Management</h1>
              <p className="text-text-secondary">
                Manage team members, roles, and access permissions across projects
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <Button
                variant="outline"
                iconName="Download"
                onClick={handleExportUsers}
                className="w-full sm:w-auto"
              >
                Export CSV
              </Button>
              <Button
                variant="primary"
                iconName="UserPlus"
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto"
              >
                Add User
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface border border-border rounded-radius-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Total Users</p>
                  <p className="text-2xl font-bold text-text-primary">{users.length}</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-primary" />
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-radius-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Active Users</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                  <Icon name="UserCheck" size={20} className="text-success" />
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-radius-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Admins</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                  <Icon name="UserCog" size={20} className="text-error" />
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-radius-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">New This Month</p>
                  <p className="text-2xl font-bold text-text-primary">3</p>
                </div>
                <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                  <Icon name="UserPlus" size={20} className="text-warning" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-3">
              <UserFilters
                onFiltersChange={handleFiltersChange}
                totalUsers={users.length}
              />
            </div>

            {/* User List */}
            <div className="lg:col-span-9">
              {loading ? (
                <div className="bg-surface border border-border rounded-radius-md p-8 text-center">
                  <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
                  <p className="text-text-secondary">Loading users...</p>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-text-secondary">
                      Showing {filteredUsers.length} of {users.length} users
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-text-secondary">View:</span>
                      <Button
                        variant={isMobile ? "ghost" : "outline"}
                        size="sm"
                        onClick={() => setIsMobile(false)}
                        iconName="Table"
                        className="hidden sm:flex"
                      />
                      <Button
                        variant={isMobile ? "outline" : "ghost"}
                        size="sm"
                        onClick={() => setIsMobile(true)}
                        iconName="Grid3x3"
                        className="hidden sm:flex"
                      />
                    </div>
                  </div>

                  {/* User Table/Cards */}
                  {isMobile || window.innerWidth < 768 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredUsers.map((user) => (
                        <MobileUserCard
                          key={user.id}
                          user={user}
                          onUserSelect={handleUserSelect}
                          onUserEdit={handleUserEdit}
                          onUserDelete={handleUserDelete}
                        />
                      ))}
                    </div>
                  ) : (
                    <UserTable
                      users={filteredUsers}
                      onUserSelect={handleUserSelect}
                      onUserEdit={handleUserEdit}
                      onUserDelete={handleUserDelete}
                      onBulkAction={handleBulkAction}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUser}
        />
      )}

      {showProfileModal && selectedUser && (
        <UserProfileModal
          user={selectedUser}
          isOpen={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedUser(null);
          }}
          onSave={handleUpdateUser}
          onDelete={handleUserDelete}
        />
      )}
    </div>
  );
};

export default UserManagement;