import { useState } from "react";
import Button from "@components/ui/Button";

const MAX_PROFILE_CHOICES = 3;
const MAX_PROJECT_CHOICES = 3;

const PROFILE_OPTIONS = [
    "Technical (Robotics, Software, Hardware)",
    "Operations (HR, Community, Finance & Legal)",
    "Innovation & Entrepreneurship (Precelerator, Podcast, Roboweek)",
    "Media & Marketing",
    "Event Management",
    "Other",
];

const PROJECT_OPTIONS = [
    "Humanoid Project",
    "Creative Robotics",
    "Website Development",
    "ITQ Plastix Project",
    "Reply Challenge Team",
    "HR, Finance & Legal",
    "Community Engagement",
    "Bookclub & DnD Project",
    "Workshop Wednesday",
    "Generation Robotics (EFR)",
    "Robotics Student Precelerator",
    "Roboweek",
    "RoboTUM Podcast",
    "Robo spark SUMMIT",
];

const STUDY_LEVEL_OPTIONS = [
    "Bachelor",
    "Master",
    "PhD",
    "Exchange / Erasmus",
    "Working student",
    "Other",
];

const HOURS_PER_WEEK_OPTIONS = [
    "3–5 hours / week",
    "5–8 hours / week",
    "8–12 hours / week",
    "12+ hours / week",
];

const HEAR_ABOUT_OPTIONS = [
    "Friends / word of mouth",
    "Social media",
    "Intro week / fair",
    "Lecture announcement",
    "RoboTUM event",
    "TUM website / mailing list",
    "Other",
];

const TOTAL_STEPS = 6;

const initialFormState = {
    // Step 1 – Personal info
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    linkedin: "",
    studyLevel: "",
    studyLevelOther: "",
    fieldOfStudy: "",
    semester: "",
    university: "",
    matriculationNumber: "",
    // Step 2 – Experience
    whyJoin: "",
    hasExperience: "no",
    experienceDetails: "",
    hasClubExperience: "no",
    clubExperienceDetails: "",
    hoursPerWeek: "",
    // Step 3 – Preferences
    topProfiles: [],
    topProfilesOther: "",
    topProjects: [],
    // Step 4 – Motivation & links
    motivationLetter: "",
    whatToGain: "",
    dreamRobot: "",
    heardFrom: "",
    heardFromOther: "",
    extraLinks: [""],
    // Step 5 – Attachments & consent
    cvFile: null,
    extraFile: null,
    confirmInfoAccurate: false,
    consentDataProcessing: false,
};

const ApplicationFormSection = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState(initialFormState);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleToggleChoice = (field, value, max) => {
        setFormData((prev) => {
            const current = prev[field] || [];
            const alreadySelected = current.includes(value);

            if (alreadySelected) {
                return {
                    ...prev,
                    [field]: current.filter((v) => v !== value),
                };
            }

            if (current.length >= max) {
                return prev; // ignore if max reached
            }

            return {
                ...prev,
                [field]: [...current, value],
            };
        });
    };

    const handleExtraLinkChange = (index, value) => {
        setFormData((prev) => {
            const links = [...prev.extraLinks];
            links[index] = value;
            return { ...prev, extraLinks: links };
        });
    };

    const addExtraLink = () => {
        setFormData((prev) => ({
            ...prev,
            extraLinks: [...prev.extraLinks, ""],
        }));
    };

    const removeExtraLink = (index) => {
        setFormData((prev) => {
            const links = [...prev.extraLinks];
            links.splice(index, 1);
            return { ...prev, extraLinks: links.length ? links : [""] };
        });
    };

    const handleFileChange = (field, fileList) => {
        const file = fileList && fileList[0] ? fileList[0] : null;
        setFormData((prev) => ({
            ...prev,
            [field]: file,
        }));
    };

    const goNext = () => {
        setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    };

    const goBack = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Here you will later integrate Supabase:
        // e.g. call a mutation to insert into "Applications" + upload files
        // For now, just log and show thank-you screen.
        // eslint-disable-next-line no-console
        console.log("Application submitted:", formData);

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <section className="section-dark-primary surface-pattern">
                <div className="section-container min-h-[60vh] flex flex-col items-center justify-center text-center gap-6">
                    <p className="text-sm font-mono uppercase tracking-[0.25em] text-accent/80">
                        Application sent
                    </p>
                    <h2 className="heading text-3xl md:text-4xl">
                        Thank you for applying to{" "}
                        <span className="text-gradient-primary">RoboTUM</span>!
                    </h2>
                    <p className="max-w-2xl text-base md:text-lg text-white/80">
                        We&apos;ll review your application and get back to you via email.
                        This usually takes a few days, especially during the main recruitment
                        phase. In the meantime, feel free to drop by our events or say hi on
                        social media. If you have any questions, reach out to{" "}
                        <a
                            href="mailto:operations@robotum.info"
                            className="underline"
                        >
                            operations@robotum.info
                        </a>
                        .
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="application" className="section-dark-secondary surface-pattern">
            <div className="section-container">
                {/* Progress header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                    <div>
                        <p className="text-xs tracking-widest text-white/60 uppercase mb-2">
                            Join RoboTUM
                        </p>
                        <h2 className="heading heading-h2 text-3xl md:text-4xl mt-2">
                            Application form
                        </h2>
                        <p className="mt-3 text-sm md:text-base text-white/80 max-w-2xl">
                            Tell us who you are, what you love, and how you&apos;d like to
                            contribute. The form takes around{" "}
                            <span className="font-semibold text-white">10–15 minutes</span>.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3">
                            {[...Array(TOTAL_STEPS + 1)].map((_, idx) => {
                                const isActive = idx === step;
                                const isCompleted = idx < step;
                                return (
                                    <span
                                        key={idx}
                                        className={`h-2 w-2 rounded-full transition-all ${isActive
                                            ? "w-8 bg-accent"
                                            : isCompleted
                                                ? "bg-accent/60"
                                                : "bg-white/15"
                                            }`}
                                    />
                                );
                            })}
                        </div>
                        <p className="text-xs text-white/60">
                            Step {step} of {TOTAL_STEPS}
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                                        className="mx-auto max-w-4xl bg-[#0F1C3A]/80 border border-white/10 rounded-3xl px-5 py-6 sm:px-8 sm:py-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl flex flex-col gap-6"
                >
                    {/* STEP 0 – Intro */}
                    {step === 0 && (
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className="flex-1 space-y-4">
                                <h3 className="heading text-2xl md:text-3xl">
                                    Build robots with people who care.
                                </h3>
                                <p className="text-sm md:text-base text-white/80">
                                    RoboTUM is TUM&apos;s interdisciplinary robotics club. We bring
                                    together students from engineering, informatics, management,
                                    and many other fields to design, build, and test real robots —
                                    from idea to prototype.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-white/85">
                                    <li>🧠 Learn: hands-on robotics, software, hardware, and teamwork.</li>
                                    <li>🤝 Community: work in small, motivated project teams.</li>
                                    <li>🤖 Build: turn your ideas into real robots and demos.</li>
                                </ul>
                                <p className="mt-4 text-xs text-white/60">
                                    The application has 6 short steps and takes around 10–15
                                    minutes. You can always go back and edit your answers before
                                    sending.
                                </p>
                            </div>
                            <div className="w-full md:w-[40%] flex flex-col items-center gap-4">
                                <div className="rounded-2xl border border-accent/30 bg-[#101A34]/90 px-4 py-5 w-full text-sm text-white/85">
                                    <p className="font-semibold text-white mb-2">
                                        Before you start:
                                    </p>
                                    <ul className="space-y-1 list-disc list-inside text-white/80">
                                        <li>Use your university email if possible.</li>
                                        <li>Have your CV ready as PDF.</li>
                                        <li>Think about 2–3 roles or projects that excite you.</li>
                                    </ul>
                                </div>
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="w-full md:w-auto"
                                    onClick={goNext}
                                >
                                    Start application →
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 1 – Personal info */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="heading text-2xl">Step 1 · Personal information</h3>
                            <p className="text-sm text-white/75">
                                Tell us how we can reach you and a bit about your current studies.
                                Fields with <span className="text-red-400">*</span> are required.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">
                                        First name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">
                                        Surname <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        value={formData.surname}
                                        onChange={(e) => handleChange("surname", e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">
                                        Email <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="input border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        placeholder="you@tum.de"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">Phone number</label>
                                    <input
                                        type="tel"
                                        className="input border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        placeholder="+49 ..."
                                        value={formData.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        className="input border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        placeholder="https://www.linkedin.com/in/..."
                                        value={formData.linkedin}
                                        onChange={(e) => handleChange("linkedin", e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">
                                        Current level of study <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        className="input border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        value={formData.studyLevel}
                                        onChange={(e) => handleChange("studyLevel", e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        {STUDY_LEVEL_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                    {formData.studyLevel === "Other" && (
                                        <input
                                            type="text"
                                            className="input mt-1 border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                            placeholder="Please specify"
                                            value={formData.studyLevelOther}
                                            onChange={(e) =>
                                                handleChange("studyLevelOther", e.target.value)
                                            }
                                        />
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">Field of study</label>
                                    <input
                                        type="text"
                                        className="input border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        placeholder="e.g. Informatics, Mechanical Engineering..."
                                        value={formData.fieldOfStudy}
                                        onChange={(e) =>
                                            handleChange("fieldOfStudy", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">Current semester</label>
                                    <input
                                        type="text"
                                        className="input border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        placeholder="e.g. 3rd, 5th..."
                                        value={formData.semester}
                                        onChange={(e) => handleChange("semester", e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">University</label>
                                    <input
                                        type="text"
                                        className="input border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        placeholder="e.g. TUM, HM..."
                                        value={formData.university}
                                        onChange={(e) => handleChange("university", e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">Matriculation number</label>
                                    <input
                                        type="text"
                                        className="input border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        value={formData.matriculationNumber}
                                        onChange={(e) =>
                                            handleChange("matriculationNumber", e.target.value)
                                        }
                                    />
                                    <p className="mt-1 text-[11px] text-white/50">
                                        Optional · helps us link your application internally.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2 – Experience & background */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className="heading text-2xl">Step 2 · Experience & background</h3>
                            <p className="text-sm text-white/75">
                                We don&apos;t expect everyone to have robotics experience. We just want to
                                understand where you&apos;re coming from.
                            </p>

                            <div className="space-y-6">
                                {/* Why join */}
                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">Why do you want to join RoboTUM?</label>
                                    <textarea
                                        className="input min-h-[100px] border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        value={formData.whyJoin}
                                        onChange={(e) => handleChange("whyJoin", e.target.value)}
                                    />
                                </div>

                                {/* Experience + Club experience */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Robotics / Programming / Teamwork experience */}
                                    <div className="flex flex-col gap-2">
                                        <label className="label-sm">
                                            Do you have previous experience in robotics, programming, or teamwork?
                                        </label>

                                        <div className="flex gap-3 mt-1.5">
                                            {["yes", "no"].map((val) => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => handleChange("hasExperience", val)}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.hasExperience === val
                                                        ? "bg-accent text-white border-accent"
                                                        : "border-white/25 text-white/75 hover:border-accent/60"
                                                        }`}
                                                >
                                                    {val === "yes" ? "Yes" : "No"}
                                                </button>
                                            ))}
                                        </div>

                                        {formData.hasExperience === "yes" && (
                                            <textarea
                                                className="input mt-3 min-h-[90px] border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                                placeholder="Tell us briefly about your experience (courses, projects, competitions, work, etc.)."
                                                value={formData.experienceDetails}
                                                onChange={(e) => handleChange("experienceDetails", e.target.value)}
                                            />
                                        )}
                                    </div>

                                    {/* Student club experience */}
                                    <div className="flex flex-col gap-2">
                                        <label className="label-sm">
                                            Have you worked in a student club or team project before?
                                        </label>

                                        <div className="flex gap-3 mt-1.5">
                                            {["yes", "no"].map((val) => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => handleChange("hasClubExperience", val)}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.hasClubExperience === val
                                                        ? "bg-accent text-white border-accent"
                                                        : "border-white/25 text-white/75 hover:border-accent/60"
                                                        }`}
                                                >
                                                    {val === "yes" ? "Yes" : "No"}
                                                </button>
                                            ))}
                                        </div>

                                        {formData.hasClubExperience === "yes" && (
                                            <textarea
                                                className="input mt-3 min-h-[90px] border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                                placeholder="Briefly describe your role or responsibilities."
                                                value={formData.clubExperienceDetails}
                                                onChange={(e) =>
                                                    handleChange("clubExperienceDetails", e.target.value)
                                                }
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Hours per week */}
                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">
                                        How many hours per week can you dedicate to RoboTUM?
                                    </label>
                                    <select
                                        className="input mt-1 border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        value={formData.hoursPerWeek}
                                        onChange={(e) => handleChange("hoursPerWeek", e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        {HOURS_PER_WEEK_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 – Preferences (roles & projects) */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h3 className="heading text-2xl">Step 3 · Roles & project preferences</h3>
                            <p className="text-sm text-white/75">
                                Choose up to three profiles and three projects that feel like a good fit.
                                This is not binding – it just helps us route your application.
                            </p>

                            <div className="space-y-6">
                                {/* Top profile choices */}
                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">
                                        Top profile choices (max {MAX_PROFILE_CHOICES})
                                    </label>
                                    <p className="text-[11px] text-white/55">
                                        Think about how you&apos;d like to contribute – technical, operations, or
                                        innovation-focused roles.
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {PROFILE_OPTIONS.map((opt) => {
                                            const selected = formData.topProfiles.includes(opt);

                                            return (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleChoice("topProfiles", opt, MAX_PROFILE_CHOICES)
                                                    }
                                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selected
                                                        ? "bg-accent text-white border-accent"
                                                        : "border-white/25 text-white/75 hover:border-accent/60"
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {formData.topProfiles.includes("Other") && (
                                        <input
                                            type="text"
                                            className="input mt-3 border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                            placeholder="If Other: what kind of role are you imagining?"
                                            value={formData.topProfilesOther}
                                            onChange={(e) => handleChange("topProfilesOther", e.target.value)}
                                        />
                                    )}
                                </div>

                                {/* Top project choices */}
                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">
                                        Top project choices (max {MAX_PROJECT_CHOICES})
                                    </label>
                                    <p className="mt-1 text-[11px] text-white/55">
                                        You can pick projects from any category – technical, operations, or
                                        innovation & entrepreneurship.
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {PROJECT_OPTIONS.map((opt) => {
                                            const selected = formData.topProjects.includes(opt);

                                            return (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleChoice("topProjects", opt, MAX_PROJECT_CHOICES)
                                                    }
                                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selected
                                                        ? "bg-accent text-white border-accent"
                                                        : "border-white/25 text-white/75 hover:border-accent/60"
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4 – Motivation & links */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <h3 className="heading text-2xl">Step 4 · Motivation & links</h3>
                            <p className="text-sm text-white/75">
                                This helps us understand your goals and how RoboTUM can support you.
                            </p>

                            <div className="space-y-6">

                                {/* Motivation Letter */}
                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">
                                        Short motivation letter (approx. 200–400 words)
                                    </label>
                                    <textarea
                                        className="input min-h-40 border border-white/20 bg-[#050A1A]/60 focus:border-accent/70 focus:outline-none"
                                        placeholder="Tell us why you chose your top roles/projects, relevant skills, and what you hope to learn and achieve with RoboTUM."
                                        value={formData.motivationLetter}
                                        onChange={(e) =>
                                            handleChange("motivationLetter", e.target.value)
                                        }
                                    />
                                </div>

                                {/* What to gain & Dream robot */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="label-sm">
                                            What do you hope to gain by joining RoboTUM?
                                        </label>
                                        <textarea
                                            className="input min-h-[90px] border border-white/20 bg-[#050A1A]/60 focus:border-accent/70"
                                            placeholder="e.g., personal growth, network, technical skills, fun projects..."
                                            value={formData.whatToGain}
                                            onChange={(e) => handleChange("whatToGain", e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="label-sm">
                                            Fun question: If you could build any robot, what would it do?
                                        </label>
                                        <textarea
                                            className="input min-h-[90px] border border-white/20 bg-[#050A1A]/60 focus:border-accent/70"
                                            value={formData.dreamRobot}
                                            onChange={(e) => handleChange("dreamRobot", e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Heard from */}
                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">How did you hear about RoboTUM?</label>

                                    <select
                                        className="input bg-[#0D1730] border border-white/20 focus:border-accent/70"
                                        value={formData.heardFrom}
                                        onChange={(e) => handleChange("heardFrom", e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        {HEAR_ABOUT_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>

                                    {formData.heardFrom === "Other" && (
                                        <input
                                            type="text"
                                            className="input mt-2 border border-white/20 bg-[#050A1A]/60 focus:border-accent/70"
                                            placeholder="Please specify"
                                            value={formData.heardFromOther}
                                            onChange={(e) =>
                                                handleChange("heardFromOther", e.target.value)
                                            }
                                        />
                                    )}
                                </div>

                                {/* Extra Links */}
                                <div className="flex flex-col gap-2">
                                    <label className="label-sm">
                                        Any other link(s) you want to share? (GitHub, portfolio,
                                        website, etc.)
                                    </label>

                                    <div className="space-y-3 mt-2">
                                        {formData.extraLinks.map((link, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    type="url"
                                                    className="input flex-1 border border-white/20 bg-[#050A1A]/60 focus:border-accent/70"
                                                    placeholder="https://..."
                                                    value={link}
                                                    onChange={(e) =>
                                                        handleExtraLinkChange(idx, e.target.value)
                                                    }
                                                />
                                                {formData.extraLinks.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="text-xs text-white/60 hover:text-red-300 px-2"
                                                        onClick={() => removeExtraLink(idx)}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            className="text-xs text-accent hover:text-accent/80"
                                            onClick={addExtraLink}
                                        >
                                            + Add another link
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* STEP 5 – Attachments & consent */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <h3 className="heading text-2xl">
                                Step 5 · Attachments & consent
                            </h3>
                            <p className="text-sm text-white/75">
                                Your data will be used only for processing your application and internal statistics.
                                You can request deletion at any time.
                            </p>

                            <div className="space-y-6">
                                {/* File uploads */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* CV upload */}
                                    <div className="flex flex-col gap-2">
                                        <label className="label-sm">
                                            CV upload <span className="text-red-400">*</span>
                                        </label>
                                        <div className="rounded-xl border border-white/15 bg-[#050A1A]/40 px-3 py-2">
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                className="block w-full text-xs sm:text-sm text-white/80 file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-1.5 file:text-[11px] file:font-medium file:text-white hover:file:bg-accent/90"
                                                onChange={(e) => handleFileChange("cvFile", e.target.files)}
                                            />
                                        </div>
                                        {formData.cvFile && (
                                            <p className="text-[11px] text-white/60">
                                                Selected: {formData.cvFile.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Extra document */}
                                    <div className="flex flex-col gap-2">
                                        <label className="label-sm">
                                            Additional document (optional)
                                        </label>
                                        <div className="rounded-xl border border-white/15 bg-[#050A1A]/40 px-3 py-2">
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                className="block w-full text-xs sm:text-sm text-white/80 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-1.5 file:text-[11px] file:font-medium file:text-white hover:file:bg-white/20"
                                                onChange={(e) => handleFileChange("extraFile", e.target.files)}
                                            />
                                        </div>
                                        {formData.extraFile && (
                                            <p className="text-[11px] text-white/60">
                                                Selected: {formData.extraFile.name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Consent checkboxes */}
                                <div className="space-y-3 text-xs text-white/75">
                                    <label className="flex items-start gap-3 p-3 rounded-lg border border-white/20 bg-[#050A1A]/40">
                                        <input
                                            type="checkbox"
                                            className="mt-0.5 h-4 w-4 rounded border-white/40 bg-transparent accent-accent"
                                            checked={formData.confirmInfoAccurate}
                                            onChange={(e) =>
                                                handleChange("confirmInfoAccurate", e.target.checked)
                                            }
                                        />
                                        <span>
                                            I confirm that the information I provided is accurate to the best of my knowledge.
                                        </span>
                                    </label>

                                    <label className="flex items-start gap-3 p-3 rounded-lg border border-white/20 bg-[#050A1A]/40">
                                        <input
                                            type="checkbox"
                                            className="mt-0.5 h-4 w-4 rounded border-white/40 bg-transparent accent-accent"
                                            checked={formData.consentDataProcessing}
                                            onChange={(e) =>
                                                handleChange("consentDataProcessing", e.target.checked)
                                            }
                                        />
                                        <span>
                                            I agree that RoboTUM can store and process my application data for the
                                            purpose of evaluating my application, in accordance with the applicable
                                            data protection rules.
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 6 – Review & submit */}
                    {step === 6 && (
                        <div className="space-y-6">
                            <h3 className="heading text-2xl">Step 6 · Review & submit</h3>
                            <p className="text-sm text-white/75">
                                Please quickly review your answers. If everything looks good, submit your application.
                            </p>

                            <div className="space-y-6 text-sm text-white/85">

                                {/* Personal info */}
                                <div className="rounded-2xl border border-white/15 bg-[#050A1A]/40 p-5 flex flex-col gap-2">
                                    <h4 className="font-semibold text-white mb-1">Personal info</h4>
                                    <p>{formData.firstName} {formData.surname}</p>
                                    <p>{formData.email}</p>
                                    {formData.phone && <p>{formData.phone}</p>}
                                    {formData.linkedin && <p>LinkedIn: {formData.linkedin}</p>}

                                    <p className="mt-1">
                                        {formData.studyLevel}
                                        {formData.studyLevel === "Other" && formData.studyLevelOther &&
                                            ` (${formData.studyLevelOther})`}
                                        {formData.fieldOfStudy && ` · ${formData.fieldOfStudy}`}
                                    </p>

                                    {(formData.semester || formData.university) && (
                                        <p>
                                            {formData.semester && `Semester: ${formData.semester}`}
                                            {formData.university && ` · ${formData.university}`}
                                        </p>
                                    )}
                                </div>

                                {/* Experience */}
                                <div className="rounded-2xl border border-white/15 bg-[#050A1A]/40 p-5 flex flex-col gap-2">
                                    <h4 className="font-semibold text-white mb-1">Experience</h4>

                                    {formData.whyJoin && (
                                        <p>
                                            <span className="font-medium">Why join RoboTUM:</span> {formData.whyJoin}
                                        </p>
                                    )}

                                    <p>
                                        Experience in robotics/programming/teamwork:{" "}
                                        <span className="font-medium">
                                            {formData.hasExperience === "yes" ? "Yes" : "No"}
                                        </span>
                                    </p>

                                    {formData.experienceDetails && (
                                        <p className="mt-1">{formData.experienceDetails}</p>
                                    )}

                                    <p className="mt-2">
                                        Student club / team experience:{" "}
                                        <span className="font-medium">
                                            {formData.hasClubExperience === "yes" ? "Yes" : "No"}
                                        </span>
                                    </p>

                                    {formData.clubExperienceDetails && (
                                        <p className="mt-1">{formData.clubExperienceDetails}</p>
                                    )}

                                    {formData.hoursPerWeek && (
                                        <p className="mt-2">Availability: {formData.hoursPerWeek}</p>
                                    )}
                                </div>

                                {/* Preferences */}
                                <div className="rounded-2xl border border-white/15 bg-[#050A1A]/40 p-5 flex flex-col gap-2">
                                    <h4 className="font-semibold text-white mb-1">Preferences</h4>

                                    {formData.topProfiles.length > 0 && (
                                        <p>
                                            <span className="font-medium">Profiles:</span>{" "}
                                            {formData.topProfiles.join(", ")}
                                            {formData.topProfiles.includes("Other") &&
                                                formData.topProfilesOther &&
                                                ` (${formData.topProfilesOther})`}
                                        </p>
                                    )}

                                    {formData.topProjects.length > 0 && (
                                        <p>
                                            <span className="font-medium">Projects:</span>{" "}
                                            {formData.topProjects.join(", ")}
                                        </p>
                                    )}
                                </div>

                                {/* Motivation & links */}
                                <div className="rounded-2xl border border-white/15 bg-[#050A1A]/40 p-5 flex flex-col gap-2">
                                    <h4 className="font-semibold text-white mb-1">Motivation & links</h4>

                                    {formData.motivationLetter && (
                                        <p>
                                            <span className="font-medium">Motivation:</span> {formData.motivationLetter}
                                        </p>
                                    )}

                                    {formData.whatToGain && (
                                        <p>
                                            <span className="font-medium">What to gain:</span> {formData.whatToGain}
                                        </p>
                                    )}

                                    {formData.dreamRobot && (
                                        <p>
                                            <span className="font-medium">Dream robot:</span> {formData.dreamRobot}
                                        </p>
                                    )}

                                    {(formData.heardFrom || formData.heardFromOther) && (
                                        <p>
                                            <span className="font-medium">Heard from:</span>{" "}
                                            {formData.heardFrom}
                                            {formData.heardFrom === "Other" && formData.heardFromOther &&
                                                ` (${formData.heardFromOther})`}
                                        </p>
                                    )}

                                    {formData.extraLinks.filter(Boolean).length > 0 && (
                                        <p>
                                            <span className="font-medium">Links:</span>{" "}
                                            {formData.extraLinks.filter(Boolean).join(" · ")}
                                        </p>
                                    )}
                                </div>

                                {/* Files & consent */}
                                <div className="rounded-2xl border border-white/15 bg-[#050A1A]/40 p-5 flex flex-col gap-2 text-xs text-white/80">
                                    <h4 className="font-semibold text-white mb-1">Files & consent</h4>

                                    <p>
                                        CV:{" "}
                                        {formData.cvFile ? formData.cvFile.name : "Not attached (required)"}
                                    </p>
                                    <p>
                                        Extra file: {formData.extraFile ? formData.extraFile.name : "—"}
                                    </p>

                                    <p className="mt-1">
                                        Info accurate: {formData.confirmInfoAccurate ? "Yes" : "No"}
                                    </p>
                                    <p>
                                        Data processing consent: {formData.consentDataProcessing ? "Yes" : "No"}
                                    </p>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Navigation buttons */}
                    {step > 0 && (
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex gap-3 w-full sm:w-auto">
                                {step > 0 && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="w-full sm:w-auto"
                                        onClick={goBack}
                                    >
                                        ← Back
                                    </Button>
                                )}
                            </div>

                            <div className="flex gap-3 w-full sm:w-auto justify-end">
                                {step > 0 && step < TOTAL_STEPS && (
                                    <Button
                                        type="button"
                                        variant="primary"
                                        className="w-full sm:w-auto"
                                        onClick={goNext}
                                    >
                                        Next step →
                                    </Button>
                                )}
                                {step === TOTAL_STEPS && (
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full sm:w-auto"
                                        disabled={
                                            !formData.cvFile ||
                                            !formData.confirmInfoAccurate ||
                                            !formData.consentDataProcessing
                                        }
                                    >
                                        Submit application
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
};

export default ApplicationFormSection;