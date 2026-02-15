import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Account {
  id: number;
  username: string;
  email: string;
  salt: Uint8Array;
  verifier: Uint8Array;
  joindate: string;
  last_ip: string;
  expansion: number;
}

export interface Realm {
  id: number;
  name: string;
  flag: number;
  population: number;
}

export interface ServerStatus {
  online: boolean;
  realmName: string;
}

export interface ServerStats {
  onlineCount: number;
  totalAccounts: number;
  alliance: number;
  horde: number;
}

export interface News {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsRow {
  id: number;
  title_en: string;
  title_fr: string;
  title_es: string;
  title_de: string;
  title_it: string;
  content_en: string;
  content_fr: string;
  content_es: string;
  content_de: string;
  content_it: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Character {
  guid: number;
  name: string;
  race: number;
  class: number;
  level: number;
  gender: number;
  online: number;
  totaltime: number;
  zone: number;
}

export interface AccountInfo {
  id: number;
  username: string;
  email: string;
  joindate: string;
  last_ip: string;
  expansion: number;
}

export interface JWTPayload {
  id: number;
  username: string;
}
