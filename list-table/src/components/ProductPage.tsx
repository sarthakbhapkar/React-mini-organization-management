import { ListTable } from './ListTable.tsx';
import {useProduct} from "../hooks/useProduct.ts";

type Product = {
    id: number;
    title: string;
    description: string;
    category: string;
};

export default function ProductPage() {
    const {
        data,
        loading,
        error,
        page,
        totalPages,
        setPage,
    } = useProduct();

    return (
        <ListTable<Product>
            data={data}
            loading={loading}
            error={error}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            includeKeys={['id', 'title', 'description', 'category']}
            rowKey="id"
        />
    );
}
