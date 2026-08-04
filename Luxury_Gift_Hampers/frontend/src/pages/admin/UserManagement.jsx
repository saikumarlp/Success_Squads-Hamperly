import React, { useState, useEffect } from 'react';
import { getAdminUsers, updateAdminUser, patchAdminUserRole, toggleAdminUserBlock, resetAdminUserPassword } from '../../services/admin/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // Selected User Modal details
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Password reset Modal states
  const [resetUserId, setResetUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const triggerToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size,
        search: search.trim() ? search.trim() : undefined,
        sortBy: 'id',
        direction: 'DESC'
      };
      const data = await getAdminUsers(params);
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load users', err);
      triggerToast('danger', 'Could not load users list.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadUsers();
  };

  const handleResetSearch = () => {
    setSearch('');
    setPage(0);
    setTimeout(() => loadUsers(), 50);
  };

  const handleRoleChange = async (userId, currentRole) => {
    const nextRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    if (!window.confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) {
      return;
    }
    try {
      await patchAdminUserRole(userId, nextRole);
      triggerToast('success', `User role updated to ${nextRole} successfully.`);
      loadUsers();
      // Update details view if open
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => ({ ...prev, role: nextRole }));
      }
    } catch (err) {
      console.error(err);
      triggerToast('danger', 'Failed to change user role.');
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    const actionText = isBlocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${actionText} this user?`)) {
      return;
    }
    try {
      await toggleAdminUserBlock(userId, !isBlocked);
      triggerToast('success', `User account ${isBlocked ? 'unblocked' : 'blocked'} successfully.`);
      loadUsers();
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => ({ ...prev, blocked: !isBlocked }));
      }
    } catch (err) {
      console.error(err);
      triggerToast('danger', 'Failed to modify account lock status.');
    }
  };

  const openResetPasswordModal = (userId) => {
    setResetUserId(userId);
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setResetError('');

    if (!newPassword) {
      setResetError('New password is required');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    setResetLoading(true);
    try {
      await resetAdminUserPassword(resetUserId, newPassword);
      triggerToast('success', 'User password updated successfully.');
      setResetUserId(null);
    } catch (err) {
      console.error(err);
      setResetError(err.message || 'Failed to update user password.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div>
      {/* Toast Alert popup */}
      {toast && (
        <div className={`toast-alert alert alert-${toast.type} shadow border-0 position-fixed`} style={{ right: '20px', top: '90px', zIndex: 1060, borderRadius: '12px' }}>
          <div className="d-flex align-items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="fw-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h2 className="m-0 fw-bold tracking-wide" style={{ color: '#f8fafc' }}>User Registry</h2>
        <p className="text-secondary small m-0 mt-1">Review accounts, configure roles, block violations and update passwords.</p>
      </div>

      {/* Filter panel */}
      <div className="card border-0 p-3 mb-4 shadow-sm" style={{ borderRadius: '14px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
          <div className="col-12 col-md-8">
            <label htmlFor="search-input" className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">Search Users</label>
            <input 
              type="text" 
              id="search-input"
              className="form-control admin-input w-100" 
              placeholder="Search by name, email, or mobile number..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4 d-flex gap-2">
            <button type="submit" className="btn btn-warning flex-grow-1 py-2 fw-semibold text-dark border-0" style={{ backgroundColor: '#fbbf24', borderRadius: '10px' }}>
              Search
            </button>
            <button type="button" onClick={handleResetSearch} className="btn btn-outline-secondary py-2 px-3 text-light" style={{ borderColor: '#334155', borderRadius: '10px' }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* User Table Grid */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#111827', border: '1px solid #1f2937', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle m-0" style={{ backgroundColor: 'transparent' }}>
            <thead>
              <tr style={{ color: '#94a3b8', borderBottom: '1px solid #1f2937' }}>
                <th className="py-3 px-4 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">ID</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Name</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Email</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Mobile</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Role</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border text-warning" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #1f2937' }}>
                    <td className="py-3 px-4 border-0 bg-transparent font-monospace text-secondary" style={{ fontSize: '0.85rem' }}>{u.id}</td>
                    <td className="py-3 border-0 bg-transparent fw-semibold text-white">{u.fullName}</td>
                    <td className="py-3 border-0 bg-transparent">{u.email}</td>
                    <td className="py-3 border-0 bg-transparent text-secondary">{u.mobileNumber}</td>
                    <td className="py-3 border-0 bg-transparent">
                      <span className={`badge rounded px-2.5 py-1.5 font-bold ${
                        u.role === 'ADMIN' ? 'bg-danger text-light' : 'bg-primary text-light'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 border-0 bg-transparent">
                      <span className={`badge px-2.5 py-1.5 rounded-pill font-semibold ${
                        u.blocked ? 'bg-danger-subtle text-danger border border-danger' : 'bg-success-subtle text-success border border-success'
                      }`}>
                        {u.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-0 bg-transparent text-end">
                      <div className="d-inline-flex gap-2">
                        <button 
                          onClick={() => { setSelectedUser(u); setIsDetailsOpen(true); }}
                          className="btn btn-sm btn-outline-info p-2" 
                          style={{ borderRadius: '8px' }}
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleRoleChange(u.id, u.role)}
                          className="btn btn-sm btn-outline-warning p-2"
                          style={{ borderRadius: '8px' }}
                          title="Change Role"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleBlockToggle(u.id, u.blocked)}
                          className={`btn btn-sm p-2 ${u.blocked ? 'btn-outline-success' : 'btn-outline-danger'}`}
                          style={{ borderRadius: '8px' }}
                          title={u.blocked ? 'Unblock' : 'Block'}
                        >
                          {u.blocked ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                        </button>
                        <button 
                          onClick={() => openResetPasswordModal(u.id)}
                          className="btn btn-sm btn-outline-secondary p-2 text-light"
                          style={{ borderRadius: '8px', borderColor: '#334155' }}
                          title="Reset Password"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-secondary">
                    No registered user accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex align-items-center justify-content-between p-3 border-top" style={{ borderColor: '#1f2937' }}>
            <span className="text-secondary small">Showing page {page + 1} of {totalPages} ({totalElements} total users)</span>
            <div className="d-inline-flex gap-2">
              <button 
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                className="btn btn-sm btn-outline-secondary text-light px-3"
                disabled={page === 0}
                style={{ borderColor: '#334155', borderRadius: '8px' }}
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                className="btn btn-sm btn-outline-secondary text-light px-3"
                disabled={page === totalPages - 1}
                style={{ borderColor: '#334155', borderRadius: '8px' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {isDetailsOpen && selectedUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-light border-0" style={{ backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <div className="modal-header border-bottom" style={{ borderColor: '#1f2937' }}>
                <h5 className="modal-title fw-bold" style={{ color: '#fbbf24' }}>Profile Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsDetailsOpen(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white font-semibold" style={{ width: '60px', height: '60px', backgroundColor: '#374151', fontSize: '1.5rem' }}>
                    {selectedUser.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="m-0 fw-bold">{selectedUser.fullName}</h5>
                    <span className="text-secondary small">{selectedUser.email}</span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  <div className="row">
                    <div className="col-4 text-secondary small">Mobile:</div>
                    <div className="col-8 fw-semibold">{selectedUser.mobileNumber}</div>
                  </div>
                  <div className="row">
                    <div className="col-4 text-secondary small">Role Name:</div>
                    <div className="col-8">
                      <span className={`badge ${selectedUser.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>{selectedUser.role}</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4 text-secondary small">Status:</div>
                    <div className="col-8">
                      <span className={`badge ${selectedUser.blocked ? 'bg-danger text-light' : 'bg-success text-light'}`}>
                        {selectedUser.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                  </div>
                  {selectedUser.createdAt && (
                    <div className="row">
                      <div className="col-4 text-secondary small">Joined Date:</div>
                      <div className="col-8 text-secondary">{new Date(selectedUser.createdAt).toLocaleString()}</div>
                    </div>
                  )}
                  {selectedUser.updatedAt && (
                    <div className="row">
                      <div className="col-4 text-secondary small">Last Updated:</div>
                      <div className="col-8 text-secondary">{new Date(selectedUser.updatedAt).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer border-top p-3" style={{ borderColor: '#1f2937' }}>
                <button type="button" className="btn btn-warning text-dark border-0 fw-semibold px-4" onClick={() => setIsDetailsOpen(false)} style={{ backgroundColor: '#fbbf24', borderRadius: '8px' }}>
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {resetUserId && (
        <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1055, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-light border-0" style={{ backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #1f2937' }}>
              <div className="modal-header border-bottom" style={{ borderColor: '#1f2937' }}>
                <h5 className="modal-title fw-bold" style={{ color: '#fbbf24' }}>Force Reset Password</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setResetUserId(null)}></button>
              </div>
              <form onSubmit={handlePasswordResetSubmit}>
                <div className="modal-body p-4">
                  {resetError && (
                    <div className="alert alert-danger border-0 py-2 text-center small mb-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
                      {resetError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">New Password</label>
                    <input 
                      type="password" 
                      className="form-control admin-input"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label text-light-muted fs-8 font-semibold text-uppercase tracking-wider">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-control admin-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer border-top p-3" style={{ borderColor: '#1f2937' }}>
                  <button type="button" className="btn btn-outline-secondary text-light border-0 px-3" onClick={() => setResetUserId(null)} style={{ backgroundColor: '#1f2937' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning text-dark border-0 fw-semibold px-4" disabled={resetLoading} style={{ backgroundColor: '#fbbf24' }}>
                    {resetLoading ? 'Resetting...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .bg-success-subtle {
          background-color: rgba(34, 197, 94, 0.1) !important;
        }
        .bg-danger-subtle {
          background-color: rgba(239, 68, 68, 0.1) !important;
        }
        .admin-input {
          background-color: #0f172a !important;
          border: 1px solid #1f2937 !important;
          color: #f8fafc !important;
          border-radius: 10px;
          padding: 0.625rem 0.875rem;
        }
        .admin-input:focus {
          border-color: #fbbf24 !important;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
