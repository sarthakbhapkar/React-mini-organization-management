import { ListTable } from './ListTable.tsx';
import {usePost} from "../hooks/usePost.ts";

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
    } = usePost();

    return (
        <ListTable<Post>
            data={data}
            loading={loading}
            error={error}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            includeKeys={['id', 'title', 'body']}
            rowKey="id"
        />
    );
}
