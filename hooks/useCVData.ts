"use client";

import { useCallback, useRef, useState } from "react";
import {
  capitalizeWords,
  CVData,
  validateDateRange,
  validateField,
  validateCV,
} from "@/types/cv";

export function useCVData() {
  const cursorRefs = useRef<Map<HTMLInputElement | HTMLTextAreaElement, number>>(new Map());

  const formatName = useCallback((value: string): string => {
    return capitalizeWords(value);
  }, []);

  const handleNameChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (formatted: string) => void
  ) => {
    const input = e.target;
    const cursorPos = input.selectionStart;
    const formatted = formatName(input.value);
    input.value = formatted;
    onChange(formatted);
    if (typeof cursorPos === "number") {
      input.setSelectionRange(cursorPos, cursorPos);
    }
  }, [formatName]);

  const handleTextChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: (value: string) => void
  ) => {
    onChange(e.target.value);
  }, []);

  const handleRangeChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    onChange(parseInt(e.target.value, 10));
  }, []);

  const createItem = useCallback(<T extends { id: string }>(
    factory: (id: string) => T
  ): T => {
    return factory(`${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  }, []);

  return {
    formatName,
    handleNameChange,
    handleTextChange,
    handleRangeChange,
    createItem,
  };
}

export function useCVValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((ruleKey: string, value: string): string | null => {
    const error = validateField(ruleKey, value);
    setErrors((prev) => {
      if (error) return { ...prev, [ruleKey]: error };
      const next = { ...prev };
      delete next[ruleKey];
      return next;
    });
    return error;
  }, []);

  const validateDateRangeFields = useCallback(
    (
      startKey: string,
      startValue: string,
      endKey: string,
      endValue: string
    ) => {
      const result = validateDateRange(startValue, endValue);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[startKey];
        delete next[endKey];
        if (result.startDate) next[startKey] = result.startDate;
        if (result.endDate) next[endKey] = result.endDate;
        return next;
      });
      return result;
    },
    []
  );

  const validateAll = useCallback((data: CVData): boolean => {
    const allErrors = validateCV(data);
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearError = useCallback((key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    validate,
    validateDateRangeFields,
    validateAll,
    clearErrors,
    clearError,
    isValid,
  };
}
