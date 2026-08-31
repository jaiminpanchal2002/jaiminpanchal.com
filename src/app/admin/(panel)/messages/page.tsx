import { Mail, MailOpen, Archive } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  markRead,
  markUnread,
  archiveMessage,
  deleteMessage,
} from "./actions";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  unread: "border-[#B600A8]/40 text-[#e084d8]",
  read: "border-white/10 text-white/50",
  archived: "border-white/10 text-white/30",
};

function IconAction({
  action,
  title,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        title={title}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white"
      >
        {children}
      </button>
    </form>
  );
}

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Messages"
        subtitle="Submissions from the public contact form."
      />

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-white/50">No messages yet.</p>
          <p className="mt-1 text-xs text-white/30">
            Contact-form submissions will appear here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className={`rounded-2xl border bg-white/[0.03] p-5 ${
                msg.status === "unread" ? "border-[#B600A8]/30" : "border-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{msg.name}</p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[0.6rem] uppercase tracking-wider ${
                        statusStyle[msg.status] ?? statusStyle.read
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/40">{msg.email}</p>
                </div>
                <span className="shrink-0 text-xs text-white/30">
                  {msg.createdAt.toLocaleDateString()}
                </span>
              </div>

              {msg.subject ? (
                <p className="mt-3 text-sm font-medium text-white/80">
                  {msg.subject}
                </p>
              ) : null}
              <p className="mt-1 whitespace-pre-wrap text-sm text-white/60">
                {msg.message}
              </p>

              <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
                {msg.status === "unread" ? (
                  <IconAction
                    action={markRead.bind(null, msg.id)}
                    title="Mark as read"
                  >
                    <MailOpen size={13} /> Mark read
                  </IconAction>
                ) : (
                  <IconAction
                    action={markUnread.bind(null, msg.id)}
                    title="Mark as unread"
                  >
                    <Mail size={13} /> Mark unread
                  </IconAction>
                )}
                {msg.status !== "archived" ? (
                  <IconAction
                    action={archiveMessage.bind(null, msg.id)}
                    title="Archive"
                  >
                    <Archive size={13} /> Archive
                  </IconAction>
                ) : null}
                <DeleteButton
                  action={deleteMessage.bind(null, msg.id)}
                  compact
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
