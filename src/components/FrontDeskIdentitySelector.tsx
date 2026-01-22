"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const FRONT_DESK_NAMES = ["Dannish", "Danna", "April"] as const;

type FrontDeskIdentitySelectorProps = {
  onSelect: (name: string) => void;
};

export function FrontDeskIdentitySelector({ onSelect }: FrontDeskIdentitySelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <Card className="w-full max-w-sm space-y-6 shadow-2xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Front Desk
          </p>
          <h1 className="text-2xl font-bold text-zinc-900">Who&apos;s on shift?</h1>
          <p className="text-sm text-zinc-500 mt-1">Select your name to continue</p>
        </div>

        <div className="space-y-3">
          {FRONT_DESK_NAMES.map((name) => (
            <Button
              key={name}
              className="w-full h-14 text-lg font-semibold"
              variant="secondary"
              onClick={() => onSelect(name)}
            >
              {name}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
