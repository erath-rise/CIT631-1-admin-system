import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 设置 token
export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// 请求拦截器 - 自动添加token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 处理认证错误
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token过期或无效，清除本地存储并跳转到登录页
            localStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// 认证相关API
export const authAPI = {
    login: (username: string, password: string) =>
        api.post("/auth/login", { username, password }),
    register: (username: string, password: string) =>
        api.post("/auth/register", { username, password }),
    resetPassword: (username: string, newPassword: string) =>
        api.post("/auth/reset-password", { username, newPassword }),
};

// 员工相关API
export const employeeAPI = {
    // 获取员工列表
    getEmployees: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        department?: string;
        status?: string;
    }) => api.get("/employees", { params }),
    
    // 获取单个员工
    getEmployee: (id: string) => api.get(`/employees/${id}`),
    
    // 创建员工
    createEmployee: (data: any) => api.post("/employees", data),
    
    // 更新员工
    updateEmployee: (id: string, data: any) => api.put(`/employees/${id}`, data),
    
    // 删除员工
    deleteEmployee: (id: string) => api.delete(`/employees/${id}`),
    
    // 获取部门列表
    getDepartments: () => api.get("/employees/departments"),
};

export default api;