"use client";
import { useParams } from "next/navigation";
import { ChatView } from "@/components/chat";

export default function ChatIdPage() {
  const params = useParams<{ id: string }>();
  return <ChatView id={params?.id} />;
}
