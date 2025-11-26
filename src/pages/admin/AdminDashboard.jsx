import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import Button from "@components/ui/Button";
import { supabase } from "@lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <>
      {/* You can later replace this Navbar with an admin-specific header */}
      <Navbar />

      <main className="section-container min-h-screen text-white font-sans section-dark-primary surface-pattern py-20">
        <div className="max-w-4xl mx-auto space-y-10 text-center">
          <h1 className="heading heading-h1 text-white">Admin Dashboard</h1>
          <p className="text-text1 text-white/70 text-lg">
            Welcome to the RoboTUM Admin Panel.
          </p>

          <div className="space-y-6 mt-10">
            <p className="text-white/60">Admin tools coming soon:</p>
            <ul className="text-white/80 space-y-3">
              <li>• Manage Projects</li>
              <li>• Manage Events</li>
              <li>• Manage Partners</li>
              <li>• Manage FAQs</li>
              <li>• Manage Members</li>
              <li>• Review Applications</li>
            </ul>
          </div>

          <div className="mt-16">
            <Button variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </main>

      <FooterSection />
    </>
  );
}