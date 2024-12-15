import { LoginFormData } from "../LoginForm/LoginForm.type";

export interface SignupFormData extends LoginFormData {
    name: string;
    confirmPassword: string;
}