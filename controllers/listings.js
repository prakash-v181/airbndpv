const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = geocodingClient({ accessToken: GOOGLE_MAPS_API_KEY });

// =================== INDEX ===================
module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  // Our index.ejs uses "listings"
  res.render("listings/index.ejs", { listings });
};

// =================== NEW FORM ===================
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// =================== SHOW ONE LISTING ===================
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings"); // ✅ return so function stops here
  }

  res.render("listings/show.ejs", { listing });
};

// =================== CREATE LISTING ===================
module.exports.createListing = async (req, res, next) => {
  // Optional: Mapbox code can go here later

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // ✅ Handle optional image upload safely
  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    newListing.image = { url, filename };
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// =================== EDIT FORM ===================
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings"); // ✅ return
  }

  // ✅ Be safe if listing.image is missing
  let originalImageUrl = listing.image && listing.image.url ? listing.image.url : null;
  if (originalImageUrl) {
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  }

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// =================== UPDATE LISTING ===================
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  // ✅ If a new image is uploaded, update it
  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// =================== DELETE LISTING ===================
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  console.log("Deleted listing:", deletedListing._id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
