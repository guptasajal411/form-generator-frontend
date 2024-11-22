import { Form } from "./types";

const API_BASE_URL = "http://localhost:5000/forms";

export const fetchForms = async (): Promise<Form[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch forms");
    const arr = await response.json();
    return arr;
};

export const fetchFormById = async (id: string): Promise<Form> => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch form with ID: ${id}`);
    return await response.json();
};

export const createForm = async (data: Partial<Form>): Promise<Form> => {
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create form");
    return await response.json();
};

export const updateForm = async (
    id: string,
    data: Partial<Form>
): Promise<Form> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update form with ID: ${id}`);
    return await response.json();
};

export const deleteForm = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to delete form with ID: ${id}`);
};
