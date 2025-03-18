import { useFormContext } from "react-hook-form";
import Text from "./text";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import { useState } from "react";
import { input } from "@/config/styles";

interface InputProps {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  validation?: Record<string, unknown>;
  multiline?: boolean;
}

export default function FormInput({
  name,
  label,
  type,
  placeholder,
  validation,
  multiline = false,
}: InputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // useState() for removing the placeholder on focus
  const [placeholderState, setPlaceholderState] = useState(placeholder);

  // Properties for both input and textarea
  const commonProps = {
    id: name,
    placeholder: placeholderState,
    ...register(name, validation),
    onFocus: () => setPlaceholderState(""),
    onBlur: () => setPlaceholderState(placeholder),
    className: clsx(input, multiline && "min-h-[150px] md:min-h-[15rem] block"),
  };

  // Extracting error message safely
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div>
      <label htmlFor={name}>{label}</label>

      {multiline ? (
        <textarea {...commonProps}></textarea>
      ) : (
        <input type={type} {...commonProps} />
      )}

      <AnimatePresence mode="wait" initial={false}>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "fit-content", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="alert"
          >
            <Text level="sm" customs="text-alarm pt-1 leading-[1]">
              {errorMessage}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
