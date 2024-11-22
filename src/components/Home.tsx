import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteForm, fetchForms } from "../api";
import { Form } from "../types";

const Home: React.FC = () => {
    const [forms, setForms] = useState<Form[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const loadForms = async () => {
        setLoading(true);
        try {
            const response = await fetchForms();
            setForms(response);
        } catch (error) {
            console.error("Error fetching forms:", error);
            alert("Failed to fetch forms.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadForms();
    }, []);

    const handleDelete = async (id: string) => {
        if (loading) return;
        try {
            await deleteForm(id);
            loadForms();
        } catch (error) {
            console.error("Error deleting form:", error);
            alert("Failed to delete form.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Welcome to Form.com</h1>
            <button onClick={() => navigate("/form/create")}>Create Form</button>
            <h1>Forms</h1>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {forms.length > 0 ? (
                        forms.map((form) => (
                            <li key={form._id}>
                                <h3>{form.title}</h3>
                                <button onClick={() => navigate(`/form/${form._id}`)}>View</button>
                                <button onClick={() => navigate(`/form/${form._id}/edit`)}>Edit</button>
                                <button onClick={() => handleDelete(form._id as string)}>Delete</button>
                            </li>
                        ))
                    ) : (
                        <p>You have no forms created yet</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Home;
