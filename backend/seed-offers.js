// Seed special offers for Christmas/New Year 2025
require('dotenv').config();
const mongoose = require('mongoose');
const Offer = require('./models/Offer');

const seedOffers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await Offer.deleteMany({});
        console.log('🗑️ Cleared existing offers');

        const offers = [
            {
                title: 'Christmas Special - Pet Food Sale',
                description: 'Get 6% off on all pet food items this Christmas season!',
                category: 'food',
                petType: 'all',
                discountPercentage: 6,
                validFrom: new Date('2025-12-20'),
                validUntil: new Date('2025-12-26'),
                isActive: true,
                bannerImage: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800'
            },
            {
                title: 'New Year Sale - Dog Toys',
                description: 'Start the new year with happy pets! 10% off on all dog toys',
                category: 'toys',
                petType: 'dog',
                discountPercentage: 10,
                validFrom: new Date('2025-12-28'),
                validUntil: new Date('2026-01-05'),
                isActive: true,
                bannerImage: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800'
            },
            {
                title: 'Holiday Bundle - Cat Accessories',
                description: 'Pamper your feline friends with 8% off on cat accessories',
                category: 'accessories',
                petType: 'cat',
                discountPercentage: 8,
                validFrom: new Date('2025-12-20'),
                validUntil: new Date('2026-01-05'),
                isActive: true,
                bannerImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800'
            },
            {
                title: 'Winter Care - Grooming Special',
                description: 'Keep your pets clean and healthy! 15% off on grooming items',
                category: 'grooming',
                petType: 'all',
                discountPercentage: 15,
                validFrom: new Date('2025-12-20'),
                validUntil: new Date('2026-01-10'),
                isActive: true,
                bannerImage: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800'
            },
            {
                title: 'Mega Pet Sale - All Items',
                description: 'Year-end clearance! 5% off on everything in store',
                category: 'all',
                petType: 'all',
                discountPercentage: 5,
                validFrom: new Date('2025-12-22'),
                validUntil: new Date('2026-01-02'),
                isActive: true,
                bannerImage: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800'
            }
        ];

        await Offer.insertMany(offers);
        console.log(`✅ Added ${offers.length} special offers`);
        console.log('\n🎉 Offers seeded successfully!');
        console.log('\nActive Offers:');
        offers.forEach(offer => {
            console.log(`  - ${offer.title}: ${offer.discountPercentage}% off`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedOffers();
