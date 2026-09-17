import { useEffect, useRef, useState } from "react";

const DEFAULT_CAMERA_ORBIT = "-0.45rad 1.25rad 120m";
const DEFAULT_CAMERA_TARGET = "2.81m -10.31m -6.31m";

const CASING_OBJECT_NAME = "_i_casing";

export default function HumanoidViewer({ config }) {
  const viewerRef = useRef(null);
  const casingRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  const [autoRotate, setAutoRotate] = useState(true);
  const [animationPlaying, setAnimationPlaying] = useState(false);

  const [casingFound, setCasingFound] = useState(false);
  const [casingVisible, setCasingVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;

    import("@google/model-viewer").then(() => {
      if (!cancelled) {
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      const sceneSymbol = Object.getOwnPropertySymbols(viewer).find(
        (symbol) => symbol.description === "scene",
      );

      if (sceneSymbol) {
        const modelScene = viewer[sceneSymbol];

        if (modelScene) {
          const casing = modelScene.getObjectByName(
            CASING_OBJECT_NAME,
          );

          if (casing) {
            casingRef.current = casing;

            setCasingFound(true);
            setCasingVisible(casing.visible);
          }
        }
      }

      setModelLoaded(true);
    };

    viewer.addEventListener("load", handleLoad);

    if (viewer.loaded) {
      handleLoad();
    }

    return () => {
      viewer.removeEventListener("load", handleLoad);

      casingRef.current = null;
    };
  }, [ready]);

  const resetCamera = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    viewer.cameraOrbit = DEFAULT_CAMERA_ORBIT;
    viewer.cameraTarget = DEFAULT_CAMERA_TARGET;
    viewer.fieldOfView = "30deg";
  };

  const toggleAutoRotate = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const next = !autoRotate;

    viewer.toggleAttribute("auto-rotate", next);
    setAutoRotate(next);
  };

  const toggleAnimation = async () => {
    const viewer = viewerRef.current;

    if (!viewer || !viewer.availableAnimations?.length) {
      return;
    }

    const next = !animationPlaying;

    if (next) {
      viewer.animationName = viewer.availableAnimations.includes(
        "Scene",
      )
        ? "Scene"
        : viewer.availableAnimations[0];

      viewer.timeScale = 1.5;

      await viewer.play?.();
    } else {
      viewer.pause?.();
    }

    setAnimationPlaying(next);
  };

  const toggleCasing = () => {
    const casing = casingRef.current;
    if (!casing) return;

    const next = !casingVisible;

    casing.visible = next;

    setCasingVisible(next);

    viewerRef.current?.requestUpdate?.();
  };

  return (
    <div className="relative h-full w-full overflow-hidden section-dark-primary surface-pattern">
      {!modelLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-white/70" />

          <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
            Loading 3D viewer
          </span>
        </div>
      )}

      {ready && (
        <model-viewer
          ref={viewerRef}
          src={config.modelSrc}
          alt={config.alt}
          camera-controls
          auto-rotate
          auto-rotate-delay="0"
          interaction-prompt="none"
          camera-orbit={DEFAULT_CAMERA_ORBIT}
          camera-target={DEFAULT_CAMERA_TARGET}
          field-of-view="30deg"
          min-camera-orbit="auto 0deg 30%"
          max-camera-orbit="auto 90deg auto"
          interpolation-decay="1"
          scale="0.5 0.5 0.5"
          className={`h-full w-full transition-opacity duration-500 ${
            modelLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {modelLoaded && (
        <div className="absolute bottom-5 left-1/2 z-10 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 text-[11px] uppercase tracking-[0.12em] text-white/70">
          <button
            type="button"
            onClick={resetCamera}
            className="viewer-control"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={toggleAutoRotate}
            className={`viewer-control ${
              autoRotate ? "is-active" : ""
            }`}
            aria-pressed={autoRotate}
          >
            Rotate {autoRotate ? "on" : "off"}
          </button>

          <button
            type="button"
            onClick={toggleAnimation}
            className={`viewer-control ${
              animationPlaying ? "is-active" : ""
            }`}
            aria-pressed={animationPlaying}
          >
            Motion {animationPlaying ? "on" : "off"}
          </button>

          <button
            type="button"
            onClick={toggleCasing}
            disabled={!casingFound}
            className={`viewer-control ${
              casingVisible && casingFound ? "is-active" : ""
            } ${!casingFound ? "cursor-not-allowed opacity-40" : ""}`}
            aria-pressed={casingVisible}
          >
            Casing {casingVisible ? "on" : "off"}
          </button>
        </div>
      )}
    </div>
  );
}