import { useCallback } from "react";
import { Page } from "@/resources/RotMGSpriteLoader/page";
import { RotMGSpriteLoader } from "@/resources/RotMGSpriteLoader/RotMGSpriteLoader";
// import { Posts } from "../api/posts";
// import { Post } from "./post";

interface SearchPostsResult {
    posts: Post[];
    total: number;
}

export interface Sprite {
    objectId: string;
    displayId: string;
}

export type Domain = "Deca" | "Community" | "Mine" | "All";

export function useQuery(spriteLoader: RotMGSpriteLoader) {

    const searchMyPosts = useCallback(
        async (
            tags: string,
            type: string,
            offset: number
        ): Promise<SearchPostsResult> => {
            const results = await Posts.getPosts(true, tags, type, offset);
            results.posts = results.posts.map((post: any) => new Post(post));
            return results;
        },
        []
    );

    const searchAllPosts = useCallback(
        async (
            tags: string,
            type: string,
            offset: number
        ): Promise<SearchPostsResult> => {
            const results = await Posts.getPosts(false, tags, type, offset);
            results.posts = results.posts.map((post: any) => new Post(post));
            return results;
        },
        []
    );

    const divideObjects = useCallback((objects: any[], pageSize: number): Page[] => {
        const pages: Page[] = [];
        const totalPages = Math.ceil(objects.length / pageSize);

        for (let i = 0; i < totalPages; i++) {
            const startIndex = i * pageSize;
            const pageItems = objects.slice(startIndex, startIndex + pageSize);
            pages.push(new Page(i, pageItems, false));
        }

        return pages;
    }, []);


    const getSpriteQuery = (tags: string, type: string): any[] => {
        return spriteLoader.query(tags.split(", "), type);
    };


    const createPostPage = async (
        searchFn: (tags: string, type: string, offset: number) => Promise<SearchPostsResult>,
        tags: string,
        type: string,
        pageIndex: number,
        objectsPerPage: number
    ): Promise<[Page, number]> => {
        const offset = pageIndex * objectsPerPage;
        const { posts, total } = await searchFn(tags, type, offset);
        const page = new Page(pageIndex, posts, false);
        return [page, Math.ceil(total / objectsPerPage)];
    };


    const searchAllDomain = async (
        tags: string,
        type: string,
        pageIndex: number,
        objectsPerPage: number
    ): Promise<[Page | undefined, number]> => {
        let objects = getSpriteQuery(tags, type);
        const spriteCount = objects.length;
        const totalRealmPages = Math.ceil(spriteCount / objectsPerPage) + 1;
        const normalizedIndex = ((pageIndex % totalRealmPages) + totalRealmPages) % totalRealmPages;

        if ((normalizedIndex + 1) * objectsPerPage > spriteCount) {
            const placeholdersNeeded = (normalizedIndex + 1) * objectsPerPage - spriteCount;
            let startOffset = placeholdersNeeded - objectsPerPage;
            if (startOffset < 0) startOffset = 0;

            objects = [...objects, ...new Array(startOffset).fill(null)];

            const { posts } = await searchAllPosts(tags, type, startOffset);
            objects = [...objects, ...posts];
        }

        const pages = divideObjects(objects, objectsPerPage);
        const totalPages = pages.length;
        const finalIndex = totalPages > 0 ? ((pageIndex % totalPages) + totalPages) % totalPages : 0;
        return [pages.at(finalIndex), totalPages];
    };


    const search = useCallback(
        async (
            domain: Domain,
            type: string,
            tags: string,
            pageIndex: number = 0
        ): Promise<[Page | undefined, number]> => {
            const OBJECTS_PER_PAGE = 15;

            switch (domain) {
                case "Deca": {
                    const objects = getSpriteQuery(tags, type);
                    const pages = divideObjects(objects, OBJECTS_PER_PAGE);
                    const totalPages = pages.length;
                    const finalIndex = totalPages ? ((pageIndex % totalPages) + totalPages) % totalPages : 0;
                    return [pages.at(finalIndex), totalPages];
                }
                case "Community":
                    return await createPostPage(searchAllPosts, tags, type, pageIndex, OBJECTS_PER_PAGE);
                case "Mine":
                    return await createPostPage(searchMyPosts, tags, type, pageIndex, OBJECTS_PER_PAGE);
                case "All":
                    return await searchAllDomain(tags, type, pageIndex, OBJECTS_PER_PAGE);
                default:
                    throw new Error("Invalid search domain");
            }
        },
        [divideObjects, searchAllPosts, searchMyPosts]
    );

    return { searchMyPosts, searchAllPosts, divideObjects, search };
}
