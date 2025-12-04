// src/components/sections/about/MemberStories.jsx
import { useEffect, useState } from "react";
import Button from "@components/ui/Button";
import ImageFrame from "@components/ui/ImageFrame";
import { fetchMemberStories } from "@data"; // make sure it's exported in src/data/index.js

export default function MemberStoriesSection() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const data = await fetchMemberStories();
        setStories(data);
      } catch (err) {
        console.error("Error loading member stories:", err);
        setErrorMsg("Failed to load member stories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const hasStories = !loading && !errorMsg && stories.length > 0;

  return (
    <section
      id="member-stories"
      className="section-dark-primary surface-pattern"
    >
      <div className="section-container">
        {/* Heading block */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between w-full">
          <div className="max-w-xl">
            <p className="text-xs tracking-widest text-white/60 uppercase mb-2">
              What it's like
            </p>
            <h2 className="heading heading-h2">
              Member <span className="text-gradient">Stories</span>
            </h2>
          </div>

          <div className="md:text-right">
            <Button
              as="link"
              to="/about"
              scrollTarget="team-section"
              variant="secondary"
              className="text-sm"
            >
              Meet the team →
            </Button>
          </div>
        </div>

        {/* Loading / error states */}
        {errorMsg && (
          <p className="mt-6 text-sm text-center text-red-200">{errorMsg}</p>
        )}
        {loading && !errorMsg && (
          <p className="mt-6 text-sm text-center text-white/60">
            Loading stories…
          </p>
        )}

        {/* Stories – mobile slider, desktop grid */}
        {hasStories && (
          <div className="mt-9 md:mt-10">
            {/* Mobile: horizontal scroll with snap */}
            <div className="flex gap-4 overflow-x-auto pb-4 px-4 md:hidden snap-x snap-mandatory">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} layout="mobile" />
              ))}
            </div>

            {/* Desktop / tablet: 2-column grid */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-8 lg:gap-10 w-full">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} layout="desktop" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StoryCard({ story, layout }) {
  const containerClasses =
    "group relative overflow-hidden rounded-2xl border border-white/8 bg-white/5 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.55)] backdrop-blur-md transition-all duration-300 hover:border-accent/60 hover:bg-white/8 hover:shadow-[0_22px_60px_rgba(15,23,42,0.75)]";

  const wrapperClasses =
    layout === "mobile"
      ? "group relative min-w-[260px] max-w-xs flex-1 shrink-0 snap-start " +
        containerClasses
      : containerClasses;

  const joinedLabel = story.joinedYear
    ? `Joined ${story.joinedYear}`
    : "Joined RoboTUM";

  const programUniversity =
    story.studyProgram && story.university
      ? `${story.studyProgram}, ${story.university}`
      : story.studyProgram || story.university || "";

  return (
    <article className={wrapperClasses}>
      {/* Decorative gradient stripe */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-[#60A5FA] via-[#A78BFA] to-[#22D3EE] opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="h-11 w-11 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shadow-[0_8px_20px_rgba(15,23,42,0.7)]">
          {story.avatarUrl ? (
            <ImageFrame
              src={story.avatarUrl}
              alt={story.name}
              variant="soft"
              rounded="full"
              fit="cover"
              className="h-full w-full"
            />
          ) : (
            <span className="text-sm font-semibold text-white">
              {story.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold leading-snug text-white">
              {story.name}
            </h3>
            {story.department && (
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/70">
                {story.department}
              </span>
            )}
          </div>

          {/* Joined + study program + university */}
          <p className="mt-0.5 text-[11px] text-white/40">
            {joinedLabel}
            {programUniversity && ` • ${programUniversity}`}
          </p>
        </div>
      </div>

      {/* Story quote (from members_personal.story) */}
      <p className="mt-4 text-sm leading-relaxed text-white/80">
        <span className="mr-1 text-base text-gradient">“</span>
        {story.story}
        <span className="ml-1 text-base text-gradient">”</span>
      </p>

      {/* No "Impact" line – removed as requested */}
    </article>
  );
}
