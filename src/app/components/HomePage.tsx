import { HeroSection }       from "./HeroSection";
import { ProjectsSection }   from "./ProjectsSection";
import { AboutSection }      from "./AboutSection";
import { GallerySection }    from "./GallerySection";
import { ReviewsSection }    from "./ReviewsSection";
import { PaymentSection }    from "./PaymentSection";
import { ContactSection }    from "./ContactSection";
import { NewsletterSection } from "./NewsletterSection";
import { FooterSection }     from "./FooterSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <GallerySection />
      <ReviewsSection />
      <PaymentSection />
      <ContactSection />
      <NewsletterSection />
      <FooterSection />
    </>
  );
}
