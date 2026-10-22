import HumanoidViewer from "./HumanoidViewer.jsx";
import { humanoidHomepagePreview, humanoidPreview } from "@assets";

export const PROJECT_VIEWERS = {
  humanoid: {
    component: HumanoidViewer,
    enabled: true,
    showOnProjectPage: true,
    showOnHomepage: true,
    title: "Forrest",
    subtitle: "Humanoid project",
    modelSrc: "/forrest.glb",
    previewSrc: humanoidPreview,
    homepagePreviewSrc: humanoidHomepagePreview,
    alt: "3D model of the FORREST humanoid robot",
  }
};

export const AVAILABLE_PROJECT_VIEWERS = Object.entries(PROJECT_VIEWERS).map(
  ([id, config]) => ({ id, ...config }),
);

export function getProjectViewerConfig(slug) {
  const config = PROJECT_VIEWERS[slug];
  return config?.enabled === false ? null : config ?? null;
}
