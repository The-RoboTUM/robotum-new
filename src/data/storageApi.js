import { supabase } from "@lib/supabaseClient";

export const ADMIN_ASSET_BUCKET = "asset";
export const MAX_IMAGE_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const ADMIN_IMAGE_TARGETS = {
  events: { folderPath: "events/covers" },
  projects: { folderPath: "projects/covers" },
  partners: { folderPath: "partners/logos" },
  members: { folderPath: "members/covers" },
};

const MANAGED_FOLDERS = [
  "events/covers",
  "projects/covers",
  "partners/logos",
  "members/covers",
  "others",
];

function fallbackUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildUniqueId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return fallbackUniqueId();
}

function sanitizeBaseName(fileName) {
  const noExtension = fileName.replace(/\.[^/.]+$/, "").trim().toLowerCase();
  const slug = noExtension
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "image";
}

function resolveFileExtension(file) {
  if (file?.name && /\.[^/.]+$/.test(file.name)) {
    return file.name.split(".").pop().toLowerCase();
  }

  if (file?.type?.startsWith("image/")) {
    const subtype = file.type.split("/")[1];
    return subtype === "jpeg" ? "jpg" : subtype;
  }

  return "bin";
}

function createStoragePath(folderPath, file) {
  const timestamp = Date.now();
  const uniqueId = buildUniqueId();
  const baseName = sanitizeBaseName(file?.name || "image");
  const extension = resolveFileExtension(file);

  return `${folderPath}/${timestamp}-${uniqueId}-${baseName}.${extension}`;
}

function ensureValidImageFile(file) {
  if (!file) {
    throw new Error("Please select an image file.");
  }

  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    throw new Error("Image must be 10MB or smaller.");
  }
}

function tryParsePublicStoragePath(url, bucketName) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const marker = `/object/public/${bucketName}/`;
    const markerIndex = parsedUrl.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    const encodedPath = parsedUrl.pathname.slice(markerIndex + marker.length);
    return decodeURIComponent(encodedPath);
  } catch {
    return null;
  }
}

function isManagedFolderPath(storagePath) {
  return MANAGED_FOLDERS.some(
    (folderPath) =>
      storagePath === folderPath || storagePath.startsWith(`${folderPath}/`),
  );
}

export function getAdminImageUploadTarget(entityName) {
  return ADMIN_IMAGE_TARGETS[entityName] || { folderPath: "others" };
}

export async function uploadPublicImage({
  file,
  folderPath,
  bucketName = ADMIN_ASSET_BUCKET,
}) {
  ensureValidImageFile(file);

  if (!folderPath) {
    throw new Error("Missing storage folder path for image upload.");
  }

  const storagePath = createStoragePath(folderPath, file);
  const { error: uploadError } = await supabase
    .storage
    .from(bucketName)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    console.error("Error uploading image to storage:", uploadError);
    throw new Error("Failed to upload image. Please try again.");
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
  if (!data?.publicUrl) {
    throw new Error("Failed to create a public URL for the uploaded image.");
  }

  return {
    publicUrl: data.publicUrl,
    storagePath,
    bucketName,
  };
}

export async function deletePublicImageByUrl({
  publicUrl,
  bucketName = ADMIN_ASSET_BUCKET,
}) {
  if (!publicUrl) return false;

  const storagePath = tryParsePublicStoragePath(publicUrl, bucketName);
  if (!storagePath || !isManagedFolderPath(storagePath)) {
    return false;
  }

  const { error } = await supabase.storage.from(bucketName).remove([storagePath]);
  if (error) {
    console.warn("Failed to delete old storage image:", error);
    return false;
  }

  return true;
}
