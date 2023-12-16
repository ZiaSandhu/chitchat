import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { addFriendValidator } from "@/lib/validation/addFriend";

import Button from "@/components/ui/button";

interface AddFriendProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriend: FC<AddFriendProps> = ({}) => {

  const [showStatus, setShowStatus] = useState<boolean>(false);
  const [isSending,setIsSending] = useState<boolean>(false);
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const onSubmit = (data: FormData) => {
    setIsSending(true)
    addFriend(data.email);
  };

  const addFriend = async (email: string) => {
    setError("email", { message: "" });
    try {
      const validatedEmail = addFriendValidator.parse({ email });
      await axios.post("/api/friend/add", {
        email: validatedEmail,
      });
      reset()
      setShowStatus(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
      }
      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
      } else {
        setError("email", { message: "Something went wrong!" });
      }
    }
    finally{
      setIsSending(false)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add friend by E-Mail
      </label>

      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
        />
        <Button isLoading={isSending}>{isSending ? "Sending" : "Add" }</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showStatus && (
        <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
      )}
    </form>
  );
};

export default AddFriend;
