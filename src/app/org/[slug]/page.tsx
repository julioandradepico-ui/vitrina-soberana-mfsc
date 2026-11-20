import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ORGANIZATIONS, PRODUCTS } from "@/data/mfscData";
import { OrgProfileClient } from "@/components/OrgProfileClient";

export function generateStaticParams() {
  return ORGANIZATIONS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const org = ORGANIZATIONS.find((o) => o.slug === slug);
  if (!org) return { title: "Organización no encontrada · Vitrina de Forestería Comunitaria" };
  return {
    title: `${org.sigla} (${org.municipio}, ${org.departamento}) · Vitrina de Forestería Comunitaria`,
    description: `${org.razonSocial}. ${org.certificaciones}. Conecta directamente con esta asociación forestal comunitaria.`,
    openGraph: {
      title: `${org.sigla} · Vitrina de Forestería Comunitaria`,
      description: `${org.razonSocial} en ${org.municipio}, ${org.departamento}.`,
      images: [org.heroImage],
    },
  };
}

export default async function OrgMicroSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = ORGANIZATIONS.find((o) => o.slug === slug);
  if (!org) notFound();
  const prods = PRODUCTS.filter((p) => p.orgId === org.id);
  return <OrgProfileClient org={org} products={prods} />;
}
