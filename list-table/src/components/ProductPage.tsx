import { useListTable } from '../hooks/useListTable';
import { ListTable } from './ListTable';

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
    } = useListTable<Product>({
        url: 'https://dummyjson.com/products',
        limit: 10,
        dataKey: 'products',
    });

    return (
        <ListTable<Product>
            data={data}
            loading={loading}
            error={error}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            includeKeys={['id', 'title', 'description', 'category']}
        />
    );
}
