import { Search } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  debounceTime?: number;
  className?: string;
  disabled?: boolean;
}

const SearchInput = ({
  placeholder = "Tìm kiếm...",
  value: externalValue,
  onChange,
  onSearch,
  debounceTime = 500,
  className = "",
  disabled = false,
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = useState(externalValue || "");
  const [debouncedValue, setDebouncedValue] = useState(externalValue || "");

  // Update internal value when external value changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
      setDebouncedValue(externalValue);
    }
  }, [externalValue]);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(internalValue);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [internalValue, debounceTime]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    
    // Call onChange immediately for controlled components
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={internalValue}
        onChange={handleInputChange}
        disabled={disabled}
        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default SearchInput;
