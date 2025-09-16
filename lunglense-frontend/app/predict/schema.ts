import { z } from "zod";

 export const imageSchema = z
  .custom<File>((file) => file instanceof File, {
    message: "Must be a file",
  }).refine((file) => file.type.startsWith("image/"), {
    message: "Only image files are allowed",
  }).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image must be less than 5MB",
  });

