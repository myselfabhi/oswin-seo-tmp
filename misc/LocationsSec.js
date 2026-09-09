import "./LocationsSec.scss"
import CommonSec, { CommonHeading } from "../CommonSec"
import CommonSlider from "../SliderCommon/CommonSlider"
import Link from "next/link"

const CITIES = [
  { name: "Madurai", slug: "plywood-dealers-madurai" },
  { name: "Trichy", slug: "plywood-dealers-trichy" },
  { name: "Nellore", slug: "plywood-dealers-nellore" },
  { name: "Hyderabad", slug: "plywood-dealers-hyderabad" },
  { name: "Bengaluru", slug: "plywood-dealers-bengaluru" },
  { name: "Hubballi", slug: "plywood-dealers-hubballi" },
];

const PinIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Mirrors BlogsList: returns the array of cards for CommonSlider to slide.
const LocationsList = () => {
  return (
    [
      CITIES.map((c) => (
        <div className="location-card-wrap" key={c.slug}>
          <Link href={`/${c.slug}`} className="location-card">
            <span className="loc-pin"><PinIcon /></span>
            <span className="loc-city">{c.name}</span>
            <span className="loc-sub">Plywood Manufacturers in {c.name}</span>
            <span className="loc-link">View Details <span className="arw">&rarr;</span></span>
          </Link>
        </div>
      ))
    ]
  );
};

const LocationsSec = () => {
  return (
    <CommonSec secname="locations-sec common-spacing-py">
      <div className="inner-container">
        <CommonHeading subtitle="Our Presence Across India" title="Authorised Plywood Dealers Near You" />
        <div className="items mt-4 sm:-ml-4">
          <CommonSlider itemStyle="mb-1 sm:px-4" desktopcount={4} arrow={true} tabcount={3} smalltabcount={2} mobilecount={1}>
            <LocationsList />
          </CommonSlider>
        </div>
      </div>
    </CommonSec>
  );
};

export default LocationsSec;
