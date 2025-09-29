import z from "zod";

export const transformationSchema = z.object({
  positionX: z.string()
    .refine((val) => val === '' || /^-?\d+(\.\d{1,2})?$/.test(val), {
      message: 'Must be empty or a number with up to 2 decimals (e.g., 12, 12.3, or -12.34)',
    }),
  positionY: z.string()
    .refine((val) => val === '' || /^-?\d+(\.\d{1,2})?$/.test(val), {
      message: 'Must be empty or a number with up to 2 decimals (e.g., 12, 12.3, or -12.34)',
    }),
  rotation: z.string()
    .refine((val) => /^-?\d+(\.\d{1,2})?$/.test(val), {
      message: 'Must be a number with up to 2 decimals (e.g., 45, 45.5, or -90.50)',
    }),
  pivotX: z.string()
    .refine((val) => val === '' || /^-?\d+(\.\d{1,2})?$/.test(val), {
      message: 'Must be empty or a number with up to 2 decimals (e.g., 12, 12.3, or -12.34)',
    }),
  pivotY: z.string()
    .refine((val) => val === '' || /^-?\d+(\.\d{1,2})?$/.test(val), {
      message: 'Must be empty or a number with up to 2 decimals (e.g., 12, 12.3, or -12.34)',
    }),
});