import React from 'react';

const FormInput = ({ label, type, id, placeholder, value, onChange, required }) => {
    return (
        <div className="grupo-input">
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default FormInput;