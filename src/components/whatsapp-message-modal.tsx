"use client";
import { useState } from "react";

interface WhatsAppMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  phoneNumber: string;
}

export default function WhatsAppMessageModal({ 
  isOpen, 
  onClose, 
  message, 
  phoneNumber 
}: WhatsAppMessageModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#181818] p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#C6FF00]">
            Mensaje de WhatsApp
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#C6FF00] mb-3">
            Tu mensaje con emojis:
          </h3>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <pre className="text-white whitespace-pre-wrap font-sans text-sm">
              {message}
            </pre>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={copyToClipboard}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-[#C6FF00] hover:bg-[#b2e600] text-black'
            }`}
          >
            {copied ? '¡Copiado!' : 'Copiar Mensaje'}
          </button>
          
          <button
            onClick={openWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Abrir WhatsApp
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-500">
          <h4 className="text-blue-300 font-semibold mb-2">Instrucciones:</h4>
          <ol className="text-blue-200 text-sm space-y-1">
            <li>1. Haz clic en "Copiar Mensaje"</li>
            <li>2. Haz clic en "Abrir WhatsApp"</li>
            <li>3. Pega el mensaje (Ctrl+V o Cmd+V)</li>
            <li>4. Envía el mensaje</li>
          </ol>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white underline"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
} 