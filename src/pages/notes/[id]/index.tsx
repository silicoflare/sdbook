import Navbar from "@/pages/_components/Navbar";
import { Note } from "@/types";
import axios, { AxiosResponse } from "axios";
import {
  DotIcon,
  Loader2Icon,
  PencilIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { space_mono } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const markdownStyles: Partial<Components> = {
  h1: ({ node, ...props }) => (
    <h1 className="text-3xl font-bold my-4" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-2xl font-semibold my-3" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-xl font-semibold my-2" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="text-base my-2 leading-relaxed" {...props} />
  ),
  a: ({ node, ...props }) => (
    <a className="text-blue-600 hover:underline" target="_blank" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-5 ml-7 space-y-2" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-5 ml-7 space-y-2" {...props} />
  ),
  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
};

export default function ViewNote() {
  const router = useRouter();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);

  const { id } = router.query;

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
    mutate();
  }, [router.isReady]);

  async function deleteNote() {
    try {
      toast("Deleting note...");
      const res: AxiosResponse<{ message: string }> = await axios.delete(
        `/api/notes/${id}/delete`
      );
      setOpen(false);
      toast.success("Deleted note successfully!");
      router.replace(`/notes`);
    } catch (error) {
      toast.error("Some error occured");
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col w-full h-full items-center gap-2">
      <Navbar />
      {!isLoading ? (
        !data ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-col items-center justify-center border border-red-600 text-red-600 rounded-md px-10 py-5">
              This note is private.
            </div>
          </div>
        ) : (
          <>
            <Head>
              <title>{data.title}</title>
            </Head>
            <div className="flex flex-col items-center w-1/2 ph:w-full p-10 ph:p-5 gap-2">
              <h1 className="text-4xl font-bold w-full text-left">
                {data.title}
              </h1>
              <span className="text-gray-500 flex items-center justify-start w-full">
                <span>By {data.creatorID}</span>
                <DotIcon />
                <span>{moment(data.updatedAt).format("LL \\at LT")}</span>
              </span>
              <div className="my-3 flex items-center justify-end ph:grid ph:grid-cols-2 gap-3 w-full">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger>
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2 ph:w-full"
                    >
                      <Trash2Icon size={20} />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Note</DialogTitle>
                      <DialogDescription>
                        Are you sure that you want to delete the note? This
                        action is irreversible.
                      </DialogDescription>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={(_) => deleteNote()}
                        >
                          Yes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={(_) => setOpen(false)}
                        >
                          No
                        </Button>
                      </DialogFooter>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Link href={`/notes/${id}/edit`}>
                  <Button className="flex items-center gap-2 ph:w-full">
                    <PencilIcon size={20} />
                    Edit
                  </Button>
                </Link>
              </div>
              <div className={`mt-10 w-full text-left ${space_mono}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownStyles}
                >
                  {data.markdown}
                </ReactMarkdown>
              </div>
            </div>
          </>
        )
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="flex flex-row items-center justify-center gap-2">
            <Loader2Icon className="animate-spin" />
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}
