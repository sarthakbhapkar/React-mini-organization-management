import { createContext, useContext } from "react";
import type {UseFormReturn} from "../hooks/UseFormHook";

export const FormContext = createContext<UseFormReturn<any> | null>(null);

export function useFormContext<T>():UseFormReturn<T> {
    const context = useContext(FormContext);
    return context as UseFormReturn<T>;
}
