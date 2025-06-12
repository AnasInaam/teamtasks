import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import ChangePasswordForm from '../components/ChangePasswordForm';
import DeleteAccountButton from '../components/DeleteAccountButton';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      email: user?.email || '',
    },
  });

  React.useEffect(() => {
    setValue('name', profile?.name || '');
    setValue('email', user?.email || '');
    setAvatarUrl(profile?.avatar_url || '');
  }, [profile, user, setValue]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    if (!file.type.startsWith('image/')) {
      setSubmitError('Only image files are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setSubmitError('Image size must be less than 2MB.');
      return;
    }
    setAvatarUploading(true);
    setSubmitError(null);
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${profile.id}_${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      setSubmitError(uploadError.message);
      setAvatarUploading(false);
      return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setAvatarUrl(data.publicUrl);
    setAvatarUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccess(false);
    let updateError = null;
    if (data.email !== user?.email) {
      const { error } = await supabase.auth.updateUser({ email: data.email });
      if (error) updateError = error;
    }
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ name: data.name, avatar_url: avatarUrl })
      .eq('id', profile?.id);
    if (profileError) updateError = profileError;
    if (updateError) {
      if (updateError.message?.toLowerCase().includes('confirmation required')) {
        setSubmitError('Please check your new email address to confirm the change.');
      } else {
        setSubmitError(updateError.message);
      }
      setIsSubmitting(false);
      return;
    }
    await refreshProfile();
    setSuccess(true);
    setIsSubmitting(false);
  };

  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <div className="flex flex-col items-center mb-4">
          <img
            src={avatarUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'}
            alt="Avatar"
            className={`h-20 w-20 rounded-full object-cover mb-2 border ${avatarUploading ? 'opacity-60' : ''}`}
          />
          {avatarUploading && <div className="text-xs text-gray-500 mb-2">Uploading...</div>}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
            disabled={avatarUploading || isSubmitting}
          />
          <button
            type="button"
            className="btn btn-secondary text-xs px-3 py-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading || isSubmitting}
          >
            {avatarUploading ? 'Uploading...' : 'Change Avatar'}
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            className={`input w-full ${errors.name ? 'border-red-500' : ''}`}
            {...register('name')}
            disabled={isSubmitting || avatarUploading}
          />
          {errors.name && <ErrorMessage message={errors.name.message} />}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            className={`input w-full ${errors.email ? 'border-red-500' : ''}`}
            {...register('email')}
            disabled={isSubmitting || avatarUploading}
          />
          {errors.email && <ErrorMessage message={errors.email.message} />}
        </div>
        {submitError && <ErrorMessage message={submitError} />}
        {success && (
          <div
            role="status"
            aria-live="polite"
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow z-50"
          >
            Profile updated!
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting || avatarUploading}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <Spinner className="h-4 w-4 mr-2" />
              Saving...
            </div>
          ) : (
            'Save Changes'
          )}
        </button>
        {/* Change Password Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Change Password</h2>
          <ChangePasswordForm />
        </div>
        {/* Delete Account Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">Delete Account</h2>
          <DeleteAccountButton />
        </div>
      </form>
    </div>
  );
};

export default Profile;
