export const normalizeBrandName = (name: string): string => {
    if (!name) return "";
    return name
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
