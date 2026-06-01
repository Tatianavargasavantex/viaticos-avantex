// Migración: agregar columnas de dispersión a la tabla presupuestos
// Uso: node agregar-columnas-dispersion.mjs <PERSONAL_ACCESS_TOKEN>
// El PAT se obtiene en: https://supabase.com/dashboard/account/tokens
//
// Si no tienes PAT, ejecuta este SQL directamente en el SQL Editor de Supabase:
//
//   ALTER TABLE presupuestos ADD COLUMN IF NOT EXISTS fecha_dispersion date;
//   ALTER TABLE presupuestos ADD COLUMN IF NOT EXISTS estado_dispersion text DEFAULT 'pendiente';
//   ALTER TABLE presupuestos ADD COLUMN IF NOT EXISTS fecha_dispersado timestamptz;
//   ALTER TABLE presupuestos ADD COLUMN IF NOT EXISTS dispersado_por text;

const PROJECT_REF = 'qyzlzfagdqkpczifnphd'
const PAT = process.argv[2]

const sql = `
ALTER TABLE presupuestos ADD COLUMN IF NOT EXISTS fecha_dispersion date;
ALTER TABLE presupuestos ADD COLUMN IF NOT EXISTS estado_dispersion text DEFAULT 'pendiente';
ALTER TABLE presupuestos ADD COLUMN IF NOT EXISTS fecha_dispersado timestamptz;
ALTER TABLE presupuestos ADD COLUMN IF NOT EXISTS dispersado_por text;
`.trim()

if (!PAT) {
  console.log('No se proporcionó Personal Access Token.')
  console.log('Ejecuta manualmente en el SQL Editor de Supabase:\n')
  console.log(sql)
  process.exit(0)
}

console.log('Ejecutando migración...')
const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${PAT}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: sql }),
})

const body = await res.json()
if (!res.ok) {
  console.error('Error al ejecutar migración:', JSON.stringify(body, null, 2))
  process.exit(1)
}
console.log('Columnas agregadas correctamente.')
