"use client";

import { ContentWrapper } from "@/components/layout/Content-wrapper";

export default function ImageCropperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContentWrapper>{children}</ContentWrapper>;
}
