import React from "react";

type TextInputProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export const TextInput = ({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
}: TextInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-lg text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1cb0f6]"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={error ? "true" : "false"}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
