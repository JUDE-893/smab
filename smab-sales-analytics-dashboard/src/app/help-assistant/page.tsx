"use client"; // if using App Router

import { useEffect, useState } from "react";

export default function EmbedPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <iframe
      src="https://n8n.srv883668.hstgr.cloud/webhook/9411a999-00f0-4f2f-97ec-4782c9458b4a/chat"
      style={{ width: "100%", height: "98vh", border: "none" }}
      title="Embedded Website"
    />
  );
}
