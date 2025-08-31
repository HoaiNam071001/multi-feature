"use client";

import { ContentWrapper } from "@/components/layout/Content-wrapper";

export default function ProvinceLookupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContentWrapper>{children}</ContentWrapper>;
}
