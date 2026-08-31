"use client"
import { createContext, useContext, useState } from "react";

const BrochureContext = createContext();

export const BrochureProvider = ({ children }) => {
  const [brochure, setBrochure] = useState({
    name: "Oswin Ply",
    url: "/brochures/oswin-ply.pdf"
  });

  return (
    <BrochureContext.Provider value={{ brochure, setBrochure }}>
      {children}
    </BrochureContext.Provider>
  );
};

export const useBrochure = () => useContext(BrochureContext);
