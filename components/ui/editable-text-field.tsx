import React, { useState } from 'react';
import { Input } from './input';

type EditableTextFieldProps = {
    text: string,
    setText(text: string): void
}
const EditableTextField = ({ text, setText }: EditableTextFieldProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentText, setCurrentText] = useState(text);

    const handleInputChange = (event: { target: { value: any; }; }) => {
        setCurrentText(event.target.value);
    };

    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            setText(currentText);
            setIsEditing(false);
        } else if (event.key === 'Escape') {
            setCurrentText(text);
            setIsEditing(false);
        }
    };

    const handleFocus = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setText(currentText);
        setIsEditing(false);
    };

    return (
        <div className='ml-auto'>
            {isEditing ? (
                <Input
                    type="text"
                    value={currentText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    autoFocus
                />
            ) : (
                <span
                    onClick={handleFocus}>{text}</span>
            )}
        </div>
    );
};

export default EditableTextField;