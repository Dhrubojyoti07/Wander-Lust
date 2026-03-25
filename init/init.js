const mongoose = require("mongoose");
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const data = require("./data.js");
const Listing = require("../models/Listings.js");
const dbUrl = process.env.DB_URL;

if (!dbUrl) {
    console.error('FATAL: DB_URL environment variable is not set. Set it to your Atlas URI.');
    process.exit(1);
}

async function initdb() {
    await Listing.deleteMany();
    data.data = data.data.map((d) => ({
        ...d,
        User: process.env.SEED_USER_ID || "69b15d9fa14f447cf116b81a",
    }));
    await Listing.insertMany(data.data);
}

mongoose
    .connect(dbUrl, { serverSelectionTimeoutMS: 5000 })
    .then(async () => {
        console.log('init: mongodb is connected to', dbUrl.startsWith('mongodb+srv') ? 'Atlas' : dbUrl);
        if (process.env.SEED_DB === 'true') {
            try {
                await initdb();
                console.log('init: seeding complete');
            } catch (e) {
                console.error('init: seeding error', e);
            }
            process.exit(0);
        } else {
            console.log('init: SEED_DB not set, skipping seeding');
            process.exit(0);
        }
    })
    .catch((err) => {
        console.error('init: MongoDB connection error:', err);
        process.exit(1);
    });