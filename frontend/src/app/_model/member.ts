import { Photo } from "./photo";


export interface Member {
  userName: string;
  gender: string;
  dateOfBirth: string;
  knownAs: string;
  photoUrl: string;
  created: string;
  lastActive: string;
  introduction: string;
  lookingFor: string;
  interests: string;
  city: string;
  country: string;
  age: string;
  photos: Photo[];
}

