/* eslint-disable no-console */
// prisma/seed.ts
import { PrismaClient, Role, SkillCategory, ProjectStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Owner/Admin
  const hashedPassword = await bcrypt.hash(
    process.env.OWNER_PASSWORD || 'Admin@123',
    12
  );

  const owner = await prisma.owner.upsert({
    where: { email: process.env.OWNER_EMAIL || 'nifazurrahman2872@gmail.com' },
    update: {},
    create: {
      name: process.env.OWNER_NAME || 'Nifazur Rahman',
      email: process.env.OWNER_EMAIL || 'nifazurrahman2872@gmail.com',
      password: hashedPassword,
      phone: process.env.OWNER_PHONE || '+880-1862040593',
      bio: process.env.OWNER_BIO || 'Full-Stack Developer passionate about creating elegant solutions. Completed Diploma in CSE and currently pursuing BSc in Computer Science while learning advanced web development.',
      role: Role.OWNER,
    },
  });

  console.log('✅ Owner created:', owner.email);

  // Seed Skills
  const skills = [
    // Frontend
    { name: 'HTML5', category: SkillCategory.FRONTEND, level: 95, color: 'orange-500' },
    { name: 'CSS3', category: SkillCategory.FRONTEND, level: 92, color: 'blue-500' },
    { name: 'JavaScript', category: SkillCategory.FRONTEND, level: 88, color: 'yellow-500' },
    { name: 'TypeScript', category: SkillCategory.FRONTEND, level: 82, color: 'blue-600' },
    { name: 'React', category: SkillCategory.FRONTEND, level: 90, color: 'cyan-500' },
    { name: 'Next.js', category: SkillCategory.FRONTEND, level: 85, color: 'gray-800' },
    { name: 'Tailwind CSS', category: SkillCategory.FRONTEND, level: 93, color: 'cyan-400' },
    { name: 'Bootstrap', category: SkillCategory.FRONTEND, level: 88, color: 'purple-600' },
    { name: 'Sass/SCSS', category: SkillCategory.FRONTEND, level: 80, color: 'pink-500' },
    
    // Backend
    { name: 'Node.js', category: SkillCategory.BACKEND, level: 85, color: 'green-600' },
    { name: 'Express.js', category: SkillCategory.BACKEND, level: 88, color: 'gray-700' },
    { name: 'RESTful APIs', category: SkillCategory.BACKEND, level: 90, color: 'green-500' },
    { name: 'JWT Authentication', category: SkillCategory.BACKEND, level: 85, color: 'red-500' },
    
    // Database
    { name: 'MongoDB', category: SkillCategory.DATABASE, level: 88, color: 'green-600' },
    { name: 'PostgreSQL', category: SkillCategory.DATABASE, level: 75, color: 'blue-800' },
    { name: 'Firebase', category: SkillCategory.DATABASE, level: 82, color: 'orange-500' },
    { name: 'Mongoose', category: SkillCategory.DATABASE, level: 90, color: 'red-600' },
    
    // Tools
    { name: 'Git', category: SkillCategory.TOOLS, level: 90, color: 'gray-800' },
    { name: 'GitHub', category: SkillCategory.TOOLS, level: 90, color: 'gray-800' },
    { name: 'VS Code', category: SkillCategory.TOOLS, level: 95, color: 'blue-600' },
    { name: 'Webpack', category: SkillCategory.TOOLS, level: 70, color: 'blue-500' },
    { name: 'Vite', category: SkillCategory.TOOLS, level: 85, color: 'purple-500' },
    { name: 'Docker', category: SkillCategory.TOOLS, level: 65, color: 'blue-400' },
    { name: 'Netlify', category: SkillCategory.TOOLS, level: 88, color: 'teal-500' },
    { name: 'Vercel', category: SkillCategory.TOOLS, level: 92, color: 'gray-800' },
    
    // Design
    { name: 'Figma', category: SkillCategory.TOOLS, level: 85, color: 'purple-600' },
    { name: 'UI/UX Design', category: SkillCategory.TOOLS, level: 82, color: 'blue-500' },
    { name: 'Responsive Design', category: SkillCategory.TOOLS, level: 95, color: 'green-500' },
    { name: 'Prototyping', category: SkillCategory.TOOLS, level: 78, color: 'orange-500' },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }

  console.log('✅ Skills seeded');

  // Seed Education
  const educations = [
    {
      institution: 'University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: new Date('2025-01-01'),
      endDate: null,
      description: 'Currently pursuing Bachelor of Science in Computer Science, expanding knowledge in advanced algorithms, software engineering, and computer systems.',
      achievements: [],
      order: 1,
    },
    {
      institution: 'Programming Hero',
      degree: 'Level 2 Web Development Course',
      field: 'Full-Stack Development',
      startDate: new Date('2025-01-01'),
      endDate: null,
      description: 'Intensive full-stack web development program covering modern frameworks, backend technologies, and industry best practices.',
      achievements: [],
      order: 2,
    },
    {
      institution: 'Technical Institute',
      degree: 'Diploma',
      field: 'Computer Science Engineering',
      startDate: new Date('2021-01-01'),
      endDate: new Date('2025-01-01'),
      description: 'Successfully completed Diploma in CSE with comprehensive training in programming fundamentals, database systems, and software development.',
      achievements: [],
      order: 3,
    },
  ];

  for (const education of educations) {
    await prisma.education.create({
      data: education,
    });
  }

  console.log('✅ Education seeded');

  // Seed Projects
  const projects = [
    {
      title: 'FastBox - Parcel Delivery System',
      slug: 'fastbox-parcel-delivery',
      description: 'A comprehensive parcel delivery website with dynamic role-based functionality. Features user dashboards for customers, delivery personnel, and admins with real-time tracking and management capabilities.',
      thumbnail: 'https://i.ibb.co.com/SwPRzqVm/project1.png',
      images: ['https://i.ibb.co.com/SwPRzqVm/project1.png'],
      liveUrl: 'https://parcel-delivery-system-client-omega.vercel.app/',
      githubUrl: 'https://github.com/Nifazur/Parcel-Delivery-System-Frontend',
      technologies: ['React', 'Node.js', 'MongoDB', 'Mongoose', 'Express.js', 'Tailwind CSS'],
      category: 'Web Apps',
      isFeatured: true,
      status: ProjectStatus.COMPLETED,
      features: [
        'Role-based dashboards',
        'Real-time tracking',
        'User management',
        'Dynamic functionality',
      ],
      order: 1,
    },
    {
      title: 'EcoUnity - Food Distribution Platform',
      slug: 'ecounity-food-distribution',
      description: 'A leftover food distribution website connecting food donors with those in need. Helps reduce food waste while supporting community welfare through an intuitive platform.',
      thumbnail: 'https://i.ibb.co.com/WNppHH5S/project2.jpg',
      images: ['https://i.ibb.co.com/WNppHH5S/project2.jpg'],
      liveUrl: 'https://surplus-reduction-community.web.app/availableFood',
      githubUrl: 'https://github.com/NahazS/Surplus-Reduction-Community-Client',
      technologies: ['React', 'Node.js', 'MongoDB', 'Mongoose', 'Firebase', 'Tailwind CSS'],
      category: 'Social Impact',
      isFeatured: true,
      status: ProjectStatus.COMPLETED,
      features: [
        'Food donation system',
        'Community matching',
        'Waste reduction tracking',
        'User authentication',
      ],
      order: 2,
    },
    {
      title: 'Readora - Advanced Library Management',
      slug: 'readora-library-management',
      description: 'A sophisticated library management system with advanced features including book cataloging, user management, borrowing system, and comprehensive reporting capabilities.',
      thumbnail: 'https://i.ibb.co.com/V03h2yg0/project3.jpg',
      images: ['https://i.ibb.co.com/V03h2yg0/project3.jpg'],
      liveUrl: 'https://readora-client.vercel.app/',
      githubUrl: 'https://github.com/Nifazur/Readora-Library-Management-System-Client',
      technologies: ['React', 'Node.js', 'MongoDB', 'Mongoose', 'Express.js', 'Material-UI'],
      category: 'Web Apps',
      isFeatured: true,
      status: ProjectStatus.COMPLETED,
      features: [
        'Book cataloging',
        'Borrowing system',
        'User management',
        'Comprehensive reporting',
      ],
      order: 3,
    },
    {
      title: 'Bistro Boss - Restaurant Platform',
      slug: 'bistro-boss-restaurant',
      description: 'A comprehensive restaurant website with dynamic roles, online ordering system, payment integration, menu management, and customer service features.',
      thumbnail: 'https://i.ibb.co.com/3mQ7d2Hy/project9.jpg',
      images: ['https://i.ibb.co.com/3mQ7d2Hy/project9.jpg'],
      liveUrl: 'https://bistroboss-860e7.web.app/',
      githubUrl: 'https://github.com/NahazS/Bistro-Boss-Restaurant-Client',
      technologies: ['React', 'Node.js', 'MongoDB', 'Mongoose', 'Stripe Payment', 'JWT'],
      category: 'Business',
      isFeatured: true,
      status: ProjectStatus.COMPLETED,
      features: [
        'Online ordering',
        'Payment integration',
        'Menu management',
        'Role-based access',
      ],
      order: 4,
    },
    {
      title: 'Real Estate Platform',
      slug: 'real-estate-platform',
      description: 'A modern real estate website featuring property listings, advanced search filters, property details, and user authentication for buyers and sellers.',
      thumbnail: 'https://i.ibb.co.com/HpN4n479/project4.jpg',
      images: ['https://i.ibb.co.com/HpN4n479/project4.jpg'],
      liveUrl: 'https://real-state-df9c3.web.app/',
      githubUrl: 'https://github.com/NahazS/Real-State',
      technologies: ['React', 'Node.js', 'MongoDB', 'Mongoose', 'Firebase', 'React Router'],
      category: 'Web Apps',
      isFeatured: false,
      status: ProjectStatus.COMPLETED,
      features: [
        'Property listings',
        'Advanced search',
        'User authentication',
        'Property details',
      ],
      order: 5,
    },
    {
      title: 'EcoBazar - E-Commerce Store',
      slug: 'ecobazar-ecommerce',
      description: 'A fully functional e-commerce website built with vanilla JavaScript, HTML, and CSS. Features product catalog, shopping cart, and responsive design.',
      thumbnail: 'https://i.ibb.co.com/1tFkFr4H/project5.jpg',
      images: ['https://i.ibb.co.com/1tFkFr4H/project5.jpg'],
      liveUrl: 'https://nahazs.github.io/Ecobazar/',
      githubUrl: 'https://github.com/NahazS/Ecobazar',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
      category: 'Business',
      isFeatured: false,
      status: ProjectStatus.COMPLETED,
      features: [
        'Product catalog',
        'Shopping cart',
        'Responsive design',
        'Vanilla JavaScript',
      ],
      order: 6,
    },
    {
      title: 'Book Vibe - Library Portal',
      slug: 'book-vibe-library',
      description: 'An interactive library website with book browsing, reading lists, user reviews, and personalized recommendations for book enthusiasts.',
      thumbnail: 'https://i.ibb.co.com/dydDPvW/project6.png',
      images: ['https://i.ibb.co.com/dydDPvW/project6.png'],
      liveUrl: 'https://nahazs-book-vibe.netlify.app/',
      githubUrl: 'https://github.com/NahazS/Book-Vibe',
      technologies: ['React', 'Node.js', 'MongoDB', 'Mongoose', 'Chart.js', 'React Router'],
      category: 'Web Apps',
      isFeatured: false,
      status: ProjectStatus.COMPLETED,
      features: [
        'Book browsing',
        'Reading lists',
        'User reviews',
        'Personalized recommendations',
      ],
      order: 7,
    },
    {
      title: 'Recipe Calorie Calculator',
      slug: 'recipe-calorie-calculator',
      description: 'A health-focused recipe website that calculates calories and nutritional information for various recipes. Helps users make informed dietary choices.',
      thumbnail: 'https://i.ibb.co.com/RpZRrVqP/project7.jpg',
      images: ['https://i.ibb.co.com/RpZRrVqP/project7.jpg'],
      liveUrl: 'https://nahazs-recipe-calorie.netlify.app/',
      githubUrl: 'https://github.com/NahazS/RecipeCalorie',
      technologies: ['React', 'API Integration', 'Chart.js', 'Tailwind CSS', 'LocalStorage'],
      category: 'Health & Fitness',
      isFeatured: false,
      status: ProjectStatus.COMPLETED,
      features: [
        'Calorie calculation',
        'Nutritional information',
        'Recipe database',
        'Health tracking',
      ],
      order: 8,
    },
    {
      title: 'Coffee Shop Management',
      slug: 'coffee-shop-management',
      description: 'A dynamic coffee shop website with role-based functionality, order management, menu customization, and customer interaction features.',
      thumbnail: 'https://i.ibb.co.com/d0DVHv5T/project8.png',
      images: ['https://i.ibb.co.com/d0DVHv5T/project8.png'],
      liveUrl: 'https://coffee-shop-3ccb3.web.app/',
      githubUrl: 'https://github.com/NahazS/coffee-client',
      technologies: ['React', 'Node.js', 'MongoDB', 'Mongoose', 'Express.js', 'Sweet Alert'],
      category: 'Business',
      isFeatured: false,
      status: ProjectStatus.COMPLETED,
      features: [
        'Order management',
        'Menu customization',
        'Role-based access',
        'Customer interaction',
      ],
      order: 9,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  console.log('✅ Projects seeded');

  // Seed Sample Blog
  await prisma.blog.upsert({
    where: { slug: 'getting-started-with-nextjs' },
    update: {},
    create: {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-with-nextjs',
      content: '<h1>Introduction to Next.js 14</h1><p>Next.js 14 brings amazing new features for modern web development. In this guide, we\'ll explore the key improvements and how to leverage them in your projects.</p>',
      excerpt: 'Learn about the latest features in Next.js 14 and how to build modern web applications with improved performance and developer experience.',
      category: 'Web Development',
      tags: ['Next.js', 'React', 'Tutorial', 'JavaScript'],
      isPublished: true,
      isFeatured: true,
      readTime: 8,
      authorId: owner.id,
    },
  });

  console.log('✅ Sample blog created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });