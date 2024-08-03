import Head from "next/head";
import Navbar from "../_components/Navbar";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/router";

export default function NewNote() {
  const router = useRouter();

  const formSchema = z.object({
    title: z
      .string()
      .refine((str) => str !== "", { message: "Title should not be empty" }),
    markdown: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      markdown: "",
    },
  });

  async function createForm(data: z.infer<typeof formSchema>) {
    try {
      const res: AxiosResponse<{ noteID: string }> = await axios.post(
        "/api/notes/new",
        data
      );
      toast.success("Created note successfully!");
      router.replace(`/notes/${res.data.noteID}`);
    } catch (error) {
      toast.error("Some error occured");
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>New Note - SD Book</title>
      </Head>
      <div className="flex flex-col w-full h-full items-center gap-2">
        <Navbar />
        <div className="w-1/2 ph:w-full ph:p-5 flex flex-col items-center">
          <h1 className="text-4xl font-bold my-10 ph:my-5">New Note</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(createForm)}
              className="w-full flex flex-col items-center gap-5"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input className="border-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="markdown"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea rows={15} className="border-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex items-center justify-end">
                <Button>Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
