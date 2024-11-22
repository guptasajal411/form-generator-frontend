import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFormById } from "../api";
import { Form } from "../types";

const FormViewer: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState<Form | null>(null);

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        alert("Form submitted!");
        navigate("/")
    }

    useEffect(() => {
        const loadForm = async () => {
            const response = await fetchFormById(id!);
            setForm(response);
        };
        loadForm();
    }, [id]);

    if (!form) return <p>Loading...</p>;

    return (
        <div className="w-screen h-screen flex justify-center p-6">
            <div className="border p-4 rounded-md h-fit flex flex-col justify-center items-center gap-4">
                <h1 className="text-4xl">{form.title}</h1>
                <form className="flex items-center justify-center flex-col gap-4" onSubmit={(e) => onSubmit(e)}>
                    <div className="w-full flex flex-row flex-wrap items-center justify-between gap-4 min-w-64">
                        {form.fields.map((field) => (
                            <div key={field.id} className="w-[calc(50%-0.5rem)] flex items-center justify-center">
                                <input type={field.type} placeholder={field.placeholder} className="border-x-none border-t-none border-b-2 focus:border-b-green-600 focus:outline-none" />
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="px-3 py-1 bg-green-700 text-white rounded-md w-fit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default FormViewer;
