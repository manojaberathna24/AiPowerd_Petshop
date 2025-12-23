// Add 3 more offers to existing ones
require('dotenv').config();
const mongoose = require('mongoose');
const Offer = require('./models/Offer');

const addOffers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const newOffers = [
            {
                title: 'Weekend Special - Bird Supplies',
                description: 'Everything your feathered friends need! 12% off on all bird supplies',
                category: 'accessories',
                petType: 'bird',
                discountPercentage: 12,
                validFrom: new Date('2025-12-22'),
                validUntil: new Date('2026-01-15'),
                isActive: true,
                bannerImage: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800'
            },
            {
                title: 'Fish Tank Sale - Aquarium Essentials',
                description: 'Create the perfect home for your fish! 20% off on aquarium accessories',
                category: 'accessories',
                petType: 'fish',
                discountPercentage: 20,
                validFrom: new Date('2025-12-22'),
                validUntil: new Date('2026-01-20'),
                isActive: true,
                bannerImage: 'https://images.unsplash.com/photo-1520990761521-22e8a27a48eb?w=800'
            },
            {
                title: 'Premium Dog Food Bonanza',
                description: 'High-quality nutrition for your best friend! 18% off on premium dog food',
                category: 'food',
                petType: 'dog',
                discountPercentage: 18,
                validFrom: new Date('2025-12-22'),
                validUntil: new Date('2026-01-12'),
                isActive: true,
                bannerImage: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=800'
            }
        ];

        await Offer.insertMany(newOffers);
        console.log(`✅ Added ${newOffers.length} new offers`);
        console.log('\n🎉 New offers added successfully!');
        console.log('\nNew Offers:');
        newOffers.forEach(offer => {
            console.log(`  - ${offer.title}: ${offer.discountPercentage}% off`);
        });

        // Show total count
        const totalOffers = await Offer.countDocuments();
        console.log(`\n📊 Total offers in database: ${totalOffers}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

addOffers();
