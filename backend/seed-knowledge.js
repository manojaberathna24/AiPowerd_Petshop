// Seed knowledge base with pet care FAQs
require('dotenv').config();
const mongoose = require('mongoose');
const KnowledgeBase = require('./models/KnowledgeBase');

const seedKnowledge = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await KnowledgeBase.deleteMany({});
        console.log('🗑️ Cleared existing knowledge base');

        const knowledge = [
            // DOG NUTRITION
            {
                title: 'Puppy Feeding Guide',
                category: 'nutrition',
                petType: 'dog',
                question: 'How often should I feed my puppy?',
                answer: 'Puppies under 6 months should be fed 3-4 times daily. From 6-12 months, reduce to 2-3 times. Adult dogs typically eat twice a day. Use high-quality puppy food rich in protein and calcium.',
                keywords: ['puppy', 'feeding', 'food', 'schedule', 'how often', 'meals']
            },
            {
                title: 'Dog Food Portions',
                category: 'nutrition',
                petType: 'dog',
                question: 'How much should I feed my dog?',
                answer: 'Portion sizes depend on weight, age, and activity level. Generally: Small dogs (under 10kg): 1-1.5 cups/day, Medium dogs (10-25kg): 2-3 cups/day, Large dogs (25kg+): 3-4 cups/day. Always check food packaging for specific guidelines.',
                keywords: ['dog', 'portions', 'amount', 'how much', 'food', 'cups']
            },
            {
                title: 'Foods Dogs Cannot Eat',
                category: 'nutrition',
                petType: 'dog',
                question: 'What foods are toxic to dogs?',
                answer: 'NEVER feed dogs: chocolate, grapes/raisins, onions, garlic, avocado, xylitol (artificial sweetener), alcohol, caffeine, macadamia nuts, or cooked bones. These can cause serious health issues or death.',
                keywords: ['toxic', 'poison', 'dangerous', 'cannot eat', 'avoid', 'chocolate']
            },

            // CAT NUTRITION
            {
                title: 'Kitten Nutrition',
                category: 'nutrition',
                petType: 'cat',
                question: 'What should I feed my kitten?',
                answer: 'Kittens need high-protein food formulated for growth. Feed 3-4 small meals daily until 6 months, then 2-3 meals. Provide fresh water always. Avoid milk as many cats are lactose intolerant.',
                keywords: ['kitten', 'feeding', 'food', 'nutrition', 'protein']
            },
            {
                title: 'Cat Hydration',
                category: 'nutrition',
                petType: 'cat',
                question: 'How can I get my cat to drink more water?',
                answer: 'Try: pet water fountains (cats prefer running water), multiple water bowls in different locations, wet food (70% water content), ice cubes in water, wide shallow bowls (whiskers dont touch sides).',
                keywords: ['cat', 'water', 'drink', 'hydration', 'dehydrated']
            },

            // DOG HEALTH
            {
                title: 'Vaccination Schedule',
                category: 'health',
                petType: 'dog',
                question: 'When should I vaccinate my puppy?',
                answer: 'Core vaccines: 6-8 weeks: First DHPP, 10-12 weeks: Second DHPP, 14-16 weeks: Third DHPP + Rabies. Annual boosters thereafter. Consult your vet for specific recommendations.',
                keywords: ['vaccine', 'vaccination', 'shots', 'puppy', 'immunization', 'dhpp', 'rabies']
            },
            {
                title: 'Tick and Flea Prevention',
                category: 'health',
                petType: 'dog',
                question: 'How do I prevent ticks and fleas?',
                answer: 'Use monthly topical treatments or oral medications. Check your dog after outdoor activities. Keep grass short. Use flea combs regularly. Wash bedding weekly in hot water.',
                keywords: ['tick', 'flea', 'prevention', 'parasite', 'treatment']
            },
            {
                title: 'Dog Vomiting',
                category: 'health',
                petType: 'dog',
                question: 'My dog is vomiting, what should I do?',
                answer: 'Single vomiting may not be serious. Monitor for: repeated vomiting, blood, lethargy, diarrhea, or appetite loss. Fast for 12 hours, then offer small bland meals (boiled chicken + rice). If symptoms persist beyond 24 hours, see a vet immediately.',
                keywords: ['vomit', 'vomiting', 'throw up', 'sick', 'nausea']
            },

            // CAT HEALTH
            {
                title: 'Cat Hairballs',
                category: 'health',
                petType: 'cat',
                question: 'How can I reduce hairballs in my cat?',
                answer: 'Regular brushing (daily for long-haired cats), hairball prevention treats or gel, fiber-rich diet, increase water intake, and ensure adequate exercise. Occasional hairballs are normal, but frequent ones need vet attention.',
                keywords: ['hairball', 'fur', 'grooming', 'coughing', 'gagging']
            },

            // DOG TRAINING
            {
                title: 'Potty Training Puppies',
                category: 'training',
                petType: 'dog',
                question: 'How do I potty train my puppy?',
                answer: 'Take puppy out: after waking, after eating, after playing, every 2 hours. Use consistent spot and command. Reward immediately after success. Never punish accidents. Most puppies are trained by 4-6 months with consistency.',
                keywords: ['potty', 'toilet', 'house training', 'pee', 'poop', 'puppy', 'training']
            },
            {
                title: 'Stop Dog Barking',
                category: 'training',
                petType: 'dog',
                question: 'How do I stop excessive barking?',
                answer: 'Identify cause (boredom, fear, attention). Provide exercise and mental stimulation. Teach "quiet" command. Ignore attention-seeking barks. Reward quiet behavior. Consistency is key.',
                keywords: ['barking', 'bark', 'noise', 'loud', 'quiet', 'training']
            },

            // GROOMING
            {
                title: 'Dog Bathing Frequency',
                category: 'grooming',
                petType: 'dog',
                question: 'How often should I bathe my dog?',
                answer: 'Most dogs: once every 4-6 weeks. Active/outdoor dogs: every 2-4 weeks. Use dog-specific shampoo. Over-bathing removes natural oils. Brush before bathing to remove knots.',
                keywords: ['bath', 'bathe', 'wash', 'shampoo', 'clean', 'grooming']
            },
            {
                title: 'Nail Trimming',
                category: 'grooming',
                petType: 'all',
                question: 'How do I trim my pets nails?',
                answer: 'Trim every 2-4 weeks. Use proper pet nail clippers. Cut small amounts at a time. Avoid the quick (pink area). If bleeding occurs, use styptic powder. Reward your pet after trimming.',
                keywords: ['nail', 'trim', 'cut', 'claws', 'grooming']
            },

            // EMERGENCY
            {
                title: 'Pet Emergency Signs',
                category: 'emergency',
                petType: 'all',
                question: 'What are signs of a pet emergency?',
                answer: 'Seek immediate vet care for: difficulty breathing, unconsciousness, seizures, severe bleeding, suspected poisoning, inability to urinate, extreme pain, bloated abdomen, heatstroke, or broken bones.',
                keywords: ['emergency', 'urgent', 'vet', 'serious', 'help', 'danger']
            },

            // GENERAL
            {
                title: 'First Pet Care',
                category: 'general',
                petType: 'all',
                question: 'What do I need for a new pet?',
                answer: 'Essentials: food & water bowls, quality pet food, collar & ID tag, leash (dogs), litter box (cats), bed, toys, grooming supplies, vet appointment for checkup and vaccinations.',
                keywords: ['new pet', 'first time', 'essentials', 'supplies', 'necessities']
            },
            {
                title: 'Pet Exercise Requirements',
                category: 'general',
                petType: 'dog',
                question: 'How much exercise does my dog need?',
                answer: 'Depends on breed and age. Active breeds: 1-2 hours daily. Medium energy: 30-60 minutes. Low energy: 20-30 minutes. Puppies: 5 minutes per month of age, twice daily. Mental stimulation also important.',
                keywords: ['exercise', 'walk', 'play', 'activity', 'energy']
            }
        ];

        await KnowledgeBase.insertMany(knowledge);
        console.log(`✅ Added ${knowledge.length} knowledge base items`);
        console.log('\n🎉 Knowledge base seeded successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedKnowledge();
