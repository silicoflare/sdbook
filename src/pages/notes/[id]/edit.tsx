import Head from "next/head";
import Navbar from "@/pages/_components/Navbar";
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
import useSWR from "swr";
import { Note } from "@/types";
import { useEffect } from "react";
import { Loader2Icon } from "lucide-react";

export default function EditNote() {
  const router = useRouter();
  const { id } = router.query;

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

  const { data, isLoading, mutate } = useSWR("getNote", async () => {
    if (!id) {
      return;
    }
    try {
      const res: AxiosResponse<{ note: Note }> = await axios.get(
        `/api/notes/${id}`
      );
      return res.data.note;
    } catch (error) {
      console.error("Error fetching note:", error);
      return null;
    }
  });

  useEffect(() => {
    if (data) {
      form.setValue("title", data.title);
      form.setValue("markdown", data.markdown);
    }
  }, [data]);

  async function editNote(data: z.infer<typeof formSchema>) {
    try {
      const res: AxiosResponse<{ message: string }> = await axios.patch(
        `/api/notes/${id}/edit`,
        data
      );
      toast.success("Updated note successfully!");
      router.replace(`/notes/${id}`);
    } catch (error) {
      toast.error("Some error occured");
      console.log(error);
    }
  }

  useEffect(() => {
    mutate();
  }, [router.isReady]);

  return (
    <>
      <div className="flex flex-col w-full h-full items-center gap-2">
        <Navbar />
        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-row items-center justify-center gap-2">
              <Loader2Icon className="animate-spin" />
              Loading...
            </div>
          </div>
        ) : data ? (
          <>
            <Head>
              <title>Edit {data?.title} - SD Book</title>
            </Head>
            <div className="w-1/2 ph:w-full ph:p-5 flex flex-col items-center">
              <h1 className="text-4xl font-bold my-10">Edit Note</h1>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(editNote)}
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
                          <Textarea
                            rows={15}
                            className="border-black"
                            {...field}
                          />
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-col items-center justify-center border border-red-600 text-red-600 rounded-md px-10 py-5">
              This note is private.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
