import React from 'react'
import { Table, Button } from 'antd'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'

function ProductList() {
    const queryClient = useQueryClient()

    const getAll = async () => {
        const { data } = await axios.get('http://localhost:3000/products')
        return data
    }

    const { data, isLoading } = useQuery({
        queryKey: ["product"],
        queryFn: getAll
    })

    const delPro = async (id: any) => {
        if (confirm('Ban chac chan muon xoa?')) {
            await axios.delete(`http://localhost:3000/products/${id}`)
            queryClient.invalidateQueries('product')
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
            title: "Brand",
            dataIndex: "brand",
            key: "brand"
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price: number) => `$${price}`
        },
        {
            title: "Sale Price",
            dataIndex: "sale",
            key: "sale",
            render: (sale: number) => `$${sale}`
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock"
        },
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (imgUrl: string) => <img src={imgUrl} alt="Product Image" width={100} />
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description"
        },
        {
            title: "Category",
            dataIndex: "categoryId",
            key: "categoryId"
        },
        {
            title: "Actions",
            render: (product: any) => (
                <>
                    <Button type="primary" style={{ marginRight: 8 }}>
                        <Link to={`/product/${product.id}/edit`}>Edit</Link>
                    </Button>
                    <Button type="dashed" onClick={() => delPro(product.id)} style={{ marginRight: 8 }}>
                        Delete
                    </Button>
                    <Button type="default">
                        <Link to={`/product/${product.id}`}>Details</Link>
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
                    <Link to="/admin/product/add">Add Product</Link>
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

export default ProductList
