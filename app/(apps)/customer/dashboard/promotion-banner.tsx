export const PromotionBanner = () => {
  return (
    <div className="col-span-6">
      <div
        className="flex h-36 relative items-center rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34, 197, 94, 0.25), transparent 70%), #000000",
        }}
      >
        <div className="aspect-[0.8/1] lg:aspect-video relative shrink-0 h-full">
          <img
            src="/cup/paso.png"
            className="w-full h-auto lg:h-full lg:scale-140 lg:-translate-2 absolute -rotate-5 scale-200 translate-y-8 drop-shadow-xs drop-shadow-sidebar-accent"
          />
        </div>

        <div className="p-4 relative z-1">
          <div className="mb-1 text-xl font-bold text-primary-foreground">
            Exclusive Signature Cup
          </div>
          <p className="mb-4 text-sm text-primary-foreground opacity-80">
            Designed to bring the perfect fiesta vibe to every order.
            <br />
          </p>
        </div>
        <span className="absolute right-4 top-4 rounded-md text-xs h-6 px-2.5 inline-flex items-center justify-center font-medium bg-background">
          Coming Soon
        </span>
      </div>
    </div>
  );
};
