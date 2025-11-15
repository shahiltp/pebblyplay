import { type NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/server/db';
import { signInSchema } from './validators';
import { verifyPassword } from './password';
import type { Adapter, AdapterUser, AdapterAccount } from 'next-auth/adapters';

// Custom adapter that extends PrismaAdapter to handle account linking for existing users
function createCustomAdapter(): Adapter {
  const baseAdapter = PrismaAdapter(prisma) as Adapter;

  return {
    ...baseAdapter,
    async createUser(user: AdapterUser) {
      // If user has email, check if user already exists
      if (user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          // User exists, return it instead of creating a new one
          // This prevents the OAuthAccountNotLinked error
          return existingUser as any;
        }
      }

      // User doesn't exist, create it normally
      return await baseAdapter.createUser!(user);
    },
    async linkAccount(account: AdapterAccount) {
      try {
        // Try to link account normally first
        return await baseAdapter.linkAccount!(account);
      } catch (error: any) {
        // If linking fails, check if account already exists
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        if (existingAccount) {
          // Account already linked, return it
          return existingAccount as any;
        }

        // If account doesn't exist but we have a userId, create it manually
        // This handles the case where user exists but account isn't linked yet
        if (account.userId) {
          try {
            const newAccount = await prisma.account.create({
              data: {
                userId: account.userId,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
            return newAccount as any;
          } catch (createError: any) {
            // If create fails (e.g., account already exists), try to find it again
            const accountAgain = await prisma.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            });
            if (accountAgain) {
              return accountAgain as any;
            }
            throw createError;
          }
        }

        // If we can't handle it, re-throw the original error
        throw error;
      }
    },
  };
}

export const authOptions: NextAuthOptions = {
  adapter: createCustomAdapter(),
  session: { strategy: 'jwt' },
  providers: [
    // Only enable Google provider if credentials are configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Minimal in-memory rate limit (dev only)
        if (process.env.NODE_ENV !== 'production') {
          if (!globalThis.__pp_rate) globalThis.__pp_rate = {} as any;
          const key = `auth:${new Date().toISOString().slice(0, 16)}`;
          const rate = globalThis.__pp_rate;
          if (rate) {
            (rate[key] = (rate[key] || 0) + 1);
            if (rate[key] && rate[key] > 50) return null;
          }
        }

        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.name ?? undefined, email: user.email ?? undefined, image: user.image ?? undefined, role: user.role } as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email }) {
      // Allow credentials provider to proceed normally
      if (account?.provider === 'credentials') {
        return true;
      }

      // For OAuth providers (like Google), handle account linking
      if (account?.provider === 'google' && user.email) {
        try {
          // Check if user exists with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true },
          });

          if (existingUser) {
            // User exists - check if Google account is already linked
            const googleAccount = existingUser.accounts.find(
              (acc) => acc.provider === 'google' && acc.providerAccountId === account.providerAccountId
            );

            if (!googleAccount) {
              // User exists but Google account is not linked - link it
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                },
              });
            }
            // Update user info if needed (name, image)
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                emailVerified: existingUser.emailVerified || new Date(),
              },
            });
          }
          // If user doesn't exist, PrismaAdapter will create it
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          // Allow sign in to proceed - PrismaAdapter will handle user creation
          return true;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      
      // If this is an OAuth sign-in and we have the user email, ensure we have the latest user data
      if (account?.provider === 'google' && user?.email && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      // Default redirect to account page
      return `${baseUrl}/account`;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

declare global {
  // eslint-disable-next-line no-var
  var __pp_rate: Record<string, number> | undefined;
}


