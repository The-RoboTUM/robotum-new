// Faqs.jsx

import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import PageLoader from "@components/sections/common-sections/PageLoader";
import FaqSection from "@components/sections/faqs-sections/FaqSection";

import { fetchFaqs } from "@data"; // ✅ use your helper
import { useAsyncData } from "@hooks/useAsyncData";
import { usePageTitle } from "@hooks/usePageTitle";

const Faqs = () => {
  const {
    data: faqs,
    loading,
    error: errorMsg,
  } = useAsyncData(fetchFaqs, [], {
    initialData: [],
    errorMessage: "Failed to load FAQs. Please try again later.",
  });

  usePageTitle("Q&A | roboTUM");

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
