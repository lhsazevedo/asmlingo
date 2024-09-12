"use client";

import {
  SignUpRouteErrors,
  SignUpRouteFields,
} from "@/app/api/auth/signup/route";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignUpFormState extends SignUpRouteFields {
  errors: SignUpRouteErrors;
}

export default function SignUpForm() {
  const router = useRouter();
  const [state, setState] = useState<SignUpFormState>({
    name: "",
    email: "",
    password: "",
    errors: {},
  });

  const handleSignUp = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(state),
    });

    if (res.ok) {
      router.push("/");
      return;
    }

    // Form validation errors
    if (res.status === 422) {
      const json = await res.json();
      setState({ ...state, errors: json.errors });
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

    setState({
      ...state,
      errors: { form: "Something went wrong, please try again later" },
    });
  };

  // TODO: Extract form fields into a separate component
  return (
    <div
      className="max-w-md mx-auto flex flex-col"
      role="form"
      aria-label="Sign up form"
    >
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
        {state.errors.name && (
          <div className="text-red-500">{state.errors.name}</div>
        )}
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
        {state.errors.email && (
          <div className="text-red-500">{state.errors.email}</div>
        )}
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
        {state.errors.password && (
          <div className="text-red-500">{state.errors.password}</div>
        )}
      </div>
      <button onClick={handleSignUp}>Sign up</button>
    </div>
  );
}
