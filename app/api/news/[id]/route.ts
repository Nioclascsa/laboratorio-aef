import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

function getStoragePath(imageUrl: string) {
  try {
    const url = new URL(imageUrl);
    const marker = "/news/";
    const index = url.pathname.indexOf(marker);
    if (index === -1) {
      return null;
    }
    return url.pathname.slice(index + marker.length);
  } catch {
    return null;
  }
}

export async function DELETE(
  request: Request,
  { params }: { params?: { id?: string } | Promise<{ id?: string }> },
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "No autorizado. Debes iniciar sesion." },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Solo administradores pueden eliminar noticias." },
      { status: 403 },
    );
  }

  const resolvedParams = params ? await Promise.resolve(params) : null;
  const idFromParams = resolvedParams?.id;
  const idFromUrl = new URL(request.url).pathname.split("/").pop();
  const id = idFromParams ?? idFromUrl;

  if (!id || id === "undefined" || id === "null") {
    return NextResponse.json(
      { error: "Id invalido." },
      { status: 400 },
    );
  }

  const news = await prisma.news.findUnique({
    where: { id },
  });

  if (!news) {
    return NextResponse.json(
      { error: "Noticia no encontrada." },
      { status: 404 },
    );
  }

  await prisma.news.delete({
    where: { id },
  });

  if (news.imageUrl) {
    const storagePath = getStoragePath(news.imageUrl);
    if (storagePath) {
      const { error } = await supabaseAdmin.storage.from("news").remove([storagePath]);
      if (error) {
        console.error("Supabase Delete Error:", error);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
