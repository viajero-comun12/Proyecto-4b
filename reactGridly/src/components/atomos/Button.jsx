import React from 'react';

const Button = ({ type = "button", children, disabled, onClick, style, className = "" }) => {
    return (
        <button 
            type={type} 
            onClick={onClick}
            className={className} 
            style={style}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;