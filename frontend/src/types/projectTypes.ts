export type Note = {
    id: string;
    pitch: number;
    time: number;
    duration: number;
    velocity: number;
  };
  
  export type Track = {
    id: string;
    name: string;
    notes: Note[];
    instrument: string;
    customSoundUrl?: string;
  };
  
  export type Project = {
    id: string;
    name: string;
    tracks: Track[];
    createdAt: string;
    updatedAt: string;
  };
  