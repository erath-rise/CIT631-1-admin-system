"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // 这里可以添加获取用户信息的逻辑
    setUser({ username: "管理员" });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) {
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
              <span className="text-gray-700">欢迎，{user.username}</span>
              <Button
                onClick={handleLogout}
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
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                欢迎使用员工管理系统
              </h2>
              <p className="text-gray-600 mb-6">
                这里将显示员工管理的主要功能
              </p>
              <div className="space-x-4">
                <Button 
                  onClick={() => router.push("/employees")}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  员工管理
                </Button>
                <Button 
                  onClick={() => router.push("/employees")}
                  variant="outline"
                >
                  查看员工
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
