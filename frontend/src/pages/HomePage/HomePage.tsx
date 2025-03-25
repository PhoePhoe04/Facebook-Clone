import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const HomePage = () => {
  const storiesRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Kiểm tra trạng thái scroll
  const checkScroll = () => {
    if (storiesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = storiesRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // trừ 1 để tránh lỗi làm tròn
    }
  };

  // Tính toán scroll
  const storyWidth = 144; // 144px = w-36
  const gap = 16; // 16px = gap-4
  const storiesPerView = 3; // Hiển thị 4 stories
  const scrollDistance =
    storiesPerView * storyWidth + (storiesPerView - 1) * gap; // 4 stories + 3 gaps

  // Cuộn sang trái
  const scrollLeft = () => {
    if (storiesRef.current) {
      storiesRef.current.scrollBy({
        left: -scrollDistance,
        behavior: "smooth",
      });
    }
  };

  // Cuộn sang phải
  const scrollRight = () => {
    if (storiesRef.current) {
      storiesRef.current.scrollBy({
        left: scrollDistance,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScroll();
    const storiesElement = storiesRef.current;
    storiesElement?.addEventListener("scroll", checkScroll);
    return () => storiesElement?.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div className="flex flex-row px-4 py-2">
      {/* Left Side */}
      <div className="w-1/4 border-2 border-red-500">left side</div>

      {/* Content */}
      <div className="w-1/2 border-2 border-black">
        {/* What's on your mind */}

        {/* Stories */}
        <div className="relative mb-4">
          {/* Left scroll */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
            </button>
          )}

          {/* Stories container */}
          <div
            ref={storiesRef}
            className="flex flex-row gap-4 overflow-x-auto scrollbar-hidden snap-x snap-mandatory"
          >
            <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
              Story 1
            </div>
            <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
              Story 2
            </div>
            <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
              Story 3
            </div>
            <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
              Story 4
            </div>
            <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
              Story 5
            </div>
            <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
              Story 6
            </div>
            <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
              Story 7
            </div>
            <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
              Story 8
            </div>
            <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
              Story 9
            </div>
            <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
              Story 10
            </div>
            <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
              Story 11
            </div>
            <div className="w-36 h-48 border-2 border-gray-400 rounded-lg flex-shrink-0 snap-center bg-gray-200 flex items-center justify-center">
              Story 12
            </div>
          </div>

          {/* Right scroll */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-800" />
            </button>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/4 border-2 border-blue-500">Right Side</div>
    </div>
  );
};

export default HomePage;
