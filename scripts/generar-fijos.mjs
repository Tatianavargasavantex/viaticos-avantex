// Genera presupuestos fijos de la semana actual.
// Replica la lógica del botón "Generar semana actual" del dashboard.
// Se ejecuta cada lunes via GitHub Actions.

import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.SUPABASE_URL || 'https://qyzlzfagdqkpczifnphd.supabase.co'
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SB_KEY) { console.error('Falta SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }

const sb = createClient(SB_URL, SB_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const MESES = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO',
               'JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE']

const hoy   = new Date()
const dia   = hoy.getDate()
const semana = dia <= 7 ? 1 : dia <= 14 ? 2 : dia <= 21 ? 3 : dia <= 28 ? 4 : 5
const mes   = MESES[hoy.getMonth()]
const anio  = hoy.getFullYear()

console.log(`Generando presupuestos fijos — Semana ${semana} · ${mes} ${anio}`)

// 1. Leer plantillas activas
const { data: fijos, error: ef } = await sb
  .from('presupuestos_fijos')
  .select('*')
  .eq('activo', true)

if (ef) { console.error('Error leyendo presupuestos_fijos:', ef.message); process.exit(1) }
if (!fijos || fijos.length === 0) { console.log('No hay presupuestos fijos activos. Nada que generar.'); process.exit(0) }

console.log(`Plantillas activas: ${fijos.length}`)

// 2. Insertar evitando duplicados
let generados = 0, omitidos = 0, errores = 0

for (const f of fijos) {
  // Verificar si ya existe para esta semana/mes/año
  const { data: dup } = await sb
    .from('presupuestos')
    .select('id')
    .eq('tecnico_nombre', f.tecnico_nombre)
    .eq('concepto',       f.concepto)
    .eq('semana',         semana)
    .eq('mes',            mes)
    .eq('anio',           anio)
    .limit(1)

  if (dup && dup.length > 0) { omitidos++; continue }

  const { error: ei } = await sb.from('presupuestos').insert([{
    semana,
    mes,
    anio,
    tipo:          'PRESUPUESTADO',
    tecnico_nombre: f.tecnico_nombre,
    tecnico_id:     f.tecnico_id    || null,
    zona:           f.zona          || '',
    ciudad:         f.ciudad        || '',
    udn:            f.udn           || '',
    coordinador:    f.coordinador   || '',
    concepto:       f.concepto,
    monto:          f.monto,
    local_viaje:    f.local_viaje,
    estado:         'PENDIENTE',
    estado_dispersion: 'pendiente',
  }])

  if (ei) {
    console.error(`  Error insertando ${f.tecnico_nombre} / ${f.concepto}: ${ei.message}`)
    errores++
  } else {
    generados++
  }
}

console.log(`\nResultado: ${generados} generados · ${omitidos} ya existían · ${errores} errores`)
if (errores > 0) process.exit(1)
