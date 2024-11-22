export interface Field {
    id: string;
    type: "email" | "text" | "password" | "number" | "date";
    title: string;
    order: number;
}

export interface Form {
    _id?: string;
    title: string;
    fields: Field[];
}
