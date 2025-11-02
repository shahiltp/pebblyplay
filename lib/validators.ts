import { z } from 'zod';

export const emailSchema = z.string().email();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/(?=.*[A-Za-z])(?=.*\d)/, 'Must include at least one letter and one number');

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Category slug is required'),
});

export const productVariantSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  optionValues: z.record(z.string(), z.any()), // JSON object with key-value pairs
  priceCents: z.number().int().positive('Price must be greater than 0'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  imageIds: z.array(z.string()).default([]),
});

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  ageMin: z.number().int().positive().optional().nullable(),
  ageMax: z.number().int().positive().optional().nullable(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
  variants: z.array(productVariantSchema).min(1, 'At least one variant is required'),
  imageIds: z.array(z.string()).default([]),
}).refine(
  (data) => {
    // Validate age range
    if (data.ageMin != null && data.ageMax != null && data.ageMin > data.ageMax) {
      return false;
    }
    return true;
  },
  {
    message: 'Age min must be less than or equal to age max',
    path: ['ageMin'],
  }
);

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;



