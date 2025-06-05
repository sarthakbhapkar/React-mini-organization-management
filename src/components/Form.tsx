import { FormContext } from "../context/FormContext";
import {type ReactNode} from "react";
import type {UseFormReturn} from "../hooks/UseFormHook";

type FormProps<T> = {
    form:UseFormReturn<T>;
    children: ReactNode;
    showSave?: boolean;
    showReset?: boolean;
};

export function Form<T>({
                            form,
                            children,
                            showSave = true,
                            showReset = true,
                        }: FormProps<T>) {
    return (
        <FormContext.Provider value={form}>
            <form onSubmit={form.handleSubmit}>
                {children}
                <div style={{ marginTop: "1rem" }}>
                    {showSave && (
                        <button type="submit" disabled={form.isSubmitted}>
                            Save
                        </button>
                    )}
                    {showReset && (
                        <button type="button" onClick={form.resetForm}>
                            Reset
                        </button>
                    )}
                </div>
            </form>
        </FormContext.Provider>
    );
}