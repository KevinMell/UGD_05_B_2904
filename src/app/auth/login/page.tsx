'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface LoginFormData {
    email: string;
    password: string;
    captchaInput: string;
    remberMe?: boolean;
}

interface ErrorObject {
    email?: string;
    password?: string;
    captcha?: string;
}

// TODO: Ganti dengan NPM asli kamu (misal: "220711905")
const NPM_KAMU = "240000000"; 
const EMAIL_VALID = `${NPM_KAMU.slice(-4)}@gmail.com`; // Mengambil 4 digit terakhir untuk email

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        captchaInput: ''
    });
    const [errors, setErrors] = useState<ErrorObject>({});
    
    // State baru sesuai soal
    const [attempts, setAttempts] = useState<number>(3);
    const [captchaText, setCaptchaText] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // Generate Captcha acak saat komponen dimuat
    useEffect(() => {
        refreshCaptcha();
    }, []);

    const refreshCaptcha = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(result);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleResetKesempatan = () => {
        setAttempts(3);
        toast.success('Kesempatan login berhasil direset!', { theme: 'dark', position: 'top-right' });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: ErrorObject = {};
        
        // Validasi Kosong & Sesuai NPM [cite: 26, 27, 31, 32]
        if (!formData.email.trim()) {
            newErrors.email = 'Email tidak boleh kosong';
        } else if (formData.email !== EMAIL_VALID) {
            newErrors.email = `Email harus sesuai NPM (${EMAIL_VALID})`;
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password tidak boleh kosong';
        } else if (formData.password !== NPM_KAMU) {
            newErrors.password = 'Password harus sesuai NPM';
        }

        // Validasi Captcha [cite: 33]
        if (!formData.captchaInput.trim()) {
            newErrors.captcha = 'Captcha belum diisi';
        } else if (formData.captchaInput !== captchaText) {
            newErrors.captcha = 'Captcha salah';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            
            // Kurangi kesempatan jika gagal [cite: 6]
            const newAttempts = Math.max(0, attempts - 1);
            setAttempts(newAttempts);
            
            if (newAttempts === 0) {
                toast.error('Login gagal / kesempatan login habis.', { theme: 'dark', position: 'top-right' }); // [cite: 10]
            } else {
                toast.error(`Login Gagal! Sisa kesempatan: ${newAttempts}`, { theme: 'dark', position: 'top-right' }); // [cite: 7]
            }
            return;
        }

        // Jika Sukses [cite: 116]
        toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
        localStorage.setItem('isLoggedIn', 'true'); // Penanda untuk proteksi route di /home
        router.push('/home');
    };

    return (
        <AuthFormWrapper title="Login">
            {/* Teks Sisa Kesempatan */}
            <p className="text-center text-sm text-gray-600 mb-4">
                Sisa kesempatan: {attempts}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 w-full">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={attempts === 0}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} disabled:bg-gray-100`}
                        placeholder={`Masukan email (cth: ${EMAIL_VALID})`}
                    />
                    {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"} // Fitur Show/Hide [cite: 54]
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={attempts === 0}
                            className={`w-full px-4 py-2.5 rounded-lg border pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'} disabled:bg-gray-100`}
                            placeholder="Masukan password"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            disabled={attempts === 0}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-sm italic mt-1">{errors.password}</p>}
                    
                    <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="remberMe"
                                checked={formData.remberMe || false}
                                onChange={(e) => setFormData(prev => ({ ...prev, remberMe: e.target.checked }))}
                                className="mr-2 h-4 w-4 rounded border-gray-300"
                            />
                            Ingat Saya
                        </label>
                        <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Captcha:</span>
                        <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded select-none">
                            {captchaText}
                        </span>
                        <button 
                            type="button" 
                            onClick={refreshCaptcha}
                            disabled={attempts === 0}
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                            title="Refresh Captcha"
                        >
                            🔄 {/* Refresh Icon  */}
                        </button>
                    </div>
                    <input
                        type="text"
                        name="captchaInput"
                        value={formData.captchaInput}
                        onChange={handleChange}
                        disabled={attempts === 0}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'} disabled:bg-gray-100`}
                        placeholder="Masukan captcha"
                    />
                    {errors.captcha && <p className="text-red-600 text-sm italic mt-1">{errors.captcha}</p>}
                </div>

                <div className="space-y-3">
                    {/* Tombol Sign In abu-abu jika attempts 0 [cite: 10] */}
                    <button
                        type="submit"
                        disabled={attempts === 0}
                        className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors ${
                            attempts === 0 
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        Sign In
                    </button>

                    {/* Tombol Reset Kesempatan hijau jika attempts 0 [cite: 11] */}
                    <button
                        type="button"
                        onClick={handleResetKesempatan}
                        disabled={attempts > 0}
                        className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors ${
                            attempts === 0 
                            ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Reset Kesempatan
                    </button>
                </div>

                <SocialAuth />

                <p className="mt-6 text-center text-sm text-gray-600">
                    Tidak punya akun?{' '}
                    <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                        Daftar
                    </Link>
                </p>
            </form>
        </AuthFormWrapper>
    );
};

export default LoginPage;
