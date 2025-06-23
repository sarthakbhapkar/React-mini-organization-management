import { useListTable } from './useListTable';

export type Post = {
    id: number;
    title: string;
    body: string;
    userId: number;
};

export function usePost() {
    return useListTable<Post>({
        url: 'https://dummyjson.com/posts',
        limit: 10,
        dataKey: 'posts',
    });
}