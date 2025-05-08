import dayjs from "dayjs";
import "dayjs/locale/th"; // ป้องกัน fallback
dayjs.locale("th");       // สำรองอีกครั้ง เฉพาะ helper นี้
/**
 * แสดงวันที่แบบ 1 ม.ค. 2025
 */
export const formatThaiDate = (date: string | Date) => {
  return dayjs(date).format("D MMM YYYY");
};
