export function FieldText({ label, name, value, ...props }) {
  return (
    <div className="form-outline">
      <label className="form-label" htmlFor={name}>
        <b>{label}</b>
      </label>
      <br />
      <input
        className="form-control"
        type="text"
        name={name}
        id={name}
        value={value}
        {...props}
      />
    </div>
  );
}
