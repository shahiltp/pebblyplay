'use client';

import { UploadButton, UploadDropzone } from '@uploadthing/react';
import { OurFileRouter } from '@/server/uploadthing';

export function UploadThingButton({
  endpoint,
  onClientUploadComplete,
  onUploadError,
  ...props
}: {
  endpoint: 'productImages';
  onClientUploadComplete?: (res?: Array<{ url: string; name: string }>) => void;
  onUploadError?: (error: Error) => void;
  [key: string]: any;
}) {
  return (
    <UploadButton<OurFileRouter, 'productImages'>
      endpoint={endpoint}
      onClientUploadComplete={onClientUploadComplete}
      onUploadError={onUploadError}
      {...props}
    />
  );
}

export function UploadThingDropzone({
  endpoint,
  onClientUploadComplete,
  onUploadError,
  ...props
}: {
  endpoint: 'productImages';
  onClientUploadComplete?: (res?: Array<{ url: string; name: string }>) => void;
  onUploadError?: (error: Error) => void;
  [key: string]: any;
}) {
  return (
    <UploadDropzone<OurFileRouter, 'productImages'>
      endpoint={endpoint}
      onClientUploadComplete={onClientUploadComplete}
      onUploadError={onUploadError}
      {...props}
    />
  );
}

