"use client";

import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Check,
  Plus,
  type LucideIcon,
} from "lucide-react";

interface AdminSectionWorkspaceProps {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
}

/**
 * AdminSectionWorkspace - Unified Design System
 * Uses tokens from src/styles/globals.css (Warm Canvas Theme)
 */
export default function AdminSectionWorkspace({
  sectionLabel,
  sectionTitle,
  sectionDescription,
  icon: Icon,
  iconColor = "#0020d7", // Frontend Brand Blue
  children,
}: AdminSectionWorkspaceProps) {
  return (
    <div className="flex flex-col flex-1 min-h-full overflow-hidden rounded-[33px] border-[5px] border-[#e4e4e7] bg-white shadow-2xl shadow-black/5">
      <div className="flex flex-col flex-1 bg-[#f7f4ef]/30">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-[#e4e4e7] bg-white/90 px-8 py-8 backdrop-blur-2xl">
          <div className="flex items-start gap-6">
            {Icon ? (
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-white border-2 border-[#e4e4e7] shadow-sm transition-transform hover:scale-105"
                style={{ color: iconColor }}
              >
                <Icon className="h-7 w-7" strokeWidth={1.5} />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#0020d7] font-extrabold">
                {sectionLabel}
              </p>
              <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-[#0b0b0c]">
                {sectionTitle}
              </h2>
              <p className="mt-1.5 max-w-2xl text-[14px] text-[#4a4a68] leading-relaxed font-medium">
                {sectionDescription}
              </p>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 space-y-12 p-8 lg:p-12 pb-32 bg-[#f7f4ef]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable UI Primitives ─── */

export function SectionPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border-[3px] border-[#e4e4e7] bg-white p-8 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  copy,
  icon: TitleIcon,
}: {
  title: string;
  copy?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="mb-8 flex items-start gap-5">
      {TitleIcon ? (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#0020d7]/5 text-[#0020d7] border border-[#0020d7]/10">
          <TitleIcon className="h-6 w-6" strokeWidth={1.5} />
        </div>
      ) : null}
      <div>
        <h3 className="text-[18px] font-bold tracking-tight text-[#0b0b0c]">{title}</h3>
        {copy ? (
          <p className="mt-1 text-[13px] text-[#4a4a68] leading-relaxed font-medium">{copy}</p>
        ) : null}
      </div>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  onBlur,
  className = "",
  type = "text",
  placeholder,
  icon: FieldIcon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
}) {
  return (
    <label className={`block space-y-2.5 text-[13px] ${className}`}>
      <span className="text-[#4a4a68] font-bold ml-1 tracking-tight flex items-center gap-2">
        {FieldIcon && <FieldIcon size={14} className="text-[#0020d7]" />}
        {label}
      </span>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full rounded-[18px] border-2 border-[#e4e4e7] bg-white px-5 py-4 text-[14px] text-[#0b0b0c] font-medium outline-none transition-all placeholder:text-[#c1c1c1] focus:border-[#0020d7] focus:ring-4 focus:ring-[#0020d7]/5 shadow-sm"
      />
    </label>
  );
}

export function TextareaField({
  label,
  value,
  onChange,
  className = "",
  rows = 4,
  placeholder,
  icon: AreaIcon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  rows?: number;
  placeholder?: string;
  icon?: LucideIcon;
}) {
  return (
    <label className={`block space-y-2.5 text-[13px] ${className}`}>
      <span className="text-[#4a4a68] font-bold ml-1 tracking-tight flex items-center gap-2">
        {AreaIcon && <AreaIcon size={14} className="text-[#0020d7]" />}
        {label}
      </span>
      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-[22px] border-2 border-[#e4e4e7] bg-white px-5 py-4.5 text-[14px] text-[#0b0b0c] font-medium outline-none transition-all placeholder:text-[#c1c1c1] focus:border-[#0020d7] focus:ring-4 focus:ring-[#0020d7]/5 shadow-sm"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`block space-y-2.5 text-[13px] ${className}`}>
      <span className="text-[#4a4a68] font-bold ml-1">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-[18px] border-2 border-[#e4e4e7] bg-white px-5 py-3.5 text-[14px] text-[#0b0b0c] font-medium outline-none transition-all focus:border-[#0020d7] focus:ring-4 focus:ring-[#0020d7]/5"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-[#4a4a68]">
          <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </label>
  );
}

export function TinyButton({
  children,
  onClick,
  variant = "default",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger" | "primary";
  disabled?: boolean;
  className?: string;
}) {
  const classes = {
    default:
      "rounded-full border-2 border-[#e4e4e7] bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#4a4a68] hover:bg-[#f7f4ef] transition-all active:scale-95",
    danger:
      "rounded-full border-2 border-[#ff3b30]/20 bg-[#ff3b30]/5 px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#ff3b30] hover:bg-[#ff3b30]/10 transition-all active:scale-95",
    primary:
      "rounded-full border-2 border-[#0020d7]/20 bg-[#0020d7]/5 px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0020d7] hover:bg-[#0020d7]/10 transition-all active:scale-95",
  };

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${classes[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function ActionButton({
  children,
  onClick,
  disabled,
  className = "",
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
}) {
  const classes = {
    primary:
      "inline-flex items-center justify-center gap-2 rounded-full bg-[#0020d7] px-6 py-2.5 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-lg shadow-[#0020d7]/20 hover:scale-105 hover:bg-[#001bb0] disabled:opacity-50 transition-all active:scale-95",
    secondary:
      "inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#929292] bg-white px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-widest text-[#0b0b0c] hover:bg-[#f7f4ef] transition-all active:scale-95",
    danger:
      "inline-flex items-center justify-center gap-2 rounded-full bg-[#ff3b30] px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-lg shadow-[#ff3b30]/20 hover:bg-[#e03126] transition-all active:scale-95",
  };

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${classes[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function ListEditor<T>({
  title,
  addLabel,
  items,
  onAdd,
  onRemove,
  onMove,
  icon: TitleIcon,
  renderItem,
  columns = 2,
}: {
  title: string;
  addLabel: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove?: (index: number, direction: -1 | 1) => void;
  icon?: LucideIcon;
  renderItem: (item: T, index: number) => React.ReactNode;
  columns?: 2 | 3;
}) {
  const gridClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className="mt-10 rounded-[33px] border-[3px] border-[#e4e4e7] bg-[#f7f4ef]/50 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {TitleIcon ? (
            <div className="h-10 w-10 rounded-[14px] bg-white border-2 border-[#e4e4e7] flex items-center justify-center text-[#4a4a68]">
              <TitleIcon size={20} strokeWidth={2} />
            </div>
          ) : null}
          <h4 className="text-[16px] font-extrabold text-[#0b0b0c] tracking-tight">{title}</h4>
        </div>
        <TinyButton variant="primary" onClick={onAdd}>{addLabel}</TinyButton>
      </div>
      <div className={cn("grid grid-cols-1 gap-8", gridClasses[columns])}>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col rounded-[40px] border-[3px] border-[#e4e4e7] bg-white shadow-sm group hover:shadow-xl hover:border-[#0020d7]/10 transition-all overflow-hidden"
          >
            <div className="flex-1 p-8">
               {renderItem(item, index)}
            </div>
            
            <div className="p-6 bg-[#f7f4ef]/30 border-t-2 border-[#f7f4ef] flex flex-wrap justify-end gap-3">
              {onMove ? (
                <>
                  <TinyButton onClick={() => onMove(index, -1)}>Move Up</TinyButton>
                  <TinyButton onClick={() => onMove(index, 1)}>Move Down</TinyButton>
                </>
              ) : null}
              <TinyButton variant="danger" onClick={() => onRemove(index)}>
                Remove Entry
              </TinyButton>
            </div>
          </div>
        ))}
        
        {/* Visual Add Card */}
        <button 
          onClick={onAdd}
          className="min-h-[300px] py-10 rounded-[40px] border-[3px] border-dashed border-[#e4e4e7] bg-white/50 hover:bg-white hover:border-[#0020d7]/30 hover:shadow-xl transition-all group flex flex-col items-center justify-center gap-4"
        >
           <div className="h-14 w-14 rounded-full bg-[#f7f4ef] flex items-center justify-center text-[#4a4a68] group-hover:bg-[#0020d7] group-hover:text-white transition-all duration-300">
              <Plus size={28} strokeWidth={3} />
           </div>
           <span className="text-[14px] font-extrabold text-[#4a4a68] uppercase tracking-widest group-hover:text-[#0b0b0c] transition-colors">{addLabel}</span>
        </button>
      </div>
    </div>
  );
}

export function StatusBadge({
  status,
  children,
}: {
  status: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
}) {
  const classes = {
    success: "bg-[#34c759]/10 text-[#34c759] border-[#34c759]/30",
    error: "bg-[#ff3b30]/10 text-[#ff3b30] border-[#ff3b30]/30",
    warning: "bg-[#ff9500]/10 text-[#ff9500] border-[#ff9500]/30",
    info: "bg-[#0020d7]/10 text-[#0020d7] border-[#0020d7]/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider ${classes[status]}`}
    >
      {status === "success" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <AlertCircle className="h-3.5 w-3.5" strokeWidth={3} />}
      {children}
    </span>
  );
}

// Attach sub-components for dot-notation access
AdminSectionWorkspace.ListEditor = ListEditor;
AdminSectionWorkspace.SectionPanel = SectionPanel;
AdminSectionWorkspace.SectionTitle = SectionTitle;
AdminSectionWorkspace.Field = Field;
AdminSectionWorkspace.TextareaField = TextareaField;
AdminSectionWorkspace.SelectField = SelectField;
AdminSectionWorkspace.ActionButton = ActionButton;
AdminSectionWorkspace.TinyButton = TinyButton;
AdminSectionWorkspace.StatusBadge = StatusBadge;
