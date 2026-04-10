"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

export default function CalEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
      });
    })();
  }, []);

  return null; // This component just initializes the script
}
