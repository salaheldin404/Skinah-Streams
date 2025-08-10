import groupBy from "lodash/groupBy";
import { Verse, VerseTiming } from "@/types/verse";
import { Word } from "@/types/word";

export const groupVersesByPage = (verses: Verse[]) => {
  if (!verses || verses.length === 0) {
    return {};
  }
  const versesData = groupBy(verses, (verse) => verse.page_number);

  return versesData;
  // return verses.reduce((acc: Record<string, Verse[]>, verse) => {
  //   const page = verse.page_number;
  //   if (!acc[page]) {
  //     acc[page] = [];
  //   }
  //   acc[page].push(verse);
  //   return acc;
  // }, {} as Record<string, Verse[]>);
};

const getVerseWords = (verse: Verse) => verse.words;

export const groupLinesByVerses = (verses: Verse[]) => {
  const words = verses.flatMap((verse) => getVerseWords(verse));
  const lines = groupBy(
    words,
    (word) => `page${word.page_number}-line${word.line_number}`
  );

  return lines;
};

export const groupLinsByPage = (verses: Verse[]) => {
  const lines = groupLinesByVerses(verses);
  return groupBy(lines, (line) => line[0].page_number);
};

export const groupLinesByPage = (verses: Verse[]) => {
  // 1. Flatten all verses into a single array of words.
  const words = verses.flatMap((verse) => getVerseWords(verse));

  // 2. Group these words into lines based on their page and line number using lodash's groupBy.
  // The result is an object where keys are like "page1-line1", "page1-line2", etc.,
  // and values are the array of words belonging to that line.
  const lines = groupBy(
    words,
    (word) => `page${word.page_number}-line${word.line_number}`
  );

  // 3. Group the generated lines by page.
  // We use `Object.keys(lines).reduce(...)` to iterate over each line key (e.g., "page1-line1")
  // and build a new object structured by page.
  const pages = Object.keys(lines).reduce((accumulator, currentLineKey) => {
    // Get the first word of the line to determine the page number.
    // We can be sure all words in a line have the same page number.
    const firstWordOfLine = lines[currentLineKey][0];

    // If for some reason a line is empty, skip it.
    if (!firstWordOfLine) {
      return accumulator;
    }

    // Create a page key, e.g., "page1".
    const pageKey = `page${firstWordOfLine.page_number}`;

    // If this is the first time we've seen this page,
    // initialize an empty object for it in our accumulator.
    if (!accumulator[pageKey]) {
      accumulator[pageKey] = {};
    }

    // Add the current line (and its array of words) to the correct page.
    accumulator[pageKey][currentLineKey] = lines[currentLineKey];

    // Return the accumulator for the next iteration.
    return accumulator;
  }, {} as { [pageKey: string]: { [lineKey: string]: Word[] } }); // Start with an empty object.

  return pages;
};

export const getCurrentVerse = (
  timestamps: VerseTiming[],
  currentTime: number
) => {
  if (!timestamps.length) return null;

  const currentTimeInMS = currentTime * 1000;
  let low = 0;
  let high = timestamps.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const { timestamp_from, timestamp_to } = timestamps[mid];
    if (timestamp_from <= currentTimeInMS && timestamp_to >= currentTimeInMS) {
      return timestamps[mid];
    } else if (currentTimeInMS < timestamp_from) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return null;
};

export const getVerseByKey = (
  verseKey: string,
  timestamps: Map<string, VerseTiming>
) => {
  if (!verseKey) return null;
  return timestamps.get(verseKey) || null;
};
