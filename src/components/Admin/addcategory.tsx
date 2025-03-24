import React, { useState } from "react";
import { Form, Input, InputNumber, Checkbox, Button, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Category {
  name: string;
  description: string;
}

const AddCategoryForm: React.FC = () => {

  const queryClient = useQueryClient();

  const nav = useNavigate()
    const addproduct = async(product:Category) => {
        await axios.post('http://localhost:3000/categories', product)
    }

    const { mutate } = useMutation({
        mutationFn: addproduct,
        onSuccess: () => {
            alert('Thêm thành công')
            nav('/admin/category')
        },
        onError: () => {
            alert('Thêm thất bại')
        }
    })

  const handleSubmit = (values: Category) => {
    mutate(values)
  };

  return (
    // <div className="w-full h-screen flex justify-center items-center p-4 overflow-hidden">
    //     <div className="w-full h-full max-w-4xl h-full p-6 border rounded-lg shadow-lg bg-white flex flex-col overflow-auto">
        <Form onFinish={handleSubmit} layout="vertical" className="w-full h-[80vh] flex-1 overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Thêm Danh Mục</h2>
            <Form.Item label="Tên danh mục" name="name" rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}> 
              <Input />
            </Form.Item>
            
            <Form.Item label="Mô tả danh mục" name="description" className="col-span-2"> 
              <Input.TextArea rows={4} />
            </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">Thêm Danh mục</Button>
          </Form.Item>

        </Form>
  );
};

export default AddCategoryForm;