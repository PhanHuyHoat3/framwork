import React from 'react'
import { Table, Button } from 'antd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'

function ProductList() {
    const queryClient = useQueryClient()

    const getAllProducts = async () => {
        const { data } = await axios.get('http://localhost:3000/products')
        return data
    }

    const { data: products, isLoading } = useQuery({
        queryKey: ['products'], // sửa 'product' thành 'products' cho nhất quán
        queryFn: getAllProducts
    })

    const { data: categories, isLoading: isCategoryLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await axios.get("http://localhost:3000/categories");
            return data;
        },
        enabled: !!products // Chỉ fetch categories khi có products
    });

    const delPro = async (id) => {
        if (confirm('Bạn chắc chắn muốn xóa?')) {
            await axios.delete(`http://localhost:3000/products/${id}`)
            queryClient.invalidateQueries(['products'])
        }
    }

    // Hàm lấy tên danh mục từ categoryId
    const getCategoryName = (categoryId) => {
        const category = categories?.find(cat => cat.id === categoryId)
        return category ? category.name : 'Không xác định'
    }

    const columns = [
        {
            title: 'STT',
            render: (_: any, record: any, index: number) => index + 1,
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
            render: (price) => `$${price}`
        },
        {
            title: "Sale Price",
            dataIndex: "sale",
            key: "sale",
            render: (sale) => `$${sale}`
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
            render: (imgUrl) => <img src={imgUrl} alt="Product Image" width={100} />
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description"
        },
        {
            title: "Category",
            dataIndex: "categoryId",
            key: "categoryId",
            render: (categoryId: number) => {
                if (isCategoryLoading) return "Loading...";
                return getCategoryName(categoryId);
            },
        },
        {
            title: "Actions",
            render: (product) => (
                <>
                    <Button type="primary" style={{ marginRight: 8 }}>
                        <Link to={`/admin/product/${product.id}/edit`}>Edit</Link>
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

    // Nếu đang tải dữ liệu, hiển thị loading
    if (isLoading || isCategoryLoading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary">
                    <Link to="/admin/product/add">Add Product</Link>
                </Button>
            </div>
            <Table 
                dataSource={products?.slice().reverse()} 
                columns={columns} 
                loading={isLoading} 
                scroll={{ y: "calc(100vh - 250px)" }} 
                rowKey="id" 
            />
        </>
    )
}

export default ProductList