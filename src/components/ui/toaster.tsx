"use client"

import { createContext, useContext, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number;
  imageUrl?: string;
}

interface ToasterContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined)

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after custom duration or 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToasterContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-6 right-6 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-2 p-3 rounded-lg shadow-lg min-w-[180px] max-w-[260px] border text-xs",
              {
                "bg-green-500 border-green-300 text-white": toast.type === "success",
                "bg-red-500 border-red-300 text-white": toast.type === "error",
                "bg-yellow-400 border-yellow-200 text-gray-900": toast.type === "warning",
                "bg-blue-500 border-blue-300 text-white": toast.type === "info",
              }
            )}
            style={{ boxShadow: "0 4px 16px rgba(80,80,80,0.18)" }}
          >
            {/* Icono por tipo */}
            <div className="flex-shrink-0">
              {toast.type === "success" && <CheckCircle className="h-4 w-4 text-white" />}
              {toast.type === "error" && <XCircle className="h-4 w-4 text-white" />}
              {toast.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-900" />}
              {toast.type === "info" && <Info className="h-4 w-4 text-white" />}
            </div>
            {/* Imagen del producto si existe */}
            {toast.imageUrl && (
              <img src={toast.imageUrl} alt="Producto" className="h-7 w-7 rounded object-cover border border-white" />
            )}
            <div className="flex-1">
              <h4 className="font-bold mb-0.5" style={{ fontSize: "1em" }} dangerouslySetInnerHTML={{ __html: toast.title }} />
              {toast.message && (
                <div className="opacity-95" style={{ fontSize: "0.95em" }} dangerouslySetInnerHTML={{ __html: toast.message }} />
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-1 text-white hover:text-gray-200 text-base focus:outline-none"
              aria-label="Cerrar notificación"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToasterContext.Provider>
  )
}

export function useToaster() {
  const context = useContext(ToasterContext)
  if (!context) {
    throw new Error("useToaster must be used within a ToasterProvider")
  }
  return context
}

export function Toaster() {
  return null // This is handled by the ToasterProvider
} 