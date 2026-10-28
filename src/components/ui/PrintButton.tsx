"use client";

import { Printer } from "lucide-react";
import { buttonClass } from "./styles";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClass("secondary")}>
      <Printer className="size-4" aria-hidden /> Print or save as PDF
    </button>
  );
}
