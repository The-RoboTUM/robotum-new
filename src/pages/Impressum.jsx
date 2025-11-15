// General imports
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import PageLoader from "@components/sections/common-sections/PageLoader";

import { useEffect } from "react";

export default function Impressum() {
  useEffect(() => {
    document.title = "Impressum | RoboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <main className="w-full px-6 md:px-16 py-16 font-sans surface-2 edge-fade-top edge-fade-bottom">
          <article className="prose prose-invert max-w-3xl mx-auto">
            <h1 className="heading heading-h2 font-bold mb-6">Impressum</h1>

            <section className="mb-8">
              <h2 className="text-text1 font-semibold">Angaben gemäß § 5 TMG</h2>
              <p>
                NEXT Prototypes e.V.
                <br />
                Lichtenbergstr. 4a
                <br />
                85748 Garching bei München
                <br />
                Deutschland
              </p>
              <p>
                Vereinsregister: VR 208020
                <br />
                Registergericht: Amtsgericht München
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-text1 font-semibold">Kontakt</h2>
              <p className="mt-2">
                Owner contact phone:{" "}
                <a
                  href="tel:+4915222178503"
                  className="text-accent hover:underline"
                >
                  +49 (0) 15222178503
                </a>
                <br />
                Owner contact email:{" "}
                <a
                  href="mailto:outreach@robotum.info"
                  className="text-accent hover:underline"
                >
                  outreach@robotum.info
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-text1 font-semibold">Haftung für Inhalte</h2>
              <p>
                Als Dienstanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
                auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
                Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                verpflichtet, übermittelte oder gespeicherte fremde Informationen
                zu überwachen oder nach Umständen zu forschen, die auf eine
                rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung
                oder Sperrung der Nutzung von Informationen nach den allgemeinen
                Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung
                ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
                Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
                Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-text1 font-semibold">Haftung für Links</h2>
              <p>
                Unsere Seiten enthalten Links zu externen Websites Dritter, auf
                deren Inhalte wir keinen Einfluss haben und für die wir keine
                Haftung übernehmen können.
              </p>
            </section>

            <p className="text-white/60 mt-10 text-sm">
              Letzte Aktualisierung: {new Date().toLocaleDateString("de-DE")}
            </p>
          </article>
        </main>
      </Suspense>
      <FooterSection />
    </>
  );
}
