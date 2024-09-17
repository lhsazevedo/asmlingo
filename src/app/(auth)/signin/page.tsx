"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/AuthProvider";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";

type SignInFields = {
  email: string;
  password: string;
};

type SignInFormErrors = {
  form?: string;
  email?: string;
  password?: string;
};

export default function SignInForm() {
  const router = useRouter();
  const { recheckAuth } = useAuth();
  const [state, setState] = useState<SignInFields>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<SignInFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/signin", {
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
        setErrors({
          form: "Invalid email or password. Please try again.",
        });
        return;
      }

      throw new Error("Unexpected error occurred");
    } catch (error) {
      console.error("Signin error:", error);
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
        Welcome back!
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
          onClick={() => void handleSignIn()}
          disabled={isLoading}
          block={true}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
        <Button
          onClick={() => router.push("/signup")}
          variant="text"
          block={true}
        >
          Or create an account
        </Button>

        <Button
          onClick={() => router.push("/")}
          variant="text"
          block={true}
        >
          Go back
        </Button>
      </div>
    </Card>
  );
}
