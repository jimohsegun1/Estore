const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-shimmer bg-gradient-to-r from-[#e4e4ef] via-[#f1f1f7] to-[#e4e4ef]
      dark:from-[#17172a] dark:via-[#2a2a45] dark:to-[#17172a]
      bg-[length:200%_100%] rounded-xl ${className}`}
  />
);

export default Skeleton;
