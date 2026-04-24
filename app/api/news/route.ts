import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function isAllowedImageName(name: string) {
  const lower = name.toLowerCase();
  return ALLOWED_IMAGE_EXT.some((ext) => lower.endsWith(ext));
}

export async function POST(request: Request) {
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
      { error: "Solo administradores pueden publicar noticias." },
      { status: 403 },
    );
  }

  const formData = await request.formData();

  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const publishedAtValue = String(formData.get("publishedAt") || "").trim();
  const image = formData.get("image");

  if (!title || !body || !publishedAtValue) {
    return NextResponse.json(
      { error: "Titulo, texto y fecha son obligatorios." },
      { status: 400 },
    );
  }

  const publishedAt = new Date(publishedAtValue);

  if (Number.isNaN(publishedAt.getTime())) {
    return NextResponse.json(
      { error: "La fecha no es valida." },
      { status: 400 },
    );
  }

  let imageUrl: string | null = null;
  let imageName: string | null = null;
  let imageSize: number | null = null;

  if (image instanceof File && image.size > 0) {
    const isAllowedMime = ALLOWED_IMAGE_MIME.has(image.type);
    const isAllowedName = isAllowedImageName(image.name);

    if (!isAllowedMime && !isAllowedName) {
      return NextResponse.json(
        { error: "Formato de imagen no permitido." },
        { status: 415 },
      );
    }

    if (image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "La imagen supera el limite de 10 MB." },
        { status: 413 },
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const finalFileName = `${randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("news")
      .upload(finalFileName, buffer, {
        contentType: image.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      return NextResponse.json(
        { error: "Error subiendo imagen a la nube." },
        { status: 500 },
      );
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("news")
      .getPublicUrl(finalFileName);

    imageUrl = publicUrl;
    imageName = image.name;
    imageSize = image.size;
  }

  const newNews = await prisma.news.create({
    data: {
      title,
      body,
      publishedAt,
      imageUrl,
      imageName,
      imageSize,
    },
  });

  return NextResponse.json({
    data: newNews,
  });
}
