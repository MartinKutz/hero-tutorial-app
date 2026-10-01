export type HeroClassification = 'PUBLIC' | 'CLASSIFIED';

export interface Hero {
  id: number;
  name: string;
  classification?: HeroClassification;
  description?: string;
}
