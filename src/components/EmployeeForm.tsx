"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { employeeAPI } from "@/lib/api";
import { DialogContent } from '@/components/ui/dialog';

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

interface EmployeeFormProps {
  employee?: Employee | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: "",
    hireDate: "",
    status: "active" as 'active' | 'inactive',
    address: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    }
  });
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取部门列表
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await employeeAPI.getDepartments();
        setDepartments(response.data);
      } catch (error) {
        console.error("获取部门列表失败:", error);
      }
    };
    fetchDepartments();
  }, []);

  // 如果是编辑模式，填充表单数据
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "",
        position: employee.position || "",
        salary: employee.salary?.toString() || "",
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : "",
        status: employee.status || "active",
        address: employee.address || "",
        emergencyContact: {
          name: employee.emergencyContact?.name || "",
          phone: employee.emergencyContact?.phone || "",
          relationship: employee.emergencyContact?.relationship || ""
        }
      });
    }
  }, [employee]);

  // 处理输入变化
  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('emergencyContact.')) {
      const emergencyField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [emergencyField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        salary: parseFloat(formData.salary),
        hireDate: new Date(formData.hireDate).toISOString(),
        emergencyContact: formData.emergencyContact.name ? formData.emergencyContact : undefined
      };

      // 移除空字符串字段，但保留必需字段
      const requiredFields = ['name', 'email', 'phone', 'department', 'position', 'salary', 'hireDate', 'status'];
      Object.keys(submitData).forEach(key => {
        if (submitData[key as keyof typeof submitData] === "" && !requiredFields.includes(key)) {
          delete submitData[key as keyof typeof submitData];
        }
      });

      onSubmit(submitData);
    } catch (error) {
      console.error("提交表单失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 基本信息 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">基本信息</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="请输入姓名"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱 <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="请输入邮箱"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              电话 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="请输入电话"
              required
            />
          </div>
          {/* department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              部门 <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              required
            >
              <option value="">请选择部门</option>
              {departments.map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              职位 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              placeholder="请输入职位"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              薪资 <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.salary}
              onChange={(e) => handleInputChange("salary", e.target.value)}
              placeholder="请输入薪资"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              入职日期 <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.hireDate}
              onChange={(e) => handleInputChange("hireDate", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              <option value="active">在职</option>
              <option value="inactive">离职</option>
            </select>
          </div>
        </div>

        {/* 其他信息 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">其他信息</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              地址
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="请输入地址"
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">紧急联系人</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  联系人姓名
                </label>
                <Input
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleInputChange("emergencyContact.name", e.target.value)}
                  placeholder="请输入联系人姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  联系人电话
                </label>
                <Input
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleInputChange("emergencyContact.phone", e.target.value)}
                  placeholder="请输入联系人电话"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  关系
                </label>
                <Input
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => handleInputChange("emergencyContact.relationship", e.target.value)}
                  placeholder="请输入关系"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 表单按钮 */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          disabled={loading}
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {loading ? "保存中..." : employee ? "更新" : "创建"}
        </Button>
      </div>
    </form>
  );
}
