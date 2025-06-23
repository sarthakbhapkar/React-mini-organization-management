import {useListTable} from "./useListTable.ts";

export type Product = {
    id: number;
    title: string;
    description: string;
    category: string;
};

export function useProduct() {
    return useListTable<Product>({
        url: 'https://dummyjson.com/products',
        limit: 10,
        dataKey: 'products',
    });
}