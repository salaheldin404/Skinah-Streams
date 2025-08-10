export interface Radio {
  id: number;
  name: string;
  url: string;
  recent_date?: string;
}

export interface Station {
  name: {
    en: string;
    ar: string;
  };
  url: string;
  id: number;
  image_url?: string;
}

export interface Category {
  category_id: string;
  category_name: {
    ar: string;
    en: string; // Assuming 'en' name might also exist
  };
  stations: Station[];
}
