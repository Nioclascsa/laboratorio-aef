import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json(
      { error: "No autorizado. Debes iniciar sesion." },
      { status: 401 },
    );
  }

  const formData = await request.formData();

  const title = String(formData.get("title") || "").trim();
  const authors = String(formData.get("authors") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const file = formData.get("paper");

  if (!title || !authors) {
    return NextResponse.json(
      { error: "Titulo y autores son obligatorios." },
      { status: 400 },
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Debe seleccionar un archivo PDF." },
      { status: 400 },
    );
  }

  const isPdfMime = file.type === "application/pdf";
  const isPdfName = file.name.toLowerCase().endsWith(".pdf");

  if (!isPdfMime && !isPdfName) {
    return NextResponse.json(
      { error: "Solo se permiten archivos PDF." },
      { status: 415 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "El archivo supera el limite de 20 MB." },
      { status: 413 },
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const id = randomUUID();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const finalFileName = `${id}-${safeName}`;

  // Upload to Supabase Storage
  // Make sure you have created a PUBLIC bucket named 'papers' in Supabase dashboard
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('papers')
    .upload(finalFileName, buffer, {
      contentType: 'application/pdf',
      upsert: false
    });

  if (uploadError) {
    console.error('Supabase Upload Error:', uploadError);
    return NextResponse.json(
      { error: "Error subiendo archivo a la nube." },
      { status: 500 },
    );
  }

  // Get public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('papers')
    .getPublicUrl(finalFileName);

  // Guardar metadatos en PostgreSQL
  const newPaper = await prisma.paper.create({
    data: {
      id,
      title,
      authors,
      summary: summary || null,
      originalName: file.name,
      storagePath: publicUrl,
      size: file.size,
    },
  });

  return NextResponse.json({
    data: newPaper,
  });
}
