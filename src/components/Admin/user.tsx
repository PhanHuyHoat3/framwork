import React from "react";
import { Table, Button } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function UserList() {
  const queryClient = useQueryClient();

  // Lấy danh sách người dùng
  const getAll = async () => {
    const { data } = await axios.get("http://localhost:3000/users");
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getAll,
  });

  // Hàm cập nhật role
  const updateRole = async (user: any) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    await axios.patch(`http://localhost:3000/users/${user.id}`, { role: newRole });
  };

  const { mutate } = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
        alert("Cập nhật thành công!")
      queryClient.invalidateQueries(["user"]); // Làm mới danh sách sau khi cập nhật
    },
    onError: () => {
      alert("Cập nhật thất bại!");
    },
  });

  const columns = [
    {
      title: "STT",
      render: (_: any, record: any, index: number) => index + 1,
      width: "5%",
    },
    {
      title: "UserName",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      render: (user: any) => (
        <>
          <Button type="primary" onClick={() => mutate(user)} style={{ marginRight: 8 }}>
            Edit Role
          </Button>
        </>
      ),
      width: "20%",
    },
  ];

  return (
    <Table
      dataSource={data?.slice().reverse()}
      columns={columns}
      loading={isLoading}
      scroll={{ y: "calc(100vh - 250px)" }}
      rowKey="id"
    />
  );
}

export default UserList;