import { Logger } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaClient } from '@/prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import * as dotenvExpand from 'dotenv-expand';
import * as dotenv from 'dotenv';

dotenvExpand.expand(dotenv.config());

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env['POSTGRES_URI'],
  }),
});

async function main() {
  try {
    Logger.log('Starting seeding protocol...');

    await prisma.$transaction([
      prisma.socialLink.deleteMany(),
      prisma.stream.deleteMany(),
      prisma.user.deleteMany(),
      prisma.category.deleteMany(),
    ]);

    const categoriesData = [
      {
        name: 'Just Chatting',
        slug: 'just-chatting',
        thumbnailUrl: '/categories/chatting.webp',
        description:
          'The place for specialized talk shows, podcasts, and professional broadcasters to engage with their community. Whether you are discussing the latest news or just hanging out, this is your home for everything non-gaming.',
      },
      {
        name: 'League of Legends',
        slug: 'lol',
        thumbnailUrl: '/categories/lol.webp',
        description:
          "Dive into the world of Runeterra. League of Legends is a team-based strategy game where two teams of five powerful champions face off to destroy the enemy's base.",
      },
      {
        name: 'Counter-Strike 2',
        slug: 'cs2',
        thumbnailUrl: '/categories/cs2.webp',
        description:
          'Tactical gameplay, precise aim, and high-tension bomb defusals. For over two decades, Counter-Strike has offered an elite competitive experience.',
      },
      {
        name: 'Software Development',
        slug: 'software-dev',
        thumbnailUrl: '/categories/dev.webp',
        description:
          'Watch developers solve complex problems, build open-source projects, and share knowledge about the latest tech stacks and frameworks.',
      },
      {
        name: 'Art',
        slug: 'art',
        thumbnailUrl: '/categories/art.webp',
        description:
          'Watch the creative process unfold in real-time. From digital illustration and 3D modeling to traditional oil painting.',
      },
    ];

    await prisma.category.createMany({ data: categoriesData });
    const categories = await prisma.category.findMany();

    const prefixes = [
      'iAm',
      'The Real',
      'Official',
      'ItsMe',
      'Silent',
      'Mighty',
      'Lazy',
      'Cyber',
      'Urban',
      'Wild',
      'Pure',
      'Hyper',
    ];
    const names = [
      'Jordan',
      'Alex',
      'Shadow',
      'Panda',
      'Wolf',
      'Viper',
      'Nova',
      'Pixel',
      'Hunter',
      'Ghost',
      'Rogue',
      'Ace',
      'Blaze',
      'Zero',
      'Mist',
    ];
    const suffixes = [
      'Live',
      'TV',
      'Gaming',
      'Streams',
      'Plays',
      'HQ',
      'X',
      'Mode',
    ];

    const streamTitles: Record<string, string[]> = {
      'just-chatting': [
        'Morning Coffee & News',
        'Weekly Q&A',
        'Reacting to Reddit highlights',
        'Chill Sunday Vibes',
      ],
      lol: [
        'Solo Q Road to Diamond',
        'Testing new Patch',
        'Viewer Games!',
        'Challenger Coaching Session',
      ],
      cs2: [
        'Road to Global Elite',
        'Premium Faceit Grind',
        'Only Deagle Challenge',
        'Training Aim with Music',
      ],
      'software-dev': [
        'Refactoring React Components',
        'Building a NestJS API',
        'Typescript is Awesome',
        'Daily Coding Grind',
      ],
      art: [
        'Character Design Session',
        'Commission Progress',
        'Speed-painting Forest',
        'Learning Blender 3D',
      ],
    };

    const usedUsernames = new Set<string>();
    const userPassword = await hash('123123');
    const userCount = 60;

    for (let i = 0; i < userCount; i++) {
      let username = '';
      while (!username || usedUsernames.has(username)) {
        const p = prefixes[Math.floor(Math.random() * prefixes.length)];
        const n = names[Math.floor(Math.random() * names.length)];
        const s = suffixes[Math.floor(Math.random() * suffixes.length)];

        const format = Math.random();
        username =
          format > 0.6
            ? `${p}${n}`
            : format > 0.3
              ? `${n}${s}`
              : `${p}${n}${s}`;

        if (username.length < 5 || Math.random() > 0.8) {
          username += Math.floor(Math.random() * 99);
        }
      }
      usedUsernames.add(username);

      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const titles = streamTitles[randomCategory.slug] || ['Live Stream'];
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];

      await prisma.user.create({
        data: {
          username: username.toLowerCase(),
          name: username,
          email: `${username.toLowerCase()}@example.com`,
          password: userPassword,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          isActive: true,
          socialLinks: {
            createMany: {
              data: [
                {
                  name: 'Twitter',
                  url: `https://x.com/${username}`,
                  position: 1,
                },
                {
                  name: 'Discord',
                  url: `https://discord.gg/${username.toLowerCase()}`,
                  position: 2,
                },
              ],
            },
          },
          stream: {
            create: {
              title: randomTitle,
              thumbnailUrl: `/thumbnails/stream-${i % 20}.webp`,
              categoryId: randomCategory.id,
            },
          },
        },
      });

      if ((i + 1) % 10 === 0) {
        Logger.log(`Created ${i + 1} realistic users...`);
      }
    }

    Logger.log(`Seeding finished! ${userCount} unique streamers are ready.`);
  } catch (error) {
    Logger.error('Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
