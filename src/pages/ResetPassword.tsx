import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ResetPassword: React.FC = () => {
  // Get access_token from query or hash fragment
  const [searchParams] = useSearchParams();
  const hashParams = React.useMemo(() => {
    if (window.location.hash) {
      return new URLSearchParams(window.location.hash.substring(1));
    }
    return null;
  }, []);
  const accessToken = searchParams.get('access_token') || hashParams?.get('access_token');

  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!accessToken) {
      setError('Invalid or missing token.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password }, { accessToken });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/auth/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Reset Password</h2>
        {success ? (
          <div className="text-green-600 text-center mb-4">Password reset successful! Redirecting to login...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
