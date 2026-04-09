const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const House = require('./models/House');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Seeding...'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const importData = async () => {
  try {
    // 1. Clear existing data
    await House.deleteMany();
    await User.deleteMany();
    console.log('Old Data Cleared...');

    // 2. Create Default Owner
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const owner = await User.create({
      name: 'Demo Owner',
      email: 'owner@test.com',
      password: hashedPassword,
      phone: '1234567890',
      role: 'owner'
    });
    console.log('Default Owner Created: owner@test.com / password123');

    // 3. Define Houses with the new owner ID
    const houses = [
      // --- LIVING: APARTMENT ---
      {
        ownerId: owner._id,
        title: "Eco-Friendly Urban Studio",
        location: "Greenwich, London",
        rent: 1800,
        purpose: "Living",
        propertyType: "Apartment",
        images: ["https://i.pinimg.com/1200x/bc/6d/4d/bc6d4d62f46fd20f786969542a98f48a.jpg"],
        amenities: ["Solar Power", "Smart HVAC", "Rooftop Garden", "Gym"]
      },
      {
        ownerId: owner._id,
        title: "Luxury High-Rise Suite",
        location: "Downtown, New York",
        rent: 3200,
        purpose: "Living",
        propertyType: "Apartment",
        images: ["https://i.pinimg.com/1200x/89/22/4d/89224d691cb744e848827979387c571a.jpg"],
        amenities: ["Concierge", "Swimming Pool", "Parking", "City View"]
      },
      // --- LIVING: STUDIO ---
      {
        ownerId: owner._id,
        title: "Minimalist Artist Loft",
        location: "SoHo, NYC",
        rent: 2200,
        purpose: "Living",
        propertyType: "Studio",
        images: ["https://i.pinimg.com/1200x/f1/c1/db/f1c1db5f33408fbfedf14b4708effb01.jpg"],
        amenities: ["Large Windows", "High Ceilings", "Fast WiFi"]
      },
      {
        ownerId: owner._id,
        title: "Compact Modern Studio",
        location: "Shibuya, Tokyo",
        rent: 1500,
        purpose: "Living",
        propertyType: "Studio",
        images: ["https://i.pinimg.com/1200x/80/e6/d0/80e6d0233caf51b392e24a1aa4915c71.jpg"],
        amenities: ["Smart Storage", "Subway Access", "Air Purifier"]
      },
      // --- LIVING: VILLA ---
      {
        ownerId: owner._id,
        title: "Mediterranean Dream Villa",
        location: "San Jose, California",
        rent: 5500,
        purpose: "Living",
        propertyType: "Villa",
        images: ["https://i.pinimg.com/1200x/69/75/f9/6975f944ae42587f05d9f64f0eb22bd2.jpg"],
        amenities: ["Private Pool", "Home Cinema", "Wine Cellar", "Gated Security"]
      },
      {
        ownerId: owner._id,
        title: "Modern Glass Estate",
        location: "Austin, Texas",
        rent: 4800,
        purpose: "Living",
        propertyType: "Villa",
        images: ["https://i.pinimg.com/1200x/26/de/fe/26defe817493dd15ffd320181c756b0a.jpg"],
        amenities: ["Floor-to-Ceiling Glass", "Infinity Pool", "Tesla Charger"]
      },
      // --- LIVING: SHARED HOUSE ---
      {
        ownerId: owner._id,
        title: "Co-Living Community House",
        location: "Cambridge, MA",
        rent: 1100,
        purpose: "Living",
        propertyType: "Shared House",
        images: ["https://i.pinimg.com/1200x/b1/9a/c4/b19ac4d4a475015760a58ec4e7ba6b9d.jpg"],
        amenities: ["Shared Kitchen", "Coworking Space", "Events Community", "Cleaning Service"]
      },
      {
        ownerId: owner._id,
        title: "Friendly Shared Townhome",
        location: "Melbourne, Australia",
        rent: 950,
        purpose: "Living",
        propertyType: "Shared House",
        images: ["https://i.pinimg.com/1200x/cb/c0/c9/cbc0c9ca96111bdb3123194ba3912183.jpg"],
        amenities: ["Backyard BBQ", "Communal TV Lounge", "Bike Storage"]
      },
      // --- VACATION: BEACH HOUSE ---
      {
        ownerId: owner._id,
        title: "Blue Horizon Beachfront",
        location: "Malibu, California",
        rent: 8500,
        purpose: "Vacation",
        propertyType: "Beach House",
        images: ["https://i.pinimg.com/1200x/83/87/36/8387366f91a55f1d6c59efe0568ee683.jpg"],
        amenities: ["Ocean Front", "Private Dock", "Sand Patio", "Barbecue"]
      },
      {
        ownerId: owner._id,
        title: "Seaside Shell Cottage",
        location: "Outer Banks, NC",
        rent: 4200,
        purpose: "Vacation",
        propertyType: "Beach House",
        images: ["https://i.pinimg.com/1200x/a8/72/25/a87225f967981e7a25e10b8d1747a858.jpg"],
        amenities: ["Beach Access", "Outdoor Shower", "Wraparound Deck"]
      },
      // --- VACATION: RELAXATION SPOT ---
      {
        ownerId: owner._id,
        title: "Zen Mountain Sanctuary",
        location: "Asheville, NC",
        rent: 3500,
        purpose: "Vacation",
        propertyType: "Relaxation Spot",
        images: ["https://i.pinimg.com/1200x/f7/d9/a0/f7d9a0cc3cbf4f319922a9f6df969bab.jpg"],
        amenities: ["Yoga Deck", "Hot Tub", "Mountain View", "Meditation Room"]
      },
      {
        ownerId: owner._id,
        title: "Peaceful Pine Cabin",
        location: "Lake Tahoe, CA",
        rent: 2800,
        purpose: "Vacation",
        propertyType: "Relaxation Spot",
        images: ["https://i.pinimg.com/1200x/5f/df/a7/5fdfa70fed3d2030ff801872633acb54.jpg"],
        amenities: ["Sauna", "Fireplace", "Forest Views", "Hammocks"]
      },
      // --- VACATION: RESORT ---
      {
        ownerId: owner._id,
        title: "Tropical Lagoon Resort Suite",
        location: "Bora Bora",
        rent: 12000,
        purpose: "Vacation",
        propertyType: "Resort",
        images: ["https://i.pinimg.com/1200x/ce/7c/3b/ce7c3b4962c24d9cfe569cb4afd1996c.jpg"],
        amenities: ["Overwater Bungalow", "Private Chef", "Spa Access", "Diving Gear"]
      },
      {
        ownerId: owner._id,
        title: "Gold Coast Luxury Resort",
        location: "Queensland, Australia",
        rent: 9800,
        purpose: "Vacation",
        propertyType: "Resort",
        images: ["https://i.pinimg.com/1200x/92/38/f3/9238f358df9888a5dddba5c8a34f027f.jpg"],
        amenities: ["All Inclusive", "Kids Club", "7 Swimming Pools", "Nightclub"]
      },
      // --- VACATION: COTTAGE ---
      {
        ownerId: owner._id,
        title: "English Rose Cottage",
        location: "Cotswolds, UK",
        rent: 2400,
        purpose: "Vacation",
        propertyType: "Cottage",
        images: ["https://i.pinimg.com/1200x/b7/75/86/b7758615370561ebd534be54e61a04c4.jpg"],
        amenities: ["Thatch Roof", "Secret Garden", "Log Burner", "Afternoon Tea"]
      },
      {
        ownerId: owner._id,
        title: "Mist & Fern Woodland Cottage",
        location: "Portland, Oregon",
        rent: 2100,
        purpose: "Vacation",
        propertyType: "Cottage",
        images: ["https://i.pinimg.com/1200x/a4/a7/3d/a4a73d1a79c75a2a828df031eff7b742.jpg"],
        amenities: ["Forest Trails", "Outdoor Firepit", "Pet Friendly", "Rustic Kitchen"]
      }
    ];

    // 4. Insert houses
    await House.insertMany(houses);
    console.log('16 Properties with 8 Varieties Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();