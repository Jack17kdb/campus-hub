import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Item from './models/itemModel.js';
import Message from './models/chatModel.js';

dotenv.config({ path: '../.env' });

// ── Picsum photos gives stable, free, no-auth images by ID ──────────────────
const img = (id, w = 400, h = 400) => `https://picsum.photos/id/${id}/${w}/${h}`;

const USERS = [
  { username: 'jackmuriithi',   email: 'jack.muriithi@kist.ac.ke',   studentId: 'CSC6/0001/23' },
  { username: 'brianotieno',    email: 'brian.otieno@kist.ac.ke',    studentId: 'CSC6/0002/23' },
  { username: 'faithwanjiku',   email: 'faith.wanjiku@kist.ac.ke',   studentId: 'BIT6/0003/23' },
  { username: 'kevinmwangi',    email: 'kevin.mwangi@kist.ac.ke',    studentId: 'BIT6/0004/23' },
  { username: 'gloriaatieno',   email: 'gloria.atieno@kist.ac.ke',   studentId: 'CSC6/0005/22' },
  { username: 'samuelkimani',   email: 'samuel.kimani@kist.ac.ke',   studentId: 'CSC6/0006/22' },
  { username: 'amandachebet',   email: 'amanda.chebet@kist.ac.ke',   studentId: 'BIT6/0007/22' },
  { username: 'denniskipchoge', email: 'dennis.kipchoge@kist.ac.ke', studentId: 'CSC6/0008/24' },
];

const ITEMS = [
  // ── Marketplace (selling) ──────────────────────────────────────────────────
  {
    title: 'Engineering Mathematics Textbook',
    description: 'Stroud Engineering Mathematics 7th edition. Good condition, minor highlights. Perfect for 1st and 2nd year students.',
    image: img(24, 600, 400),
    intention: 'selling',
    price: 850,
    category: 'Textbooks',
    status: 'Available',
    ownerIndex: 0,
  },
  {
    title: 'HP Laptop 15" i5 8GB RAM',
    description: 'HP laptop, 3 years old, still running perfectly. Comes with charger and laptop bag. Battery lasts about 3 hours.',
    image: img(48, 600, 400),
    intention: 'selling',
    price: 28000,
    category: 'Electronics',
    status: 'Available',
    ownerIndex: 1,
  },
  {
    title: 'Introduction to Programming – C++',
    description: 'Deitel C++ How to Program 10th edition. Barely used, no highlights. Great for CSC students.',
    image: img(160, 600, 400),
    intention: 'selling',
    price: 600,
    category: 'Textbooks',
    status: 'Available',
    ownerIndex: 2,
  },
  {
    title: 'Scientific Calculator Casio FX-991ES',
    description: 'Used for one semester, works perfectly. Great for maths and physics units.',
    image: img(356, 600, 400),
    intention: 'selling',
    price: 1500,
    category: 'Electronics',
    status: 'Available',
    ownerIndex: 3,
  },
  {
    title: 'Hostel Bedding Set',
    description: 'Fitted sheet, duvet, and two pillowcases. Washed and in clean condition. Suitable for standard hostel beds.',
    image: img(180, 600, 400),
    intention: 'selling',
    price: 1200,
    category: 'Hostel Gear',
    status: 'Available',
    ownerIndex: 4,
  },
  {
    title: 'Lab Coat (Medium)',
    description: 'White lab coat, medium size, used for one semester. Clean, no stains.',
    image: img(119, 600, 400),
    intention: 'selling',
    price: 400,
    category: 'Lab Equipment',
    status: 'Available',
    ownerIndex: 5,
  },
  {
    title: 'Android Phone Samsung Galaxy A14',
    description: 'Selling Samsung A14, 64GB, good condition. Screen protector on. Comes with original charger.',
    image: img(442, 600, 400),
    intention: 'selling',
    price: 14000,
    category: 'Electronics',
    status: 'Available',
    ownerIndex: 6,
  },
  {
    title: 'Drawing Instruments Set',
    description: 'Full geometry set including compass, protractor, set squares and pencils. Good condition.',
    image: img(209, 600, 400),
    intention: 'selling',
    price: 350,
    category: 'Lab Equipment',
    status: 'Available',
    ownerIndex: 7,
  },
  {
    title: 'Business Communication Textbook',
    description: 'Business Communication Today – 14th edition. Perfect for BIT students taking communication units.',
    image: img(327, 600, 400),
    intention: 'selling',
    price: 700,
    category: 'Textbooks',
    status: 'Available',
    ownerIndex: 0,
  },
  {
    title: 'Extension Cable 5-Way 3 Metres',
    description: 'Heavy duty extension cord, 3 metres. Works perfectly, great for hostel rooms with few sockets.',
    image: img(365, 600, 400),
    intention: 'selling',
    price: 650,
    category: 'Hostel Gear',
    status: 'Available',
    ownerIndex: 1,
  },
  // ── Donating ────────────────────────────────────────────────────────────────
  {
    title: 'Introduction to Networking Notes',
    description: 'Printed notes for Networking unit, semester 3. Well organised and complete. Free to a good student.',
    image: img(266, 600, 400),
    intention: 'donating',
    price: 0,
    category: 'Documents',
    status: 'Available',
    ownerIndex: 2,
  },
  {
    title: 'Java Programming Textbook',
    description: 'Head First Java 3rd edition. I graduated, no longer need it. Take it free.',
    image: img(415, 600, 400),
    intention: 'donating',
    price: 0,
    category: 'Textbooks',
    status: 'Available',
    ownerIndex: 3,
  },
  // ── Lost and Found (returning) ───────────────────────────────────────────────
  {
    title: 'Student ID Card',
    description: 'Found a student ID card near the cafeteria. Name visible on card. Please reach out to claim.',
    image: img(392, 600, 400),
    intention: 'returning',
    price: 0,
    category: 'IDs',
    status: 'Available',
    ownerIndex: 4,
  },
  {
    title: 'Black Leather Wallet',
    description: 'Found in the library on Tuesday afternoon. Contains some cash and cards. Owner please contact me.',
    image: img(169, 600, 400),
    intention: 'returning',
    price: 0,
    category: 'Wallets',
    status: 'Available',
    ownerIndex: 5,
  },
  {
    title: 'Set of Keys on Red Keychain',
    description: 'Found near Block A staircase. 3 keys on a red keychain. Come to Block B room 14 to claim.',
    image: img(306, 600, 400),
    intention: 'returning',
    price: 0,
    category: 'Keys',
    status: 'Available',
    ownerIndex: 6,
  },
  {
    title: 'Black Backpack',
    description: 'Found abandoned in the computer lab after evening class. Contains some books and a pencil case.',
    image: img(404, 600, 400),
    intention: 'returning',
    price: 0,
    category: 'Bags',
    status: 'Available',
    ownerIndex: 7,
  },
  {
    title: 'Earphones (White)',
    description: 'Found near the main gate. White wired earphones in a small pouch. Message me to identify and claim.',
    image: img(129, 600, 400),
    intention: 'returning',
    price: 0,
    category: 'Gadgets',
    status: 'Available',
    ownerIndex: 0,
  },
];

const MESSAGES = [
  { fromIndex: 0, toIndex: 1, text: 'Hey, is the laptop still available?' },
  { fromIndex: 1, toIndex: 0, text: 'Yes it is! Come check it out anytime.' },
  { fromIndex: 0, toIndex: 1, text: 'Cool, can we meet tomorrow at the library?' },
  { fromIndex: 2, toIndex: 3, text: 'Hi, interested in the calculator. Is it negotiable?' },
  { fromIndex: 3, toIndex: 2, text: 'I can do 1300 if you come to campus.' },
  { fromIndex: 4, toIndex: 5, text: 'I think the wallet you found is mine!' },
  { fromIndex: 5, toIndex: 4, text: 'Great! What cards are inside? I need to verify.' },
  { fromIndex: 4, toIndex: 5, text: 'Equity card and a KU library card.' },
  { fromIndex: 5, toIndex: 4, text: "That's the one. Let's meet at the cafeteria at 1pm." },
];

// ── Seed ────────────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing seed data only (emails ending in kist.ac.ke and belonging to seeded usernames)
    const seedUsernames = USERS.map(u => u.username);
    const existingUsers = await User.find({ username: { $in: seedUsernames } });
    const existingIds = existingUsers.map(u => u._id);

    await Message.deleteMany({
      $or: [{ senderId: { $in: existingIds } }, { recieverId: { $in: existingIds } }]
    });
    await Item.deleteMany({ owner: { $in: existingIds } });
    await User.deleteMany({ username: { $in: seedUsernames } });
    console.log('Cleared old seed data');

    // Create users
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Password123', salt);

    const createdUsers = await User.insertMany(
      USERS.map(u => ({
        ...u,
        password: hash,
        isVerified: true,
        profilePic: img(Math.floor(Math.random() * 100) + 10, 200, 200),
      }))
    );
    console.log(`Created ${createdUsers.length} users`);

    // Create items
    const createdItems = await Item.insertMany(
      ITEMS.map(item => ({
        title: item.title,
        description: item.description,
        image: item.image,
        intention: item.intention,
        price: item.price,
        category: item.category,
        status: item.status,
        owner: createdUsers[item.ownerIndex]._id,
      }))
    );
    console.log(`Created ${createdItems.length} items`);

    // Create messages
    const createdMessages = await Message.insertMany(
      MESSAGES.map(m => ({
        senderId: createdUsers[m.fromIndex]._id,
        recieverId: createdUsers[m.toIndex]._id,
        text: m.text,
        isRead: true,
      }))
    );
    console.log(`Created ${createdMessages.length} messages`);

    console.log('\n✅ Seeding complete!');
    console.log('─────────────────────────────────────────');
    console.log('All seeded accounts use password: Password123');
    console.log('Sample login: jack.muriithi@kist.ac.ke / Password123');
    console.log('─────────────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
