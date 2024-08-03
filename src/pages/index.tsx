"use client";

import { z } from "zod";
import Navbar from "./_components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function App() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, []);

  const formSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function login(data: z.infer<typeof formSchema>) {
    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (res?.ok) {
        toast.success("Signed in successfully!");
        router.push("/dashboard");
      } else {
        if (res?.status === 401) {
          toast.error("Invalid username or password!");
        } else {
          toast.error("An error occurred, please try again!");
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="flex w-full h-full flex-col items-center gap-2">
      <Navbar />
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Log In</CardTitle>
            <CardDescription>
              Use the credentials given to you to login
            </CardDescription>
            <CardContent className="w-full p-0 pt-5">
              <Form {...form}>
                <form
                  className="flex w-full flex-col items-center gap-2"
                  onSubmit={form.handleSubmit(login)}
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} defaultValue="" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} defaultValue="" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </Form>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
