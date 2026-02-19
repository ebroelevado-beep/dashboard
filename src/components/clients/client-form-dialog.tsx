"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateClient, useUpdateClient, type Client } from "@/hooks/use-clients";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(150),
  phone: z.string().max(30).optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

type FormValues = {
  name: string;
  phone?: string;
  notes?: string;
  serviceUser?: string;
  servicePassword?: string;
};

interface ClientFormDialogProps {
  mode: "create" | "edit";
  client?: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientFormDialog({ mode, client, open, onOpenChange }: ClientFormDialogProps) {
  const t = useTranslations("clients");
  const tc = useTranslations("common");
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register, handleSubmit, reset, formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { name: "", phone: "", notes: "" },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && client) {
        reset({
          name: client.name,
          phone: client.phone ?? "",
          notes: client.notes ?? "",
        });
      } else {
        reset({ name: "", phone: "", notes: "" });
      }
    }
  }, [open, mode, client, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      phone: values.phone || null,
      notes: values.notes || null,
    };
    if (mode === "edit" && client) {
      await updateMutation.mutateAsync({ id: client.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? t("addTitle") : t("editTitle")}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? t("addDescription") : t("editDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">{t("nameLabel")}</Label>
            <Input id="client-name" placeholder={t("namePlaceholder")} {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-phone">{t("phoneLabel")}</Label>
            <Input id="client-phone" placeholder={t("phonePlaceholder")} {...register("phone")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-notes">{t("notesLabel")}</Label>
            <textarea
              id="client-notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={t("notesPlaceholder")}
              {...register("notes")}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? tc("saving") : mode === "create" ? tc("create") : tc("saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

