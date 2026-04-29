function DropdownFilter({ label, options, value, onChange, defaultLabel }) {
    return (
        <div className="dropdownFilterContainer">
            <label className="filterLabel">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="dropdownFilter"
            >
                <option value="">{defaultLabel}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
}

export default DropdownFilter;