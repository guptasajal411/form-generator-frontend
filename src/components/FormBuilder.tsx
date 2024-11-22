import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createForm, fetchFormById, updateForm } from "../api";
import { Field, Form } from "../types";
import { useDrag, useDrop } from "react-dnd";

const FormBuilder: React.FC<{ isEditMode?: boolean; existingForm?: Form }> = ({
    isEditMode = false,
    existingForm,
}) => {
    const [formTitle, setFormTitle] = useState(existingForm?.title || "Untitled Form");
    const [isFormTitleEditable, setIsFormTitleEditable] = useState(false);
    const [fields, setFields] = useState<Field[]>(existingForm?.fields || []);
    const [isFormBodyEditable, setIsFormBodyEditable] = useState(false);
    const [focusedInputIndex, setFocusedInputIndex] = useState(0);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const addField = (type: Field["type"]) => {
        try {
            if (fields.length >= 20) throw new Error("Maximum 20 fields allowed");
            const newField: Field = {
                id: Date.now().toString(),
                type,
                placeholder: `Placeholder for ${type} field`,
                title: `Title for ${type} field`,
                order: fields.length + 1,
            };
            setFields([...fields, newField]);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unexpected error occurred");
        }
    };

    const saveForm = async () => {
        try {
            const formData = { title: formTitle, fields };
            if (!formTitle.trim()) throw new Error("Form title cannot be empty");
            if (!fields.length) throw new Error("Form must have at least one field");
            if (isEditMode) {
                await updateForm(id as string, formData);
            } else {
                await createForm(formData);
            }
            navigate("/");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save form");
        }
    };

    const moveField = (fromIndex: number, toIndex: number) => {
        const updatedFields = [...fields];
        const [movedField] = updatedFields.splice(fromIndex, 1);
        updatedFields.splice(toIndex, 0, movedField);
        setFields(updatedFields);
    };

    useEffect(() => {
        if (id && isEditMode) {
            const loadForm = async () => {
                try {
                    const form = await fetchFormById(id);
                    setFormTitle(form.title);
                    setFields(form.fields);
                } catch (e) {
                    setError(e instanceof Error ? e.message : "Failed to load form");
                }
            };
            loadForm();
        }
    }, [id, isEditMode]);

    return (
        <div className="w-screen h-screen flex items-center flex-col p-6">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <h1 className="text-5xl mb-2">{isEditMode ? "Edit Form" : "Create New Form"}</h1>
            <div className="border md:max-w-2xl w-full flex flex-row items-start justify-center">
                <div className="w-2/3 border-r-2 p-4">
                    <div className="w-full flex flex-row items-center justify-center gap-4">
                        <input
                            type="text"
                            placeholder="Form Title"
                            value={formTitle}
                            onChange={(e) => isFormTitleEditable && setFormTitle(e.target.value)}
                            className={isFormTitleEditable ? "border text-2xl focus:outline-none px-1 py-1" : " text-2xl focus:outline-none px-1 py-1"}
                        />
                        <button className="w-6" onClick={() => setIsFormTitleEditable(!isFormTitleEditable)}>
                            <img src="/pencil.png" alt="edit" className="editImageButton" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-start py-6">
                        <button onClick={() => setIsFormBodyEditable(!isFormBodyEditable)} className="bg-transparent border border-blue-400 rounded-md text-blue-500 px-3 py-1">
                            {isFormBodyEditable ? <>Close {isEditMode ? "Edit" : "Add"} input</> : <>Open {isEditMode ? "Edit" : "Add"} input</>}
                        </button>
                        <br />
                        {isFormBodyEditable && (
                            <div className="flex flex-row gap-2 mb-4">
                                <button className="bg-blue-500 text-white px-2 py-1 rounded-md" onClick={() => addField("text")}>Text</button>
                                <button className="bg-blue-500 text-white px-2 py-1 rounded-md" onClick={() => addField("email")}>Email</button>
                                <button className="bg-blue-500 text-white px-2 py-1 rounded-md" onClick={() => addField("password")}>Password</button>
                                <button className="bg-blue-500 text-white px-2 py-1 rounded-md" onClick={() => addField("number")}>Number</button>
                                <button className="bg-blue-500 text-white px-2 py-1 rounded-md" onClick={() => addField("date")}>Date</button>
                            </div>
                        )}
                        <div className="flex flex-row flex-wrap items-center justify-between w-full">
                            {fields.map((field, index) => (
                                <FieldComponent
                                    key={field.id}
                                    field={field} setFocusedInputIndex={setFocusedInputIndex}
                                    index={index} setError={setError}
                                    fields={fields} setFields={setFields}
                                    moveField={moveField}
                                />
                            ))}
                        </div>
                        <button className="px-3 py-1 bg-green-700 text-white rounded-md mt-6" onClick={saveForm}>
                            {isEditMode ? "Update" : "Create"} Form
                        </button>
                    </div>
                </div>
                <div className="w-1/3 p-4">
                    <h3 className="text-xl my-3 text-center">Form Editor</h3>
                    <p className="text-lg capitalize my-3 text-center">{fields[focusedInputIndex]?.type || "Select inputs by pressing the edit button"}</p>
                    {fields.length > 0 && (
                        <>
                            <input type="text" value={fields[focusedInputIndex]?.title} onChange={(e) => {
                                const updatedFields = [...fields];
                                updatedFields[focusedInputIndex] = { ...updatedFields[focusedInputIndex], title: e.target.value };
                                setFields(updatedFields);
                            }} placeholder="title" className="border-x-none border-t-none border-b-2 py-1 px-1 focus:border-b-blue-500 focus:outline-none" />
                            <input type="text" value={fields[focusedInputIndex]?.placeholder} onChange={(e) => {
                                const updatedFields = [...fields];
                                updatedFields[focusedInputIndex] = { ...updatedFields[focusedInputIndex], placeholder: e.target.value };
                                setFields(updatedFields);
                            }} placeholder="placeholder" className="border-x-none border-t-none border-b-2 py-1 px-1 focus:border-b-blue-500 focus:outline-none mt-3" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const FieldComponent: React.FC<{
    field: Field;
    index: number;
    moveField: (fromIndex: number, toIndex: number) => void;
    fields: Field[];
    setFields: React.Dispatch<React.SetStateAction<Field[]>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setFocusedInputIndex: React.Dispatch<React.SetStateAction<number>>;
}> = ({ field, index, moveField, fields, setFields, setError, setFocusedInputIndex }) => {
    const [, drag] = useDrag({
        type: "field",
        item: { index },
    });

    const [, drop] = useDrop({
        accept: "field",
        hover: (item: { index: number }) => {
            if (item.index !== index) {
                moveField(item.index, index);
                item.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => drag(drop(node))}
            className="flex flex-row items-center justify-start w-1/2 p-2 gap-2"
        >
            <img src="/drag.png" alt="drag" className="cursor-grab" />
            <input type={field.type} placeholder={field.title} className="w-full border px-2 py-1 focus:outline-none" />
            <button className="w-4" onClick={() => setFocusedInputIndex(index)}>
                <img src="/pencil.png" alt="edit" />
            </button>
            <button
                className="w-4"
                onClick={() => {
                    try {
                        const updatedFields = fields.filter((_, idx) => idx !== index);
                        setFields(updatedFields);
                    } catch (e) {
                        setError("Failed to delete field");
                    }
                }}
            >
                <img src="/trash.png" alt="delete" />
            </button>
        </div>
    );
};


export default FormBuilder;
