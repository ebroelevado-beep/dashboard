"use client";

import { useDeleteClient, type Client } from "@/hooks/use-clients";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

interface DeleteClientDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteClientDialog({ client, open, onOpenChange }: DeleteClientDialogProps) {
  const t = useTranslations("clients");
  const tc = useTranslations("common");
  const deleteMutation = useDeleteClient();

  const handleDelete = async () => {
    if (!client) return;
    await deleteMutation.mutateAsync(client.id);
    onOpenChange(false);
  };

  const activeSeats = client?.clientSubscriptions.filter((cs) => cs.status === "active").length ?? 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("deleteTitle", { name: client?.name ?? "" })}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span>{t("deleteDescription")}</span>
            {activeSeats > 0 && (
              <span className="block font-medium text-destructive">
                {t("deleteActiveSeats", { count: activeSeats })}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? tc("deleting") : tc("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
