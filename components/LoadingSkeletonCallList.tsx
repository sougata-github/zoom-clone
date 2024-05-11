const LoadingSkeletonCallList = () => {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <section
          className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px] animate-pulse transition-all"
          key={index}
        ></section>
      ))}
    </div>
  );
};

export default LoadingSkeletonCallList;
