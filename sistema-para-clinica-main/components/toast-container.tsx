"use client"

import { useApp } from "@/context/app-context"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function ToastContainer() {
  const { toasts, removeToast } = useApp()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] transition-all duration-300 animate-in slide-in-from-right",
            toast.type === "success"
              ? "bg-woofy-accent text-primary"
              : "bg-destructive text-destructive-foreground"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="flex-1 font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
