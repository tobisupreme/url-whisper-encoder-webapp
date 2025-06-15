
import * as z from "zod";

export const formSchema = z.object({
  systolic: z.coerce.number().min(30, "Invalid systolic value").max(300, "Invalid systolic value"),
  diastolic: z.coerce.number().min(30, "Invalid diastolic value").max(300, "Invalid diastolic value"),
});

export type Reading = z.infer<typeof formSchema> & {
  date: Date;
};
