// Generate a slug from product name and append ID as query parameter
export function generateSlug(name: string, id?: string): string {
  // Use the product name exactly as it is, just replace spaces with hyphens
  const slug = name.trim().replace(/\s+/g, "-");
  // Append ID as query parameter if provided
  return id ? `${encodeURIComponent(slug)}?id=${id}` : encodeURIComponent(slug);
}

// Extract ID from query parameter (not needed in this case but kept for compatibility)
export function extractIdFromSlug(slug: string): string | null {
  // Check if slug contains query parameter
  const queryMatch = slug.match(/[?&]id=([^&]*)/);
  if (queryMatch) {
    const id = queryMatch[1];
    // Validate ID (assuming MongoDB ObjectId format: 24 hex characters)
    if (/^[a-f0-9]{24}$/i.test(id)) {
      return id;
    }
  }
  return null;
}
