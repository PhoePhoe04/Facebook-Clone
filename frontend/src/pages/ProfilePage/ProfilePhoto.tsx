import React from "react";

const photos = [
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
    "/images/dp1.png",
];

const ProfilePhoto = () => {
  return (
    <div className="w-3/5 flex flex-col bg-white p-4 rounded-lg shadow-md mt-3 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Ảnh</h2>
      <div className="grid grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Ảnh ${index + 1}`}
            className="w-full h-48 object-cover rounded-lg shadow-md hover:opacity-80 transition"
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePhoto;
