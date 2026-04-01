'use client';

import { useRouter } from 'next/navigation';

export default function NotAuthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-500 p-4">
            <div className="bg-blue-100 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                <div className="text-red-500 text-5xl mb-4 font-bold">
                    ❌
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Anda belum login</h1>
                <p className="text-gray-600 mb-6 text-sm">Silakan login terlebih dahulu.</p>
                <button
                    onClick={() => router.push('/auth/login')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto space-x-2"
                >
                    <span>⬅️</span>
                    <span>Kembali</span>
                </button>
            </div>
        </div>
    );
}
