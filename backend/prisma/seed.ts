import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Check if we already have data
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('✅ Database already seeded');
    return;
  }

  // Create demo organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Demo Construction Company',
      description: 'A demo organization for COREVQC platform'
    }
  });

  // Create demo admin user
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'demo@corevqc.com',
      firstName: 'Demo',
      lastName: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      organizationId: organization.id
    }
  });

  // Create a sample project
  const project = await prisma.project.create({
    data: {
      name: 'Downtown Office Building',
      description: 'Construction of a 10-story office building in downtown',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      progress: 25,
      budget: 2500000.00,
      clientName: 'Metro Development Corp',
      clientContact: 'john.client@metrodev.com',
      projectType: 'Commercial Building',
      location: '123 Main Street, Downtown',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-12-31'),
      organizationId: organization.id,
      ownerId: adminUser.id
    }
  });

  // Add admin as project manager
  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      userId: adminUser.id,
      role: 'MANAGER'
    }
  });

  console.log('✅ Seed completed successfully!');
  console.log('🏢 Organization created:', organization.name);
  console.log('👤 Admin user created:', adminUser.email);
  console.log('📋 Sample project created:', project.name);
  console.log('');
  console.log('🔑 Login credentials:');
  console.log('   Email: demo@corevqc.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
