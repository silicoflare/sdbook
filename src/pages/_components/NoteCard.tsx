"use client";

import { Note } from "@/types";
import moment from "moment";
import Link from "next/link";

export default function NoteCard({ note }: { note: Note }) {
  return note ? (
    <Link
      href={`/notes/${note.noteID}`}
      className="flex w-full flex-col rounded-md border border-primary bg-primary p-5 text-primary-foreground gap-3 transition duration-200 ease-in-out hover:scale-110 cursor-pointer"
    >
      <h2 className="text-2xl">{note.title}</h2>
      <span>{moment(note.updatedAt).format("LL \\at LT")}</span>
    </Link>
  ) : null;
}
