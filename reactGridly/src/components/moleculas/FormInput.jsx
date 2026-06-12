
const FormInput = ({ label, type, id, placeholder, value, onChange, required, maxLength, minLength }) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <label htmlFor={id} className="text-sm font-semibold text-gray-dark">{label}</label>}
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                maxLength={maxLength}
                minLength={minLength}
                className="w-full px-4 py-3 border-2 border-beige rounded-2xl text-base bg-beige-light/50 text-gray-dark transition-all duration-300 focus:outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10 placeholder:text-gray-muted"
            />
            {maxLength && (
                <span className={`block text-right text-xs mt-0.5 ${value && value.length > maxLength * 0.9 ? 'text-danger' : 'text-gray-muted'}`}>
                    {value ? value.length : 0}/{maxLength}
                </span>
            )}
        </div>
    );
};

export default FormInput;