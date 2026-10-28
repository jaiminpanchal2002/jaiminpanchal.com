"use client";

import { defineConfig, buildLegacyTheme } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { codeInput } from "@sanity/code-input";
import { apiVersion, dataset, projectId, studioUrl } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

// Brand-tinted Studio theme that keeps Sanity's usability defaults.
const theme = buildLegacyTheme({
  "--black": "#070b14",
  "--white": "#f6f8ff",
  "--gray-base": "#7788a4",
  "--brand-primary": "#4c8dff",
  "--component-bg": "#0c1425",
  "--component-text-color": "#f6f8ff",
  "--default-button-primary-color": "#4c8dff",
  "--focus-color": "#49e3f5",
  "--main-navigation-color": "#070b14",
  "--main-navigation-color--inverted": "#f6f8ff",
});

export default defineConfig({
  name: "jaimin-beyond-code",
  title: "JAIMIN / BEYOND CODE",
  basePath: studioUrl,
  projectId: projectId || "unconfigured",
  dataset,
  theme,
  schema: {
    types: schemaTypes,
    // Singletons can't be created again from the "New document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Singletons: no duplicate/delete; everything else keeps the full workflow.
    actions: (input, ctx) => (singletonTypes.has(ctx.schemaType) ? input.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action)) : input),
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable", disable: "/api/draft-mode/disable" } },
    }),
    codeInput(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
