export function getWatchSpecs(product) {
  const name = (product.name || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();

  // Default specifications
  let movement = "Quartz";
  let diameter = "40mm";
  let water = "50m";
  let strap = "Leather";
  let glass = "Mineral Glass";
  let warranty = "2 Years";
  let features = "Analog Display";

  if (brand.includes("rolex")) {
    movement = "Automatic (Self-winding)";
    diameter = name.includes("daytona") ? "40mm" : "41mm";
    water = name.includes("submariner") ? "300m (1000ft)" : "100m";
    strap = name.includes("rose gold") ? "18ct Everose Gold" : "Oystersteel";
    glass = "Scratch-resistant Sapphire";
    warranty = "5 Years";
    features = name.includes("daytona")
      ? "Chronograph, Tachymeter scale, Oysterclasp"
      : "Unidirectional rotatable bezel, Cerachrom insert, Luminescent markers";
  } else if (brand.includes("casio")) {
    if (name.includes("vintage")) {
      movement = "Quartz (Digital)";
      diameter = "36.3mm";
      water = "30m (Splashproof)";
      strap = "Gold-plated Stainless Steel";
      glass = "Acrylic Glass";
      warranty = "1 Year";
      features = "Daily alarm, Auto-calendar, Micro-light, 1/100-sec stopwatch";
    } else if (name.includes("g-shock")) {
      movement = "Quartz (Ana-Digi)";
      diameter = "48.5mm";
      water = "200m (Diver's)";
      strap = "Resin Strap";
      glass = "Mineral Glass";
      warranty = "2 Years";
      features = "Shock resistant, Double LED light, 5 daily alarms, World time (48 cities)";
    }
  } else if (brand.includes("fastrack")) {
    if (name.includes("smartwatch") || name.includes("reflex")) {
      movement = "Smart Tech (Rechargeable)";
      diameter = "42mm (Touchscreen)";
      water = "IP68 Dust & Water Resistant";
      strap = "Silicone Strap";
      glass = "Tempered Glass";
      warranty = "1 Year";
      features = "Heart rate tracker, Sleep monitor, SpO2, Auto-sports tracking, Custom watch faces";
    } else {
      movement = "Quartz";
      diameter = "38mm";
      water = "50m";
      strap = "Genuine Leather";
      glass = "Mineral Glass";
      warranty = "1 Year";
      features = "Minimalist dial, lightweight build";
    }
  } else if (brand.includes("titan")) {
    if (name.includes("chronograph") || name.includes("regalia")) {
      movement = "Multi-function Quartz";
      diameter = "43mm";
      water = "50m";
      strap = "Stainless Steel";
      glass = "Mineral Glass";
      warranty = "2 Years";
      features = "Chronograph stopwatch, date complications, silver-plated links";
    } else {
      movement = "Quartz";
      diameter = "39mm";
      water = "30m";
      strap = "Genuine Leather";
      glass = "Mineral Glass";
      warranty = "2 Years";
      features = "Classic day-date window, gold-plated bezel detail";
    }
  } else if (name.includes("sport") || name.includes("chronograph")) {
    movement = "Automatic";
    diameter = "42mm";
    water = "100m";
    strap = "Stainless Steel";
    glass = "Sapphire Crystal";
    warranty = "2 Years";
    features = "Chronograph subdials, tachymeter";
  }

  return {
    movement,
    diameter,
    water,
    strap,
    glass,
    warranty,
    features,
  };
}
