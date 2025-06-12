import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import Spinner from './ui/Spinner';
import ErrorMessage from './ui/ErrorMessage';

const DeleteAccountButton: React.FC = () => {
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      // Call backend API for true account deletion
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not found');
      await axios.post('/api/delete-account', { userId: user.id });
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {error && <ErrorMessage message={error} />}
      {confirming ? (
        <div className="space-y-2">
          <p className="text-red-600 text-sm">Are you sure? This action cannot be undone.</p>
          <button
            className="btn btn-danger w-full"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner className="h-4 w-4 mr-2" /> : 'Yes, Delete My Account'}
          </button>
          <button
            className="btn btn-secondary w-full"
            onClick={() => setConfirming(false)}
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="btn btn-danger w-full"
          onClick={() => setConfirming(true)}
        >
          Delete Account
        </button>
      )}
    </div>
  );
};

export default DeleteAccountButton;
