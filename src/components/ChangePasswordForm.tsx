import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Spinner from './ui/Spinner';
import ErrorMessage from './ui/ErrorMessage';

const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    // Supabase does not support password change with current password verification directly.
    // You must re-authenticate on the client if needed.
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsSubmitting(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">New Password</label>
        <input
          type="password"
          className="input w-full"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          minLength={6}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
        <input
          type="password"
          className="input w-full"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          minLength={6}
          required
        />
      </div>
      {error && <ErrorMessage message={error} />}
      {success && <div className="text-green-600 text-center">Password changed successfully!</div>}
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner className="h-4 w-4 mr-2" /> : 'Change Password'}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
