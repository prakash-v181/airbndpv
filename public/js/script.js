// Runs after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const homeMapDiv = document.getElementById("homeMap");

  // Only if we are on home page (map exists) and Leaflet is loaded
  if (homeMapDiv && typeof L !== "undefined") {
    // Center on India
    const centerCoords = [20.5937, 78.9629];

    const map = L.map("homeMap").setView(centerCoords, 5);

    // OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Example locations
    const locations = [
      { name: "Goa – Beach stays", coords: [15.2993, 74.124] },
      { name: "Manali – Mountain cabins", coords: [32.2432, 77.1892] },
      { name: "Bengaluru – City lofts", coords: [12.9716, 77.5946] },
    ];

    locations.forEach((loc) => {
      L.marker(loc.coords).addTo(map).bindPopup(loc.name);
    });
  }
});
