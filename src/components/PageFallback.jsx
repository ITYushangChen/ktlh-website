/** 路由懒加载时的轻量占位，避免整页白屏 */
const PageFallback = () => (
  <div className="min-h-[50vh] bg-white animate-pulse" aria-hidden>
    <div className="container mx-auto px-4 py-16 max-w-4xl space-y-6">
      <div className="h-10 bg-gray-100 rounded-lg w-2/5 mx-auto" />
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-11/12" />
      <div className="h-4 bg-gray-100 rounded w-4/5" />
    </div>
  </div>
);

export default PageFallback;
