import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../models/User.js';
import { Dish } from '../models/Dish.js';
import { Meal } from '../models/Meal.js';
import { Rating } from '../models/Rating.js';
import { Feedback } from '../models/Feedback.js';
import { Complaint } from '../models/Complaint.js';
import { Notification } from '../models/Notification.js';
import { SentimentService } from '../services/sentimentService.js';
import { connectDB } from '../config/database.js';

const DISHES_DATA = [
  // Breakfast Special
  { name: 'Masala Dosa with Sambar & Chutney', category: 'Breakfast Special', description: 'Crispy fermented crepe stuffed with spiced potato masala, served with piping hot drumstick sambar and coconut chutney.', isVegetarian: true, calories: 320 },
  { name: 'Steamed Idli with Vada', category: 'Breakfast Special', description: 'Fluffy steamed rice-lentil cakes paired with crispy medu vada and spicy tomato-onion chutney.', isVegetarian: true, calories: 280 },
  { name: 'Aloo Paratha with Curd & Pickle', category: 'Breakfast Special', description: 'Whole wheat flatbread stuffed with spiced mashed potatoes, roasted with butter, served with fresh curd.', isVegetarian: true, calories: 380 },
  { name: 'Poha with Sev & Roasted Peanuts', category: 'Breakfast Special', description: 'Flattened rice tempered with mustard seeds, curry leaves, turmeric, crunchy peanuts, and fresh coriander.', isVegetarian: true, calories: 240 },
  { name: 'Chole Bhature', category: 'Breakfast Special', description: 'Spicy tangy chickpea curry served with golden fried puffy bread and pickled onions.', isVegetarian: true, calories: 520 },
  { name: 'Upma with Coconut Chutney', category: 'Breakfast Special', description: 'Roasted semolina cooked with vegetables, curry leaves, ginger, and cashew nuts.', isVegetarian: true, calories: 220 },
  { name: 'Poori Bhaji', category: 'Breakfast Special', description: 'Fluffy fried wheat pooris served with mild spiced potato curry.', isVegetarian: true, calories: 410 },

  // Curry & Dal
  { name: 'Paneer Butter Masala', category: 'Curry & Dal', description: 'Cottage cheese cubes simmered in a rich tomato, butter, and cashew cream gravy.', isVegetarian: true, calories: 360 },
  { name: 'Dal Makhani', category: 'Curry & Dal', description: 'Slow-cooked black lentils and kidney beans enriched with fresh cream and butter.', isVegetarian: true, calories: 310 },
  { name: 'Palak Paneer', category: 'Curry & Dal', description: 'Cottage cheese cooked in smooth spiced spinach puree with ginger and garlic.', isVegetarian: true, calories: 290 },
  { name: 'Yellow Dal Tadka', category: 'Curry & Dal', description: 'Yellow arhar dal tempered with cumin, garlic, red chilies, and ghee.', isVegetarian: true, calories: 180 },
  { name: 'Rajma Masala', category: 'Curry & Dal', description: 'Punjabi style red kidney beans in thick aromatic onion-tomato gravy.', isVegetarian: true, calories: 260 },
  { name: 'Kadhai Paneer', category: 'Curry & Dal', description: 'Paneer and bell peppers tossed with freshly pounded coriander and red chili masala.', isVegetarian: true, calories: 340 },
  { name: 'Mixed Veg Curry', category: 'Curry & Dal', description: 'Seasonal vegetables cooked in home-style tomato-onion gravy.', isVegetarian: true, calories: 190 },
  { name: 'Aloo Gobi Matar', category: 'Curry & Dal', description: 'Potatoes, cauliflower, and green peas sautéed with cumin and turmeric.', isVegetarian: true, calories: 210 },
  { name: 'Egg Curry (2 Eggs)', category: 'Curry & Dal', description: 'Boiled eggs cooked in spicy roasted onion and garlic gravy.', isVegetarian: false, calories: 280 },
  { name: 'Butter Chicken Curry', category: 'Curry & Dal', description: 'Tender chicken pieces simmered in silky makhani gravy with aromatic fenugreek.', isVegetarian: false, calories: 420 },

  // Bread & Rice
  { name: 'Tandoori Roti (Butter / Plain)', category: 'Bread & Rice', description: 'Whole wheat flatbread cooked in clay oven.', isVegetarian: true, calories: 120 },
  { name: 'Garlic Butter Naan', category: 'Bread & Rice', description: 'Leavened flatbread brushed with garlic butter and fresh cilantro.', isVegetarian: true, calories: 210 },
  { name: 'Jeera Rice', category: 'Bread & Rice', description: 'Fragrant basmati rice tempered with roasted cumin seeds and ghee.', isVegetarian: true, calories: 220 },
  { name: 'Hyderabadi Veg Dum Biryani', category: 'Bread & Rice', description: 'Layers of basmati rice, vegetables, saffron, and mint slow-cooked in sealed handi.', isVegetarian: true, calories: 390 },
  { name: 'Steamed Basmati Rice', category: 'Bread & Rice', description: 'Fluffy long-grain basmati rice.', isVegetarian: true, calories: 180 },
  { name: 'Chicken Dum Biryani', category: 'Bread & Rice', description: 'Aromatic layered basmati rice with marinated spiced chicken, fried onions, and mint.', isVegetarian: false, calories: 510 },

  // Snacks & Beverages
  { name: 'Pav Bhaji with Butter Pav', category: 'Snacks & Beverages', description: 'Spiced mashed mixed vegetable curry served with hot butter-toasted pav and lemon wedges.', isVegetarian: true, calories: 380 },
  { name: 'Samosa (2 pcs) with Mint Chutney', category: 'Snacks & Beverages', description: 'Crispy pastry crust filled with spiced potatoes, green peas, and cashews.', isVegetarian: true, calories: 310 },
  { name: 'Masala Chai & Biscuits', category: 'Snacks & Beverages', description: 'Brewed black tea infused with crushed ginger, cardamom, and whole milk.', isVegetarian: true, calories: 90 },
  { name: 'Filter Coffee', category: 'Snacks & Beverages', description: 'South Indian style chicory-blended decoction with frothy frothed milk.', isVegetarian: true, calories: 85 },
  { name: 'Veg Cutlet with Ketchup', category: 'Snacks & Beverages', description: 'Crisp breadcrumb-coated vegetable patties with beetroot and potatoes.', isVegetarian: true, calories: 210 },
  { name: 'Bread Pakoda with Green Chutney', category: 'Snacks & Beverages', description: 'Spiced potato sandwich coated in gram flour batter and deep fried golden.', isVegetarian: true, calories: 290 },

  // Dessert & Sweets
  { name: 'Gulab Jamun (2 pcs)', category: 'Dessert & Sweets', description: 'Soft milk solids dumplings fried and soaked in rose-cardamom sugar syrup.', isVegetarian: true, calories: 290 },
  { name: 'Rice Kheer with Nuts', category: 'Dessert & Sweets', description: 'Slow-simmered rice pudding with saffron, cardamom, raisins, and slivered almonds.', isVegetarian: true, calories: 220 },
  { name: 'Moong Dal Halwa', category: 'Dessert & Sweets', description: 'Rich dessert made with yellow lentils, pure desi ghee, and roasted cashews.', isVegetarian: true, calories: 340 },
  { name: 'Vanilla Ice Cream Cup', category: 'Dessert & Sweets', description: 'Classic creamy vanilla scoop.', isVegetarian: true, calories: 150 },

  // Salad & Accompaniments
  { name: 'Fresh Green Salad & Raita', category: 'Salad & Accompaniments', description: 'Sliced cucumbers, carrots, tomatoes, onions paired with boondi or mix veg raita.', isVegetarian: true, calories: 75 },
  { name: 'Crispy Papad & Mixed Pickle', category: 'Salad & Accompaniments', description: 'Roasted urad dal papad with traditional spicy mango and lemon pickle.', isVegetarian: true, calories: 50 },
];

const STUDENT_FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith', 'Kabir', 'Ananya', 'Diya', 'Isha', 'Aadhya',
  'Anika', 'Navya', 'Pooja', 'Riya', 'Sneha', 'Tanvi', 'Veda', 'Meera', 'Tara', 'Rohan', 'Dhruv',
  'Manish', 'Karthik', 'Siddharth', 'Nikhil', 'Dev', 'Kunal', 'Harsh', 'Yash', 'Varun', 'Gaurav',
  'Abhinav', 'Shubham', 'Ayush', 'Mohit', 'Akash', 'Rahul', 'Nitin', 'Vikas', 'Prakash'
];

const STUDENT_LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Rao', 'Nair', 'Menon',
  'Iyer', 'Agarwal', 'Joshi', 'Bose', 'Chatterjee', 'Banerjee', 'Das', 'Mishra', 'Pandey', 'Tiwari',
  'Choudhury', 'Kulkarni', 'Deshmukh', 'Saxena', 'Bhat', 'Shetty', 'Pillai', 'Gowda', 'Naidu', 'Yadav'
];

const HOSTELS = ['Kaveri Hostel', 'Krishna Hostel', 'Godavari Hostel', 'Brahmaputra Hostel', 'Ganga Hostel'];

const REALISTIC_FEEDBACKS = [
  { text: 'The Paneer Butter Masala was extremely tasty and flavorful! Rotis were also fresh and hot.', rating: 5, tags: ['Good taste', 'Fresh', 'Excellent'] },
  { text: 'Food was delicious but the dal had a bit too much oil today. Please reduce the tadka oil.', rating: 3, tags: ['Too oily', 'Good taste'] },
  { text: 'Sambar was watery and had very little flavor. Masala Dosa filling was good though.', rating: 2, tags: ['Poor taste', 'Good quantity'] },
  { text: 'Lunch was well prepared! Rajma rice was warm, hygienic, and very fulfilling.', rating: 5, tags: ['Good taste', 'Good quantity', 'Fresh', 'Excellent'] },
  { text: 'Chappatis were stiff and cold by the time we reached the counter at 8:45 PM.', rating: 2, tags: ['Cold food', 'Poor taste'] },
  { text: 'Found a small piece of hair in the vegetable curry. This is the second time this week!', rating: 1, tags: ['Poor hygiene'] },
  { text: 'Chole Bhature was exceptional this Sunday morning! Hot, puffy, and flavorful.', rating: 5, tags: ['Good taste', 'Fresh', 'Good quantity', 'Excellent'] },
  { text: 'The food was way too spicy today. Even the dal had excess green chilies.', rating: 2, tags: ['Too spicy'] },
  { text: 'Gulab jamun was soft and perfectly sweet! Really made dinner special.', rating: 5, tags: ['Good taste', 'Excellent'] },
  { text: 'Quantity of paneer cubes was very scarce. Mostly just gravy was served.', rating: 2, tags: ['Poor taste'] },
  { text: 'Very satisfied with the breakfast quality today. Idlis were super soft and fresh.', rating: 5, tags: ['Fresh', 'Good taste', 'Excellent'] },
  { text: 'Yellow dal was oversalted today. Could barely finish one bowl.', rating: 2, tags: ['Too salty'] },
  { text: 'Hygiene in the serving area has noticeably improved. Staff were wearing gloves and hairnets.', rating: 5, tags: ['Good taste', 'Fresh'] },
  { text: 'Snacks finished 20 minutes before official closing time. Many students had to leave empty handed.', rating: 1, tags: ['Poor taste'] },
  { text: 'Veg Biryani was fragrant, spiced properly, and served with great cucumber raita.', rating: 4, tags: ['Good taste', 'Good quantity'] },
  { text: 'Average food today. Nothing special, edible but bland.', rating: 3, tags: ['Poor taste'] },
  { text: 'The rice was slightly undercooked and hard to chew. Curd helped.', rating: 2, tags: ['Cold food'] },
  { text: 'Crispy samosas and hot masala chai was perfect for the rainy evening.', rating: 5, tags: ['Good taste', 'Fresh', 'Excellent'] },
];

const REALISTIC_COMPLAINTS = [
  {
    category: 'Hygiene',
    priority: 'Critical',
    description: 'Found a dead insect/fly in the sambar vessel during breakfast today at 8:15 AM. Need immediate inspection of kitchen vents.',
    status: 'Resolved',
    adminResponse: 'We have thoroughly inspected the kitchen, replaced the entire sambar batch, sanitized the storage area, and installed new mesh screens on all kitchen vents.',
  },
  {
    category: 'Food Quality',
    priority: 'High',
    description: 'Dinner rotis were burnt and rock-hard. Students had to request multiple replacements.',
    status: 'Resolved',
    adminResponse: 'Spoke with the tandoor staff and recalibrated the tandoor oven temperature. Extra staff deployed during peak dinner hours.',
  },
  {
    category: 'Quantity',
    priority: 'Medium',
    description: 'Evening snacks (Samosa) ran out by 5:25 PM even though serving time is till 6:00 PM. Around 40 students went without snacks.',
    status: 'In Progress',
    adminResponse: 'Cooks have been instructed to prepare an additional 75 portions buffer for evening snack timings.',
  },
  {
    category: 'Temperature',
    priority: 'Low',
    description: 'Milk and tea served during breakfast are frequently lukewarm instead of hot.',
    status: 'Under Review',
    adminResponse: 'Inspecting the electric thermal urn in the beverage section.',
  },
  {
    category: 'Foreign Object',
    priority: 'Critical',
    description: 'Found a small black gravel stone in the steamed rice. Please ensure proper destoning of raw rice grains.',
    status: 'In Progress',
    adminResponse: 'The grain supplier has been issued a warning penalty. Manual double-screening has been implemented before boiling.',
  },
  {
    category: 'Late Serving',
    priority: 'Medium',
    description: 'Lunch counter opening was delayed by 25 minutes today (started at 12:55 PM instead of 12:30 PM), causing huge student rush.',
    status: 'Resolved',
    adminResponse: 'Kitchen prep schedule moved 30 minutes earlier to ensure food reaches buffet counters strictly by 12:15 PM.',
  },
  {
    category: 'Menu Repetition',
    priority: 'Low',
    description: 'Aloo Gobi has been served 4 times in the past 6 days. Please introduce more seasonal vegetables.',
    status: 'Submitted',
    adminResponse: '',
  },
  {
    category: 'Food Quality',
    priority: 'Medium',
    description: 'Excessive food coloring and heavy cooking oil in the paneer gravy.',
    status: 'Under Review',
    adminResponse: 'Mess committee is reviewing ingredient specifications with head chef.',
  },
];

export const seedDatabase = async () => {
  console.log('🌱 Starting comprehensive MessMeter database seeding...');

  // 1. Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Dish.deleteMany({}),
    Meal.deleteMany({}),
    Rating.deleteMany({}),
    Feedback.deleteMany({}),
    Complaint.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log('🧹 Cleaned existing database collections.');

  // 2. Create Admin Users
  const admins = await User.create([
    {
      name: 'Dr. Ramesh Sharma',
      email: 'admin@messmeter.com',
      password: 'admin123',
      role: 'admin',
      hostel: 'Central Mess Administration',
      room: 'Office 101',
    },
    {
      name: 'Prof. Sunita Rao (Hostel Warden)',
      email: 'warden@messmeter.com',
      password: 'warden123',
      role: 'admin',
      hostel: 'Kaveri & Krishna Hostels',
      room: 'Warden Office',
    },
    {
      name: 'Chef Rajesh Kumar (Mess Head)',
      email: 'manager@messmeter.com',
      password: 'manager123',
      role: 'admin',
      hostel: 'Hostel Catering Services',
      room: 'Kitchen Operations',
    },
  ]);
  console.log(`👤 Created ${admins.length} Admin accounts.`);

  // 3. Create 120 Student Users
  const studentData = [
    {
      name: 'Aarav Patel (Demo Student)',
      email: 'student@messmeter.com',
      password: 'student123',
      role: 'student',
      hostel: 'Kaveri Hostel',
      room: 'A-204',
    },
  ];

  for (let i = 1; i <= 119; i++) {
    const fn = STUDENT_FIRST_NAMES[i % STUDENT_FIRST_NAMES.length];
    const ln = STUDENT_LAST_NAMES[(i * 3) % STUDENT_LAST_NAMES.length];
    const hostel = HOSTELS[i % HOSTELS.length];
    const roomNum = `${String.fromCharCode(65 + (i % 4))}-${100 + (i % 300)}`;

    studentData.push({
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@university.edu`,
      password: 'password123',
      role: 'student',
      hostel,
      room: roomNum,
    });
  }

  const students = await User.create(studentData);
  console.log(`🎓 Created ${students.length} Student accounts.`);

  // 4. Create 35+ Dishes
  const dishes = await Dish.create(DISHES_DATA);
  console.log(`🍲 Created ${dishes.length} Dishes across all categories.`);

  // Create dish lookup helpers
  const dishesByCategory: Record<string, any[]> = {};
  dishes.forEach((d) => {
    if (!dishesByCategory[d.category]) dishesByCategory[d.category] = [];
    dishesByCategory[d.category].push(d);
  });

  // 5. Generate 21 Days of Meals (Past 18 days + Today + Next 2 days)
  const today = new Date();
  const mealTypes: Array<'breakfast' | 'lunch' | 'snacks' | 'dinner'> = [
    'breakfast',
    'lunch',
    'snacks',
    'dinner',
  ];

  const mealsCreated: any[] = [];

  for (let d = -18; d <= 2; d++) {
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + d);
    const dateStr = targetDate.toISOString().split('T')[0];

    for (const mType of mealTypes) {
      let selectedDishes: any[] = [];
      let servingTime = '';

      if (mType === 'breakfast') {
        servingTime = '07:30 AM - 09:30 AM';
        const bfList = dishesByCategory['Breakfast Special'] || [];
        const bfDish = bfList[(Math.abs(d) + 1) % bfList.length];
        const bevList = dishesByCategory['Snacks & Beverages'] || [];
        const tea = bevList.find((b) => b.name.includes('Chai')) || bevList[0];
        selectedDishes = [bfDish._id, tea._id];
      } else if (mType === 'lunch') {
        servingTime = '12:30 PM - 02:30 PM';
        const curries = dishesByCategory['Curry & Dal'] || [];
        const breads = dishesByCategory['Bread & Rice'] || [];
        const salads = dishesByCategory['Salad & Accompaniments'] || [];
        selectedDishes = [
          curries[Math.abs(d) % curries.length]._id,
          curries[(Math.abs(d) + 3) % curries.length]._id,
          breads[Math.abs(d) % breads.length]._id,
          breads[(Math.abs(d) + 2) % breads.length]._id,
          salads[0]._id,
        ];
      } else if (mType === 'snacks') {
        servingTime = '05:00 PM - 06:00 PM';
        const snacksList = dishesByCategory['Snacks & Beverages'] || [];
        selectedDishes = [
          snacksList[Math.abs(d) % snacksList.length]._id,
          snacksList[(Math.abs(d) + 2) % snacksList.length]._id,
        ];
      } else if (mType === 'dinner') {
        servingTime = '07:30 PM - 09:30 PM';
        const curries = dishesByCategory['Curry & Dal'] || [];
        const breads = dishesByCategory['Bread & Rice'] || [];
        const desserts = dishesByCategory['Dessert & Sweets'] || [];
        const salads = dishesByCategory['Salad & Accompaniments'] || [];
        selectedDishes = [
          curries[(Math.abs(d) + 1) % curries.length]._id,
          breads[(Math.abs(d) + 1) % breads.length]._id,
          breads[(Math.abs(d) + 3) % breads.length]._id,
          desserts[Math.abs(d) % desserts.length]._id,
          salads[salads.length - 1]._id,
        ];
      }

      const meal = await Meal.create({
        date: dateStr,
        mealType: mType,
        dishes: selectedDishes,
        servingTime,
        specialNote: mType === 'dinner' && d % 4 === 0 ? 'Chef Special Sweet Included' : '',
      });
      mealsCreated.push(meal);
    }
  }
  console.log(`📅 Generated ${mealsCreated.length} scheduled meals across 21 days.`);

  // 6. Generate 600+ Ratings and 350+ Feedback reviews for past & today's meals
  const pastAndTodayMeals = mealsCreated.filter((m) => m.date <= today.toISOString().split('T')[0]);
  const tagsPool = [
    'Too spicy', 'Too salty', 'Too oily', 'Cold food', 'Poor taste',
    'Fresh', 'Good taste', 'Good quantity', 'Poor hygiene', 'Excellent',
    'Well cooked', 'Hot & Fresh', 'Comfort food'
  ];

  let totalRatingsCreated = 0;
  let totalFeedbacksCreated = 0;

  for (const meal of pastAndTodayMeals) {
    // 8 to 22 random students rate each meal
    const ratingCount = 8 + (Math.floor(Math.random() * 15));
    const shuffledStudents = [...students].sort(() => 0.5 - Math.random()).slice(0, ratingCount);

    // Give breakfast and lunch slightly higher average ratings, dinner variable
    const baseMean = meal.mealType === 'breakfast' ? 4.2 : meal.mealType === 'lunch' ? 4.0 : meal.mealType === 'snacks' ? 4.1 : 3.6;

    for (const student of shuffledStudents) {
      const noise = (Math.random() * 2 - 1) * 0.8;
      let overall = Math.min(5, Math.max(1, Math.round(baseMean + noise)));
      
      let taste = Math.min(5, Math.max(1, Math.round(overall + (Math.random() * 1.2 - 0.6))));
      let hygiene = Math.min(5, Math.max(1, Math.round(overall + (Math.random() * 1.0 - 0.5))));
      let quality = Math.min(5, Math.max(1, Math.round(overall + (Math.random() * 1.0 - 0.5))));
      let freshness = Math.min(5, Math.max(1, Math.round(overall + (Math.random() * 1.0 - 0.5))));
      let quantity = Math.min(5, Math.max(1, Math.round(overall + (Math.random() * 1.0 - 0.5))));
      let variety = Math.min(5, Math.max(1, Math.round(overall + (Math.random() * 1.0 - 0.5))));

      const selectedTags: string[] = [];
      if (overall >= 4) {
        selectedTags.push('Good taste', 'Fresh');
        if (overall === 5) selectedTags.push('Excellent');
      } else if (overall <= 2) {
        const negOptions = ['Too oily', 'Too salty', 'Cold food', 'Poor taste', 'Too spicy'];
        selectedTags.push(negOptions[Math.floor(Math.random() * negOptions.length)]);
      } else {
        selectedTags.push('Good quantity');
      }

      const rating = await Rating.create({
        userId: student._id,
        mealId: meal._id,
        taste,
        quality,
        hygiene,
        freshness,
        quantity,
        variety,
        overall,
        tags: selectedTags,
      });
      totalRatingsCreated++;

      // ~55% of students leave written feedback
      if (Math.random() > 0.45) {
        const template = REALISTIC_FEEDBACKS[Math.floor(Math.random() * REALISTIC_FEEDBACKS.length)];
        const analysis = SentimentService.analyze(template.text);

        await Feedback.create({
          userId: student._id,
          mealId: meal._id,
          ratingId: rating._id,
          text: template.text,
          sentiment: analysis.sentiment,
          sentimentScore: analysis.sentimentScore,
          topics: analysis.topics,
          anonymous: Math.random() > 0.7,
        });
        totalFeedbacksCreated++;
      }
    }
  }

  console.log(`⭐ Created ${totalRatingsCreated} Ratings and 💬 ${totalFeedbacksCreated} Sentiment-Analyzed Feedback items.`);

  // 7. Generate 45+ Complaints across categories and statuses
  let complaintsCreated = 0;
  for (let i = 0; i < 45; i++) {
    const student = students[i % students.length];
    const template = REALISTIC_COMPLAINTS[i % REALISTIC_COMPLAINTS.length];
    const meal = pastAndTodayMeals[i % pastAndTodayMeals.length];

    const isResolved = template.status === 'Resolved' || i % 3 === 0;
    const status = isResolved ? 'Resolved' : i % 3 === 1 ? 'In Progress' : i % 4 === 0 ? 'Under Review' : 'Submitted';

    await Complaint.create({
      userId: student._id,
      mealId: meal._id,
      category: template.category,
      description: template.description,
      imageUrl: '',
      anonymous: i % 4 === 0,
      priority: template.priority,
      status,
      adminResponse: status === 'Resolved' ? template.adminResponse : status === 'In Progress' ? 'Under active investigation by mess manager.' : '',
      resolvedAt: status === 'Resolved' ? new Date() : undefined,
    });
    complaintsCreated++;
  }
  console.log(`🚨 Created ${complaintsCreated} Complaints with realistic tracking and admin responses.`);

  // 8. Create Notifications
  await Notification.create([
    {
      userId: students[0]._id,
      title: 'Welcome to MessMeter!',
      message: 'Explore today\'s breakfast, lunch, snacks, and dinner menu. Don\'t forget to rate your meals!',
      type: 'info',
      read: false,
    },
    {
      userId: students[0]._id,
      title: 'Complaint Status Updated: Resolved',
      message: 'Your complaint regarding "Hygiene" in the breakfast sambar has been marked as Resolved. Kitchen vents have been sanitized and inspected.',
      type: 'success',
      link: '/student/complaints',
      read: false,
    },
    {
      userId: null, // Broadcast to all
      title: 'Special Sunday Feast Announced',
      message: 'This Sunday lunch features Paneer Butter Masala, Hyderabadi Dum Biryani, and hot Gulab Jamuns.',
      type: 'info',
      read: false,
    },
    {
      title: 'Active Priority Complaint',
      message: 'A High Priority complaint regarding foreign object in dinner rice is awaiting supervisor review.',
      type: 'alert',
      link: '/admin/complaints',
      read: false,
    },
  ]);
  console.log(`🔔 Created initial Notifications.`);

  console.log(`\n✨ Seeding completed successfully!`);
  console.log(`------------------------------------------------------`);
  console.log(`Demo Student Login: student@messmeter.com  /  student123`);
  console.log(`Demo Admin Login:   admin@messmeter.com    /  admin123`);
  console.log(`------------------------------------------------------\n`);
};

export const seedDatabaseIfEmpty = async () => {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('⚡ Database is empty. Auto-seeding initial dataset...');
    await seedDatabase();
  } else {
    console.log(`ℹ️ Database already contains ${userCount} users. Skipping auto-seed.`);
  }
};

// Allow running directly: tsx src/scripts/seed.ts
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    }
  })();
}
