import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Checkbox, Button, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ColorOption {
  name: string;
  image: string;
}

interface Product {
  name: string;
  brand: string;
  categoryId: number;
  price: number;
  sale: number;
  stock: number;
  image: string;
  description: string;
  new: boolean;
  outstanding: boolean;
  best: boolean;
  specs: {
    screen: string;
    processor: string;
    camera: string;
    battery: string;
    storage: string[];
    colors: ColorOption[];
  };
}

const EditProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    name: "",
    brand: "",
    categoryId: 1,
    price: 0,
    sale: 0,
    stock: 0,
    image: "",
    description: "",
    new: false,
    outstanding: false,
    best: false,
    specs: {
      screen: "",
      processor: "",
      camera: "",
      battery: "",
      storage: [],
      colors: []
    }
  });

  const queryClient = useQueryClient();

  const params = useParams()
    const id = params.id
    const [form] = Form.useForm()

  const getAllCategories = async () => {
    const { data } = await axios.get("http://localhost:3000/categories");
    return data;
  };

  const getDetailPro = async () => {
    const { data } = await axios.get(`http://localhost:3000/products/${id}`);
    return data;
  };  

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const {data} = useQuery({
    queryKey: ['product', id],
    queryFn: getDetailPro
})

useEffect(() => {
    if(!data) return
    form.setFieldsValue(data)
})

  const nav = useNavigate()
    const addproduct = async(product:Product) => {
        await axios.put(`http://localhost:3000/products/${id}`, product)
    }

    const { mutate } = useMutation({
        mutationFn: addproduct,
        onSuccess: () => {
            alert('Thêm thành công')
            nav('/admin/products')
        },
        onError: () => {
            alert('Thêm thất bại')
        }
    })

  const handleSubmit = (values: Product) => {
    mutate(values)
  };

  return (
    // <div className="w-full h-screen flex justify-center items-center p-4 overflow-hidden">
    //     <div className="w-full h-full max-w-4xl h-full p-6 border rounded-lg shadow-lg bg-white flex flex-col overflow-auto">
        <Form onFinish={handleSubmit} form={form} layout="vertical" className="w-full h-[80vh] flex-1 overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Thêm Sản Phẩm</h2>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Thương hiệu" name="brand" rules={[{ required: true, message: "Vui lòng nhập thương hiệu!" }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Danh mục" name="categoryId" rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}> 
          <Select placeholder="Chọn danh mục" loading={isLoading}>
            {categories?.map((category) => (
              <Option key={category.id} value={category.id}>{category.name}</Option>
            ))}
          </Select>
        </Form.Item>
            <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}> 
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item label="Giá khuyến mãi" name="sale"> 
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item label="Số lượng tồn kho" name="stock"> 
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item label="URL Hình ảnh" name="image"> 
              <Input />
            </Form.Item>
            <Form.Item label="Mô tả sản phẩm" name="description" className="col-span-2"> 
              <Input.TextArea rows={4} />
            </Form.Item>
          </div>
          <div className="flex gap-4 mb-4">
            <Form.Item name="new" valuePropName="checked">
              <Checkbox>Mới</Checkbox>
            </Form.Item>
            <Form.Item name="outstanding" valuePropName="checked">
              <Checkbox>Nổi bật</Checkbox>
            </Form.Item>
            <Form.Item name="best" valuePropName="checked">
              <Checkbox>Bán chạy</Checkbox>
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Màn hình" name={["specs", "screen"]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Chip xử lý" name={["specs", "processor"]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Camera" name={["specs", "camera"]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Dung lượng pin" name={["specs", "battery"]}> 
              <Input />
            </Form.Item>
          </div>
          <Form.List name={["specs", "colors"]}>
            {(fields, { add, remove }) => (
              <div>
                <h3 className="text-lg font-semibold mb-2">Màu sắc sản phẩm</h3>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-4 mb-2 items-center">
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Vui lòng nhập tên màu!" }]}
                    >
                      <Input placeholder="Tên màu (VD: Đỏ, Xanh)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "image"]}
                      rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh màu!" }]}
                    >
                      <Input placeholder="URL hình ảnh màu" />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>Xóa</Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} className="w-[50%] ">
                  + Thêm màu
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">Thêm Sản Phẩm</Button>
          </Form.Item>

        </Form>
  );
};

export default EditProductForm;