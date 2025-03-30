const ProfileAbout = () => {
    return (
        <div className="w-3/5 flex flex-col bg-white p-4 rounded-lg shadow-md mt-3 min-h-screen">
          <h2 className="text-xl font-bold mb-4">Giới thiệu</h2> {/* "About" in Vietnamese */}
    
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Tổng quan</h3> {/* Overview */}
            <ul className="list-none p-0">
              <li className="mb-2 text-gray-800">
                <span role="img" aria-label="education" className="mr-2">🎓</span>
                Học tại Trường Đại học Sài Gòn <br />
                Đã bắt đầu vào 2022 {/* Studied at University of Saigon, started in 2022 */}
              </li>
              <li className="mb-2 text-gray-800">
                <span role="img" aria-label="home" className="mr-2">🏠</span>
                Sống tại Hàm Tân {/* Lives in Ham Tan */}
              </li>
              <li className="mb-2 text-gray-800">
                <span role="img" aria-label="location" className="mr-2">📍</span>
                Đến từ Lagi, Thuận Hải, Vietnam {/* From Lagi, Thuan Hai, Vietnam */}
              </li>
            </ul>
          </div>
    
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Thông tin liên hệ và cơ bản</h3> {/* Contact and Basic Info */}
            <ul className="list-none p-0">
              <li className="mb-2 text-gray-800">
                <span role="img" aria-label="phone" className="mr-2">📞</span>
                034 572 6227 <br />
                Di động {/* Mobile */}
              </li>
            </ul>
          </div>
    
          {/* Placeholder for sections that are not filled */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Công việc và học vấn</h3> {/* Work and Education */}
            <p className="text-gray-500 italic">+ Thêm nội dung việc</p> {/* Add work content */}
          </div>
    
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Nơi từng sống</h3> {/* Places Lived */}
            <p className="text-gray-500 italic">Không có nơi nào để hiển thị</p> {/* No places to display */}
          </div>
    
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Gia đình và các mối quan hệ</h3> {/* Family and Relationships */}
            <p className="text-gray-500 italic">+ Thêm tình trạng mối quan hệ</p> {/* Add relationship status */}
          </div>
    
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Chi tiết về bạn</h3> {/* Details About You */}
            <p className="text-gray-500 italic">Không có chi tiết nào để hiển thị</p> {/* No details to display */}
          </div>
    
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-600">Sự kiện trong đời</h3> {/* Life Events */}
            <p className="text-gray-500 italic">Không có sự kiện nào để hiển thị</p> {/* No events to display */}
          </div>
        </div>
      );
  };
  
  export default ProfileAbout;