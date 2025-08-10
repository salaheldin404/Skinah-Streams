import { VerseTiming } from "./verse";

export interface AudioResponse {
  url: string;
  segments?: [];
  duration?: number;
  format?: string;
}

export interface AudioData {
  audio_url: string;
  format?: string;
  chapter_id: number;
  file_size?: number;
  timestamps: VerseTiming[];
}
