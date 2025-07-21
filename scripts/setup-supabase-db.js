const { execSync } = require('child_process');

// Usar conexión directa con la URL correcta del proyecto
const SUPABASE_URL = "postgresql://postgres:Tr3scorazon!@db.fmdnopkzeisopsohrzrq.supabase.co:5432/postgres";

console.log('🚀 Configurando base de datos de Supabase...');
console.log('📍 Usando conexión directa');
console.log('🔗 URL:', SUPABASE_URL.replace(/:[^:@]*@/, ':****@')); // Ocultar contraseña

try {
  // Generar el cliente de Prisma
  console.log('📦 Generando cliente de Prisma...');
  execSync(`DATABASE_URL="${SUPABASE_URL}" npx prisma generate`, { 
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: SUPABASE_URL }
  });

  // Crear las tablas
  console.log('🗄️ Creando tablas en Supabase...');
  execSync(`DATABASE_URL="${SUPABASE_URL}" npx prisma db push`, { 
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: SUPABASE_URL }
  });

  console.log('✅ Base de datos de Supabase configurada exitosamente!');
  console.log('');
  console.log('📋 Próximo paso: Ejecutar migración de datos');
  console.log('npx tsx scripts/migrate-to-supabase.ts');

} catch (error) {
  console.error('❌ Error configurando la base de datos:', error.message);
  console.log('');
  console.log('💡 Posibles soluciones:');
  console.log('1. Verificar que el proyecto esté activo en Supabase');
  console.log('2. Verificar la contraseña de la base de datos');
  console.log('3. Verificar que el proyecto esté en la región correcta');
  process.exit(1);
} 