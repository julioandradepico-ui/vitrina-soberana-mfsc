-- Esquema SQL Soberano para activar Supabase Free ($0/mes) en 2 minutos
-- 1. Crear proyecto gratuito en https://supabase.com
-- 2. Pegar este script en SQL Editor y ejecutar
-- 3. Configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel

create table if not exists public.organizaciones_mfsc (
  id text primary key,
  slug text unique not null,
  sigla text not null,
  razon_social text not null,
  nit text,
  municipio text not null,
  departamento text not null,
  hub_id text not null,
  lat double precision,
  lng double precision,
  representante text,
  whatsapp text,
  email text,
  sitio_web text,
  certificaciones text,
  sello text default 'Aval Comunitario MFSC',
  estado text default 'pendiente' check (estado in ('pendiente', 'aprobado', 'archivado')),
  created_at timestamptz default now()
);

create table if not exists public.productos_mfsc (
  id uuid primary key default gen_random_uuid(),
  org_id text references public.organizaciones_mfsc(id) on delete cascade,
  categoria text not null,
  titulo text not null,
  descripcion text,
  precio_label text default 'Bajo cotización',
  unidad_label text,
  disponibilidad text default 'Bajo pedido directo',
  imagen_url text,
  estado text default 'pendiente' check (estado in ('pendiente', 'aprobado', 'archivado')),
  created_at timestamptz default now()
);

alter table public.organizaciones_mfsc enable row level security;
alter table public.productos_mfsc enable row level security;

-- Lectura pública solo de registros aprobados por la Secretaría Técnica de la Mesa MFSC
create policy "Lectura publica organizaciones aprobadas"
  on public.organizaciones_mfsc for select
  using (estado = 'aprobado');

create policy "Lectura publica productos aprobados"
  on public.productos_mfsc for select
  using (estado = 'aprobado');

-- Ingreso abierto de nuevos negocios (siempre entran como 'pendiente' hasta aval)
create policy "Postulacion abierta organizaciones"
  on public.organizaciones_mfsc for insert
  with check (estado = 'pendiente');

create policy "Postulacion abierta productos"
  on public.productos_mfsc for insert
  with check (estado = 'pendiente');
