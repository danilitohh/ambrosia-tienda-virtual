import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for rate limiting
// En producción, usar Redis o similar
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Ventana de tiempo en milisegundos
  maxRequests: number; // Máximo número de requests por ventana
}

export function createRateLimiter(config: RateLimitConfig) {
  return function rateLimit(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Limpiar entradas expiradas
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }

    // Obtener o crear entrada para este IP
    const entry = rateLimitStore.get(ip) || { count: 0, resetTime: now + config.windowMs };
    
    // Verificar si la ventana ha expirado
    if (entry.resetTime < now) {
      entry.count = 0;
      entry.resetTime = now + config.windowMs;
    }

    // Incrementar contador
    entry.count++;
    rateLimitStore.set(ip, entry);

    // Verificar límite
    if (entry.count > config.maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    return null; // Continuar con la request
  };
}

// Configuraciones predefinidas
export const rateLimiters = {
  // Límite estricto para APIs críticas
  strict: createRateLimiter({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 requests por minuto
  
  // Límite moderado para APIs generales
  moderate: createRateLimiter({ windowMs: 60 * 1000, maxRequests: 60 }), // 60 requests por minuto
  
  // Límite relajado para páginas públicas
  relaxed: createRateLimiter({ windowMs: 60 * 1000, maxRequests: 300 }), // 300 requests por minuto
}; 