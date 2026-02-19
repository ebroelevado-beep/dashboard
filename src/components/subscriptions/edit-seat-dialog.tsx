"use client";

import { useEffect, useState } from "react";
import { useUpdateSeat } from "@/hooks/use-seats";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface EditSeatDialogProps {
  seat?: {
    id: string;
    customPrice: number;
    status: "active" | "paused" | "cancelled";
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSeatDialog({ seat, open, onOpenChange }: EditSeatDialogProps) {
  const updateSeat = useUpdateSeat();
  const [customPrice, setCustomPrice] = useState("");

  useEffect(() => {
    if (open && seat) {
      setCustomPrice(seat.customPrice.toString());
    } else {
      setCustomPrice("");
    }
  }, [open, seat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seat || !customPrice) return;

    await updateSeat.mutateAsync({
      id: seat.id,
      customPrice: parseFloat(customPrice),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Seat</DialogTitle>
          <DialogDescription>
            Update the pricing for this seat assignment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-seat-price">Price (€/month)</Label>
            <Input
              id="edit-seat-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateSeat.isPending || !customPrice}>
              {updateSeat.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
