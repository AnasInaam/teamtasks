import { createClient } from '@supabase/supabase-js';

// This API route is for secure account deletion using the Supabase service role key.
// Place your service role key in an environment variable (never expose it to the client!).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Delete user from auth.users
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Optionally, delete user profile and related data here
  await supabase.from('profiles').delete().eq('id', userId);

  return res.status(200).json({ success: true });
}
