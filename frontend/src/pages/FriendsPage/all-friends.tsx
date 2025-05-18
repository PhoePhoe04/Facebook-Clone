import React, { useState, useEffect, useRef } from "react";
import { FiMoreHorizontal } from "react-icons/fi";

interface Friend {
    id: number;
    firstname: string;
    lastname: string;
    mutualFriends: string;
    avatar: string;
}

const friends: Friend[] = [
    { id: 1, firstname: "Nghĩa", lastname: "Dái", mutualFriends: "5 bạn chung", avatar: "/images/avtfr.jpg" },
    { id: 2, firstname: "Dái", lastname: "bò", mutualFriends: "10 bạn chung", avatar: "/images/avatar.png" },
    { id: 3, firstname: "Wibu", lastname: "chó", mutualFriends: "", avatar: "/images/avatar2.jpg" },
];

const FriendsList: React.FC = () => {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<(HTMLDivElement | null)[]>([]);

    // Đóng dropdown khi nhấn ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current.every(
                    (ref) => ref && !ref.contains(event.target as Node)
                )
            ) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-80 h-screen bg-white p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Tất cả bạn bè</h2>
            <input
                type="text"
                placeholder="Tìm kiếm bạn bè"
                className="w-full p-2 mb-4 bg-gray-100 border-solid rounded-2xl placeholder-gray-400 focus:outline-none"
            />
            <p className="text-black font-medium mb-4">{friends.length} người bạn</p>
            <div className="flex-1 overflow-y-auto">
                {friends.map((friend, index) => (
                    <div
                        key={friend.id}
                        className="flex items-center p-2 mb-2 hover:bg-gray-100 rounded-lg cursor-pointer relative"
                    >
                        <img
                            src={friend.avatar}
                            alt={friend.firstname + " " + friend.lastname}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className="flex-1">
                            <p className="text-black font-medium">{friend.firstname + " " + friend.lastname}</p>
                            {friend.mutualFriends && (
                                <p className="text-gray-400 text-sm">{friend.mutualFriends}</p>
                            )}
                        </div>
                        <button
                            onClick={() => setOpenDropdown(openDropdown === friend.id ? null : friend.id)}
                            className="p-2 rounded-full hover:bg-gray-300 transition"
                        >
                            <FiMoreHorizontal className="text-gray-600 text-xl" />
                        </button>
                        {openDropdown === friend.id && (
                            <div
                                ref={(el) => {
                                    dropdownRef.current[index] = el;
                                }}
                                className="absolute right-8 top-12 w-32 bg-white shadow-lg rounded-lg border border-gray-200 z-10"
                            >
                                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                                    Xóa bạn
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendsList;