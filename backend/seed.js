// Enhanced seed script with many more products
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Pet = require('./models/Pet');
const Service = require('./models/Service');
const ForumPost = require('./models/ForumPost');
const User = require('./models/User');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            adminUser = await User.findOne();
        }
        const userId = adminUser?._id;

        // Clear existing data
        await Product.deleteMany({});
        await Pet.deleteMany({});
        await Service.deleteMany({});
        await ForumPost.deleteMany({});
        console.log('🗑️ Cleared existing data');

        // Expanded Products List
        const products = [
            // Dog Foods (Under Rs.500)
            {
                name: 'Pedigree Puppy Dry Food 400g',
                description: 'Complete nutrition for growing puppies with chicken and vegetables',
                price: 450,
                category: 'food',
                petType: 'dog',
                stock: 50,
                brand: 'Pedigree',
                image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
                rating: 4.5,
                numReviews: 32
            },
            {
                name: 'Drools Chicken & Rice Puppy Food 400g',
                description: 'Protein-rich puppy food with real chicken',
                price: 380,
                category: 'food',
                petType: 'dog',
                stock: 45,
                brand: 'Drools',
                image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400',
                rating: 4.3,
                numReviews: 28
            },

            // Dog Foods (Above Rs.500)
            {
                name: 'Royal Canin Maxi Adult 1kg',
                description: 'Premium dog food for large breed adults',
                price: 2500,
                category: 'food',
                petType: 'dog',
                stock: 30,
                brand: 'Royal Canin',
                image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400',
                rating: 4.8,
                numReviews: 45
            },
            {
                name: 'Pedigree Adult Dry Food 3kg',
                description: 'Complete nutrition for adult dogs',
                price: 1850,
                category: 'food',
                petType: 'dog',
                stock: 40,
                brand: 'Pedigree',
                image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400',
                rating: 4.4,
                numReviews: 56
            },

            // Dog Toys (Under Rs.500)
            {
                name: 'Rubber Chew Bone',
                description: 'Durable rubber bone for aggressive chewers',
                price: 350,
                category: 'toys',
                petType: 'dog',
                stock: 80,
                brand: 'PetPlay',
                image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400',
                rating: 4.6,
                numReviews: 42
            },
            {
                name: 'Squeaky Ball Toy',
                description: 'Interactive squeaky ball for playtime',
                price: 280,
                category: 'toys',
                petType: 'dog',
                stock: 100,
                brand: 'FunPet',
                image: 'https://images.unsplash.com/photo-1535268244880-d71ab59a320d?w=400',
                rating: 4.4,
                numReviews: 38
            },
            {
                name: 'Rope Tug Toy',
                description: 'Cotton rope toy for tug-of-war games',
                price: 220,
                category: 'toys',
                petType: 'dog',
                stock: 90,
                brand: 'PetPlay',
                image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
                rating: 4.5,
                numReviews: 35
            },
            {
                name: 'Tennis Ball 3-Pack',
                description: 'Classic tennis balls for fetch games',
                price: 320,
                category: 'toys',
                petType: 'dog',
                stock: 120,
                brand: 'Kong',
                image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400',
                rating: 4.7,
                numReviews: 50
            },

            // Cat Food (Under Rs.500)
            {
                name: 'Whiskas Junior Wet Food Pouch 85g',
                description: 'Tuna flavor wet food for kittens',
                price: 180,
                category: 'food',
                petType: 'cat',
                stock: 60,
                brand: 'Whiskas',
                image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
                rating: 4.5,
                numReviews: 40
            },
            {
                name: 'Me-O Adult Cat Food 400g',
                description: 'Complete nutrition with ocean fish',
                price: 420,
                category: 'food',
                petType: 'cat',
                stock: 55,
                brand: 'Me-O',
                image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
                rating: 4.3,
                numReviews: 33
            },

            // Cat Food (Above Rs.500)
            {
                name: 'Royal Canin Persian Adult 2kg',
                description: 'Specialized food for Persian cats',
                price: 3200,
                category: 'food',
                petType: 'cat',
                stock: 25,
                brand: 'Royal Canin',
                image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
                rating: 4.9,
                numReviews: 28
            },
            {
                name: 'Whiskas Dry Food Variety Pack 1.2kg',
                description: 'Mixed flavors for adult cats',
                price: 1680,
                category: 'food',
                petType: 'cat',
                stock: 35,
                brand: 'Whiskas',
                image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
                rating: 4.6,
                numReviews: 48
            },

            // Cat Toys (Under Rs.500)
            {
                name: 'Feather Wand Toy',
                description: 'Interactive feather wand for cats',
                price: 280,
                category: 'toys',
                petType: 'cat',
                stock: 70,
                brand: 'CatPlay',
                image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
                rating: 4.6,
                numReviews: 42
            },
            {
                name: 'Catnip Mouse 3-Pack',
                description: 'Soft mice filled with catnip',
                price: 350,
                category: 'toys',
                petType: 'cat',
                stock: 85,
                brand: 'CatPlay',
                image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
                rating: 4.5,
                numReviews: 38
            },
            {
                name: 'Laser Pointer Toy',
                description: 'LED laser pointer for cat exercise',
                price: 250,
                category: 'toys',
                petType: 'cat',
                stock: 95,
                brand: 'PetTech',
                image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
                rating: 4.7,
                numReviews: 45
            },

            // Accessories (Under Rs.500)
            {
                name: 'Stainless Steel Food Bowl',
                description: 'Anti-slip food bowl for dogs and cats',
                price: 380,
                category: 'accessories',
                petType: 'all',
                stock: 100,
                brand: 'PetEssentials',
                image: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400',
                rating: 4.5,
                numReviews: 30
            },
            {
                name: 'Adjustable Collar (Small)',
                description: 'Nylon collar for small dogs and cats',
                price: 320,
                category: 'accessories',
                petType: 'all',
                stock: 110,
                brand: 'PetGear',
                image: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400',
                rating: 4.4,
                numReviews: 35
            },
            {
                name: 'Nail Clipper Set',
                description: 'Professional nail clipper for pets',
                price: 450,
                category: 'grooming',
                petType: 'all',
                stock: 60,
                brand: 'GroomPro',
                image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400',
                rating: 4.6,
                numReviews: 28
            },

            // Accessories (Above Rs.500)
            {
                name: 'Premium Cat Scratching Post',
                description: 'Multi-level scratching post with toys',
                price: 8500,
                category: 'accessories',
                petType: 'cat',
                stock: 15,
                brand: 'PetPals',
                image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400',
                rating: 4.8,
                numReviews: 18
            },
            {
                name: 'Dog Leash and Harness Set',
                description: 'Reflective leash and padded harness',
                price: 1850,
                category: 'accessories',
                petType: 'dog',
                stock: 40,
                brand: 'SafeWalk',
                image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400',
                rating: 4.7,
                numReviews: 32
            },
            {
                name: 'Automatic Pet Water Fountain',
                description: 'Circulating water fountain with filter',
                price: 3200,
                category: 'accessories',
                petType: 'all',
                stock: 20,
                brand: 'AquaPet',
                image: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400',
                rating: 4.8,
                numReviews: 25
            },

            // Bird & Fish Products
            {
                name: 'Bird Cage with Stand',
                description: 'Spacious cage for parakeets',
                price: 12000,
                category: 'accessories',
                petType: 'bird',
                stock: 10,
                brand: 'BirdLife',
                image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400',
                rating: 4.7,
                numReviews: 8
            },
            {
                name: 'Aquarium Starter Kit 20L',
                description: 'Complete setup with filter and lights',
                price: 15000,
                category: 'accessories',
                petType: 'fish',
                stock: 8,
                brand: 'AquaLife',
                image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400',
                rating: 4.5,
                numReviews: 12
            }
        ];

        await Product.insertMany(products);
        console.log(`✅ Added ${products.length} products`);

        // Pets remain the same
        const pets = [
            {
                name: 'Bruno',
                type: 'dog',
                breed: 'Golden Retriever',
                age: '2 years',
                gender: 'male',
                description: 'Friendly and energetic Golden Retriever',
                location: 'Colombo',
                image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
                vaccinated: true,
                neutered: true,
                status: 'available'
            },
            {
                name: 'Mimi',
                type: 'cat',
                breed: 'Persian',
                age: '1 year',
                gender: 'female',
                description: 'Beautiful Persian cat with calm personality',
                location: 'Kandy',
                image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
                vaccinated: true,
                neutered: false,
                status: 'available'
            }
        ];

        await Pet.insertMany(pets);
        console.log(`✅ Added ${pets.length} pets`);

        // Services
        const services = [
            {
                name: 'Pet Care Veterinary Clinic',
                type: 'vet',
                address: 'No. 45, Galle Road, Colombo 03',
                phone: '+94 11 234 5678',
                email: 'info@petcarevet.lk',
                location: { lat: 6.9271, lng: 79.8612 },
                openHours: '8:00 AM - 8:00 PM',
                rating: 4.8,
                numReviews: 45,
                image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400'
            }
        ];

        await Service.insertMany(services);
        console.log(`✅ Added ${services.length} services`);

        if (userId) {
            const forumPosts = [
                {
                    user: userId,
                    title: 'Best food for Golden Retrievers?',
                    content: 'Looking for recommendations',
                    category: 'nutrition',
                    views: 45
                }
            ];
            await ForumPost.insertMany(forumPosts);
            console.log(`✅ Added ${forumPosts.length} forum posts`);
        }

        console.log('\n🎉 Database seeded successfully!');
        console.log(`📦 Products: ${products.length}`);
        console.log(`🐶 Pets: ${pets.length}`);
        console.log(`🏥 Services: ${services.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
