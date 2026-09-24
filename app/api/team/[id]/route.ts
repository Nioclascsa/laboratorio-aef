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

function getStoragePath(photoUrl: string) {
  try {
    const url = new URL(photoUrl);
    const marker = "/team/";
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
        { error: "Solo administradores pueden gestionar integrantes." },
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
    return NextResponse.json(
      { error: "Id invalido." },
      { status: 400 },
    );
  }

  const member = await prisma.teamMember.findUnique({
    where: { id },
  });

  if (!member) {
    return NextResponse.json(
      { error: "Integrante no encontrado." },
      { status: 404 },
    );
  }

  await prisma.teamMember.delete({
    where: { id },
  });

  const storagePath = getStoragePath(member.photoUrl);

  if (storagePath) {
    const { error } = await supabaseAdmin.storage.from("team").remove([storagePath]);
    if (error) {
      console.error("Supabase Delete Error:", error);
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

  const existing = await prisma.teamMember.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Integrante no encontrado." },
      { status: 404 },
    );
  }

  let name = "";
  let role = "";
  let email = "";
  let degrees = "";
  let bio = "";
  let researchLines = "";
  let activeProjects = "";
  let courses = "";
  let featuredPubs = "";
  let orcid = "";
  let researchGate = "";
  let newPhotoFile: File | null = null;

  const contentType = request.headers.get("content-type") || "";

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    const formData = await request.formData();
    name = String(formData.get("name") || "").trim();
    role = String(formData.get("role") || "").trim();
    email = String(formData.get("email") || "").trim();
    degrees = String(formData.get("degrees") || "").trim();
    bio = String(formData.get("bio") || "").trim();
    researchLines = String(formData.get("researchLines") || "").trim();
    activeProjects = String(formData.get("activeProjects") || "").trim();
    courses = String(formData.get("courses") || "").trim();
    featuredPubs = String(formData.get("featuredPubs") || "").trim();
    orcid = String(formData.get("orcid") || "").trim();
    researchGate = String(formData.get("researchGate") || "").trim();

    const photo = formData.get("photo");
    if (photo instanceof File && photo.size > 0) {
      newPhotoFile = photo;
    }
  } else {
    const body = (await request.json().catch(() => ({}))) as Record<string, string>;
    name = String(body.name || "").trim();
    role = String(body.role || "").trim();
    email = String(body.email || "").trim();
    degrees = String(body.degrees || "").trim();
    bio = String(body.bio || "").trim();
    researchLines = String(body.researchLines || "").trim();
    activeProjects = String(body.activeProjects || "").trim();
    courses = String(body.courses || "").trim();
    featuredPubs = String(body.featuredPubs || "").trim();
    orcid = String(body.orcid || "").trim();
    researchGate = String(body.researchGate || "").trim();
  }

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

  let photoUrl = existing.photoUrl;
  let photoName = existing.photoName;
  let photoSize = existing.photoSize;

  if (newPhotoFile) {
    const isAllowedMime = ALLOWED_IMAGE_MIME.has(newPhotoFile.type);
    const isAllowedName = isAllowedImageName(newPhotoFile.name);

    if (!isAllowedMime && !isAllowedName) {
      return NextResponse.json(
        { error: "Formato de imagen no permitido." },
        { status: 415 },
      );
    }

    if (newPhotoFile.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "La imagen supera el limite de 10 MB." },
        { status: 413 },
      );
    }

    const bytes = await newPhotoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = newPhotoFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const finalFileName = `${randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("team")
      .upload(finalFileName, buffer, {
        contentType: newPhotoFile.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      return NextResponse.json(
        { error: "Error subiendo imagen a la nube." },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("team").getPublicUrl(finalFileName);

    const oldStoragePath = getStoragePath(existing.photoUrl);
    if (oldStoragePath) {
      const { error: removeError } = await supabaseAdmin.storage
        .from("team")
        .remove([oldStoragePath]);
      if (removeError) {
        console.error("Supabase Old Photo Delete Error:", removeError);
      }
    }

    photoUrl = publicUrl;
    photoName = newPhotoFile.name;
    photoSize = newPhotoFile.size;
  }

  const updated = await prisma.teamMember.update({
    where: { id },
    data: {
      name,
      role,
      email,
      degrees,
      bio,
      researchLines,
      activeProjects,
      courses,
      featuredPubs,
      orcid,
      researchGate,
      photoUrl,
      photoName,
      photoSize,
    },
  });

  return NextResponse.json({ ok: true, data: updated });
}

