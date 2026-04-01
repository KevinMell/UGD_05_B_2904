'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Game1 from "../../components/Game1";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const login = localStorage.getItem('isLoggedIn');
        if (!login) {
            router.push('/auth/not-authorized'); // Redirect jika paksa akses URL [cite: 106, 114]
        }
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500">
            <h1 className="text-white text-3xl font-bold mb-4">Selamat Datang!</h1> [cite: 129]
            <Game1 />
        </div>
    );
}
