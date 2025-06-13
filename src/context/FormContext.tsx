import React, { createContext, useContext } from "react";
import type {UseFormReturn} from "../hooks/UseFormHook";

export const FormContext = createContext<UseFormReturn<any> | null>(null);

export function useFormContext<T>():UseFormReturn<T> {
    const context = useContext(FormContext);
    if(!context)
        throw new Error("useFormContext must be used within a FormProvider");
    return context as UseFormReturn<T>;
}

export function FormProvider<T>({ value, children }: { children: React.ReactNode; value: UseFormReturn<T> }) {
    return(
        <FormContext.Provider value={value}>
            {children}
        </FormContext.Provider>
    );
}
