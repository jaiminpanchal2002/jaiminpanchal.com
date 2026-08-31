"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function revalidateAll() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin"); // dashboard unread count
}

async function setStatus(id: string, status: string) {
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidateAll();
}

export async function markRead(id: string, _formData?: FormData) {
  await setStatus(id, "read");
}

export async function markUnread(id: string, _formData?: FormData) {
  await setStatus(id, "unread");
}

export async function archiveMessage(id: string, _formData?: FormData) {
  await setStatus(id, "archived");
}

export async function deleteMessage(id: string, _formData?: FormData) {
  await prisma.contactMessage.delete({ where: { id } });
  revalidateAll();
}
