import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/apiClient';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaFileContract, FaCalendarAlt, FaUser } from 'react-icons/fa';

const RegisterPage = ({ onLogin }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    jobTitle: '',
    jobDescription: '',
    joinedAt: ''
  });
  const [contractFile, setContractFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('role', 'admin');
      formData.append('jobTitle', form.jobTitle);
      formData.append('jobDescription', form.jobDescription);
      formData.append('joinedAt', form.joinedAt);
      if (contractFile) {
        formData.append('signedContract', contractFile);
      }

      const response = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.token) {
        // Employee registration - auto-login
        onLogin(response.data.token);
        navigate('/admin');
      } else {
        // Admin registration - pending approval
        setForm({ firstName: '', lastName: '', email: '', password: '', jobTitle: '', jobDescription: '', joinedAt: '' });
        setContractFile(null);
        alert('Admin registration submitted successfully! An existing administrator needs to approve your account.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl card-glass p-8"
      >
        <h2 className="text-3xl font-semibold text-slate-900 mb-2">Professional Admin Onboarding</h2>
        <p className="text-slate-500 mb-6">Complete your administrator profile with a signed contract, role summary, and company join date.</p>

        {error && <div className="rounded-2xl bg-red-100 text-red-700 p-3 mb-4">{error}</div>}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-slate-700">First Name</span>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none"
                required
              />
            </label>
            <label className="block">
              <span className="text-slate-700">Last Name</span>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="text-slate-700">Work Email</span>
            <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3">
              <FaEnvelope className="text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="text-slate-700">Password</span>
            <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3">
              <FaLock className="text-slate-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-slate-700">Your Title</span>
              <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3">
                <FaUser className="text-slate-400" />
                <input
                  type="text"
                  value={form.jobTitle}
                  onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                  className="w-full bg-transparent outline-none"
                  placeholder="e.g. HR Director"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-slate-700">Date of Joining</span>
              <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3">
                <FaCalendarAlt className="text-slate-400" />
                <input
                  type="date"
                  value={form.joinedAt}
                  onChange={(e) => setForm({ ...form, joinedAt: e.target.value })}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </label>
          </div>

          <label className="block">
            <span className="text-slate-700">Professional summary</span>
            <textarea
              value={form.jobDescription}
              onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
              className="mt-2 w-full min-h-[120px] rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none"
              placeholder="Describe your role and how you contribute to the company"
            />
          </label>

          <label className="block">
            <span className="text-slate-700">Signed contract</span>
            <div className="mt-2 rounded-3xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center gap-3 text-slate-600">
                <FaFileContract className="text-slate-400" />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setContractFile(e.target.files[0])}
                  className="w-full text-sm text-slate-700"
                />
              </div>
              {contractFile && <p className="mt-2 text-sm text-slate-500">Selected file: {contractFile.name}</p>}
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full bg-slate-900 text-white py-3 rounded-2xl font-medium hover:bg-slate-800 transition-colors duration-200"
          >
            {submitting ? 'Registering…' : 'Create Admin Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an admin account? <Link to="/login" className="text-primary font-semibold">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
