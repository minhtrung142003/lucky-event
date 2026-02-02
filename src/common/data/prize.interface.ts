export interface Prize {
  id: string;
  name: string; // Tên giải (Giải Đặc Biệt, Giải Nhất, ...)
  description: string; // Tên quà tặng
  quantity: number; // Số lượng giải
  order: number; // Thứ tự ưu tiên (VD: giải khuyến khích quay trước, đặc biệt quay sau)
}

/**
 * Record of a single award ceremony session
 * Saved each time COMPLETE_CEREMONY is triggered
 */
export interface AwardHistoryEntry {
  id: string; // Unique ID (timestamp-based)
  prizeId: string; // ID of the prize
  prizeName: string; // Name of the prize for display
  prizeDescription: string; // Prize description/gift name
  timestamp: number; // When the ceremony was completed
  winners: AwardHistoryWinner[]; // Snapshot of winners in this session
}

export interface AwardHistoryWinner {
  employeeCode: string;
  employeeName: string;
  department: string;
  part: string;
  lotteryCode: string;
}
