import type { LastRead } from '@/types/surah';

/**
 * Validates that data conforms to LastRead type structure
 * Use this when saving/reading lastRead from database
 */
export function validateLastRead(data: LastRead): LastRead {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid LastRead: must be an object');
  }


  // Validate required fields
  if (data.chapter_id === undefined || data.chapter_id === null) {
    throw new Error('Invalid LastRead: missing chapter_id');
  }

  if (typeof data.verse_number !== 'number') {
    throw new Error('Invalid LastRead: verse_number must be a number');
  }

  if (typeof data.verse_key !== 'string') {
    throw new Error('Invalid LastRead: verse_key must be a string');
  }

  if (typeof data.page_number !== 'number') {
    throw new Error('Invalid LastRead: page_number must be a number');
  }

  if (typeof data.qpc_uthmani_hafs !== 'string') {
    throw new Error('Invalid LastRead: qpc_uthmani_hafs must be a string');
  }

  return {
    chapter_id: data.chapter_id as number | string,
    verse_number: data.verse_number,
    verse_key: data.verse_key,
    page_number: data.page_number,
    qpc_uthmani_hafs: data.qpc_uthmani_hafs,
  };
}
