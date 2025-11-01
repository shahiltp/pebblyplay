import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

export const ourFileRouter = {
  productImages: f({ image: { maxFileSize: '5MB', maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      // TODO: Add auth check here if needed
      // For now, we'll rely on the admin route protection
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // File uploaded successfully
      return { uploadedBy: 'admin' };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

