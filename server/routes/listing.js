import express from "express";
import multer from "multer";
import mongoose from "mongoose"; // Import mongoose to use ObjectId
import Listing from "../models/Listing.js";
import User from "../models/User.js";

const router = express.Router();

// Configuration for multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

// CREATE LISTING
router.post("/create", upload.array("listingPhotos"), async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      price,
    } = req.body;

    const listingPhotos = req.files;

    if (!listingPhotos) {
      return res.status(400).send("No file uploaded.");
    }

    // Generate full URLs for uploaded files
    const listingPhotoPaths = listingPhotos.map(
      (file) => `${req.protocol}://${req.get("host")}/${file.path}`
    );

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      price,
    });

    await newListing.save();
    res.status(200).json(newListing);
  } catch (err) {
    res
      .status(409)
      .json({ message: "Failed to create listing", error: err.message });
    console.error(err);
  }
});

// GET LISTING BY CATEGORY
router.get("/", async (req, res) => {
  const qCategory = req.query.category;
  try {
    let listings;
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate(
        "creator"
      );
    } else {
      listings = await Listing.find().populate("creator");
    }
    res.status(200).json(listings);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Failed to fetch listings", error: err.message });
    console.error(err);
  }
});

// GET LISTING BY SEARCH
router.get("/search/:search", async (req, res) => {
  const { search } = req.params;
  try {
    let listings = [];
    if (search === "All") {
      listings = await Listing.find().populate("creator");
    } else {
      listings = await Listing.find({
        $or: [
          { category: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ],
      }).populate("creator");
    }
    res.status(200).json(listings);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Failed to fetch listings", error: err.message });
    console.error(err);
  }
});

// GET LISTING DETAILS
router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    // Validate listingId as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: "Invalid Listing ID format" });
    }
    const listing = await Listing.findById(listingId).populate("creator");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch listing details", error: err.message });
    console.error(err);
  }
});

export default router;
