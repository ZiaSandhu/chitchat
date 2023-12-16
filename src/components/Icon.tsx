import { LucideProps, UserPlus, User } from "lucide-react";
import { ImgHTMLAttributes } from "react";

export const Icons = {
  Logo: (props: ImgHTMLAttributes<HTMLImageElement>) => (
   <img {...props } src="/logo.png" alt="logo" />
  ),
  UserPlus,
  User
};

export type Icon = keyof typeof Icons