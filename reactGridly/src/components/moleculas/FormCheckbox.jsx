const FormCheckbox = ({ label, id, checked, onChange }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
            <input 
                type="checkbox" 
                id={id} 
                checked={checked} 
                onChange={onChange} 
            />
            <label htmlFor={id}>{label}</label>
        </div>
    );
};

export default FormCheckbox;
