import { Icon } from "@iconify/react";

export function NewsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gray-800/50 border border-white/5">
          <Icon className="w-10 h-10 text-gray-400/60" icon="lucide:newspaper" />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-gray-500/60" icon="lucide:inbox" />
        <h4 className="text-base font-medium text-gray-300">No news available</h4>
      </div>
      <p className="text-sm text-gray-500/80 text-center max-w-sm">
        There are no news articles for this entity at the moment. Check back later for updates.
      </p>
    </div>
  );
}
