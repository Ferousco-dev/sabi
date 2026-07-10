"use client";
import { useId, useState } from "react";
import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  /** Optional node rendered on the right of the label row (e.g. "Forgot?"). */
  labelAdornment?: ReactNode;
  /** Optional node absolutely-positioned inside the field (e.g. eye toggle). */
  trailing?: ReactNode;
  wrapperStyle?: CSSProperties;
};

export function Input({
  label,
  labelAdornment,
  trailing,
  wrapperStyle,
  style,
  ...inputProps
}: InputProps) {
  // Generated id ties <label htmlFor> to <input id>, fixes the auth-form
  // "unlabeled field" a11y failure and makes the label click-to-focus.
  const id = useId();
  const [focused, setFocused] = useState(false);

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <label
          htmlFor={id}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--teal)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
        {labelAdornment}
      </div>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          {...inputProps}
          style={{
            width: "100%",
            minHeight: 44,
            padding: trailing ? "13px 46px 13px 16px" : "13px 16px",
            fontSize: 16, // 16px prevents iOS auto-zoom on focus
            border: `1.5px solid ${focused ? "var(--teal)" : "var(--border)"}`,
            borderRadius: "var(--radius-sm)",
            background: "#fff",
            color: "var(--teal)",
            outline: "none",
            fontFamily: "var(--font-display)",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
            ...style,
          }}
        />
        {trailing}
      </div>
    </div>
  );
}
