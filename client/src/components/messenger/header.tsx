import { Icon } from "@iconify/react";

export const Header = () => {
  return (
    <div className="bg-primary-background text-primary-foreground flex-initial border-b border-white/20 px-4">
      <div className="py-2">
        <div className="size-10">
          <Icon icon="logos:facebook" className="size-full" />
        </div>
      </div>
    </div>
  );
};
