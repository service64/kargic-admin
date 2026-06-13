"use client"

import * as React from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import type { Control, FieldPath, FieldValues } from "react-hook-form"

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "blockquote", "code-block"],
    ["clean"],
  ],
}

type FormQuillEditorProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

function QuillEditor({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
}: {
  value: string
  onChange: (html: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const quillRef = React.useRef<Quill | null>(null)
  const onChangeRef = React.useRef(onChange)
  const onBlurRef = React.useRef(onBlur)

  onChangeRef.current = onChange
  onBlurRef.current = onBlur

  React.useEffect(() => {
    if (!containerRef.current || quillRef.current) return

    const wrapper = containerRef.current
    wrapper.innerHTML = ""
    const editorEl = document.createElement("div")
    wrapper.appendChild(editorEl)

    const quill = new Quill(editorEl, {
      theme: "snow",
      modules: QUILL_MODULES,
      placeholder,
    })

    quillRef.current = quill

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value)
    }

    quill.on("text-change", () => {
      const html = quill.root.innerHTML
      const empty = html === "<p><br></p>" || html === "<p></p>"
      onChangeRef.current(empty ? "" : html)
    })

    quill.on("selection-change", (range) => {
      if (!range) onBlurRef.current?.()
    })

    return () => {
      quillRef.current = null
      wrapper.innerHTML = ""
    }
  }, [placeholder])

  React.useEffect(() => {
    const quill = quillRef.current
    if (!quill) return
    const current = quill.root.innerHTML
    const next = value ?? ""
    const normalizedCurrent =
      current === "<p><br></p>" || current === "<p></p>" ? "" : current
    if (normalizedCurrent !== next) {
      if (!next) {
        quill.setText("")
      } else {
        quill.clipboard.dangerouslyPasteHTML(next)
      }
    }
  }, [value])

  React.useEffect(() => {
    const quill = quillRef.current
    if (!quill) return
    quill.enable(!disabled)
  }, [disabled])

  return (
    <div
      ref={containerRef}
      className={cn(
        "quill-field overflow-hidden rounded-lg border border-input bg-background transition-[color,box-shadow]",
        disabled && "pointer-events-none opacity-60",
      )}
    />
  )
}

export function FormQuillEditor<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  className,
}: FormQuillEditorProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <QuillEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={placeholder}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
