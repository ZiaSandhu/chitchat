"use client";

import { ButtonHTMLAttributes, FC, useState } from "react";
import Button from "@/components/ui/button";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader, LogOut } from "lucide-react";

interface SignoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignoutButton: FC<SignoutButtonProps> = ({ ...props }) => {
  async function signout() {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      toast.error("There was problem Signing Out");
    } finally {
      setIsSigningOut(false);
    }
  }

  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  return (
    <Button {...props} variant="ghost" onClick={signout}>
     {isSigningOut ? <Loader className="animate spin h-8 w-4" /> :  <LogOut className="h-8 w-6" />}
    </Button>
  );
};

export default SignoutButton;
