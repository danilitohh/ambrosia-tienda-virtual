import { performance } from 'perf_hooks';

interface PerformanceTest {
  name: string;
  url: string;
  method?: string;
  body?: any;
}

const tests: PerformanceTest[] = [
  {
    name: 'Página Principal',
    url: 'http://localhost:3004/',
    method: 'GET'
  },
  {
    name: 'API Productos',
    url: 'http://localhost:3004/api/products',
    method: 'GET'
  },
  {
    name: 'API Settings',
    url: 'http://localhost:3004/api/admin/settings',
    method: 'GET'
  },
  {
    name: 'Página Productos',
    url: 'http://localhost:3004/products',
    method: 'GET'
  },
  {
    name: 'Página Carrito',
    url: 'http://localhost:3004/cart',
    method: 'GET'
  }
];

async function runPerformanceTest(test: PerformanceTest): Promise<{ success: boolean; duration: number; status?: number; error?: string }> {
  const start = performance.now();
  
  try {
    const response = await fetch(test.url, {
      method: test.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: test.body ? JSON.stringify(test.body) : undefined,
    });

    const duration = performance.now() - start;
    
    return {
      success: response.ok,
      duration,
      status: response.status
    };
  } catch (error) {
    const duration = performance.now() - start;
    return {
      success: false,
      duration,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando pruebas de rendimiento...\n');

  const results = [];

  for (const test of tests) {
    console.log(`📊 Probando: ${test.name}`);
    const result = await runPerformanceTest(test);
    
    if (result.success) {
      console.log(`✅ ${test.name}: ${result.duration.toFixed(2)}ms (${result.status})`);
    } else {
      console.log(`❌ ${test.name}: Error - ${result.error} (${result.duration.toFixed(2)}ms)`);
    }
    
    results.push({ ...test, ...result });
  }

  // Análisis de resultados
  console.log('\n📈 Análisis de Rendimiento:');
  
  const successfulTests = results.filter(r => r.success);
  if (successfulTests.length > 0) {
    const avgDuration = successfulTests.reduce((sum, r) => sum + r.duration, 0) / successfulTests.length;
    const maxDuration = Math.max(...successfulTests.map(r => r.duration));
    const minDuration = Math.min(...successfulTests.map(r => r.duration));

    console.log(`📊 Promedio: ${avgDuration.toFixed(2)}ms`);
    console.log(`⚡ Más rápido: ${minDuration.toFixed(2)}ms`);
    console.log(`🐌 Más lento: ${maxDuration.toFixed(2)}ms`);
    
    // Evaluación de rendimiento
    if (avgDuration < 500) {
      console.log('🎉 Excelente rendimiento!');
    } else if (avgDuration < 1000) {
      console.log('👍 Buen rendimiento');
    } else if (avgDuration < 2000) {
      console.log('⚠️ Rendimiento aceptable, considera optimizaciones');
    } else {
      console.log('🚨 Rendimiento lento, necesita optimizaciones urgentes');
    }
  }

  console.log('\n🔧 Recomendaciones:');
  console.log('- Implementa caché para APIs frecuentemente consultadas');
  console.log('- Optimiza imágenes y assets estáticos');
  console.log('- Considera CDN para mejor distribución global');
  console.log('- Monitorea métricas en producción con Vercel Analytics');
}

runAllTests(); 