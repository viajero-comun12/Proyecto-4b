const FormTextarea = ({ label, id, placeholder, value, onChange, required, maxLength }) => {
    return (
        <div className="grupo-input" style={{ width: '100%', marginBottom: '15px' }}>
            {label && <label htmlFor={id} style={{ display: 'block', marginBottom: '5px' }}>{label}</label>}
            <textarea
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                maxLength={maxLength}
                className="input-form"
                style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
            />
            {maxLength && (
                <span style={{ display: 'block', textAlign: 'right', fontSize: '0.75rem', color: value && value.length > maxLength * 0.9 ? '#e65100' : '#8892a0', marginTop: '2px' }}>
                    {value ? value.length : 0}/{maxLength}
                </span>
            )}
        </div>
    );
};

export default FormTextarea;
