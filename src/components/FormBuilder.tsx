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
    const [focusedInputIndex, setFocusedInputIndex] = useState(0);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const addField = (type: Field["type"]) => {
        if (fields.length >= 20) return alert("Maximum 20 fields allowed");
        const newField: Field = {
            id: Date.now().toString(),
            type, placeholder: `Placeholder for ${type} field`,
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
        <div className="form-builder">
            <h1 className="formsContainer">{isEditMode ? "Edit Form" : "Create New Form"}</h1>
            <div className="builder-container">
                <div className="formContainer">
                    <div className="editTitleContainer">
                        <input
                            type="text"
                            placeholder="Form Title"
                            value={formTitle}
                            onChange={(e) => (isFormTitleEditable && setFormTitle(e.target.value))}
                            className={isFormTitleEditable ? "" : "tInput"}
                        />
                        <button className="tButton" onClick={() => setIsFormTitleEditable(!isFormTitleEditable)}>
                            <img src="/pencil.png" alt="edit" className="editImageButton" />
                        </button>
                    </div>
                    <br />
                    <button onClick={() => setIsFormBodyEditable(!isFormBodyEditable)} className="addInputButton">{isFormBodyEditable ? <>Close {isEditMode ? "Edit" : "Add"} input</> : <>Open {isEditMode ? "Edit" : "Add"} input</>}</button>
                    <br />
                    {isFormBodyEditable && <>
                        <button className="button viewButton" onClick={() => addField("text")}>Text</button>
                        <button className="button viewButton" onClick={() => addField("email")}>Email</button>
                        <button className="button viewButton" onClick={() => addField("password")}>Password</button>
                        <button className="button viewButton" onClick={() => addField("number")}>Number</button>
                        <button className="button viewButton" onClick={() => addField("date")}>Date</button>
                        <br />

                    </>}
                    <div className="flex-container">
                        {fields.map((field, index) => (<div className="flex-item flex">
                            <input type={field.type} placeholder={field.type} className="ulInput" />
                            <button className="tButton" onClick={() => setFocusedInputIndex(index)}>
                                <img src="/pencil.png" alt="edit" className="editImageButton" />
                            </button>
                            <button className="tButton" onClick={() => {
                                const updatedFields = fields.filter((_, idx) => idx !== index);
                                setFields(updatedFields);
                            }}>
                                <img src="/trash.png" alt="edit" className="editImageButton" />

                            </button>
                        </div>
                        ))}
                    </div>
                    {isFormBodyEditable && <button onClick={saveForm}>Save Form</button>}
                </div>
                <div className="editorContainer">
                    <h3>Form Editor</h3>
                    <p>{fields[focusedInputIndex]?.type || "Select inputs by pressing the edit button"}</p>
                    {fields.length > 0 && <>
                        <input type="text" value={fields[focusedInputIndex]?.title} onChange={(e) => {
                            const updatedFields = [...fields];
                            updatedFields[focusedInputIndex] = { ...updatedFields[focusedInputIndex], title: e.target.value };
                            setFields(updatedFields);
                        }} placeholder="title" />
                        <input type="text" value={fields[focusedInputIndex]?.placeholder} onChange={(e) => {
                            const updatedFields = [...fields];
                            updatedFields[focusedInputIndex] = { ...updatedFields[focusedInputIndex], placeholder: e.target.value };
                            setFields(updatedFields);
                        }} placeholder="placeholder" />
                    </>}
                </div>
            </div>
        </div>
    );
};

export default FormBuilder;
