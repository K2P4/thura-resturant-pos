import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });

  if (error) {
    throw new Error('Users could not be loaded');
  }

  return data;
}

export async function createUser({ full_name, email, password, role }) {
  const tempSupabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  const { data, error } = await tempSupabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role,
      },
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateUser({ id, ...updatedUser }) {
  const { data, error } = await supabase.from('users').update(updatedUser).eq('id', id).select();

  if (error) {
    throw new Error('User could not be updated');
  }

  return data;
}

export async function deleteUser(id) {
  const { data, error } = await supabase.from('users').delete().eq('id', id);

  if (error) {
    throw new Error('User could not be deleted');
  }

  return data;
}
