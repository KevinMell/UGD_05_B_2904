'use client';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import AuthFromWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '', captchaInput: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [captchaCode, setCaptchaCode] = useState('');
    const [attempts, setAttempts] = useState(3); // Nilai awal 3 

    const generateCaptcha = () => {
        setCaptchaCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    };

    useEffect(() => { generateCaptcha(); }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (attempts <= 0) return;

        // Aturan: Email & Password harus sesuai NPM (contoh: 1905) 
        const isEmailValid = formData.email.includes('240711516') || formData.email.includes('1905'); 
        const isPasswordValid = formData.password === '240711516' || formData.password === '220711905';
        const isCaptchaValid = formData.captchaInput === captchaCode;

        if (!isEmailValid || !isPasswordValid || !isCaptchaValid) {
            const newAttempts = Math.max(0, attempts - 1);
            setAttempts(newAttempts);
            // Toast sisa kesempatan [cite: 6, 7]
            toast.error(`Login Gagal! Sisa kesempatan: ${newAttempts}`, { position: "top-right" });
            generateCaptcha();
            return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        toast.success('Berhasil Login!', { position: "top-right" }); [cite: 116]
        router.push('/home');
    };

    const handleReset = () => {
        setAttempts(3);
        toast.success('Kesempatan login berhasil direset!', { theme: 'colored' }); [cite: 20]
    };

    return (
        <AuthFromWrapper title="Login">
            <p className="text-center text-sm mb-4">Sisa kesempatan: {attempts}</p>
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <div className="text-left">
                    <label className="text-sm font-medium">Email</label>
                    <input name="email" placeholder="Masukan email (NPM@gmail.com)" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="text-left relative">
                    <label className="text-sm font-medium">Password</label>
                    <input type={showPassword ? "text" : "password"} placeholder="Masukan password (NPM)" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} [cite: 54]
                    </button>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                    <span className="font-bold tracking-widest">{captchaCode}</span>
                    <button type="button" onClick={generateCaptcha}><RotateCcw size={16} /></button> [cite: 78]
                </div>
                <input placeholder="Masukan captcha" onChange={(e) => setFormData({...formData, captchaInput: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />

                {/* Tombol Sign In: Abu-abu jika kesempatan habis [cite: 10] */}
                <button type="submit" disabled={attempts <= 0} className={`w-full py-2 rounded-lg text-white font-bold ${attempts > 0 ? 'bg-blue-600' : 'bg-gray-400'}`}>
                    Sign In
                </button>

                {/* Tombol Reset: Hijau jika 0, Abu-abu jika > 0 [cite: 2, 11, 14] */}
                <button type="button" onClick={handleReset} disabled={attempts > 0} className={`w-full py-2 rounded-lg text-white font-bold ${attempts === 0 ? 'bg-green-500' : 'bg-gray-400'}`}>
                    Reset Kesempatan
                </button>
                
                <SocialAuth />
                <p className="text-center text-sm">Tidak punya akun? <Link href="/auth/register" className="text-blue-600 font-bold">Daftar</Link></p>
            </form>
        </AuthFromWrapper>
    );
}
