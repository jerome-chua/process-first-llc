"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router";

export function NavigationBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex items-center justify-between p-2">
      <h1 className="text-xl font-bold text-indigo-500 font-titillium leading-tight">
        Process First LLC
      </h1>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/canvas"
                className={cn(
                  "px-4 py-2 font-black cursor-pointer transition-colors duration-200 rounded-md",
                  currentPath === "/canvas"
                    ? "text-indigo-600 bg-indigo-50 underline decoration-2"
                    : "hover:text-indigo-600 hover:bg-indigo-100"
                )}
              >
                CANVAS
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/dashboard"
                className={cn(
                  "px-4 py-2 font-black cursor-pointer transition-colors duration-200 rounded-md",
                  currentPath === "/dashboard"
                    ? "text-indigo-600 bg-indigo-100 underline decoration-2"
                    : "hover:text-indigo-600 hover:bg-indigo-100"
                )}
              >
                DASHBOARD
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
