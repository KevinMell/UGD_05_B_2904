'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Game1 from "../../components/Game1";

export default function Home() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Cek apakah user sudah berhasil login
        const checkLogin = localStorage.getItem('isLoggedIn');
        if (!checkLogin) {
            router.push('/auth/not-authorized');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        router.push('/auth/login');
    };

    if (!isAuthorized) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen min-w-screen bg-blue-500 relative">
            <button 
                onClick={handleLogout}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors"
            >
                Logout
            </button>
            <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-md">Selamat Datang!</h1>
            <Game1 />
        </div>
    );
}
