'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LogoutPage() {
  const router = useRouter();
  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
      toast.success('Logout successful');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <span onClick={logout}>
      <button className="text-warning">Logout</button>
    </span>
  );
}
