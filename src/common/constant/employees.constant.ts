export interface Employee {
  part: string;
  department: string;
  code: string;
  name: string;
  lotteryCode: string;
}

const rawEmployees: Employee[] = [
  // ===== BAN GIÁM ĐỐC =====
  { code: '00001', name: 'Nguyễn Văn A', part: 'Ban Giám đốc', department: 'Tổng Giám đốc', lotteryCode: '001' },
  { code: '00002', name: 'Nguyễn Văn B', part: 'Ban Giám đốc', department: 'Phó Tổng Giám đốc', lotteryCode: '002' },
  { code: '00003', name: 'Nguyễn Văn C', part: 'Ban Giám đốc', department: 'Trợ lý Tổng Giám đốc', lotteryCode: '003' },
  { code: '00004', name: 'Trần Thị D', part: 'Ban Giám đốc', department: 'Thư ký Ban Giám đốc', lotteryCode: '004' },

  // ===== KẾ TOÁN =====
  { code: '00005', name: 'Nguyễn Thị E', part: 'Kế toán', department: 'Kế toán trưởng', lotteryCode: '005' },
  { code: '00006', name: 'Lê Văn F', part: 'Kế toán', department: 'Kế toán tổng hợp', lotteryCode: '006' },
  { code: '00007', name: 'Phạm Thị G', part: 'Kế toán', department: 'Kế toán công nợ', lotteryCode: '007' },
  { code: '00008', name: 'Hoàng Văn H', part: 'Kế toán', department: 'Kế toán nội bộ', lotteryCode: '008' },
  { code: '00009', name: 'Vũ Thị I', part: 'Kế toán', department: 'Kế toán thuế', lotteryCode: '009' },
  { code: '00010', name: 'Đặng Văn J', part: 'Kế toán', department: 'Kế toán kho', lotteryCode: '010' },
  { code: '00011', name: 'Bùi Thị K', part: 'Kế toán', department: 'Kế toán thanh toán', lotteryCode: '011' },

  // ===== NHÂN SỰ =====
  { code: '00012', name: 'Nguyễn Văn L', part: 'Nhân sự', department: 'Trưởng phòng Nhân sự', lotteryCode: '012' },
  { code: '00013', name: 'Trần Thị M', part: 'Nhân sự', department: 'Chuyên viên Tuyển dụng', lotteryCode: '013' },
  { code: '00014', name: 'Lê Văn N', part: 'Nhân sự', department: 'Chuyên viên C&B', lotteryCode: '014' },
  { code: '00015', name: 'Phạm Thị O', part: 'Nhân sự', department: 'Chuyên viên Đào tạo', lotteryCode: '015' },
  { code: '00016', name: 'Hoàng Văn P', part: 'Nhân sự', department: 'Chuyên viên Hành chính', lotteryCode: '016' },
  { code: '00017', name: 'Vũ Thị Q', part: 'Nhân sự', department: 'Chuyên viên Phúc lợi', lotteryCode: '017' },

  // ===== MARKETING =====
  { code: '00018', name: 'Đặng Văn R', part: 'Marketing', department: 'Marketing Manager', lotteryCode: '018' },
  { code: '00019', name: 'Bùi Thị S', part: 'Marketing', department: 'Content Marketing', lotteryCode: '019' },
  { code: '00020', name: 'Nguyễn Văn T', part: 'Marketing', department: 'Digital Marketing', lotteryCode: '020' },
  { code: '00021', name: 'Trần Thị U', part: 'Marketing', department: 'Designer', lotteryCode: '021' },
  { code: '00022', name: 'Lê Văn V', part: 'Marketing', department: 'SEO Specialist', lotteryCode: '022' },
  { code: '00023', name: 'Phạm Thị W', part: 'Marketing', department: 'Social Media', lotteryCode: '023' },
  { code: '00024', name: 'Hoàng Văn X', part: 'Marketing', department: 'Brand Manager', lotteryCode: '024' },
  { code: '00025', name: 'Vũ Thị Y', part: 'Marketing', department: 'PR Specialist', lotteryCode: '025' },
  { code: '00026', name: 'Đặng Văn Z', part: 'Marketing', department: 'Event Coordinator', lotteryCode: '026' },

  // ===== KINH DOANH =====
  { code: '00027', name: 'Bùi Văn An', part: 'Kinh doanh', department: 'Giám đốc Kinh doanh', lotteryCode: '027' },
  { code: '00028', name: 'Nguyễn Thị Bình', part: 'Kinh doanh', department: 'Trưởng nhóm Kinh doanh', lotteryCode: '028' },
  { code: '00029', name: 'Trần Văn Cường', part: 'Kinh doanh', department: 'Nhân viên Kinh doanh', lotteryCode: '029' },
  { code: '00030', name: 'Lê Thị Dung', part: 'Kinh doanh', department: 'Nhân viên Kinh doanh', lotteryCode: '030' },
  { code: '00031', name: 'Phạm Văn Em', part: 'Kinh doanh', department: 'Nhân viên Kinh doanh', lotteryCode: '031' },
  { code: '00032', name: 'Hoàng Thị Phượng', part: 'Kinh doanh', department: 'Chăm sóc khách hàng', lotteryCode: '032' },
  { code: '00033', name: 'Vũ Văn Giang', part: 'Kinh doanh', department: 'Chăm sóc khách hàng', lotteryCode: '033' },
  { code: '00034', name: 'Đặng Thị Hoa', part: 'Kinh doanh', department: 'Nhân viên Kinh doanh', lotteryCode: '034' },
  { code: '00035', name: 'Bùi Văn Hùng', part: 'Kinh doanh', department: 'Nhân viên Kinh doanh', lotteryCode: '035' },
  { code: '00036', name: 'Nguyễn Thị Lan', part: 'Kinh doanh', department: 'Nhân viên Kinh doanh', lotteryCode: '036' },
  { code: '00037', name: 'Trần Văn Minh', part: 'Kinh doanh', department: 'Key Account Manager', lotteryCode: '037' },
  { code: '00038', name: 'Lê Thị Nga', part: 'Kinh doanh', department: 'Key Account Manager', lotteryCode: '038' },

  // ===== CÔNG NGHỆ THÔNG TIN =====
  { code: '00039', name: 'Phạm Văn Nghĩa', part: 'Công nghệ thông tin', department: 'IT Manager', lotteryCode: '039' },
  { code: '00040', name: 'Hoàng Thị Oanh', part: 'Công nghệ thông tin', department: 'Backend Developer', lotteryCode: '040' },
  { code: '00041', name: 'Vũ Văn Phong', part: 'Công nghệ thông tin', department: 'Backend Developer', lotteryCode: '041' },
  { code: '00042', name: 'Đặng Thị Quỳnh', part: 'Công nghệ thông tin', department: 'Frontend Developer', lotteryCode: '042' },
  { code: '00043', name: 'Bùi Văn Sơn', part: 'Công nghệ thông tin', department: 'Frontend Developer', lotteryCode: '043' },
  { code: '00044', name: 'Nguyễn Thị Thảo', part: 'Công nghệ thông tin', department: 'DevOps Engineer', lotteryCode: '044' },
  { code: '00045', name: 'Trần Văn Tuấn', part: 'Công nghệ thông tin', department: 'QA Engineer', lotteryCode: '045' },
  { code: '00046', name: 'Lê Thị Uyên', part: 'Công nghệ thông tin', department: 'QA Engineer', lotteryCode: '046' },
  { code: '00047', name: 'Phạm Văn Vinh', part: 'Công nghệ thông tin', department: 'Database Administrator', lotteryCode: '047' },
  { code: '00048', name: 'Hoàng Văn Xuân', part: 'Công nghệ thông tin', department: 'System Administrator', lotteryCode: '048' },
  { code: '00049', name: 'Vũ Thị Yến', part: 'Công nghệ thông tin', department: 'Mobile Developer', lotteryCode: '049' },
  { code: '00050', name: 'Đặng Văn Zung', part: 'Công nghệ thông tin', department: 'Mobile Developer', lotteryCode: '050' },

  // ===== VẬN HÀNH =====
  { code: '00051', name: 'Bùi Thị Ánh', part: 'Vận hành', department: 'Trưởng phòng Vận hành', lotteryCode: '051' },
  { code: '00052', name: 'Nguyễn Văn Bảo', part: 'Vận hành', department: 'Chuyên viên Vận hành', lotteryCode: '052' },
  { code: '00053', name: 'Trần Thị Châu', part: 'Vận hành', department: 'Chuyên viên Vận hành', lotteryCode: '053' },
  { code: '00054', name: 'Lê Văn Dũng', part: 'Vận hành', department: 'Giám sát Vận hành', lotteryCode: '054' },
  { code: '00055', name: 'Phạm Thị Ép', part: 'Vận hành', department: 'Chuyên viên Vận hành', lotteryCode: '055' },
  { code: '00056', name: 'Hoàng Văn Phúc', part: 'Vận hành', department: 'Chuyên viên Vận hành', lotteryCode: '056' },
  { code: '00057', name: 'Vũ Thị Gấm', part: 'Vận hành', department: 'Chuyên viên Kho', lotteryCode: '057' },
  { code: '00058', name: 'Đặng Văn Hải', part: 'Vận hành', department: 'Chuyên viên Kho', lotteryCode: '058' },
  { code: '00059', name: 'Bùi Thị Hiền', part: 'Vận hành', department: 'Chuyên viên Logistics', lotteryCode: '059' },
  { code: '00060', name: 'Nguyễn Văn Hưng', part: 'Vận hành', department: 'Chuyên viên Logistics', lotteryCode: '060' },

  // ===== PHÁP LÝ =====
  { code: '00061', name: 'Trần Thị Inh', part: 'Pháp lý', department: 'Trưởng phòng Pháp lý', lotteryCode: '061' },
  { code: '00062', name: 'Lê Văn Khánh', part: 'Pháp lý', department: 'Chuyên viên Pháp lý', lotteryCode: '062' },
  { code: '00063', name: 'Phạm Thị Linh', part: 'Pháp lý', department: 'Chuyên viên Hợp đồng', lotteryCode: '063' },
  { code: '00064', name: 'Hoàng Văn Mạnh', part: 'Pháp lý', department: 'Chuyên viên Tuân thủ', lotteryCode: '064' },

  // ===== TÀI CHÍNH =====
  { code: '00065', name: 'Vũ Thị Nhung', part: 'Tài chính', department: 'Giám đốc Tài chính', lotteryCode: '065' },
  { code: '00066', name: 'Đặng Văn Ổn', part: 'Tài chính', department: 'Chuyên viên Tài chính', lotteryCode: '066' },
  { code: '00067', name: 'Bùi Thị Phúc', part: 'Tài chính', department: 'Chuyên viên Ngân sách', lotteryCode: '067' },
  { code: '00068', name: 'Nguyễn Văn Quang', part: 'Tài chính', department: 'Chuyên viên Đầu tư', lotteryCode: '068' },
  { code: '00069', name: 'Trần Thị Rạng', part: 'Tài chính', department: 'Chuyên viên Kiểm soát nội bộ', lotteryCode: '069' },

  // ===== MUA HÀNG =====
  { code: '00070', name: 'Lê Văn Sáng', part: 'Mua hàng', department: 'Trưởng phòng Mua hàng', lotteryCode: '070' },
  { code: '00071', name: 'Phạm Thị Tâm', part: 'Mua hàng', department: 'Chuyên viên Mua hàng', lotteryCode: '071' },
  { code: '00072', name: 'Hoàng Văn Ước', part: 'Mua hàng', department: 'Chuyên viên Mua hàng', lotteryCode: '072' },
  { code: '00073', name: 'Vũ Thị Vân', part: 'Mua hàng', department: 'Chuyên viên Đàm phán', lotteryCode: '073' },
  { code: '00074', name: 'Đặng Văn Xanh', part: 'Mua hàng', department: 'Chuyên viên Nhà cung cấp', lotteryCode: '074' },

  // ===== HÀNH CHÍNH =====
  { code: '00075', name: 'Bùi Thị Yên', part: 'Hành chính', department: 'Trưởng phòng Hành chính', lotteryCode: '075' },
  { code: '00076', name: 'Nguyễn Văn Zin', part: 'Hành chính', department: 'Chuyên viên Hành chính', lotteryCode: '076' },
  { code: '00077', name: 'Trần Thị Ân', part: 'Hành chính', department: 'Lễ tân', lotteryCode: '077' },
  { code: '00078', name: 'Lê Văn Ấm', part: 'Hành chính', department: 'Lễ tân', lotteryCode: '078' },
  { code: '00079', name: 'Phạm Thị Ầu', part: 'Hành chính', department: 'Chuyên viên Văn phòng', lotteryCode: '079' },
  { code: '00080', name: 'Hoàng Văn Bắc', part: 'Hành chính', department: 'Bảo vệ', lotteryCode: '080' },
  { code: '00081', name: 'Vũ Văn Bến', part: 'Hành chính', department: 'Bảo vệ', lotteryCode: '081' },
  { code: '00082', name: 'Đặng Thị Bích', part: 'Hành chính', department: 'Tạp vụ', lotteryCode: '082' },

  // ===== NGHIÊN CỨU & PHÁT TRIỂN =====
  { code: '00083', name: 'Bùi Văn Cẩm', part: 'Nghiên cứu & Phát triển', department: 'Trưởng phòng R&D', lotteryCode: '083' },
  { code: '00084', name: 'Nguyễn Thị Cát', part: 'Nghiên cứu & Phát triển', department: 'Chuyên viên Nghiên cứu', lotteryCode: '084' },
  { code: '00085', name: 'Trần Văn Châu', part: 'Nghiên cứu & Phát triển', department: 'Chuyên viên Phát triển sản phẩm', lotteryCode: '085' },
  { code: '00086', name: 'Lê Thị Chiều', part: 'Nghiên cứu & Phát triển', department: 'Chuyên viên Phát triển sản phẩm', lotteryCode: '086' },
  { code: '00087', name: 'Phạm Văn Chính', part: 'Nghiên cứu & Phát triển', department: 'Chuyên viên Nghiên cứu thị trường', lotteryCode: '087' },
  { code: '00088', name: 'Hoàng Thị Cúc', part: 'Nghiên cứu & Phát triển', department: 'Chuyên viên UX Research', lotteryCode: '088' },

  // ===== CHĂM SÓC KHÁCH HÀNG =====
  { code: '00089', name: 'Vũ Văn Dần', part: 'Chăm sóc khách hàng', department: 'Trưởng nhóm CSKH', lotteryCode: '089' },
  { code: '00090', name: 'Đặng Thị Đào', part: 'Chăm sóc khách hàng', department: 'Nhân viên CSKH', lotteryCode: '090' },
  { code: '00091', name: 'Bùi Văn Điền', part: 'Chăm sóc khách hàng', department: 'Nhân viên CSKH', lotteryCode: '091' },
  { code: '00092', name: 'Nguyễn Thị Đông', part: 'Chăm sóc khách hàng', department: 'Nhân viên CSKH', lotteryCode: '092' },
  { code: '00093', name: 'Trần Văn Đức', part: 'Chăm sóc khách hàng', department: 'Nhân viên CSKH', lotteryCode: '093' },
  { code: '00094', name: 'Lê Thị Duyên', part: 'Chăm sóc khách hàng', department: 'Nhân viên CSKH', lotteryCode: '094' },
  { code: '00095', name: 'Phạm Văn Đương', part: 'Chăm sóc khách hàng', department: 'Nhân viên CSKH', lotteryCode: '095' },

  // ===== KỸ THUẬT =====
  { code: '00096', name: 'Hoàng Thị Giang', part: 'Kỹ thuật', department: 'Trưởng phòng Kỹ thuật', lotteryCode: '096' },
  { code: '00097', name: 'Vũ Văn Gia', part: 'Kỹ thuật', department: 'Kỹ sư Cơ khí', lotteryCode: '097' },
  { code: '00098', name: 'Đặng Thị Giỏi', part: 'Kỹ thuật', department: 'Kỹ sư Điện', lotteryCode: '098' },
  { code: '00099', name: 'Bùi Văn Giàu', part: 'Kỹ thuật', department: 'Kỹ sư Tự động hóa', lotteryCode: '099' },
  { code: '00100', name: 'Nguyễn Thị Gọn', part: 'Kỹ thuật', department: 'Kỹ thuật viên', lotteryCode: '100' },
  { code: '00101', name: 'Trần Văn Gừng', part: 'Kỹ thuật', department: 'Kỹ thuật viên', lotteryCode: '101' },
  { code: '00102', name: 'Lê Thị Hạnh', part: 'Kỹ thuật', department: 'Kỹ thuật viên', lotteryCode: '102' },
];

export const employees: Employee[] = rawEmployees;
