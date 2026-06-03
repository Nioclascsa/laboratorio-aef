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
      { error: "Solo administradores pueden agregar miembros." },
      { status: 403 },
    );
  }

  const formData = await request.formData();

  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const degrees = String(formData.get("degrees") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const photo = formData.get("photo");

  if (!name || !role || !email || !degrees || !bio) {
    return NextResponse.json(
      { error: "Nombre, cargo, grados, correo y biografia son obligatorios." },
      { status: 400 },
    );
  }

  if (!email.includes("@")) {
    return NextResponse.json(
      { error: "El correo no es valido." },
      { status: 400 },
    );
  }

  if (!(photo instanceof File)) {
    return NextResponse.json(
      { error: "Debe seleccionar una foto." },
      { status: 400 },
    );
  }

  const isAllowedMime = ALLOWED_IMAGE_MIME.has(photo.type);
  const isAllowedName = isAllowedImageName(photo.name);

  if (!isAllowedMime && !isAllowedName) {
    return NextResponse.json(
      { error: "Formato de imagen no permitido." },
      { status: 415 },
    );
  }

  if (photo.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { error: "La imagen supera el limite de 10 MB." },
      { status: 413 },
    );
  }

  const bytes = await photo.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const finalFileName = `${randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("team")
    .upload(finalFileName, buffer, {
      contentType: photo.type || "image/jpeg",
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
    .from("team")
    .getPublicUrl(finalFileName);

  const newMember = await prisma.teamMember.create({
    data: {
      name,
      role,
      email,
      degrees,
      bio,
      photoUrl: publicUrl,
      photoName: photo.name,
      photoSize: photo.size,
    },
  });

  return NextResponse.json({
    data: newMember,
  });
}
