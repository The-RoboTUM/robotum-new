import { useEffect, useMemo, useState } from "react";
import * as assets from "@assets";
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import ImageFrame from "@components/ui/ImageFrame";
import SectionLoader from "@components/sections/common-sections/SectionLoader";
import { fetchPublishedRobocastEpisodes } from "@data/robocastApi";

function getPlatformLinks(ep) {
  const links = [];

  if (ep.spotify_url)
    links.push({ key: "spotify", label: "Spotify", url: ep.spotify_url });
  if (ep.apple_podcasts_url)
    links.push({
      key: "apple",
      label: "Apple Podcasts",
      url: ep.apple_podcasts_url,
    });
  if (ep.youtube_url)
    links.push({ key: "youtube", label: "YouTube", url: ep.youtube_url });

  // other_links can be { "deezer": "...", "amazon": "..." }
  if (ep.other_links && typeof ep.other_links === "object") {
    Object.entries(ep.other_links).forEach(([k, url]) => {
      if (typeof url === "string" && url.trim()) {
        links.push({ key: k, label: prettifyKey(k), url });
      }
    });
  }

  return links;
}

function prettifyKey(k) {
  return k.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function RobocastPage() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "Robocast | RoboTUM";
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const data = await fetchPublishedRobocastEpisodes();
        setEpisodes(data);
      } catch (e) {
        console.error(e);
        setErrorMsg("Failed to load episodes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const featured = useMemo(
    () => episodes.find((e) => e.is_featured) || episodes[0],
    [episodes],
  );

  return (
    <>
      <Navbar />

      <section className="section-container  hero-offset font-sans text-white section-dark-primary surface-pattern">
        {/* HERO */}
        <div className="grid gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs tracking-widest text-white/60 uppercase">
              RoboTUM Media
            </p>

            <h1 className="heading heading-h1 leading-tight text-balance">
              Robo<span className="text-gradient">cast</span>
            </h1>

            <p className="text-text2 md:text-text1 text-white/80 leading-relaxed max-w-xl">
              The Future of Robotics, One Podcast at a Time
            </p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm max-w-2xl">
              <h2 className="text-sm font-semibold text-white/90 mb-2">
                What Is RoboCast?
              </h2>
              <p className="text-sm md:text-base text-white/75 leading-relaxed">
                RoboCast is an engaging podcast series hosted by RoboTUM,
                bringing together robotics enthusiasts, students, and experts.
                Each episode dives deep into the world of robotics, featuring
                conversations with industry leaders, researchers, and
                innovators. It’s a platform where real stories meet the newest
                technology trends.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ImageFrame
              src={assets.robocastHeroImg}
              alt="Robocast hero background"
              aspect="16/10"
              fit="cover"
              variant="border"
              vignette
              className="w-full rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>

        {/* EPISODES */}
        <div className="mt-14 md:mt-18">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs tracking-widest text-white/60 uppercase mb-2">
                Episodes
              </p>
              <h2 className="heading heading-h2 leading-tight">
                Listen to the <span className="text-gradient">latest</span>
              </h2>
            </div>

            {featured?.spotify_url ? (
              <a
                href={featured.spotify_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-white/85 hover:bg-white/10 hover:border-white/30 transition"
              >
                {/* Spotify badge icon (use if you have it; fallback to external icon) */}
                <img
                  src={assets.spotifyIcon}
                  alt=""
                  className="h-4 w-4 opacity-90"
                  aria-hidden="true"
                />
                Open on Spotify
              </a>
            ) : null}
          </div>

          {loading ? (
            <SectionLoader />
          ) : errorMsg ? (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
              {errorMsg}
            </div>
          ) : episodes.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
              No episodes yet - check back soon.
            </div>
          ) : (
            <div
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              role="list"
            >
              {episodes.map((ep) => {
                const links = getPlatformLinks(ep);
                const partnerLogos = (ep.robocast_episode_partners ?? [])
                  .map((x) => x?.partner)
                  .filter((p) => p && p.logo_url);

                return (
                  <article
                    key={ep.id}
                    role="listitem"
                    className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-accent/70 hover:shadow-[0_10px_32px_rgba(59,130,246,0.16)]"
                  >
                    {ep.cover_url ? (
                      <ImageFrame
                        src={ep.cover_url}
                        alt={ep.title}
                        aspect="16/9"
                        fit="cover"
                        variant="soft"
                        rounded="none"
                      />
                    ) : (
                      <div className="h-32 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_55%)] border-b border-white/10" />
                    )}

                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base md:text-lg font-semibold text-white leading-snug">
                          {ep.title}
                        </h3>
                        {formatDate(ep.published_at) ? (
                          <span className="text-xs text-white/55 whitespace-nowrap">
                            {formatDate(ep.published_at)}
                          </span>
                        ) : null}
                      </div>

                      {ep.description ? (
                        <p className="text-sm text-white/75 leading-relaxed whitespace-pre-line">
                          {ep.description}
                        </p>
                      ) : null}

                      {/* Links (Spotify now; future platforms auto-appear) */}
                      {links.length > 0 ? (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {links.map((l) => (
                            <a
                              key={l.key}
                              href={l.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-xs text-white/85 hover:bg-white/10 hover:border-white/30 transition"
                            >
                              <img
                                src={
                                  l.key === "spotify"
                                    ? (assets.spotifyIcon ??
                                      assets.externalLinkIcon)
                                    : assets.externalLinkIcon
                                }
                                alt=""
                                className="h-3.5 w-3.5 opacity-90"
                                aria-hidden="true"
                              />
                              <span className="inline-flex items-center">
                                {l.label}
                              </span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-white/55">
                          Links coming soon.
                        </div>
                      )}

                      {/* Partner logos (optional) */}
                      {partnerLogos.length > 0 ? (
                        <div className="pt-3 border-t border-white/10">
                          <p className="text-[11px] uppercase tracking-wider text-white/50 mb-2">
                            Partnered with
                          </p>

                          <div className="flex flex-wrap items-center gap-3">
                            {partnerLogos.map((p) => {
                              const Wrapper = p.website_url ? "a" : "div";
                              return (
                                <Wrapper
                                  key={p.id}
                                  href={p.website_url || undefined}
                                  target={p.website_url ? "_blank" : undefined}
                                  rel={p.website_url ? "noopener noreferrer" : undefined}
                                  aria-label={p.name}
                                  title={p.name}
                                  className={
                                    "inline-flex items-center justify-center rounded-xl " +
                                    "bg-slate-100/95 border border-slate-200 " +
                                    "px-3 py-2 shadow-[0_10px_26px_rgba(0,0,0,0.25)] " +
                                    "transition-transform duration-300 hover:scale-[1.03]"
                                  }
                                >
                                  <img
                                    src={p.logo_url}
                                    alt={p.name}
                                    className="h-8 sm:h-9 w-auto max-w-[150px] object-contain"
                                    loading="lazy"
                                    draggable="false"
                                  />
                                </Wrapper>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </>
  );
}
