"use client";

import { ContentWrapper } from "@/components/layout/Content-wrapper";

export default function MiniGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContentWrapper>{children}</ContentWrapper>;
}
