import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

export async function requireRole(roles: Array<'OWNER' | 'STAFF'>) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role as 'OWNER' | 'STAFF' | 'CUSTOMER' | undefined;
  if (!session?.user?.id || !role || !roles.includes(role as any)) {
    throw new Error('FORBIDDEN');
  }
  return session;
}




