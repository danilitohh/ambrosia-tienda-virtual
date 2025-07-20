"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Phone, Lock, CheckCircle, AlertCircle, Globe, ChevronDown } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'security' | 'phone' | 'password' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [countryCode, setCountryCode] = useState('+57');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/get-security-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSecurityQuestion(data.securityQuestion);
        setStep('security');
      } else {
        setError(data.error || 'Error al obtener la pregunta de seguridad.');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!securityAnswer.trim()) {
      setError('La respuesta de seguridad es requerida.');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/verify-security-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          securityAnswer
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStep('phone');
      } else {
        setError(data.error || 'Error al verificar la respuesta de seguridad.');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phone.trim()) {
      setError('El número de teléfono es requerido.');
      return;
    }

    // Validar formato de teléfono (solo números)
    if (!/^\d{10}$/.test(phone.trim())) {
      setError('El teléfono debe tener 10 dígitos (sin incluir el código de país).');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          phone: countryCode + phone
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStep('password');
      } else {
        setError(data.error || 'Error al verificar el número de teléfono.');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/reset-password-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          newPassword 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStep('success');
      } else {
        setError(data.error || 'Error al actualizar la contraseña.');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/auth/signin" 
            className="inline-flex items-center text-[#C6FF00] hover:text-[#b2e600] mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio de sesión
          </Link>
          
          <div className="w-16 h-16 bg-[#C6FF00] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-black" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Recuperar contraseña
          </h1>
          <p className="text-gray-400">
            {step === 'email' && 'Ingresa tu email para verificar tu identidad.'}
            {step === 'security' && 'Responde la pregunta de seguridad para continuar.'}
            {step === 'phone' && 'Ingresa tu número de teléfono para verificar tu identidad.'}
            {step === 'password' && 'Crea tu nueva contraseña.'}
            {step === 'success' && '¡Contraseña actualizada exitosamente!'}
          </p>
        </div>

        {/* Step 1: Email */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="bg-[#181818] p-6 rounded-lg">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded bg-[#23272a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00] transition-colors"
                disabled={loading}
              />
            </div>
            
            {error && (
              <div className="flex items-center mb-4 p-3 bg-red-900/20 border border-red-600 rounded">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading || !email.trim()}
              className="w-full bg-[#C6FF00] hover:bg-[#b2e600] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Verificando...
                </>
              ) : (
                'Continuar'
              )}
            </button>
          </form>
        )}

        {/* Step 2: Security Question */}
        {step === 'security' && (
          <form onSubmit={handleSecuritySubmit} className="bg-[#181818] p-6 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pregunta de seguridad
              </label>
              <div className="p-3 bg-gray-800 rounded border border-gray-700 text-white">
                {securityQuestion}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="securityAnswer" className="block text-sm font-medium text-gray-300 mb-2">
                Tu respuesta
              </label>
              <input
                id="securityAnswer"
                type="text"
                placeholder="Tu respuesta"
                value={securityAnswer}
                onChange={e => setSecurityAnswer(e.target.value)}
                required
                className="w-full px-4 py-3 rounded bg-[#23272a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00] transition-colors"
                disabled={loading}
              />
            </div>
            
            {error && (
              <div className="flex items-center mb-4 p-3 bg-red-900/20 border border-red-600 rounded">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading || !securityAnswer.trim()}
              className="w-full bg-[#C6FF00] hover:bg-[#b2e600] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Verificando...
                </>
              ) : (
                'Continuar'
              )}
            </button>
          </form>
        )}

        {/* Step 3: Phone Verification */}
        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="bg-[#181818] p-6 rounded-lg">
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Número de teléfono
              </label>
              <div className="flex">
                <div className="relative flex-shrink-0">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="appearance-none relative block w-20 pl-10 pr-8 py-3 border border-gray-600 text-white bg-gray-700 rounded-l-md focus:outline-none focus:ring-[#C6FF00] focus:border-[#C6FF00] focus:z-10 sm:text-sm cursor-pointer"
                  >
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+54">🇦🇷 +54</option>
                    <option value="+55">🇧🇷 +55</option>
                    <option value="+56">🇨🇱 +56</option>
                    <option value="+58">🇻🇪 +58</option>
                    <option value="+593">🇪🇨 +593</option>
                    <option value="+51">🇵🇪 +51</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 pointer-events-none" />
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="3001234567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    maxLength={10}
                    className="w-full pl-10 pr-3 py-3 border border-l-0 border-gray-600 text-white bg-gray-700 rounded-r-md focus:outline-none focus:ring-[#C6FF00] focus:border-[#C6FF00] focus:z-10 sm:text-sm"
                    disabled={loading}
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Solo números, sin incluir el código de país
              </p>
            </div>
            
            {error && (
              <div className="flex items-center mb-4 p-3 bg-red-900/20 border border-red-600 rounded">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading || !phone.trim()}
              className="w-full bg-[#C6FF00] hover:bg-[#b2e600] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Verificando...
                </>
              ) : (
                'Continuar'
              )}
            </button>
          </form>
        )}

        {/* Step 4: New Password */}
        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="bg-[#181818] p-6 rounded-lg">
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Nueva contraseña
              </label>
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded bg-[#23272a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00] transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded bg-[#23272a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00] transition-colors"
                disabled={loading}
              />
            </div>
            
            {error && (
              <div className="flex items-center mb-4 p-3 bg-red-900/20 border border-red-600 rounded">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
              className="w-full bg-[#C6FF00] hover:bg-[#b2e600] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Actualizando...
                </>
              ) : (
                'Actualizar Contraseña'
              )}
            </button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="bg-[#181818] p-6 rounded-lg border border-green-600">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              <h2 className="text-lg font-semibold text-green-400">
                ¡Contraseña actualizada!
              </h2>
            </div>
            <p className="text-gray-300 mb-6">
              Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
            </p>
            <Link
              href="/auth/signin"
              className="w-full bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              Ir al inicio de sesión
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/signup" className="text-[#C6FF00] hover:text-[#b2e600] underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 