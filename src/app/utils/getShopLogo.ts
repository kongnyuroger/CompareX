export function getShopLogo(source: string): string {
  const sourceLower = source.toLowerCase();

  if (sourceLower.includes("amazon")) {
    return "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg";
  } else if (sourceLower.includes("walmart")) {
    return "https://upload.wikimedia.org/wikipedia/commons/5/5b/Walmart_logo_%282025%29.svg";
  } else if (sourceLower.includes("ebay")) {
    return "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg";
  }
  return "";
}
