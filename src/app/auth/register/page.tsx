'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import AuthFromWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import { toast } from 'react-toastify';

export default function RegisterPage() {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [captchaCode, setCaptchaCode] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const passwordValue = watch('password', '');

    const generateCaptcha = () => {
        setCaptchaCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    };

    useEffect(() => generateCaptcha(), []);

    const getPasswordStrength = (pass: string) => {
        let score = 0;
        if (!pass) return { score: 0, text: '', color: 'bg-gray-200', width: '0%' };
        if (pass.length > 5) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (score <= 1) return { score, text: 'Lemah', color: 'bg-red-500', width: '25%' };
        if (score === 2) return { score, text: 'Sedang', color: 'bg-yellow-500', width: '50%' };
        if (score === 3) return { score, text: 'Kuat', color: 'bg-blue-500', width: '75%' };
        return { score, text: 'Sangat Kuat', color: 'bg-green-500', width: '100%' };
    };

    const strength = getPasswordStrength(passwordValue);

    const onSubmit = (data: any) => {
        if (data.password !== data.confirmPassword) {
            toast.error('Konfirmasi password tidak cocok!', { theme: 'dark' });
            return;
        }
        if (captchaInput !== captchaCode) {
            toast.error('Captcha salah!', { theme: 'dark' });
            generateCaptcha();
            setCaptchaInput('');
            return;
        }
        toast.success('Register Berhasil!', { theme: 'dark' });
        router.push("/auth/login");
    };

    return (
        <AuthFromWrapper title="Register">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full">
                <div>
                    <label className="text-sm font-medium">Username</label>
                    <input {...register('username', { required: 'Wajib diisi', maxLength: { value: 8, message: 'Maks 8 karakter' } })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukan username" />
                    {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username.message as string}</p>}
                </div>
                <div>
                    <label className="text-sm font-medium">Email</label>
                    <input type="email" {...register('email', { required: 'Wajib diisi' })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukan email" />
                </div>
                <div>
                    <label className="text-sm font-medium">Nomor Telepon</label>
                    <input type="tel" {...register('nomortelp', { required: 'Wajib diisi' })} onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukan nomor" />
                </div>
                <div>
                    <label className="text-sm font-medium">Password</label>
                    <input type="password" {...register('password', { required: 'Wajib diisi' })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukan password" />
                    
                    {passwordValue && (
                        <div className="mt-2">
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }}></div>
                            </div>
                            <p className={`text-xs mt-1 font-bold text-${strength.color.replace('bg-', '')}`}>{strength.text}</p>
                        </div>
                    )}
                </div>
                <div>
                    <label className="text-sm font-medium">Konfirmasi Password</label>
                    <input type="password" {...register('confirmPassword', { required: 'Wajib diisi' })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukan konfirmasi password" />
                </div>
                <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <span className="text-sm font-medium">Captcha:</span>
                        <span className="font-mono text-lg font-bold bg-gray-100 px-3 py-1 rounded">{captchaCode}</span>
                    </div>
                    <input type="text" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukan captcha" required />
                </div>
                <button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg">Register</button>
                <SocialAuth />
                <p className="mt-4 text-center text-sm">Sudah punya akun? <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">Login</Link></p>
            </form>
        </AuthFromWrapper>
    );
}
