"use client";

import { ContentWrapper } from "@/components/layout/Content-wrapper";

export default function TextProcessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContentWrapper>{children}</ContentWrapper>;
}
