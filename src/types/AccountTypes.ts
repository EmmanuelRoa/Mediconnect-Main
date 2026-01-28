import z from "zod";
import {
  verifyAccountSchema,
  changeEmailSchema,
  changePasswordSchema,
} from "@/schema/account.schema";
export type VerifyAccount = z.infer<typeof verifyAccountSchema>;
export type ChangeEmail = z.infer<typeof changeEmailSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
