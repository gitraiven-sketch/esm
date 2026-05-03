import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import api from '../api/apiClient';
import { motion } from 'framer-motion';

const RegisterPage = ({ onRegister }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password
      });
      onRegister(response.data.token);
      navigate('/employee');
    } catch (registerError) {
      setError(registerError.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md card-glass p-8"
      >
        <h2 className="text-3xl font-semibold text-slate-900 mb-2">Create your account</h2>
        <p className="text-slate-500 mb-6">Register with email and password to access your employee dashboard.</p>
        {error && <div className="rounded-2xl bg-red-100 text-red-700 p-3 mb-4">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-slate-700">First name</span>
            <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3">
              <FaUser className="text-slate-400" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="text-slate-700">Last name</span>
            <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3">
              <FaUser className="text-slate-400" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="text-slate-700">Email</span>
            <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3">
              <FaEnvelope className="text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none"
                required
                minLength={6}
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 px-4 rounded-2xl font-medium hover:bg-slate-800 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-700">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
