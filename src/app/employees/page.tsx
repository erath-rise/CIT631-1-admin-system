"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { employeeAPI } from "@/lib/api";
import EmployeeForm from "@/components/EmployeeForm";

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive';
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  const limit = 10;

  // 检查认证状态
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  }, [router]);

  // 获取员工列表
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getEmployees({
        page: currentPage,
        limit,
        search: searchTerm,
        department: departmentFilter,
        status: statusFilter,
      });
      
      setEmployees(response.data.employees);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error: any) {
      console.error("获取员工列表失败:", error);
      console.error("错误详情:", error.response?.data);
      console.error("状态码:", error.response?.status);
      if (error.response?.status === 401) {
        alert("认证失败，请重新登录");
        router.push("/login");
      } else {
        alert(`获取员工列表失败: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 获取部门列表
  const fetchDepartments = async () => {
    try {
      const response = await employeeAPI.getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error("获取部门列表失败:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [currentPage, searchTerm, departmentFilter, statusFilter]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // 处理部门筛选
  const handleDepartmentFilter = (value: string) => {
    setDepartmentFilter(value);
    setCurrentPage(1);
  };

  // 处理状态筛选
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // 打开添加员工弹窗
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsDialogOpen(true);
  };

  // 打开编辑员工弹窗
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsDialogOpen(true);
  };

  // 删除员工
  const handleDeleteEmployee = async (id: string) => {
    try {
      await employeeAPI.deleteEmployee(id);
      setDeleteConfirm(null);
      fetchEmployees();
    } catch (error) {
      console.error("删除员工失败:", error);
    }
  };

  // 处理表单提交
  const handleFormSubmit = async (data: any) => {
    try {
      if (editingEmployee) {
        await employeeAPI.updateEmployee(editingEmployee._id, data);
      } else {
        await employeeAPI.createEmployee(data);
      }
      setIsDialogOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error: any) {
      console.error("保存员工失败:", error);
      console.error("错误详情:", error.response?.data);
      console.error("状态码:", error.response?.status);
      alert(`保存员工失败: ${error.response?.data?.message || error.message}`);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 格式化薪资
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(salary);
  };

  if (loading && employees.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                员工管理系统
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="text-gray-600 hover:text-gray-900"
              >
                返回首页
              </Button>
              <Button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
                variant="outline"
                className="text-gray-600 hover:text-gray-900"
              >
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* 页面标题和操作按钮 */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">员工管理</h2>
              <Button
                onClick={handleAddEmployee}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                添加员工
              </Button>
            </div>
          </div>

          {/* 搜索和筛选 */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  搜索
                </label>
                <Input
                  placeholder="搜索姓名、邮箱或电话"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  部门
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={departmentFilter}
                  onChange={(e) => handleDepartmentFilter(e.target.value)}
                >
                  <option value="">全部部门</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                >
                  <option value="">全部状态</option>
                  <option value="active">在职</option>
                  <option value="inactive">离职</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setDepartmentFilter("");
                    setStatusFilter("");
                    setCurrentPage(1);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  重置筛选
                </Button>
              </div>
            </div>
          </div>

          {/* 员工表格 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    姓名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    邮箱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    电话
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    部门
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    职位
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    薪资
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    入职日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatSalary(employee.salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(employee.hireDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {employee.status === 'active' ? '在职' : '离职'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEditEmployee(employee)}
                          variant="outline"
                          size="sm"
                        >
                          编辑
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirm(employee._id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-900"
                        >
                          删除
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {employees.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">暂无员工数据</p>
              </div>
            )}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                显示第 {(currentPage - 1) * limit + 1} 到{" "}
                {Math.min(currentPage * limit, total)} 条，共 {total} 条记录
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  上一页
                </Button>
                <span className="px-3 py-2 text-sm text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 员工表单弹窗 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "编辑员工" : "添加员工"}
            </DialogTitle>
          </DialogHeader>
          <EmployeeForm
            employee={editingEmployee}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingEmployee(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              确定要删除这个员工吗？此操作无法撤销。
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
              >
                取消
              </Button>
              <Button
                onClick={() => deleteConfirm && handleDeleteEmployee(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700"
              >
                删除
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
