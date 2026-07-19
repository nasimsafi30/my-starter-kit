"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileForm() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <UserAvatar
              src={user?.image}
              name={user?.name}
              email={user?.email}
              className="h-16 w-16"
            />
            <div>
              <h4 className="font-medium">{user?.name || "Your Avatar"}</h4>
              <p className="text-sm text-muted-foreground">
                This is your public avatar
              </p>
            </div>
          </div>

          <Input
            id="name"
            label="Full Name"
            placeholder="John Doe"
            disabled={isLoading}
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="john@example.com"
            disabled={isLoading}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="image"
            label="Avatar URL"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            disabled={isLoading}
            error={errors.image?.message}
            {...register("image")}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
