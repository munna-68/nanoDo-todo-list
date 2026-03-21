function pad2(value) {
  return String(value).padStart(2, "0");
}

function isValidDateParts(month, day, year) {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function parseDateParts(dateValue) {
  if (!dateValue) return null;

  const trimmed = String(dateValue).trim();
  if (!trimmed) return null;

  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);

    if (isValidDateParts(month, day, year)) {
      return { month, day, year };
    }

    return null;
  }

  const slashMatch = trimmed.match(
    /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2}|\d{4})$/,
  );
  if (slashMatch) {
    const month = Number(slashMatch[1]);
    const day = Number(slashMatch[2]);
    const year =
      slashMatch[3].length === 2
        ? 2000 + Number(slashMatch[3])
        : Number(slashMatch[3]);

    if (isValidDateParts(month, day, year)) {
      return { month, day, year };
    }

    return null;
  }

  return null;
}

export function getDateParts(dateValue) {
  return parseDateParts(dateValue);
}

export function normalizeDateInputValue(dateValue) {
  const parts = parseDateParts(dateValue);
  if (!parts) {
    return dateValue ? String(dateValue).trim() : "";
  }

  return `${pad2(parts.month)}/${pad2(parts.day)}/${parts.year}`;
}

export function normalizeDateForStorage(dateValue) {
  const parts = parseDateParts(dateValue);
  if (!parts) return null;

  return `${pad2(parts.month)}/${pad2(parts.day)}/${String(parts.year).slice(-2)}`;
}

export function formatDateDisplay(dateValue) {
  const normalized = normalizeDateInputValue(dateValue);
  return normalized || "Set Date";
}
