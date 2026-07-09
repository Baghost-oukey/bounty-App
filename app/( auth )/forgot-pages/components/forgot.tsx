"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const ForgotPassword = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Send verification to:", data.email);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid h-full w-full p-4 lg:grid-cols-2">
        <div className="m-auto flex w-full max-w-xs flex-col items-center">
          <Logo className="h-9 w-9" />
          <p className="mt-4 font-medium text-xl">Reset Password</p>
          <p className="mt-2 text-center text-muted-foreground text-sm">
            Enter your email to receive a password reset verification link.
          </p>

          <form
            className="mt-8 w-full space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                    placeholder="Email"
                    type="email"
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Button className="mt-4 w-full" type="submit">
              Send Verification Link
            </Button>
          </form>

          <div className="mt-5 space-y-5">
            <p className="text-center text-sm">
              Remember your password?
              <Link className="ml-1 text-muted-foreground underline" href="/login-pages">
                Log in
              </Link>
            </p>
          </div>
        </div>
        <div className="hidden rounded-lg border bg-muted lg:block" />
      </div>
    </div>
  );
};

export default ForgotPassword;
