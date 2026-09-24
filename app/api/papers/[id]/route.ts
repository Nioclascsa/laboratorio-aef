import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

function getStoragePath(storageUrl: string) {
  try {
    const url = new URL(storageUrl);
    const marker = "/papers/";
    const index = url.pathname.indexOf(marker);
    if (index === -1) {
      return null;
    }
    return url.pathname.slice(index + marker.length);
  } catch {
    return null;
  }
}

async function resolveId(
  request: Request,
  params?: { id?: string } | Promise<{ id?: string }>,
) {
  const resolvedParams = params ? await Promise.resolve(params) : null;
  const idFromParams = resolvedParams?.id;
  const idFromUrl = new URL(request.url).pathname.split("/").pop();
  return idFromParams ?? idFromUrl;
}

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      error: NextResponse.json(
        { error: "No autorizado. Debes iniciar sesion." },
        { status: 401 },
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { error: "Solo administradores pueden gestionar publicaciones." },
        { status: 403 },
      ),
    };
  }

  return { error: null };
}

export async function DELETE(
  request: Request,
  { params }: { params?: { id?: string } | Promise<{ id?: string }> },
) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) {
    return adminCheck.error;
  }

  const id = await resolveId(request, params);

  if (!id || id === "undefined" || id === "null") {
    return NextResponse.json({ error: "Id invalido." }, { status: 400 });
  }

  const paper = await prisma.paper.findUnique({ where: { id } });

  if (!paper) {
    return NextResponse.json(
      { error: "Publicacion no encontrada." },
      { status: 404 },
    );
  }

  await prisma.paper.delete({ where: { id } });

  if (paper.storagePath) {
    const storagePath = getStoragePath(paper.storagePath);
    if (storagePath) {
      const { error } = await supabaseAdmin.storage
        .from("papers")
        .remove([storagePath]);
      if (error) {
        console.error("Supabase Delete Error:", error);
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function PUT(
  request: Request,
  { params }: { params?: { id?: string } | Promise<{ id?: string }> },
) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) {
    return adminCheck.error;
  }

  const id = await resolveId(request, params);

  if (!id || id === "undefined" || id === "null") {
    return NextResponse.json({ error: "Id invalido." }, { status: 400 });
  }

  const paper = await prisma.paper.findUnique({ where: { id } });

  if (!paper) {
    return NextResponse.json(
      { error: "Publicacion no encontrada." },
      { status: 404 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    title?: string;
    authors?: string;
    journal?: string;
    publicationDate?: string;
    summary?: string;
  };

  const title = body.title?.trim();
  const authors = body.authors?.trim();
  const journal = body.journal?.trim();
  const publicationDateValue = body.publicationDate?.trim();
  const summary = body.summary?.trim();

  if (!title || !authors) {
    return NextResponse.json(
      { error: "Titulo y autores son obligatorios." },
      { status: 400 },
    );
  }

  let publicationDate: Date | undefined;
  if (publicationDateValue) {
    publicationDate = new Date(publicationDateValue);
    if (Number.isNaN(publicationDate.getTime())) {
      return NextResponse.json(
        { error: "La fecha de publicacion no es valida." },
        { status: 400 },
      );
    }
  }

  const updated = await prisma.paper.update({
    where: { id },
    data: {
      title,
      authors,
      journal: journal || null,
      summary: summary || null,
      ...(publicationDate ? { publicationDate } : {}),
    },
  });

  return NextResponse.json({ data: updated });
}
