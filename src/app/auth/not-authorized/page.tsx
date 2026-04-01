import Link from 'next/link';
import React from 'react';

export default function NotAuthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <div className="text-red-500 text-6xl mb-4 flex justify-center">
                    {/* Icon silang sederhana bawaan teks */}
                    &#x26A0;&#xFE0F;
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Akses Ditolak!</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Halaman game tidak boleh diakses secara langsung. Anda harus <strong>login</strong> terlebih dahulu untuk bisa bermain.
                </p>
                <Link
                    href="/auth/login"
                    className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                    Kembali ke Halaman Login
                </Link>
            </div>
        </div>
    );
}