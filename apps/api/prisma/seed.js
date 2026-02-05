const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vlr.gg' },
    update: {},
    create: {
      username: 'Slasher',
      email: 'admin@vlr.gg',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const reporter = await prisma.user.upsert({
    where: { email: 'reporter@vlr.gg' },
    update: {},
    create: {
      username: 'ReporterJoe',
      email: 'reporter@vlr.gg',
      password: hashedPassword,
      role: 'REPORTER',
    },
  });

  // Create matches
  await prisma.match.createMany({
    data: [
      { title: 'Founders Pitch Day', teamA: 'Skyline AI', teamB: 'GreenTech', scoreA: 2, scoreB: 1, status: 'COMPLETED', startTime: new Date() },
      { title: 'Auto Meetup 2024', teamA: 'Tesla Owners', teamB: 'Rivian Crew', scoreA: 0, scoreB: 0, status: 'LIVE', startTime: new Date() },
      { title: 'Zomato Funding Round', teamA: 'Zomato', teamB: 'Investors', scoreA: 500, scoreB: 0, status: 'LIVE', startTime: new Date() },
      { title: 'SaaS Wars', teamA: 'Slackers', teamB: 'Teams', scoreA: 0, scoreB: 0, status: 'UPCOMING', startTime: new Date(Date.now() + 86400000) },
    ]
  });

  // Create posts
  await prisma.post.create({
    data: {
      title: 'How to scale a SaaS in 2024',
      content: 'Scaling a SaaS is hard. Focus on retention first.',
      type: 'FORUM',
      flair: 'SaaS',
      authorId: admin.id,
      comments: {
        create: [
          {
            content: 'Great advice! What about pricing models?',
            authorId: reporter.id,
          }
        ]
      }
    }
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
