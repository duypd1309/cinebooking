// utils/pagination.js

export const getPaginationRange = (totalPages, currentPage, delta = 2) => {
  const range = [];
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  range.push(1); // Luôn có trang đầu

  if (left > 2) range.push("...");

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < totalPages - 1) range.push("...");

  if (totalPages > 1) range.push(totalPages); // Luôn có trang cuối

  return range;
};
