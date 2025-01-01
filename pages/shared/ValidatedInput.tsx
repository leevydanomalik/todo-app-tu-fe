import { Input } from "@roketid/windmill-react-ui";
import React from "react";

interface ValidatedInputProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  type?: "text" | "number" | "email" | "password" | "select" | "textarea";
  options?: { value: string | number; label: string }[]; // For select inputs
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  value,
  onChange,
  error,
  type = "text",
  options,
}) => {
  return (
    <div>
      <label className="block text-sm">
        <span>{label}</span>
        {type === "select" ? (
          <select
            className={`mt-1 block w-full text-sm form-select ${error ? "border-red-500" : ""
              }`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            className={`mt-1 block w-full text-sm form-textarea ${error ? "border-red-500" : ""
              }`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          ></textarea>
        ) : (
          <Input
            type={type}
            className={`mt-1 block w-full text-sm form-input ${error ? "border-red-500" : ""
              }`}
            value={value}
            onChange={(e) => onChange(type === "number" ? +e.target.value : e.target.value)}
          />
        )}
      </label>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default ValidatedInput;

