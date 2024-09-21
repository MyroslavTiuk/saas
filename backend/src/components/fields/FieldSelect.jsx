export function FieldSelect({ label, name, value, options, ...props }) {
  return (
    <div className="form-outline">
      <label className="form-label" htmlFor={name}>
        <b>{label}</b>
      </label>
      <br />
      <select
        className="form-select"
        type="text"
        name={name}
        id={name}
        value={value}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
