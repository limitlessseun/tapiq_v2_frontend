import { SignInValues, SignUpValues, ChangePasswordValues } from "../schema/schema";
import axiosInstance from "../utils/axios";

export const registerUser = async (values: SignUpValues) => {
    try {
        const { data } = await axiosInstance.post(`/auth/signup`, {
            email: values.email,
            password: values.password,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            gender: values.gender,
        });
        return data;
    } catch (error: any) {
        throw error;
    }
}

export const loginUser = async (values: SignInValues) => {
    try {
        const { data } = await axiosInstance.post(`/auth/signin`, {
            email: values.email,
            password: values.password,
        });
        return data;
    } catch (error: any) {
        throw error;
    }
}
