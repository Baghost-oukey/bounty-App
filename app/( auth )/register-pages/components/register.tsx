"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/logo";
import { AlertCircle, CheckCircle } from "lucide-react";

import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal harus 8 karakter"),
});

const Register = () => {
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message || "Gagal melakukan registrasi.");
      setLoading(false);
    } else {
      // If user session is created immediately (meaning email confirmation is disabled)
      if (signUpData.session) {
        setSuccess("Registrasi berhasil! Mengalihkan ke pengisian profil...");
        setTimeout(() => {
          window.location.href = "/complete-profile";
        }, 1500);
      } else {
        setSuccess("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (googleError) {
      setError(googleError.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">

      <div className="grid h-full w-full p-4 lg:grid-cols-2">
        <div className="m-auto flex w-full max-w-xs flex-col items-center">
          <Logo className="h-9 w-9" />
          <p className="mt-4 font-medium text-xl">Daftar Akun Bounty</p>

          {error && (
            <div className="mt-4 w-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-3 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 text-left animate-in fade-in duration-200">
              <AlertCircle className="shrink-0 mt-0.5" size={14} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 w-full bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-lg p-3 flex items-start gap-2.5 text-xs text-green-600 dark:text-green-400 text-left animate-in fade-in duration-200">
              <CheckCircle className="shrink-0 mt-0.5" size={14} />
              <span>{success}</span>
            </div>
          )}

          <Button
            variant="outline"
            className="mt-6 w-full gap-2.5 rounded-lg h-10 border-border"
            type="button"
            disabled={loading}
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="h-5 w-5" />
            <span>Continue with Google</span>
          </Button>

          <div className="my-6 flex w-full items-center justify-center overflow-hidden">
            <Separator />
            <span className="px-2 text-sm">OR</span>
            <Separator />
          </div>
          <form
            className="w-full space-y-4 text-left"
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
                    placeholder="Email Anda"
                    type="email"
                    disabled={loading}
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                    placeholder="Password Baru Anda"
                    type="password"
                    disabled={loading}
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Button className="mt-4 w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold" type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mendaftar...
                </span>
              ) : (
                "Daftar dengan Email"
              )}
            </Button>
          </form>

          <div className="mt-5 space-y-5">
            <Link
              className="block text-center text-muted-foreground text-sm underline"
              href="/forgot-pages"
            >
              Forgot your password?
            </Link>
            <p className="text-center text-sm">
              Already have an account?
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

export default Register;
