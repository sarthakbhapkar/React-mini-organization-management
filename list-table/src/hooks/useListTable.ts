import { useEffect, useState } from 'react';

type UseListTableProps = {
    url: string;
    limit?: number;
    dataKey?: string;
};

export function useListTable<T>({ url, limit = 10, dataKey = '' }: UseListTableProps) {
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const skip = (page - 1) * limit;
            const res = await fetch(`${url}?limit=${limit}&skip=${skip}`);
            const json = await res.json();

            const extracted = dataKey ? json[dataKey] : json;
            setData(extracted);
            setTotal(json.total || extracted.length);
            setError(null);
        } catch (err) {
            setError('Failed to load data');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const totalPages = Math.ceil(total / limit);

    return {
        data,
        loading,
        error,
        page,
        totalPages,
        setPage,
    };
}
