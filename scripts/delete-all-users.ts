import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Delete all users from the database
 * This will cascade delete:
 * - Accounts (OAuth accounts)
 * - Sessions
 * 
 * Note: Orders will remain but their userId will become null
 */
async function main() {
  console.log('Deleting all users...');

  // Get count before deletion
  const userCount = await prisma.user.count();
  console.log(`Found ${userCount} users to delete`);

  if (userCount === 0) {
    console.log('No users to delete.');
    return;
  }

  // Delete all users (cascade will handle accounts and sessions)
  const result = await prisma.user.deleteMany({});

  // Also clear verification tokens (not cascade, but related to auth)
  await prisma.verificationToken.deleteMany({});

  console.log(`✅ Deleted ${result.count} users`);
  console.log('✅ Cleared verification tokens');
  console.log('✅ Associated accounts and sessions were automatically deleted (cascade)');
}

main()
  .catch((e) => {
    console.error('Error deleting users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

