"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/AuthProvider";
import {
  SignUpRouteValidationErrorResponse,
  SignUpRouteFields,
} from "@/app/api/auth/signup/route";
import { ApiErrorResponse } from "@/app/api/util";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";

type SignUpFormErrors = {
  form?: string;
} & SignUpRouteValidationErrorResponse["errors"];

export default function SignUpForm() {
  const router = useRouter();
  const [state, setState] = useState<SignUpRouteFields>({
    name: "",
    email: "",
    password: "",
  });
  const { recheckAuth } = useAuth();
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(state),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        await recheckAuth();
        router.push("/");
        return;
      }

      if (res.status === 422) {
        const json = (await res.json()) as SignUpRouteValidationErrorResponse;
        setErrors(json.errors);
        return;
      }

      if (res.status === 400) {
        const json = (await res.json()) as ApiErrorResponse;
        if (json.error === "already_logged_in") {
          router.push("/");
          return;
        }
      }

      throw new Error("Unexpected error occurred");
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({
        form: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-3xl font-bold text-center text-gray-500 mb-6">
        Create your profile
      </h2>
      {errors.form && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{errors.form}</span>
        </div>
      )}
      <div className="space-y-8">
        <TextInput
          id="nameInput"
          label="Name"
          name="name"
          value={state.name}
          onChange={(event) => setState({ ...state, name: event.target.value })}
          error={errors.name}
        />
        <TextInput
          id="emailInput"
          label="Email"
          type="email"
          name="email"
          value={state.email}
          onChange={(event) =>
            setState({ ...state, email: event.target.value })
          }
          error={errors.email}
        />
        <TextInput
          id="passwordInput"
          label="Password"
          type="password"
          name="password"
          value={state.password}
          onChange={(event) =>
            setState({ ...state, password: event.target.value })
          }
          error={errors.password}
        />
        <Button
          onClick={() => void handleSignUp()}
          disabled={isLoading}
          block={true}
        >
          {isLoading ? "Creating profile..." : "Create profile"}
        </Button>

        <Button
          onClick={() => router.push("/signin")}
          variant="text"
          block={true}
        >
          Already have an account?
        </Button>

        <Button onClick={() => router.push("/")} variant="text" block={true}>
          Go back
        </Button>
      </div>
    </Card>
  );
}
