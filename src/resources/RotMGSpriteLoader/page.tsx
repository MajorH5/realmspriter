import { Object } from "./object";

export interface RotMGObject {
  id: string;
  Class: string;
  Texture?: { File: string; Index: string };
  AnimatedTexture?: { File: string; Index: string };
  DisplayId?: string;
}

export class Page {
  private readonly pageIndex: number;
  private readonly objects: Object[];
  private readonly pageSize: number;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;

  constructor(pageIndex: number, objects: RotMGObject[], parseObjects: boolean = true) {
    this.pageIndex = pageIndex;
    this.objects = parseObjects ? this.parseObjects(objects) : (objects as unknown as Object[]);
    this.pageSize = objects.length;
  }

  async load(): Promise<void> {
    if (this.isLoaded || this.isLoading) return;

    this.isLoading = true;

    await Promise.all(this.objects.map((object) => object.load()));

    // Even after await, not all might be loaded due to potential 404 errors on textures
    this.isLoaded = true;
    this.isLoading = false;
  }

  private parseObjects(objects: RotMGObject[]): Object[] {
    const parsed: Object[] = [];

    for (const rawObject of objects) {
      const { id, Class, Texture, AnimatedTexture, DisplayId } = rawObject;
      const texture = Texture || AnimatedTexture;

      if (!texture) {
        // Cannot find sprite in this case, skip this object
        continue;
      }

      const object = new Object(
        texture.File,
        texture.Index,
        id,
        DisplayId || id,
        Class,
        !!AnimatedTexture
      );

      parsed.push(object);
    }

    return parsed;
  }

  query(tags: string[], type: string): Object[] {
    const results: Object[] = [];

    for (const object of this.objects) {
      const matches =
        tags.length === 0 ||
        tags.some((tag) =>
          object.objectId.toLowerCase().includes(tag.toLowerCase()) ||
          object.displayId.toLowerCase().includes(tag.toLowerCase())
        );

      if (object.isType(type) && matches) {
        results.push(object);
      }
    }

    return results;
  }
}
