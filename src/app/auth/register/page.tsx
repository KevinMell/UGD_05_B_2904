'use client';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import AuthFromWrapper from '../../../components/AuthFromWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function RegisterPage() {
    const router = useRouter();
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        const s = Math.min(
            (pass.length > 7 ? 25 : 0) +
            (/[A-Z]/.test(pass) ? 25 : 0) +
            (/[0-9]/.test(pass) ? 25 : 0) +
            (/[^A-Za-z0-9]/.test(pass) ? 25 : 0)
        );
        setStrength(s);
    }, [pass]);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (pass !== confirmPass) {
            toast.error('Konfirmasi password harus sama!', { theme: 'dark' });
            return;
        }
        toast.success('Berhasil Registrasi!', { theme: 'dark' });
        router.push('/auth/login');
    };

    return (
        <AuthFromWrapper title="Register">
            <form onSubmit={handleRegister} className="space-y-3 w-full text-left">
                <div>
                    <label className="text-sm font-medium">Username</label>
                    <input minLength={3} maxLength={8} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="3-8 karakter" required />
                </div>
                <div>
                    <label className="text-sm font-medium">Nomor Telepon</label>
                    <input type="tel" onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Min 10 angka" required />
                </div>
                <div>
                    <label className="text-sm font-medium">Password</label>
                    <input type="password" onChange={(e) => setPass(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <div className="w-full bg-gray-200 h-2 mt-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${strength}%` }}></div>
                    </div>
                    <p className="text-[10px] mt-1 font-bold text-gray-500">Strength: {strength}%</p>
                </div>
                <div>
                    <label className="text-sm font-medium">Confirm Password</label>
                    <input type="password" onChange={(e) => setConfirmPass(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold shadow-lg transition-all">
                    REGISTER
                </button>
                <SocialAuth />
                <p className="text-center text-sm text-gray-600 mt-2">
                    Sudah punya akun? <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">Login</Link>
                </p>
            </form>
        </AuthFromWrapper>
    );
}
