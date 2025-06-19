type ListTableProps<T> = {
    data: T[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
    includeKeys: (keyof T)[];
};

export function ListTable<T>({
                                 data,
                                 loading,
                                 error,
                                 page,
                                 totalPages,
                                 setPage,
                                 includeKeys,
                             }: ListTableProps<T>) {
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (data.length === 0) return <p>No data available</p>;

    return (
        <div>
            <table border={1} cellPadding={5}>
                <thead>
                <tr>
                    {includeKeys.map((key) => (
                        <th>{String(key)}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        {includeKeys.map((key) => (
                            <td>
                                {String(item[key])}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{ marginTop: 10 }}>
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                <span style={{ margin: '0 10px' }}>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
}
