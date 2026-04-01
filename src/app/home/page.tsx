'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Game1 from "../../components/Game1";

export default function Home() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Sistem harus mengecek status login pengguna [cite: 105]
        const loggedIn = localStorage.getItem('isLoggedIn');
        
        if (!loggedIn) {
            // Jika pengguna belum login, maka otomatis diarahkan ke halaman (/auth/not-authorized) [cite: 106]
            router.replace('/auth/not-authorized');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    // Mencegah konten game dirender kedip-kedip sebelum pengecekan selesai
    if (!isAuthorized) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-blue-500">
            <h1 className="text-4xl font-bold mb-4 text-white">Selamat Datang!</h1>
            {/* Komponen game kamu tetap aman di sini */}
            <Game1 />
        </div>
    );
}
