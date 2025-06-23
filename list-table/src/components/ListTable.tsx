import { Table } from 'antd';
import type { TableProps } from 'antd';

type ListTableProps<T extends object> = {
    data: T[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
    includeKeys: (keyof T)[];
    rowKey?: keyof T;
};

export function ListTable<T extends object>({
                                                data,
                                                loading,
                                                error,
                                                page,
                                                totalPages,
                                                setPage,
                                                includeKeys,
                                                rowKey,
                                            }: ListTableProps<T>) {

    const columns: TableProps<T>['columns'] = includeKeys.map((key) => ({
        title: String(key).toUpperCase(),
        dataIndex: key as string,
        key: String(key),
    }));

    const dataSource = data.map((item, index) => ({
        ...item,
        key: rowKey && item[rowKey] ? String(item[rowKey]) : index,
    }));

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (data.length === 0) return <p>No data available</p>;

    return (
        <Table<T>
            columns={columns}
            dataSource={dataSource}
            pagination={{
                current: page,
                total: totalPages * 10,
                pageSize: 10,
                onChange: (page) => setPage(page),
                showSizeChanger: false,
            }}
            bordered
        />
    );
}
