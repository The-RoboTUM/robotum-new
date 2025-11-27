// Faqs.jsx
import { useEffect, useState } from "react";

import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import PageLoader from "@components/sections/common-sections/PageLoader";
import FaqSection from "@/components/sections/faqs-sections/FaqSection";

import { fetchFaqs } from "@data"; // ✅ use your helper

const Faqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "Q&A | RoboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const load = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const data = await fetchFaqs(); // ✅ all Supabase logic inside faqsApi
        setFaqs(data);
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to load FAQs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <PageLoader />
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <FaqSection faqs={faqs} errorMsg={errorMsg} />
      <FooterSection />
    </>
  );
};

export default Faqs;
