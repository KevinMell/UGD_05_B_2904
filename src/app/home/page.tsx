'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Mengecek status login dari localStorage
        const loggedIn = localStorage.getItem('isLoggedIn');
        
        if (!loggedIn) {
            // Jika belum login, redirect ke halaman not-authorized
            router.replace('/auth/not-authorized');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    // Mencegah konten game dirender kedip-kedip sebelum pengecekan selesai
    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Selamat Datang di Halaman Game!</h1>
            <p className="text-gray-600">Karena kamu tidak mengerjakan bonus, biarkan halaman ini kosong atau isi seadanya.</p>
            
            {/* Tombol Logout (Opsional tapi bagus untuk testing) */}
            <button 
                onClick={() => {
                    localStorage.removeItem('isLoggedIn');
                    router.push('/auth/login');
                }}
                className="mt-8 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition-colors"
            >
                Logout
            </button>
        </div>
    );
}
