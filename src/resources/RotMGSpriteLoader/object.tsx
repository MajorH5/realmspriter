interface Frame {
    size: { x: number, y: number };
    pixels: Uint8ClampedArray;
    canvas: HTMLCanvasElement;
    isProcessed: boolean;
}

export class Object {
    static BASE_TEXTURES_URL: string = process.env.NEXT_PUBLIC_SPRITE_TEXTURE_URL!;

    textureUrl: string;
    textureIndex: number;
    rawTextureUrl: string;
    objectId: string;
    displayId: string;
    objectClass: string;
    isAnimatedTexture: boolean;
    ownerId: string | null;
    isLoaded: boolean = false;
    isLoading: boolean = false;
    texture: HTMLImageElement | null = null;

    constructor(
        rawTextureUrl: string,
        rawTextureIndex: string,
        objectId: string,
        displayId: string,
        objectClass: string,
        isAnimatedTexture: boolean,
        ownerId: string | null = null
    ) {
        this.textureUrl = this.parseTextureUrl(rawTextureUrl);
        this.textureIndex = this.parseTextureIndex(rawTextureIndex);
        this.rawTextureUrl = rawTextureUrl;
        this.objectId = objectId;
        this.displayId = displayId;
        this.objectClass = objectClass;
        this.isAnimatedTexture = isAnimatedTexture;
        this.ownerId = ownerId;
    }

    async load(): Promise<HTMLImageElement | null> {
        if (this.isLoaded || this.isLoading) return null;

        this.isLoading = true;

        try {
            // const texture = await Sprite.getImage(this.textureUrl);
            this.isLoading = false;
            this.isLoaded = true;
            // this.texture = texture;
            // return texture;
            return null;
        } catch (error) {
            this.isLoading = false;
            return null; // TODO: Handle errors more robustly if needed
        }
    }

    isType(type: string): boolean {
        if (type === "Any Type") return true;

        const lookup: Record<string, string> = {
            Equipment: "Items",
            Character: "Entities",
            GameObject: "Objects",
            Pet: "Character",
            ConnectedWall: "Tiles",
            Wall: "Tiles",
            Portal: "Objects",
            SpiderWeb: "Tiles",
            Player: "Character",
            CaveWall: "Tiles",
            Projectile: "Objects",
            CharacterChanger: "Objects",
            YardUpgrader: "Objects",
            ReskinVendor: "Objects",
            GuildBoard: "Objects",
            GuildChronicle: "Objects",
            Stalagmite: "Tiles",
            Sign: "Objects",
            Dye: "Items",
            ClosedVaultChest: "Objects",
        };

        return lookup[this.objectClass] === type;
    }

    private parseTextureIndex(rawIndex: string): number {
        const isHex = rawIndex.includes("x");
        return parseInt(rawIndex, isHex ? 16 : 10);
    }

    private parseTextureUrl(rawTextureUrl: string): string {
        let formedUrl = `${Object.BASE_TEXTURES_URL}/${rawTextureUrl}.png`;

        formedUrl = formedUrl.replace("Embed", "").replace("new", "b").replace("skins", "sSkins");

        if (rawTextureUrl.includes("chars") && rawTextureUrl.indexOf("chars") !== 0) {
            formedUrl = formedUrl.replace("chars", "Chars");
        }

        if (rawTextureUrl.includes("8x8") && (!rawTextureUrl.includes("Chars") && !rawTextureUrl.includes("Objects"))) {
            formedUrl = formedUrl.replace("8x8", "");
        }

        if (rawTextureUrl.includes("16x16") && (!rawTextureUrl.includes("Chars") && !rawTextureUrl.includes("Objects"))) {
            formedUrl = formedUrl.replace("16x16", "");
        }

        if (rawTextureUrl.includes("16x8") && (!rawTextureUrl.includes("Chars") && !rawTextureUrl.includes("Objects"))) {
            formedUrl = formedUrl.replace("16x8", "");
        }

        return formedUrl;
    }

    getTextureRect(): [{x:number,y:number}, {x:number,y:number}] {
        if (!this.isLoaded || !this.texture) {
            throw new Error("Object texture must be loaded before rect can be determined.");
        }

        let width = 8;
        let height = 8;

        const is16x8 = this.rawTextureUrl.includes("16x8");
        const is16x16 =
            this.rawTextureUrl.includes("16x16") ||
            this.rawTextureUrl.includes("16") ||
            this.rawTextureUrl.includes("Big") ||
            this.rawTextureUrl.includes("Divine");
        const is8x8 = this.rawTextureUrl.includes("8x8");
        const is32x32 = this.rawTextureUrl.includes("32x32");

        if (is32x32) {
            width = 32;
            height = 32;
        } else if (is16x8) {
            width = 16;
            height = 8;
        } else if (is16x16) {
            width = 16;
            height = 16;
        }

        const spritesX = this.texture.width / width;
        const sourceX = (this.textureIndex % spritesX) * width;
        const sourceY = Math.floor(this.textureIndex / spritesX) * height;

        return [{ x: sourceX, y: sourceY }, { x: width, y: height }];
    }

    getTextureFrames(): Frame[] {
        if (!this.isLoaded || !this.texture) {
            return [{ pixels: new Uint8ClampedArray(0), size: { x: 0, y: 0 }, canvas: document.createElement("canvas"), isProcessed: false }];
        }

        const [imageRectOffset, imageRectSize] = this.getTextureRect();
        const frames: Frame[] = [];

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;

        canvas.width = imageRectSize.x;
        canvas.height = imageRectSize.y;

        context.drawImage(
            this.texture,
            imageRectOffset.x,
            imageRectOffset.y,
            imageRectSize.x,
            imageRectSize.y,
            0,
            0,
            imageRectSize.x,
            imageRectSize.y
        );

        const imageData = context.getImageData(0, 0, imageRectSize.x, imageRectSize.y);
        const pixels = imageData.data;

        frames.push({ size: imageRectSize, pixels, canvas, isProcessed: false });
        return frames;
    }
}
