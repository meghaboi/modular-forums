const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vlr.gg' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@vlr.gg',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  const reporter = await prisma.user.upsert({
    where: { email: 'reporter@vlr.gg' },
    update: {},
    create: {
      username: 'slasher',
      email: 'reporter@vlr.gg',
      password: hashedPassword,
      role: 'REPORTER'
    }
  });

  await prisma.post.create({
    data: {
      title: 'Welcome to the Indian Founders Hub',
      content: 'This is the place for Indian founders to discuss SaaS, Fintech, and more.',
      authorId: admin.id,
      flair: 'SaaS',
      type: 'FORUM'
    }
  });

  await prisma.match.createMany({
    data: [
      {
        title: 'Pitch Session #1',
        teamA: 'Startup A',
        teamB: 'Startup B',
        scoreA: 2,
        scoreB: 1,
        status: 'COMPLETED',
        startTime: new Date(Date.now() - 3600000)
      },
      {
        title: 'Auto Meetup Mumbai',
        teamA: 'Team Electric',
        teamB: 'Team Petrol',
        scoreA: 0,
        scoreB: 0,
        status: 'LIVE',
        startTime: new Date()
      },
      {
        title: 'Founder Pitch Finals',
        teamA: 'Finalist 1',
        teamB: 'Finalist 2',
        status: 'UPCOMING',
        startTime: new Date(Date.now() + 86400000)
      }
    ]
  });

  console.log('Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
