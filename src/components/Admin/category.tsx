import React from 'react'
import { Table, Button } from 'antd'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'

function CategoryList() {
    const queryClient = useQueryClient()

    const getAll = async () => {
        const { data } = await axios.get('http://localhost:3000/categories')
        return data
    }

    const { data, isLoading } = useQuery({
        queryKey: ["category"],
        queryFn: getAll
    })

    const delPro = async (id: any) => {
        if (confirm('Ban chac chan muon xoa?')) {
            await axios.delete(`http://localhost:3000/categories/${id}`)
            queryClient.invalidateQueries('category')
        }
    }

    const columns = [
        {
            title: 'STT',
            render: (_: any, record: any, index: number) => index + 1,  // Hiển thị số thứ tự
            width: '5%',
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description"
        },
        {
            title: "Actions",
            render: (category: any) => (
                <>
                    <Button type="primary" style={{ marginRight: 8 }}>
                        <Link to={`/admin/category/${category.id}/edit`}>Edit</Link>
                    </Button>
                    <Button type="dashed" onClick={() => delPro(category.id)} style={{ marginRight: 8 }}>
                        Delete
                    </Button>
                </>
            ),
            width: '15%',
        }
    ]

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary">
                    <Link to="/admin/category/add">Add category</Link>
                </Button>
            </div>
            <Table 
    dataSource={data?.slice().reverse()} 
    columns={columns} 
    loading={isLoading} 
    scroll={{ y: "calc(100vh - 250px)" }} 
    rowKey="id" 
/>

        </>
    )
}

export default CategoryList
