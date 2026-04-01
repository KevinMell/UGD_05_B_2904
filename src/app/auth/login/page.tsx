'use client';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import AuthFromWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '', captchaInput: '' });
    const [errors, setErrors] = useState<any>({});
    const [captchaCode, setCaptchaCode] = useState('');
    const [attempts, setAttempts] = useState(3);

    // Bikin Captcha Acak
    const generateCaptcha = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        setCaptchaCode(randomString);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (attempts <= 0) return;

        const newErrors: any = {};
        if (!formData.email.trim()) newErrors.email = 'Email tidak boleh kosong';
        if (!formData.password.trim()) newErrors.password = 'Password tidak boleh kosong';
        if (formData.captchaInput !== captchaCode) newErrors.captcha = 'Captcha salah';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setAttempts(prev => prev - 1);
            toast.error(`Login Gagal! Sisa kesempatan: ${attempts - 1}`, { theme: 'dark' });
            generateCaptcha(); // Reset captcha kalau salah
            setFormData({ ...formData, captchaInput: '' });
            return;
        }

        // Kalau sukses
        localStorage.setItem('isLoggedIn', 'true');
        toast.success('Login Berhasil!', { theme: 'dark' });
        router.push('/home');
    };

    return (
        <AuthFromWrapper title="Login">
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                {attempts <= 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center font-bold">
                        Akun terkunci! Terlalu banyak percobaan gagal.
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input name="email" value={formData.email} onChange={handleChange} disabled={attempts <= 0} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukan email" />
                    {errors.email && <p className="text-red-600 text-sm italic">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} disabled={attempts <= 0} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukan password" />
                    {errors.password && <p className="text-red-600 text-sm italic">{errors.password}</p>}
                </div>
                
                {/* Desain "Ingat Saya" & "Forgot Password" sesuai screenshotmu */}
                <div className="flex items-center justify-between mt-2 mb-4">
                    <div className="flex items-center">
                        <input type="checkbox" id="remember" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-700">Ingat Saya</label>
                    </div>
                    <Link href="/auth/forgot-password" className="text-sm font-bold text-blue-600 hover:underline">
                        Forgot Password?
                    </Link>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">Captcha:</span>
                        <span className="font-mono text-lg font-bold bg-gray-100 px-3 py-1 rounded tracking-widest">{captchaCode}</span>
                    </div>
                    <input type="text" name="captchaInput" value={formData.captchaInput} onChange={handleChange} disabled={attempts <= 0} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukan captcha" />
                    {errors.captcha && <p className="text-red-600 text-sm italic">{errors.captcha}</p>}
                </div>
                <button type="submit" disabled={attempts <= 0} className={`w-full py-2.5 rounded-lg text-white font-bold ${attempts > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}>
                    Sign In
                </button>
                <SocialAuth />
                <p className="mt-4 text-center text-sm">Tidak punya akun? <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">Daftar</Link></p>
            </form>
        </AuthFromWrapper>
    );
}
