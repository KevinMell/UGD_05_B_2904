'use client';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import AuthFromWrapper from '../../../components/AuthFormWrapper';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function RegisterPage() {
    const router = useRouter();
    const [pass, setPass] = useState('');
    const [strength, setStrength] = useState(0);

    // Rumus Strength sesuai Hint di PDF [cite: 96-101]
    useEffect(() => {
        let s = Math.min(
            (pass.length > 7 ? 25 : 0) +
            (/[A-Z]/.test(pass) ? 25 : 0) +
            (/[0-9]/.test(pass) ? 25 : 0) +
            (/[^A-Za-z0-9]/.test(pass) ? 25 : 0)
        );
        setStrength(s);
    }, [pass]);

    return (
        <AuthFromWrapper title="Register">
            <form className="space-y-3 w-full text-left">
                <div>
                    <label className="text-sm">Username (3-8 char)</label>
                    <input minLength={3} maxLength={8} className="w-full px-4 py-2 border rounded-lg" required /> 
                </div>
                <div>
                    <label className="text-sm">Nomor Telepon (Angka saja)</label>
                    <input type="tel" onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')} className="w-full px-4 py-2 border rounded-lg" required /> 
                </div>
                <div>
                    <label className="text-sm">Password</label>
                    <input type="password" onChange={(e) => setPass(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                    <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
                        <div className="bg-blue-500 h-full transition-all" style={{ width: `${strength}%` }}></div>
                    </div>
                    <p className="text-xs mt-1">Strength: {strength}%</p> [cite: 86, 92]
                </div>
                <div>
                    <label className="text-sm">Confirm Password</label>
                    <input type="password" className="w-full px-4 py-2 border rounded-lg" required /> [cite: 82]
                </div>
                <button type="button" onClick={() => { toast.success('Berhasil Daftar!'); router.push('/auth/login'); }} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Register</button>
            </form>
        </AuthFromWrapper>
    );
}
