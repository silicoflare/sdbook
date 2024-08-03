"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { NotebookIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <div className="z-[100] flex w-full items-center justify-between bg-primary p-5 px-10 shadow-md">
      <h1 className="flex items-center gap-3 text-2xl font-bold text-primary-foreground">
        <NotebookIcon size={25} />
        SD Book
      </h1>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="z-[50]">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/9.x/icons/svg?seed=${session.user.id}`}
              />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[110] mr-5 p-3">
            <DropdownMenuLabel>{session.user.id}</DropdownMenuLabel>
            {session.user.role === "ADMIN" ? (
              <DropdownMenuItem>Users</DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={_ => signOut()}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="outline" onClick={_ => signIn()}>
          Log In
        </Button>
      )}
    </div>
  );
}
