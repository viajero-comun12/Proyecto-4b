const FormCheckbox = ({ label, id, checked, onChange }) => {
    return (
        <div className="flex items-center gap-3 my-2">
            <input 
                type="checkbox" 
                id={id} 
                checked={checked} 
                onChange={onChange}
                className="w-4 h-4 accent-accent rounded"
            />
            <label htmlFor={id} className="text-sm text-gray-dark cursor-pointer select-none">{label}</label>
        </div>
    );
};

export default FormCheckbox;
