"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordChangeSchema, type PasswordChangeFormValues } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function PasswordChangeForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmit = async (data: PasswordChangeFormValues) => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to change password");
      }

      toast.success("Password changed successfully!");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="currentPassword"
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            disabled={isLoading}
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />

          <div className="space-y-2">
            <Input
              id="newPassword"
              label="New Password"
              type="password"
              placeholder="Enter new password"
              disabled={isLoading}
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <Input
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            disabled={isLoading}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          Change Password
        </Button>
      </div>
    </form>
  );
}