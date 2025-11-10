import { useState } from "react";
import ImageFrame from "@components/ui/ImageFrame";
import Button from "@components/ui/Button";
import * as assets from "@assets";

export default function ContactUsSection() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", company: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="surface-2 edge-fade-top edge-fade-bottom">
      <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left side: contact form */}
        <div>
          <h2 className="heading heading-h2 mb-6">Become a Partner</h2>
          <p className="text-text2 text-white/80 mb-8 max-w-prose">
            Interested in collaborating with RoboTUM? Fill out the form below
            and we’ll get in touch soon.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white/90 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-[#0B1B2E]/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-white/90 mb-1"
              >
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-[#0B1B2E]/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Company name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/90 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-[#0B1B2E]/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-white/90 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-[#0B1B2E]/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <Button type="submit" variant="primary" className="mt-4">
              Submit
            </Button>
          </form>

          <p className="text-sm text-white/60 mt-6">
            *Alternatively, write to{" "}
            <a
              href="mailto:outreach@robotum.info"
              className="underline text-accent hover:text-blue-400"
            >
              outreach@robotum.info
            </a>
            .
          </p>
        </div>

        {/* Right side: contact card */}
        <div className="flex flex-col items-center bg-[#0B1B2E]/40 border border-white/10 rounded-2xl p-8 text-center">
          <ImageFrame
            src={assets.member}
            alt="Marco Färber-Gonzalez"
            className="w-40 h-40 rounded-full mb-5"
          />
          <h3 className="heading text-xl mb-2">Marco Färber-Gonzalez</h3>
          <p className="text-white/80 mb-4">Head of External Relations</p>
          <p className="text-white/70 text-sm mb-1">outreach@robotum.info</p>
          <p className="text-white/70 text-sm">+49 1573 8255775</p>
        </div>
      </div>
    </section>
  );
}
