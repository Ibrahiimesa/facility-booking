import api from "@/src/shared/axios/axiosInstance";

export const loginApi = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  console.log("res", res);
  return res.data;
};

export const registerApi = async (name: string, email: string, password: string) => {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data;
};
