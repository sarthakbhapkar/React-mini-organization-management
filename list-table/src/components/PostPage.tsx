import { useListTable } from '../hooks/useListTable';
import { ListTable } from './ListTable';

type Post = {
    id: number;
    title: string;
    body: string;
};

export default function PostPage() {
    const {
        data,
        loading,
        error,
        page,
        totalPages,
        setPage,
    } = useListTable<Post>({
        url: 'https://dummyjson.com/posts',
        limit: 5,
        dataKey:'posts'
    });

    return (
        <ListTable<Post>
            data={data}
            loading={loading}
            error={error}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            includeKeys={['id', 'title', 'body']}
        />
    );
}
