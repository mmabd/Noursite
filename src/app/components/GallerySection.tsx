import { Reveal } from "./Reveal";
import { useLanguage } from "../i18n";

const images = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1572293070206-a77065f6d651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1000",
    label: "AERIAL SURVEY — الغروب",
    wide: true,
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1705242056484-213173456790?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    label: "FOUNDATION — PLAZA CORE",
    tall: true,
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1758304480333-90d7735e9f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    label: "COMMUNITY — NORTHGATE",
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1764222233275-87dc016c11dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1000",
    label: "SITE OVERVIEW — VANTAGE",
    wide: true,
  },
];

export function GallerySection() {
  const { copy } = useLanguage();

  return (
    <section className="land-section land-section--dark" id="gallery">
      <Reveal delay={0}>
        <div className="land-label land-label--white">{copy.gallery.label}</div>
      </Reveal>
      <div className="land-gallery__header">
        <Reveal delay={80} blur>
          <h2 className="land-heading land-heading--white">{copy.gallery.heading}</h2>
        </Reveal>
        <Reveal delay={160} from="left">
          <span className="land-gallery__count">
            {images.length} {copy.gallery.images}
          </span>
        </Reveal>
      </div>

      <div className="land-gallery__grid">
        <Reveal delay={100} duration={1000}>
          <div className="land-gallery__item land-gallery__item--wide" style={{ height: "100%" }}>
            <img src={images[0].url} alt={images[0].label} />
          </div>
        </Reveal>
        <Reveal delay={180} duration={1000}>
          <div className="land-gallery__item land-gallery__item--tall" style={{ height: "100%" }}>
            <img src={images[1].url} alt={images[1].label} />
          </div>
        </Reveal>
        <Reveal delay={260} duration={1000}>
          <div className="land-gallery__item" style={{ height: "100%" }}>
            <img src={images[2].url} alt={images[2].label} />
          </div>
        </Reveal>
        <Reveal delay={340} duration={1000}>
          <div className="land-gallery__item" style={{ height: "100%" }}>
            <img src={images[3].url} alt={images[3].label} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
