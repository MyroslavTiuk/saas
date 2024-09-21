import { useState } from "react";

export function useFormValues(initialValues) {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (e) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  return { formValues, handleChange, setFormValues };
}
