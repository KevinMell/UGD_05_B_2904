'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface RegisterFormData {
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    captchaInput: string;
}

interface ErrorObject {
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    captcha?: string;
}

const RegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<RegisterFormData>({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        captchaInput: ''
    });
    const [errors, setErrors] = useState<ErrorObject>({});
    
    // State tambahan sesuai instruksi soal
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [captchaText, setCaptchaText] = useState<string>('');
    const [passwordStrength, setPasswordStrength] = useState<number>(0);

    // Generate Captcha acak saat halaman dimuat
    useEffect(() => {
        refreshCaptcha();
    }, []);

    // Indikator Kekuatan Password menggunakan rumus dari soal
    useEffect(() => {
        const pwd = formData.password;
        // Rumus sesuai soal PDF
        const strength = (pwd.length > 7 ? 25 : 0) +
                         (/[A-Z]/.test(pwd) ? 25 : 0) +
                         (/[0-9]/.test(pwd) ? 25 : 0) +
                         (/[^A-Za-z0-9]/.test(pwd) ? 25 : 0);
        
        setPasswordStrength(Math.min(100, strength));
    }, [formData.password]);

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: ErrorObject = {};

        // Validasi Username: Min 3, Max 8 karakter
        if (!formData.username.trim()) {
            newErrors.username = 'Username tidak boleh kosong';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username minimal 3 karakter';
        } else if (formData.username.length > 8) {
            newErrors.username = 'Username maksimal 8 karakter';
        }

        // Validasi Email: Harus ada @ dan domain .com/.net/.co
        const emailRegex = /@.*\.(com|net|co)/i;
        if (!formData.email.trim()) {
            newErrors.email = 'Email tidak boleh kosong';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Format email tidak valid (harus ada @ dan .com/.net/.co)';
        }

        // Validasi Nomor Telepon: Min 10 karakter, hanya angka
        const phoneRegex = /^\d+$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Nomor telepon tidak boleh kosong';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Nomor telepon hanya boleh berisi angka';
        } else if (formData.phone.length < 10) {
            newErrors.phone = 'Nomor telepon minimal 10 karakter';
        }

        // Validasi Password: Min 8 karakter
        if (!formData.password.trim()) {
            newErrors.password = 'Password tidak boleh kosong';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password minimal 8 karakter';
        }

        // Validasi Konfirmasi Password
        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
        }

        // Validasi Captcha
        if (!formData.captchaInput.trim()) {
            newErrors.captcha = 'Captcha belum diisi';
        } else if (formData.captchaInput !== captchaText) {
            newErrors.captcha = 'Captcha salah';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Registrasi Gagal! Periksa kembali form Anda.', { theme: 'dark', position: 'top-right' });
            return;
        }

        toast.success('Registrasi Berhasil! Silakan Login.', { theme: 'dark', position: 'top-right' });
        router.push('/auth/login');
    };

    // Fungsi untuk mengubah warna bar indikator password
    const getStrengthColor = () => {
        if (passwordStrength <= 25) return 'bg-red-500';
        if (passwordStrength <= 50) return 'bg-orange-500';
        if (passwordStrength <= 75) return 'bg-yellow-400';
        return 'bg-green-500';
    };

    return (
        <AuthFormWrapper title="Register">
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                
                {/* Username */}
                <div className="space-y-1">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                    <input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukan username"
                    />
                    {errors.username && <p className="text-red-600 text-xs italic">{errors.username}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukan email"
                    />
                    {errors.email && <p className="text-red-600 text-xs italic">{errors.email}</p>}
                </div>

                {/* Nomor Telepon */}
                <div className="space-y-1">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukan nomor telepon"
                    />
                    {errors.phone && <p className="text-red-600 text-xs italic">{errors.phone}</p>}
                </div>

                {/* Password & Strength Indicator */}
                <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg border pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukan password"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {/* Password Strength Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Strength: {passwordStrength}%</p>
                    {errors.password && <p className="text-red-600 text-xs italic mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg border pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Masukan konfirmasi password"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-600 text-xs italic mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Captcha */}
                <div className="space-y-1 pt-2">
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-gray-700">Captcha:</span>
                        <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded select-none">
                            {captchaText}
                        </span>
                        <button 
                            type="button" 
                            onClick={refreshCaptcha}
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                            title="Refresh Captcha"
                        >
                            🔄
                        </button>
                    </div>
                    <input
                        type="text"
                        name="captchaInput"
                        value={formData.captchaInput}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukan captcha"
                    />
                    {errors.captcha && <p className="text-red-600 text-xs italic mt-1">{errors.captcha}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors mt-4"
                >
                    Register
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthFormWrapper>
    );
};

export default RegisterPage;
