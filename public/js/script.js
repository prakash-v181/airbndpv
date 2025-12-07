// Runs after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // ================== HOME PAGE MAP ==================
  const homeMapDiv = document.getElementById("homeMap");

  if (homeMapDiv && typeof L !== "undefined") {
    const centerCoords = [20.5937, 78.9629];

    const map = L.map("homeMap").setView(centerCoords, 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const locations = [
      { name: "Goa – Beach stays", coords: [15.2993, 74.124] },
      { name: "Manali – Mountain cabins", coords: [32.2432, 77.1892] },
      { name: "Bengaluru – City lofts", coords: [12.9716, 77.5946] },
    ];

    locations.forEach((loc) => {
      L.marker(loc.coords).addTo(map).bindPopup(loc.name);
    });
  }

  // ================== LISTING SHOW PAGE MAP ==================
  const listingMapDiv = document.getElementById("listingMap");

  if (listingMapDiv && typeof L !== "undefined") {
    const location = (listingMapDiv.dataset.location || "").toLowerCase().trim();
    const country = (listingMapDiv.dataset.country || "").toLowerCase().trim();

    const key = `${location}, ${country}`.replace(/\s+/g, " ");

    const coordMap = {
      "goa, india": [15.2993, 74.124],
      "bengaluru, india": [12.9716, 77.5946],
      "bangalore, india": [12.9716, 77.5946],
      "manali, india": [32.2432, 77.1892],
      "bidar, karnataka, india": [17.9133, 77.5301],
      "bidar, india": [17.9133, 77.5301],
    };

    const coords = coordMap[key] || [20.5937, 78.9629];

    const listingMap = L.map("listingMap").setView(coords, 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(listingMap);

    L.marker(coords)
      .addTo(listingMap)
      .bindPopup(`${listingMapDiv.dataset.location}, ${listingMapDiv.dataset.country}`);
  }
});
