import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

function HoverCardPortal({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Portal>) {
  return <HoverCardPrimitive.Portal data-slot="hover-card-portal" {...props} />;
}

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    data-slot="hover-card-content"
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-border bg-popover p-4 text-sm text-popover-foreground shadow-lg outline-none ring-1 ring-foreground/10",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardPortal, HoverCardContent };
