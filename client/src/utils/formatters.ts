/**
 * Formats any raw member number into the official Sovereign Men's Club ID format:
 * MAN 001
 *
 * Handles:
 * - "sp/meaza/0001" -> "MAN 001"
 * - "pr/habtemariam/0001" -> "MAN 001"
 * - "SOV-001" -> "MAN 001"
 * - "SOV-014" -> "MAN 014"
 * - "MAN 001" -> "MAN 001"
 * - "1" -> "MAN 001"
 */
export function formatMemberId(rawId?: string | null): string {
  if (!rawId) return 'MAN 001';
  const trimmed = rawId.trim();

  // If already matching "MAN 001" / "MAN-001" / "MAN001"
  const manMatch = trimmed.match(/^MAN[\s\-_#]*([0-9]+)$/i);
  if (manMatch) {
    const num = parseInt(manMatch[1], 10);
    return `MAN ${String(num).padStart(3, '0')}`;
  }

  // If it's a slash path like "sp/meaza/0001" or "pr/habtemariam/0001"
  const slashMatch = trimmed.match(/\/([0-9]+)$/);
  if (slashMatch) {
    const num = parseInt(slashMatch[1], 10);
    return `MAN ${String(num).padStart(3, '0')}`;
  }

  // If it starts with SOV, PR, SP, or MEMB followed by numbers
  const prefixMatch = trimmed.match(/^(?:SOV|MEMB|SP|PR)[\s\-_#]*([0-9]+)$/i);
  if (prefixMatch) {
    const num = parseInt(prefixMatch[1], 10);
    return `MAN ${String(num).padStart(3, '0')}`;
  }

  // Any string ending in numbers
  const endNumMatch = trimmed.match(/(\d+)$/);
  if (endNumMatch) {
    const num = parseInt(endNumMatch[1], 10);
    return `MAN ${String(num).padStart(3, '0')}`;
  }

  return 'MAN 001';
}
