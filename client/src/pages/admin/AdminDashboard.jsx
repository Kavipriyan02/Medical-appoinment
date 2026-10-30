import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Search, 
  Power,
  Activity,
  AlertTriangle
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'pending-doctors' | 'users' | 'appointments'
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  const fetchAdminOverview = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/doctors/pending')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (pendingRes.data.success) {
        setPendingDoctors(pendingRes.data.doctors || []);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/admin/users?search=${encodeURIComponent(userSearch)}`);
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/admin/appointments');
      if (res.data.success) {
        setAppointments(res.data.appointments || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'appointments') fetchAppointments();
  }, [activeTab]);

  const handleApproveDoctor = async (doctorId, approved) => {
    try {
      const res = await api.put(`/admin/doctors/${doctorId}/approve`, { approved });
      if (res.data.success) {
        toast.success(approved ? 'Doctor approved successfully' : 'Doctor application rejected');
        fetchAdminOverview();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to change user status');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#7c3aed', fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          <Shield size={16} /> Clinical System Administration
        </div>
        <h1 className="title-lg" style={{ color: '#0f172a' }}>Admin Control Center</h1>
        <p style={{ color: '#64748b', fontSize: '0.925rem' }}>
          Oversee platform health, approve medical specialists, and manage system accounts
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'overview' ? '#7c3aed' : '#64748b',
            borderBottom: activeTab === 'overview' ? '3px solid #7c3aed' : 'none',
            marginBottom: '-2px',
          }}
        >
          Overview & Metrics
        </button>

        <button
          onClick={() => setActiveTab('pending-doctors')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'pending-doctors' ? '#7c3aed' : '#64748b',
            borderBottom: activeTab === 'pending-doctors' ? '3px solid #7c3aed' : 'none',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          Doctor Approvals ({pendingDoctors.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'users' ? '#7c3aed' : '#64748b',
            borderBottom: activeTab === 'users' ? '3px solid #7c3aed' : 'none',
            marginBottom: '-2px',
          }}
        >
          Manage Users
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.75rem 1rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: activeTab === 'appointments' ? '#7c3aed' : '#64748b',
            borderBottom: activeTab === 'appointments' ? '3px solid #7c3aed' : 'none',
            marginBottom: '-2px',
          }}
        >
          All Appointments
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Cards */}
          <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Patients</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{stats?.totalPatients || 0}</span>
                <Users size={28} style={{ color: '#0284c7' }} />
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Active Doctors</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{stats?.totalDoctors || 0}</span>
                <Stethoscope size={28} style={{ color: '#0d9488' }} />
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Appointments</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{stats?.totalAppointments || 0}</span>
                <Calendar size={28} style={{ color: '#7c3aed' }} />
              </div>
            </div>

            <div className="card" style={{ border: pendingDoctors.length > 0 ? '1.5px solid #fde68a' : '1px solid #e2e8f0', backgroundColor: pendingDoctors.length > 0 ? '#fffbeb' : '#ffffff' }}>
              <span style={{ fontSize: '0.8rem', color: pendingDoctors.length > 0 ? '#b45309' : '#64748b', fontWeight: 600 }}>
                Pending Approvals
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: pendingDoctors.length > 0 ? '#b45309' : '#0f172a' }}>
                  {stats?.pendingDoctors || pendingDoctors.length || 0}
                </span>
                <AlertTriangle size={28} style={{ color: '#f59e0b' }} />
              </div>
            </div>
          </div>

          {/* Pending Applications Callout */}
          {pendingDoctors.length > 0 && (
            <div className="card" style={{ border: '2px solid #fde68a', backgroundColor: '#fffbeb', marginBottom: '2rem' }}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#92400e', marginBottom: '0.2rem' }}>
                    ⚠️ {pendingDoctors.length} Doctor Application(s) Awaiting Review
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#b45309' }}>
                    New doctors cannot be booked until their profile and credentials are verified by an administrator.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('pending-doctors')}
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: '#d97706', borderColor: '#d97706' }}
                >
                  Review Applications
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Pending Doctor Approvals */}
      {activeTab === 'pending-doctors' && (
        <div>
          <h3 className="title-md" style={{ marginBottom: '1.25rem' }}>Pending Doctor Verification Requests</h3>

          {pendingDoctors.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <CheckCircle size={40} style={{ color: '#10b981', margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ color: '#0f172a' }}>All Clear!</h4>
              <p style={{ fontSize: '0.875rem' }}>There are currently no pending doctor applications.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingDoctors.map((doc) => (
                <div key={doc._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                      Dr. {doc.user?.name}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>
                      {doc.specialization} &bull; {doc.qualifications} &bull; {doc.experience} Years Exp.
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Email: {doc.user?.email} &bull; Hospital: {doc.hospital} &bull; Fee: ₹{doc.consultationFee}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleApproveDoctor(doc._id, true)}
                      className="btn btn-success btn-sm"
                    >
                      <CheckCircle size={15} /> Approve Doctor
                    </button>
                    <button
                      onClick={() => handleApproveDoctor(doc._id, false)}
                      className="btn btn-danger btn-sm"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Users Management */}
      {activeTab === 'users' && (
        <div>
          <div className="flex-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="title-md">Registered Accounts</h3>
            <div style={{ display: 'flex', gap: '0.5rem', minWidth: '280px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              />
              <button onClick={fetchUsers} className="btn btn-primary btn-sm">
                Search
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>{u.email}</span>
                    </td>
                    <td>
                      <span className="badge badge-primary">{u.role}</span>
                    </td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-active' : 'badge-inactive'}`}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u._id)}
                          className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          <Power size={13} /> {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: All Appointments */}
      {activeTab === 'appointments' && (
        <div>
          <h3 className="title-md" style={{ marginBottom: '1.25rem' }}>Master Clinical Appointments Log</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Fee</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a._id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{a.patient?.name}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>{a.patient?.email}</span>
                    </td>
                    <td>
                      Dr. {a.doctor?.user?.name}
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#0284c7' }}>{a.doctor?.specialization}</span>
                    </td>
                    <td>
                      {new Date(a.appointmentDate).toLocaleDateString()} at {a.timeSlot}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{a.type}</td>
                    <td>₹{a.fee}</td>
                    <td>
                      <span className={`badge badge-${a.status}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

