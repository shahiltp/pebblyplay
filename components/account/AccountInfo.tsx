'use client';

interface AccountInfoProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: 'OWNER' | 'STAFF' | 'CUSTOMER';
  };
}

export function AccountInfo({ user }: AccountInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-muted-foreground">Name</label>
        <p className="text-sm mt-1">{user.name || 'Not provided'}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground">Email</label>
        <p className="text-sm mt-1">{user.email || 'Not provided'}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground">User ID</label>
        <p className="text-sm mt-1 font-mono text-xs">{user.id}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-muted-foreground">Role</label>
        <p className="text-sm mt-1">
          <span className="px-2 py-1 rounded bg-muted text-xs font-medium">
            {user.role || 'CUSTOMER'}
          </span>
        </p>
      </div>
      {user.image && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">Profile Image</label>
          <div className="mt-2">
            <img 
              src={user.image} 
              alt="Profile" 
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}


