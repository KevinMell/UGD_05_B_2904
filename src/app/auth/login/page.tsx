import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify'; // Asumsi menggunakan react-toastify

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaText, setCaptchaText] = useState('abcdef'); // Contoh pattern acak [cite: 78]
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(3); // Nilai awal 3 [cite: 2]

  const refreshCaptcha = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Validasi Email & Password sesuai NPM 
    // Contoh NPM: 220711905 -> Email: 11905@gmail.com
    const isValidEmail = email === "11905@gmail.com"; 
    const isValidPassword = password === "220711905";
    const isValidCaptcha = captchaInput === captchaText;

    if (isValidEmail && isValidPassword && isValidCaptcha) {
      toast.success("Login Berhasil!"); [cite: 116]
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/home'); // Ke halaman game [cite: 116]
    } else {
      const newAttempts = Math.max(0, attempts - 1); [cite: 7]
      setAttempts(newAttempts);
      toast.error(`Login Gagal! Sisa kesempatan: ${newAttempts}`); [cite: 6, 7]
      
      if (newAttempts === 0) {
        toast.error("Kesempatan login habis!"); [cite: 10]
      }
    }
  };

  const handleReset = () => {
    setAttempts(3);
    toast.success("Kesempatan login berhasil direset"); [cite: 14, 20]
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <p>Sisa kesempatan: {attempts}</p> {/* [cite: 2] */}
      
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Masukkan email" 
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        
        <div className="password-field">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Masukkan password" 
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "👁️" : "🙈"} {/* [cite: 54] */}
          </button>
        </div>

        <div className="captcha-section">
          <span>{captchaText}</span>
          <button type="button" onClick={refreshCaptcha}>🔄</button> {/* [cite: 78] */}
          <input 
            type="text" 
            placeholder="Masukkan captcha" 
            onChange={(e) => setCaptchaInput(e.target.value)} 
          />
        </div>

        <button 
          type="submit" 
          disabled={attempts === 0}
          className={attempts === 0 ? "btn-disabled" : "btn-blue"}
        >
          Sign In
        </button>

        <button 
          type="button" 
          onClick={handleReset}
          disabled={attempts > 0} 
          className={attempts === 0 ? "btn-green" : "btn-disabled"}
        >
          Reset Kesempatan
        </button> {/* [cite: 11, 14] */}
      </form>
    </div>
  );
};
