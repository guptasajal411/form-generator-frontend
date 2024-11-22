import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createForm, fetchFormById, updateForm } from "../api";
import { Field, Form } from "../types";

const FormBuilder: React.FC<{ isEditMode?: boolean; existingForm?: Form }> = ({
    isEditMode = false,
    existingForm,
}) => {
    const [formTitle, setFormTitle] = useState(existingForm?.title || "Untitled Form");
    const [isFormTitleEditable, setIsFormTitleEditable] = useState(false);
    const [fields, setFields] = useState<Field[]>(existingForm?.fields || []);
    const [isFormBodyEditable, setIsFormBodyEditable] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const addField = (type: Field["type"]) => {
        if (fields.length >= 20) return alert("Maximum 20 fields allowed");
        const newField: Field = {
            id: Date.now().toString(),
            type,
            title: `Title for ${type} field`,
            order: fields.length + 1,
        };
        setFields([...fields, newField]);
    };

    const saveForm = async () => {
        const formData = { title: formTitle, fields };
        if (isEditMode && existingForm?._id) {
            await updateForm(existingForm?._id, formData);
        } else {
            alert(JSON.stringify(formData))
            await createForm(formData);
        }
        navigate("/");
    };

    useEffect(() => {
        if (id && isEditMode) {
            const loadForm = async () => {
                try {
                    const form = await fetchFormById(id);
                    setFormTitle(form.title);
                    setFields(form.fields);
                } catch (error) {
                    console.error("Failed to load form:", error);
                }
            };
            loadForm();
        }
    }, [id, isEditMode]);

    return (
        <div>
            <h1>{isEditMode ? "Edit Form" : "Create Form"}</h1>
            <input
                type="text"
                placeholder="Form Title"
                value={formTitle}
                onChange={(e) => (isFormTitleEditable && setFormTitle(e.target.value))}
            />
            <button onClick={() => setIsFormTitleEditable(!isFormTitleEditable)}>toggleedit</button>
            <br />
            <button onClick={() => setIsFormBodyEditable(!isFormBodyEditable)}>{isFormBodyEditable ? <>Close {isEditMode ? "Edit" : "Add"} input</> : <>Open {isEditMode ? "Edit" : "Add"} input</>}</button>
            <br />
            {isFormBodyEditable && <>
                <button onClick={() => addField("text")}>Text</button>
                <button onClick={() => addField("email")}>Email</button>
                <button onClick={() => addField("password")}>Password</button>
                <button onClick={() => addField("number")}>Number</button>
                <button onClick={() => addField("date")}>Date</button>
            </>}
            <ul>
                {fields.map((field, index) => (
                    <input type="text" value={field.title} onChange={(e) => {
                        const updatedFields = [...fields];
                        updatedFields[index].title = e.target.value;
                        setFields(updatedFields);
                    }} placeholder={field.type} />
                ))}
            </ul>
            <button onClick={saveForm}>Save Form</button>
        </div>
    );
};

export default FormBuilder;
