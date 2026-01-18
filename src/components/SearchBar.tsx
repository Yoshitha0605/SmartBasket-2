import { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, autoFocus }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        inputMode="search"
        placeholder="Search groceries..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 pr-12 h-14 rounded-2xl bg-card border-border shadow-soft text-foreground placeholder:text-muted-foreground text-base touch-target"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center text-muted-foreground active:scale-95 touch-target"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
