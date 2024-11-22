import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFormById } from "../api";
import { Field, Form } from "../types";

const FormViewer: React.FC = () => {
    const { id } = useParams();
    const [form, setForm] = useState<Form | null>(null);

    useEffect(() => {
        const loadForm = async () => {
            const response = await fetchFormById(id!);
            setForm(response);
        };
        loadForm();
    }, [id]);

    if (!form) return <p>Loading...</p>;

    return (
        <div>
            <h1>{form.title}</h1>
            <form>
                {form.fields.map((field) => (
                    <div key={field.id}>
                        <label>{field.title}</label>
                        <input type={field.type} />
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default FormViewer;
