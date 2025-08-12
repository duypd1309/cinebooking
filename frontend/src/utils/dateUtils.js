export const formatDate = (isoString, formatType = "dd-MM-yyyy") => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0"); // Định dạng 2 chữ số
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  return formatType === "yyyy-MM-dd"
    ? `${year}-${month}-${day}` // Format cho <input type="date">
    : `${day}-${month}-${year}`; // Format hiển thị thông thường
};
