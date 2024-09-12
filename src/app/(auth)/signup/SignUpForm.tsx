"use client";

import {
  SignUpRouteErrors,
  SignUpRouteFields,
} from "@/app/api/auth/signup/route";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignUpFormErrors extends SignUpRouteErrors {
  form?: string;
}

export default function SignUpForm() {
  const router = useRouter();
  const [state, setState] = useState<SignUpRouteFields>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<SignUpFormErrors>({});

  const handleSignUp = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push("/");
      return;
    }

    // Form validation errors
    if (res.status === 422) {
      const json = await res.json();
      setErrors(json.errors);
      return;
    }

    // Other bad request errors
    if (res.status === 400) {
      const json = await res.json();
      if (json.error === "already_logged_in") {
        // TODO: Display a message to the user
        router.push("/");
        return;
      }
    }

    setErrors({
      form: "Something went wrong, please try again later",
    });
  };

  // TODO: Extract form fields into a separate component
  return (
    <div
      className="max-w-md mx-auto flex flex-col"
      role="form"
      aria-label="Sign up form"
    >
      {errors.form && <div className="text-red-500">{errors.form}</div>}
      <div className="mb-4">
        <label htmlFor="nameInput" className="block mb-2">
          Name (optional)
        </label>
        <input
          id="nameInput"
          className="border"
          type="text"
          name="name"
          value={state.name}
          onChange={(event) => setState({ ...state, name: event.target.value })}
        />
        {errors.name && <div className="text-red-500">{errors.name}</div>}
      </div>
      <div className="mb-4">
        <label htmlFor="emailInput" className="block mb-2">
          Email
        </label>
        <input
          id="emailInput"
          className="border"
          type="email"
          name="email"
          value={state.email}
          onChange={(event) =>
            setState({ ...state, email: event.target.value })
          }
        />
        {errors.email && <div className="text-red-500">{errors.email}</div>}
      </div>
      <div className="mb-4">
        <label htmlFor="passwordInput" className="block mb-2">
          Password
        </label>
        <input
          id="passwordInput"
          className="border"
          type="password"
          name="password"
          value={state.password}
          onChange={(event) =>
            setState({ ...state, password: event.target.value })
          }
        />
        {errors.password && (
          <div className="text-red-500">{errors.password}</div>
        )}
      </div>
      <button onClick={handleSignUp}>Sign up</button>
    </div>
  );
}
