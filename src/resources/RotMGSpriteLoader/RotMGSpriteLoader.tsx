import { Object } from "./object";
import { Page, RotMGObject } from "./page";

export class RotMGSpriteLoader {
  private static readonly OBJECTS_JSON_URL: string = process.env.NEXT_PUBLIC_SPRITE_JSON_URL!;
  private static globalObjects: RotMGObject[] | null = null;
  private static objectLoadPromise: Promise<void> | null = null;

  private readonly pageSize: number;
  private pages: Page[] = [];

  constructor(pageSize: number) {
    this.pageSize = pageSize;
  }

  static async preloadAll(): Promise<void> {
    if (RotMGSpriteLoader.objectLoadPromise) {
      return RotMGSpriteLoader.objectLoadPromise;
    }

    RotMGSpriteLoader.objectLoadPromise = fetch(RotMGSpriteLoader.OBJECTS_JSON_URL)
      .then((result) => result.json())
      .then((objectsJSON: { Object: RotMGObject[] }) => {
        RotMGSpriteLoader.globalObjects = objectsJSON.Object.filter((object) => {
          const texture = object.Texture || object.AnimatedTexture;
          const notInvisible = texture && texture.File !== "invisible";
          return texture && notInvisible;
        });
      });

    return RotMGSpriteLoader.objectLoadPromise;
  }

  isLoaded(): boolean {
    return RotMGSpriteLoader.globalObjects !== null;
  }

  waitLoad(): Promise<void> {
    return RotMGSpriteLoader.preloadAll();
  }

  private initializePages(): void {
    if (!RotMGSpriteLoader.globalObjects) {
      throw new Error("Global objects not loaded.");
    }

    const totalPages = this.getTotalPages();

    for (let index = 0; index < totalPages; index++) {
      const startIndex = index * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      const objects = RotMGSpriteLoader.globalObjects.slice(startIndex, endIndex);
      const page = new Page(index, objects);
      this.pages.push(page);
    }
  }

  private getTotalPages(): number {
    if (!RotMGSpriteLoader.globalObjects) {
      throw new Error("Global objects not loaded.");
    }
    return Math.ceil(RotMGSpriteLoader.globalObjects.length / this.pageSize);
  }

  getPage(index: number): Page {
    if (this.pages.length === 0) {
      this.initializePages();
    }
    return this.pages.at(index % this.pages.length) as Page;
  }

  query(tags: string[], type: string): Object[] {
    if (this.pages.length === 0) {
      this.initializePages();
    }

    const resultObjects: Object[] = [];

    this.pages.forEach((page) => {
      const matches = page.query(tags, type);
      resultObjects.push(...matches);
    });

    return resultObjects;
  }
}
