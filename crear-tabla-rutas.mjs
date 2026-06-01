// Migración: crear tabla rutas, insertar datos y agregar columna ruta a presupuestos
// Ejecutar: node crear-tabla-rutas.mjs
//
// DDL — ejecutar manualmente en Supabase SQL Editor si el script falla:
//
// CREATE TABLE IF NOT EXISTS rutas (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   ruta text NOT NULL,
//   region text,
//   estado text,
//   sede_atencion text,
//   activo boolean DEFAULT true
// );
//
// ALTER TABLE presupuestos ADD COLUMN IF NOT EXISTS ruta text;

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://qyzlzfagdqkpczifnphd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5emx6ZmFnZHFrcGN6aWZucGhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgwMDk0MSwiZXhwIjoyMDkyMzc2OTQxfQ.pp7I7cKQrnNg8athBmEbCM_Ff2uT6b7F2MARc1NhSEs',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const RUTAS = [
  { ruta:'Aguascalientes',                region:'Bajio',    estado:'Aguascalientes',         sede_atencion:'Aguascalientes' },
  { ruta:'Leon',                          region:'Bajio',    estado:'Guanajuato',             sede_atencion:'Leon' },
  { ruta:'Guanajuato',                    region:'Bajio',    estado:'Guanajuato',             sede_atencion:'Leon' },
  { ruta:'Silao',                         region:'Bajio',    estado:'Guanajuato',             sede_atencion:'Leon' },
  { ruta:'Celaya',                        region:'Bajio',    estado:'Guanajuato',             sede_atencion:'Queretaro' },
  { ruta:'Queretaro',                     region:'Bajio',    estado:'Queretaro',              sede_atencion:'Queretaro' },
  { ruta:'San Luis Potosi',               region:'Bajio',    estado:'San Luis Potosi',        sede_atencion:'San Luis Potosi' },
  { ruta:'Zacatecas',                     region:'Bajio',    estado:'Zacatecas',              sede_atencion:'San Luis Potosi' },
  { ruta:'CDMX',                          region:'Centro',   estado:'Estado de Mexico',       sede_atencion:'Ciudad de Mexico' },
  { ruta:'CDMX-Ruta 1',                   region:'Centro',   estado:'Estado de Mexico',       sede_atencion:'Ciudad de Mexico' },
  { ruta:'CDMX-Ruta 2',                   region:'Centro',   estado:'Estado de Mexico',       sede_atencion:'Ciudad de Mexico' },
  { ruta:'CDMX-Ruta 3',                   region:'Centro',   estado:'Estado de Mexico',       sede_atencion:'Ciudad de Mexico' },
  { ruta:'CDMX-Ruta 4',                   region:'Centro',   estado:'Estado de Mexico',       sede_atencion:'Ciudad de Mexico' },
  { ruta:'CDMX-Ruta 5',                   region:'Centro',   estado:'Estado de Mexico',       sede_atencion:'Ciudad de Mexico' },
  { ruta:'CDMX-Ruta 6',                   region:'Centro',   estado:'Estado de Mexico',       sede_atencion:'Ciudad de Mexico' },
  { ruta:'CDMX-Toluca',                   region:'Centro',   estado:'Estado de Mexico',       sede_atencion:'Ciudad de Mexico' },
  { ruta:'CDMX-Morelos',                  region:'Centro',   estado:'Morelos',                sede_atencion:'Ciudad de Mexico' },
  { ruta:'CDMX-Hidalgo',                  region:'Centro',   estado:'Hidalgo',                sede_atencion:'Ciudad de Mexico' },
  { ruta:'Guerrero-Ruta 1',               region:'Centro',   estado:'Guerrero',               sede_atencion:'Acapulco' },
  { ruta:'Puebla-Ruta 1',                 region:'Centro',   estado:'Puebla',                 sede_atencion:'Puebla' },
  { ruta:'Puebla-Tlaxcala',               region:'Centro',   estado:'Tlaxcala',               sede_atencion:'Puebla' },
  { ruta:'Tlaxcala',                      region:'Centro',   estado:'Tlaxcala',               sede_atencion:'Puebla' },
  { ruta:'Monclova',                      region:'Matriz',   estado:'Coahuila',               sede_atencion:'Saltillo' },
  { ruta:'Acuña',                         region:'Matriz',   estado:'Coahuila',               sede_atencion:'Saltillo' },
  { ruta:'Piedras Negras',                region:'Matriz',   estado:'Coahuila',               sede_atencion:'Saltillo' },
  { ruta:'Sabinas',                       region:'Matriz',   estado:'Coahuila',               sede_atencion:'Saltillo' },
  { ruta:'Saltillo',                      region:'Matriz',   estado:'Coahuila',               sede_atencion:'Saltillo' },
  { ruta:'Saltillo Fumigación',           region:'Matriz',   estado:'Coahuila',               sede_atencion:'Saltillo' },
  { ruta:'Torreon',                       region:'Matriz',   estado:'Coahuila',               sede_atencion:'Torreon' },
  { ruta:'Durango',                       region:'Matriz',   estado:'Durango',                sede_atencion:'Torreon' },
  { ruta:'Apodaca',                       region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Apodaca Fumigación',            region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Calzada del valle',             region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Campestre',                     region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Campestre Fumigación',          region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Carretera Nacional',            region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Carretera Nacional Fumigación', region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Centrito',                      region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Centro',                        region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Cumbres',                       region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Cumbres Nte Fumigación',        region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Cumbres Sur Fumigación',        region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Escobedo',                      region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Escobedo Fumigación',           region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Especiales',                    region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Especiales FUMIGACIÓN',         region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Garcia',                        region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Garza Sada',                    region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Garza Sada Fumigación',         region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Gomez Morin',                   region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Gomez Morin Fumigación',        region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Guadalupe',                     region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Guadalupe Fumigación',          region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Linda Vista',                   region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Obispado',                      region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Monterrey',                     region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Monterrey Ote Fumigación',      region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Monterrey Pte Fumigación',      region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Ruta Quincenal',                region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Sábados',                       region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'San Agustin',                   region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'San Jeronimo',                  region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'San Nicolas',                   region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'San Nicolás Fumigación',        region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'San Pedro Fumigación',          region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Santa Catarina',                region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Santa Catarina Fumigación',     region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Valle Oriente',                 region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Valle Poniente',                region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Vasconcelos',                   region:'Matriz',   estado:'Nuevo Leon',             sede_atencion:'Monterrey' },
  { ruta:'Nuevo Laredo',                  region:'Noreste',  estado:'Tamaulipas',             sede_atencion:'Monterrey' },
  { ruta:'Matamoros',                     region:'Noreste',  estado:'Tamaulipas',             sede_atencion:'Reynosa' },
  { ruta:'Nuevo Progreso',                region:'Noreste',  estado:'Tamaulipas',             sede_atencion:'Reynosa' },
  { ruta:'Reynosa',                       region:'Noreste',  estado:'Tamaulipas',             sede_atencion:'Reynosa' },
  { ruta:'Ciudad Victoria',               region:'Noreste',  estado:'Tamaulipas',             sede_atencion:'Tampico' },
  { ruta:'Tampico',                       region:'Noreste',  estado:'Tamaulipas',             sede_atencion:'Tampico' },
  { ruta:'Poza Rica',                     region:'Noreste',  estado:'Veracruz',               sede_atencion:'Veracruz' },
  { ruta:'Veracruz',                      region:'Noreste',  estado:'Veracruz',               sede_atencion:'Veracruz' },
  { ruta:'Xalapa',                        region:'Noreste',  estado:'Veracruz',               sede_atencion:'Veracruz' },
  { ruta:'Ensenada',                      region:'Noroeste', estado:'Baja California',        sede_atencion:'Tijuana' },
  { ruta:'Mexicali',                      region:'Noroeste', estado:'Baja California',        sede_atencion:'Tijuana' },
  { ruta:'Tijuana',                       region:'Noroeste', estado:'Baja California',        sede_atencion:'Tijuana' },
  { ruta:'Tijuana Este',                  region:'Noroeste', estado:'Baja California',        sede_atencion:'Tijuana' },
  { ruta:'Tijuana Oeste',                 region:'Noroeste', estado:'Baja California',        sede_atencion:'Tijuana' },
  { ruta:'Comondu',                       region:'Noroeste', estado:'Baja California Sur',    sede_atencion:'La Paz' },
  { ruta:'La Paz',                        region:'Noroeste', estado:'Baja California Sur',    sede_atencion:'La Paz' },
  { ruta:'La Paz Norte',                  region:'Noroeste', estado:'Baja California Sur',    sede_atencion:'La Paz' },
  { ruta:'Loreto',                        region:'Noroeste', estado:'Baja California Sur',    sede_atencion:'La Paz' },
  { ruta:'Los Cabos',                     region:'Noroeste', estado:'Baja California Sur',    sede_atencion:'La Paz' },
  { ruta:'Mulegue',                       region:'Noroeste', estado:'Baja California Sur',    sede_atencion:'La Paz' },
  { ruta:'Santa Rosalia',                 region:'Noroeste', estado:'Baja California Sur',    sede_atencion:'La Paz' },
  { ruta:'Cd. Juarez',                    region:'Noroeste', estado:'Chihuahua',              sede_atencion:'Ciudad Juarez' },
  { ruta:'Cd. Juarez EA 03',              region:'Noroeste', estado:'Chihuahua',              sede_atencion:'Ciudad Juarez' },
  { ruta:'Chihuahua',                     region:'Noroeste', estado:'Chihuahua',              sede_atencion:'Chihuahua' },
  { ruta:'Chihuahua Centro',              region:'Noroeste', estado:'Chihuahua',              sede_atencion:'Chihuahua' },
  { ruta:'Chihuahua Norponiente',         region:'Noroeste', estado:'Chihuahua',              sede_atencion:'Chihuahua' },
  { ruta:'Chihuahua Foraneo',             region:'Noroeste', estado:'Chihuahua',              sede_atencion:'Chihuahua' },
  { ruta:'Culiacan',                      region:'Noroeste', estado:'Sinaloa',                sede_atencion:'Culiacan' },
  { ruta:'Guasave',                       region:'Noroeste', estado:'Sinaloa',                sede_atencion:'Los Mochis' },
  { ruta:'Ciudad Obregon',                region:'Noroeste', estado:'Sonora',                 sede_atencion:'Los Mochis' },
  { ruta:'Guaymas',                       region:'Noroeste', estado:'Sonora',                 sede_atencion:'Hermosillo' },
  { ruta:'Hermosillo',                    region:'Noroeste', estado:'Sonora',                 sede_atencion:'Hermosillo' },
  { ruta:'Los Mochis',                    region:'Noroeste', estado:'Sinaloa',                sede_atencion:'Los Mochis' },
  { ruta:'Mazatlan',                      region:'Noroeste', estado:'Sinaloa',                sede_atencion:'Culiacan' },
  { ruta:'Nogales',                       region:'Noroeste', estado:'Sonora',                 sede_atencion:'Hermosillo' },
  { ruta:'Colima',                        region:'Pacifico', estado:'Colima',                 sede_atencion:'Guadalajara' },
  { ruta:'Guadalajara Ruta 1',            region:'Pacifico', estado:'Jalisco',                sede_atencion:'Guadalajara' },
  { ruta:'Guadalajara Ruta 2',            region:'Pacifico', estado:'Jalisco',                sede_atencion:'Guadalajara' },
  { ruta:'Puerto Vallarta',               region:'Pacifico', estado:'Jalisco',                sede_atencion:'Puerto Vallarta' },
  { ruta:'Morelia',                       region:'Pacifico', estado:'Michoacan',              sede_atencion:'Morelia' },
  { ruta:'Nayarit',                       region:'Pacifico', estado:'Nayarit',                sede_atencion:'Puerto Vallarta' },
  { ruta:'Nuevo Vallarta',                region:'Pacifico', estado:'Nayarit',                sede_atencion:'Puerto Vallarta' },
  { ruta:'Campeche',                      region:'Sureste',  estado:'Campeche',               sede_atencion:'Merida' },
  { ruta:'Cancun',                        region:'Sureste',  estado:'Quintana Roo',           sede_atencion:'Cancun' },
  { ruta:'Chetumal',                      region:'Sureste',  estado:'Quintana Roo',           sede_atencion:'Cancun' },
  { ruta:'Playa del Carmen',              region:'Sureste',  estado:'Quintana Roo',           sede_atencion:'Cancun' },
  { ruta:'Tulum',                         region:'Sureste',  estado:'Quintana Roo',           sede_atencion:'Cancun' },
  { ruta:'Chiapas',                       region:'Sureste',  estado:'Chiapas',                sede_atencion:'Tuxtla Gutierrez' },
  { ruta:'Tapachula',                     region:'Sureste',  estado:'Chiapas',                sede_atencion:'Tuxtla Gutierrez' },
  { ruta:'Tuxtla Gutierrez',              region:'Sureste',  estado:'Chiapas',                sede_atencion:'Tuxtla Gutierrez' },
  { ruta:'Coatzacoalcos',                 region:'Sureste',  estado:'Veracruz',               sede_atencion:'Villahermosa' },
  { ruta:'Huatulco',                      region:'Sureste',  estado:'Oaxaca',                 sede_atencion:'Oaxaca' },
  { ruta:'Merida',                        region:'Sureste',  estado:'Yucatan',                sede_atencion:'Merida' },
  { ruta:'Oaxaca',                        region:'Sureste',  estado:'Oaxaca',                 sede_atencion:'Oaxaca' },
  { ruta:'Tabasco',                       region:'Sureste',  estado:'Tabasco',                sede_atencion:'Villahermosa' },
  { ruta:'Villahermosa',                  region:'Sureste',  estado:'Tabasco',                sede_atencion:'Villahermosa' },
]

// Verificar que la tabla existe intentando un select
const { error: checkErr } = await sb.from('rutas').select('id').limit(1)
if (checkErr) {
  console.error('La tabla "rutas" no existe aún. Ejecuta primero este SQL en Supabase:')
  console.log(`
CREATE TABLE IF NOT EXISTS rutas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ruta text NOT NULL,
  region text,
  estado text,
  sede_atencion text,
  activo boolean DEFAULT true
);

ALTER TABLE presupuestos ADD COLUMN IF NOT EXISTS ruta text;
  `)
  process.exit(1)
}

// Limpiar e insertar (upsert para evitar duplicados en ruta)
const { error } = await sb.from('rutas').upsert(RUTAS, { onConflict: 'ruta', ignoreDuplicates: false })
if (error) {
  // Si no hay unique constraint, insertar y ignorar duplicados
  const { data: existing } = await sb.from('rutas').select('ruta')
  const existentes = new Set((existing || []).map(r => r.ruta))
  const nuevas = RUTAS.filter(r => !existentes.has(r.ruta))
  if (nuevas.length === 0) {
    console.log(`Todas las rutas ya existían (${RUTAS.length} total). Nada que insertar.`)
  } else {
    const { error: e2 } = await sb.from('rutas').insert(nuevas)
    if (e2) { console.error('Error insertando rutas:', e2.message); process.exit(1) }
    console.log(`Insertadas ${nuevas.length} rutas nuevas (${existentes.size} ya existían)`)
  }
} else {
  console.log(`${RUTAS.length} rutas insertadas/actualizadas correctamente`)
}
