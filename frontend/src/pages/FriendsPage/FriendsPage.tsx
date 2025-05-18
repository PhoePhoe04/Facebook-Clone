import SideBar from "./components/sideBar";
import { SidebarItem } from "./components/sideBar";
import FriendReqItem from "./components/friend-requests-item";

const FriendsPage = () => {
  const SidebarItems: SidebarItem[] = [
    { label: "Trang chủ", path: "/", iconPosition: { x: 0, y: -321 } },
    {
      label: "Lời mời kết bạn",
      path: "/friend-requests",
      iconPosition: { x: -24, y: 0 },
    },
    { label: "Gợi ý", path: "/suggestions", iconPosition: { x: -48, y: 0 } },
    {
      label: "Tất cả bạn bè",
      path: "/all-friends",
      iconPosition: { x: -72, y: 0 },
    },
  ];

  const friendRequests = [
    { image: "/images/avtfr.jpg", name: "Nghĩa Hà" },
    { image: "/images/avatar.png", name: "Dái bò" },
    { image: "/images/avatar2.jpg", name: "Hoàng Nam" },
    { image: "/images/avatar3.webp", name: "Lỏ c" },
    { image: "/images/avtfr.jpg", name: "Nghĩa Hà" },
    { image: "/images/avatar.png", name: "Dái Bò" },
    { image: "/images/avatar2.jpg", name: "Hoàng Nam" },
    { image: "/images/avatar3.webp", name: "Lỏ c" },
    { image: "/images/avtfr.jpg", name: "Nghĩa Hà" },
    { image: "/images/avatar.png", name: "Dái Bò" },
    { image: "/images/avatar2.jpg", name: "Hoàng Nam" },
    { image: "/images/avatar3.webp", name: "Lỏ c" },
    { image: "/images/avtfr.jpg", name: "Nghĩa Hà" },
    { image: "/images/avatar.png", name: "Dái Bò" },
    { image: "/images/avatar2.jpg", name: "Hoàng Nam" },
    { image: "/images/avatar3.webp", name: "Lỏ c" },
    { image: "/images/avtfr.jpg", name: "Nghĩa Hà" },
    { image: "/images/avatar.png", name: "Dái Bò" },
    { image: "/images/avatar2.jpg", name: "Hoàng Nam" },
    { image: "/images/avatar3.webp", name: "Lỏ c" },
    { image: "/images/avtfr.jpg", name: "Nghĩa Hà" },
    { image: "/images/avatar.png", name: "Dái Bò" },
    { image: "/images/avatar2.jpg", name: "Hoàng Nam" },
    { image: "/images/avatar3.webp", name: "Lỏ c" },

  ];

  return (
    <div className="w-full sm:w-1/4 pr-[20px] sm:pr-4:w-1/4 pr-0">
      <SideBar isMobile={false} title="Bạn bè" items={SidebarItems} />
      <div className="ml-[365px] mt-0.25">
        <div className="m-8 ">
          <div className="w-full pb-4 font-bold text-xl whitespace-nowrap flex">
            Lời mời kết bạn
          </div>
          <div className="grid grid-cols-5 gap-x-55 gap-y-2">
            {friendRequests.map((request, index) => (
              <FriendReqItem
                key={index}
                image={request.image}
                name={request.name}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
