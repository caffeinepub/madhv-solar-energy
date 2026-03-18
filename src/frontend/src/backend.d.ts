import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactFormSubmission {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface CompanyInfo {
    email: string;
    address: string;
    companyName: string;
    phone: string;
}
export interface backendInterface {
    getAllContactFormSubmissions(): Promise<Array<ContactFormSubmission>>;
    getCompanyInfo(): Promise<CompanyInfo | null>;
    setCompanyInfo(companyName: string, address: string, phone: string, email: string): Promise<void>;
    submitContactForm(name: string, email: string, message: string): Promise<void>;
}
