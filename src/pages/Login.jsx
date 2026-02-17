import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { Loader2, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      toast.error('အကောင့်ဝင်ခြင်း မအောင်မြင်ပါ', {
        description: error.message,
      });
      setLoading(false);
    } else {
      toast.success('အကောင့်ဝင်ခြင်း အောင်မြင်ပါသည်');
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-2 text-primary justify-center flex items-center gap-1 px-2 ">
          <UtensilsCrossed className="h-6 w-6" />
          <span className="text-xl font-semibold">သူရစားသောက်ဆိုင်</span>
        </div>
        <h1 className="mb-6 text-center text-lg font-normal text-gray-500">အကောင့်ဝင်ရန် </h1>


        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">အီးမေးလ် </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 p-2  focus:outline-none focus:ring-1 "
              placeholder="user@example.com"
            />
            
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">စကားဝှက် </label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 p-2  focus:outline-none focus:ring-1 "
              placeholder="******"
            />
          </div>

          <Button type="submit" disabled={loading} className="flex w-full items-center justify-center rounded p-2 font-bold text-white  disabled:bg-primary/50">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ဝင်ရောက်နေပါသည်...
              </>
            ) : (
              'အကောင့်ဝင်မည်'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
