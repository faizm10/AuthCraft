"use client";

import {
  Calendar,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  UserCircle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const profileMenuItems = [
  {
    title: "View Profile",
    icon: UserCircle,
    onClick: () => (window.location.href = "/profile"),
  },
  {
    title: "Settings",
    icon: Settings,
    onClick: () => (window.location.href = "/settings"),
  },
  {
    title: "Logout",
    icon: LogOut,
    onClick: async () => {
      await signOut();
      console.log("Logging out...");
    },
  },
];

function UserProfileSkeleton() {
  return (
    <div className="flex items-center gap-3 px-2">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function AppSidebar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "?";

  const userImage = user?.image || undefined;

  return (
    <Sidebar className="border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarContent className="flex flex-col h-full">
        {/* Logo or brand section */}
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold">App Name</h2>
        </div>

        {/* Main menu */}
        <SidebarGroup className="flex-1">
          {/* <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
            Application
          </SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="flex items-center gap-3 px-6 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Updated User profile section */}
        <div className="border-t border-border mt-auto p-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-full p-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <UserProfileSkeleton />
                ) : (
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Avatar>
                        <AvatarImage src={userImage} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-medium">
                        {user?.name || "Anonymous User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email || "No email"}
                      </span>
                    </div>
                  </div>
                )}
              </Button>
            </PopoverTrigger>
            {!isLoading && (
              <PopoverContent className="w-56 p-2" align="start" side="top">
                <div className="flex flex-col gap-1">
                  {profileMenuItems.map((item) => (
                    <Button
                      key={item.title}
                      variant="ghost"
                      className="w-full justify-start gap-2 px-2 py-1.5 text-sm"
                      onClick={item.onClick}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.title}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            )}
          </Popover>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
