import React from 'react';
import { Users2, Shield, Flame, Target, MessageSquareCode } from 'lucide-react';

export const LandingBrotherhood: React.FC = () => {
  const elements = [
    { title: "Ironclad Accountability", text: "Men who check your progress, question your compromises, and refuse to let you drift." },
    { title: "Shared Hardship", text: "Heavy mountain rucks, grueling physical sessions, and shared commitments that forge unbreakable bonds." },
    { title: "Unfiltered Counsel", text: "Direct, private conversations about business dilemmas, family leadership, and personal struggles without fear of judgment." },
    { title: "Strategic Collaboration", text: "Commercial partnerships, capital syndicates, and mutual patronage between brothers who share values." },
    { title: "Generational Mentorship", text: "Seasoned council leaders guiding younger aspirants, passing down wisdom, tradecraft, and spiritual grounding." },
    { title: "Collective Elevation", text: "A rising tide of standards where one brother's breakthrough sets a higher benchmark for the entire conclave." }
  ];

  return (
    <section className="landing-section">
      <div className="brotherhood-atmosphere-card">
        <span className="landing-section-badge">The Living Brotherhood</span>

        <h2 className="brotherhood-quote-large">
          "Surround Yourself With Men Who Are Building."
        </h2>

        <p className="brotherhood-description">
          Technology is merely the operating system. Sovereign Men's Club exists for the living, breathing brotherhood of men who show up, keep their word, and carry heavy loads together.
        </p>

        {/* 6 Dimension Grid */}
        <div className="brotherhood-dimensions-grid">
          {elements.map((el) => (
            <div key={el.title} className="brotherhood-dimension-card">
              <h4 className="brotherhood-dimension-title">
                {el.title}
              </h4>
              <p className="brotherhood-dimension-text">
                {el.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
