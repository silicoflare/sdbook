import { Button } from "@/components/ui/button";
import { PlusIcon, LoaderIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Navbar from "../_components/Navbar";
import useSWR from "swr";
import axios, { AxiosResponse } from "axios";
import { Note } from "@/types";
import NoteCard from "../_components/NoteCard";
import Head from "next/head";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const [search, setSearch] = useState("");

  const { data: notes, isLoading } = useSWR("notes", async () => {
    if (!session) {
      return null;
    }
    const res: AxiosResponse<{ notes: Note[] }> = await axios.get(
      `/api/notes/list?username=${session?.user.id}`
    );
    if (res.status === 200 && res.data) {
      return res.data.notes;
    }
    return null;
  });

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, []);

  return (
    <>
      <Head>
        <title>My Notes - SD Book</title>
      </Head>
      <div className="flex h-full w-full flex-col items-center gap-2">
        <Navbar />
        <div className="flex h-full w-1/2 ph:w-full flex-col items-center p-10 ph:p-5">
          <h1 className="text-4xl ph:text-4xl font-bold text-primary ph:w-full ph:text-center">
            My Notes
          </h1>
          <div className="flex w-full items-center gap-5 pb-5 pt-10">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-primary"
            />
            <Link href="/notes/new">
              <Button className="ph:w-10 ph:p-1">
                <PlusIcon />
                <span className="ph:hidden">New Note</span>
              </Button>
            </Link>
          </div>

          {!isLoading && notes ? (
            <div className="flex w-full flex-col items-center gap-3">
              {notes.length !== 0 ? (
                notes.map((note) => <NoteCard note={note} key={note.noteID} />)
              ) : (
                <div className="w-full text-center text-gray-500">
                  No notes found.
                </div>
              )}
            </div>
          ) : (
            <div className="flex w-full flex-row items-center gap-3">
              <LoaderIcon className="animate-spin" />
              Loading...
            </div>
          )}
        </div>
      </div>
    </>
  );
}
