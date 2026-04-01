'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Game1 from "../../components/Game1";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            router.push('/auth/not-authorized');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        router.push('/auth/login');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500 relative">
            <button 
                onClick={handleLogout}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-md"
            >
                Logout
            </button>
            <h1 className="text-white text-4xl font-bold mb-8 drop-shadow-lg">Selamat Datang!</h1>
            <div className="bg-white p-4 rounded-2xl shadow-2xl">
                <Game1 />
            </div>
        </div>
    );
}
