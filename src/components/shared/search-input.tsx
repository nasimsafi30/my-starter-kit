"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({
  placeholder = "Search...",
  onSearch,
  className,
  debounceMs = 300,
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const id = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);

      setTimeoutId(id);
    },
    [onSearch, debounceMs, timeoutId]
  );

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
