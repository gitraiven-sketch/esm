import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import api from '../api/apiClient';
import { motion } from 'framer-motion';
import { auth, requestFirebaseToken, signInWithGoogle } from '../firebase';
import { getIdToken, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('employee@example.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await getIdToken(credential.user);
      const response = await api.post('/auth/login', { firebaseIdToken: firebaseToken });
      onLogin(response.data.token);
    } catch (firebaseError) {
      try {
        const response = await api.post('/auth/login', { email, password });
        onLogin(response.data.token);
      } catch (backendError) {
        setError(backendError.response?.data?.message || 'Login failed');
        return;
      }
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(console.error);
    }
    requestFirebaseToken().then((token) => {
      if (token) {
        console.log('FCM token:', token);
      }
    });
    navigate('/employee');
  };

  const handleGoogleSignIn = async () => {
    try {
      const { token } = await signInWithGoogle();
      const response = await api.post('/auth/login', { firebaseIdToken: token });
      onLogin(response.data.token);

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(console.error);
      }
      requestFirebaseToken().then((fcmToken) => {
        if (fcmToken) {
          console.log('FCM token:', fcmToken);
        }
      });
      navigate('/employee');
    } catch (error) {
      setError(error.response?.data?.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md card-glass p-8">
        <h2 className="text-3xl font-semibold text-slate-900 mb-2">Employee Login</h2>
        <p className="text-slate-500 mb-6">Access your personal attendance, leave, and contract dashboard.</p>
        {error && <div className="rounded-2xl bg-red-100 text-red-700 p-3 mb-4">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-slate-700">Email</span>
            <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3">
              <FaEnvelope className="text-slate-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none" />
            </div>
          </label>
          <label className="block">
            <span className="text-slate-700">Password</span>
            <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3">
              <FaLock className="text-slate-400" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent outline-none" />
            </div>
          </label>
          <button type="submit" className="w-full bg-slate-900 text-white py-3 px-4 rounded-2xl font-medium hover:bg-slate-800 transition-colors duration-200">
            Sign In
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3 px-4 rounded-2xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 flex items-center justify-center gap-3"
          >
            <FaGoogle className="text-red-500" />
            Sign in with Google
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-slate-900 hover:text-slate-700">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
