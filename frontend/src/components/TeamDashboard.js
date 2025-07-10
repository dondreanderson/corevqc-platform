import React, { useState, useEffect } from 'react';
import './TeamDashboard.css';

const TeamDashboard = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [filters, setFilters] = useState({
    role: 'ALL',
    status: 'ALL',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [teamMembers, filters]);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockMembers = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1-555-0123',
          role: 'MANAGER',
          department: 'Construction',
          company: 'ABC Construction',
          status: 'active',
          joinedAt: '2024-01-01T00:00:00Z',
          lastActive: '2024-01-15T14:30:00Z'
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+1-555-0124',
          role: 'INSPECTOR',
          department: 'Quality Control',
          company: 'QC Partners',
          status: 'active',
          joinedAt: '2024-01-02T00:00:00Z',
          lastActive: '2024-01-15T10:15:00Z'
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@example.com',
          role: 'SUPERVISOR',
          department: 'Field Operations',
          company: 'ABC Construction',
          status: 'pending',
          joinedAt: '2024-01-14T00:00:00Z'
        }
      ];
      setTeamMembers(mockMembers);
    } catch (error) {
      console.error('Failed to load team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...teamMembers];

    if (filters.role !== 'ALL') {
      filtered = filtered.filter(member => member.role === filters.role);
    }

    if (filters.status !== 'ALL') {
      filtered = filtered.filter(member => member.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(member => 
        member.firstName.toLowerCase().includes(searchLower) ||
        member.lastName.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.company?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredMembers(filtered);
  };

  const getRoleColor = (role) => {
    const colors = {
      'MANAGER': 'role-purple',
      'SUPERVISOR': 'role-blue',
      'INSPECTOR': 'role-green',
      'MEMBER': 'role-gray'
    };
    return colors[role] || 'role-gray';
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'status-green',
      'inactive': 'status-red',
      'pending': 'status-yellow'
    };
    return colors[status] || 'status-gray';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'active': '✅',
      'inactive': '❌',
      'pending': '⏰'
    };
    return icons[status] || '❓';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const teamStats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === 'active').length,
    pending: teamMembers.filter(m => m.status === 'pending').length,
    managers: teamMembers.filter(m => m.role === 'MANAGER').length
  };

  if (loading) {
    return (
      <div className="team-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="team-dashboard">
      <div className="team-header">
        <h1>Team Dashboard</h1>
        <p>Manage team members, roles, and permissions</p>
      </div>

      <div className="team-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <p className="stat-label">Total Members</p>
            <p className="stat-value">{teamStats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">Active</p>
            <p className="stat-value">{teamStats.active}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value">{teamStats.pending}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👑</div>
          <div className="stat-content">
            <p className="stat-label">Managers</p>
            <p className="stat-value">{teamStats.managers}</p>
          </div>
        </div>
      </div>

      <div className="team-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search team members..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
        </div>

        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="filter-select"
        >
          <option value="ALL">All Roles</option>
          <option value="MANAGER">Manager</option>
          <option value="SUPERVISOR">Supervisor</option>
          <option value="INSPECTOR">Inspector</option>
          <option value="MEMBER">Member</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="ALL">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          onClick={() => setShowInviteModal(true)}
          className="invite-button"
        >
          + Invite Member
        </button>
      </div>

      <div className="team-grid">
        {filteredMembers.map((member) => (
          <div key={member.id} className="member-card">
            <div className="member-header">
              <div className="member-avatar">
                {member.avatar ? (
                  <img src={member.avatar} alt="" />
                ) : (
                  <div className="avatar-initials">
                    {getInitials(member.firstName, member.lastName)}
                  </div>
                )}
              </div>
              <div className="member-info">
                <h3>{member.firstName} {member.lastName}</h3>
                <p>{member.company}</p>
              </div>
              <div className="member-status">
                {getStatusIcon(member.status)}
              </div>
            </div>

            <div className="member-contact">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>{member.email}</span>
              </div>
              {member.phone && (
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>{member.phone}</span>
                </div>
              )}
            </div>

            <div className="member-badges">
              <span className={`role-badge ${getRoleColor(member.role)}`}>
                {member.role}
              </span>
              <span className={`status-badge ${getStatusColor(member.status)}`}>
                {member.status}
              </span>
            </div>

            <div className="member-dates">
              <p>Joined: {formatDate(member.joinedAt)}</p>
              {member.lastActive && (
                <p>Last active: {formatDate(member.lastActive)}</p>
              )}
            </div>

            <div className="member-actions">
              <button className="action-btn edit-btn">✏️ Edit</button>
              <button className="action-btn delete-btn">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="no-members">
          <div className="no-members-icon">👥</div>
          <p>No team members found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default TeamDashboard;