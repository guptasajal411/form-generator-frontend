import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteForm, fetchForms } from "../api";
import { Form } from "../types";

const Home: React.FC = () => {
    const [forms, setForms] = useState<Form[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const loadForms = async (showLoading = true) => {
        showLoading && setLoading(true);
        setError(null);
        try {
            const response = await fetchForms();
            setForms(response);
        } catch (err) {
            setError("Failed to fetch forms. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadForms();
    }, []);

    const handleDelete = async (id: string) => {
        if (deleting || loading) return;
        setDeleting(true);
        setError(null);
        try {
            await deleteForm(id);
            loadForms(false);
        } catch (err) {
            setError("Failed to delete form. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="w-screen h-screen flex items-center flex-col p-6">
            <div className="flex items-center flex-col">
                <h1 className="text-5xl mb-2">Welcome to Form.com</h1>
                <p className="mb-4">This is a simple form builder</p>
                <button
                    className="text-white bg-green-700 rounded-md px-4 py-1"
                    onClick={() => navigate("/form/create")}
                >
                    Create New Form
                </button>
            </div>
            <hr className="my-4 border-gray-300 w-full px-4" />
            <div className="md:max-w-md w-full">
                <h2 className="text-3xl">Forms</h2>
                {loading ? (
                    <div>Loading forms...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <div className="flex flex-row flex-wrap justify-between gap-4">
                        {forms.length > 0 ? (
                            forms.map((form) => (
                                <div key={form._id} className="p-4 rounded-md shadow h-full">
                                    <h2 className="text-xl py-2 w-1/2">{form.title}</h2>
                                    <div className="flex flex-row gap-4">
                                        <button
                                            className="text-green-600 text-sm"
                                            onClick={() => navigate(`/form/${form._id}`)}
                                        >
                                            VIEW
                                        </button>
                                        <button
                                            className="text-blue-600 text-sm"
                                            onClick={() => navigate(`/form/${form._id}/edit`)}
                                        >
                                            EDIT
                                        </button>
                                        <button
                                            className="text-red-600 text-sm"
                                            onClick={() => handleDelete(form._id as string)}
                                            disabled={deleting}
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>You have no forms created yet</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
