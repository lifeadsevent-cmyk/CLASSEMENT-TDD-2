
export interface PlayerData {
  rank: number;
  name: string;
  donations: number;
  vs: number;
  power: number;
  noteDonations: number;
  noteVs: number;
  noteForce: number;
  scoreFinal: number;
}

export interface AverageStats {
  donations: number;
  vs: number;
  power: number;
}

export type SortKey = keyof PlayerData;
export type SortOrder = 'asc' | 'desc';
