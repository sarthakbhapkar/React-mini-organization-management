import {useEffect, useState} from 'react';

export function usePagination(initialPage = 1, itemsPerPage = 5) {
    const [page, setPage] = useState(initialPage);
    const [totalItems, setTotalItems] = useState(1);
    const limit = itemsPerPage;

    const totalPages = Math.ceil(totalItems / limit);

    const updateTotal = (total: number) => {
        setTotalItems(total);
    };

    useEffect(() => {
        if (page > totalPages) {
            setPage(Math.max(1, totalPages));
        }
    }, [page, totalPages]);

    return {
        page,
        limit,
        totalPages,
        setPage,
        updateTotal,
    };
}
