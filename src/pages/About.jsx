// general imports
import Navbar from '../components/sections/common-sections/Navbar';
import FooterSection from '../components/sections/common-sections/FooterSection';

// specific imports
import HeroSection from '../components/sections/about-us-sections/HeroSection';
import TeamSection from '../components/sections/about-us-sections/TeamSection';

import { useEffect } from 'react';

const About = () => {
    useEffect(() => {
        document.title = 'About Us | RoboTUM';
    }, []);

    return (
        <>
            <Navbar />
            <HeroSection />
            <TeamSection />
            <FooterSection />
        </>
    );
}

export default About;