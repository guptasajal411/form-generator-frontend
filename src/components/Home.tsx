import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteForm, fetchForms } from "../api";
import { Form } from "../types";
import "./styles/Home.css"; // Importing the normal CSS file

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
        <div className="container">
            <h1 className="title">Welcome to Form.com</h1>
            <p className="subtitle">This is a simple form builder</p>
            <button className="createButton" onClick={() => navigate("/form/create")}>
                Create New Form
            </button>
            <hr />
            <h2 className="formsHeading">Forms</h2>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="formsContainer">
                    {forms.length > 0 ? (
                        forms.map((form) => (
                            <div key={form._id} className="formBox">
                                <h2 className="formTitle">{form.title}</h2>
                                <div className="buttons">
                                    <button
                                        className="button viewButton"
                                        onClick={() => navigate(`/form/${form._id}`)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="button editButton"
                                        onClick={() => navigate(`/form/${form._id}/edit`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="button deleteButton"
                                        onClick={() => handleDelete(form._id as string)}
                                    >
                                        Delete
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
    );
};

export default Home;
