"use client";
import { useEffect, useRef, useState } from "react";

interface OTPInputProps {
  length?: number;
  onChange: (otp: string) => void;
  error?: string;
  success?: boolean;
  className?: string;
}

const OTPInput = ({ length = 6, onChange, success, error, className }: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle OTP change
  const handleChange = (index: number, value: string) => {
    if (/\D/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Trigger onChange callback
    onChange(newOtp.join(""));

    // Auto-focus to the next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    const newOtp = [...otp];

    pasteData.split("").forEach((char, i) => {
      if (/\d/.test(char)) {
        newOtp[i] = char;
      }
    });

    setOtp(newOtp);
    onChange(newOtp.join(""));
  };

  // Focus the first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className={`space-y-1 text-center ${className}`}>
      <div className='flex items-center justify-between gap-2'>
        {otp.map((digit, index) => (
          <input
            key={index}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            className={`size-1 w-12 min-w-4 h-12 min-h-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-primary text-center ${
              error ? "border-red-500" : success ? "border-green-500" : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          />
        ))}
      </div>
      <div className='min-h-5'>{error && <p className='text-red-500 text-sm'>{error}</p>}</div>
    </div>
  );
};

export default OTPInput;
