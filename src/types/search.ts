export type SearchItem = {
  highlighted: string;
  text: string;
  verse_key: string;
  verse_id: number;
  words: SearchWord[];
};

export type SearchWord = {
  char_type: string;
  text: string;
  highlight?: boolean;
};

export type Search = {
  current_page: number;
  query: string;
  total_pages: number;
  total_results: number;
  results: SearchItem[];
};
