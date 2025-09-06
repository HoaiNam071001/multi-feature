"use client";

import { ContentWrapper } from "@/components/layout/Content-wrapper";

export default function TextDiffComparatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContentWrapper>{children}</ContentWrapper>;
}
