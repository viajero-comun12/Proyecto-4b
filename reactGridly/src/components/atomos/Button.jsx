import React from 'react';

const Button = ({ type = "button", children, disabled, className = "" }) => {
    return (
        <button 
            type={type} 
            className={`btn-primario ${className}`} 
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;