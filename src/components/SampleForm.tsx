import { useForm } from "../hooks/UseFormHook";
import { Form } from "./Form.tsx";
import { Field } from "./Field.tsx";

type SampleFormData = {
    name: string;
    email: string;
};

export default function SampleForm() {
    const form = useForm<SampleFormData>({
        initialValues: { name: "", email: "" },
        validate: (values) => {
            const errors: Partial<Record<keyof SampleFormData, string>> = {};
            if (!values.name) errors.name = "Name is required";
            if (!values.email.includes("@")) errors.email = "Email is invalid";
            return errors;
        },
        onSubmit: (values) => {
            alert(`Submitted: ${JSON.stringify(values)}`);
        },
    });

    return (
        <Form form={form}>
            <Field<SampleFormData, "name">
                name="name"
                label="Name"
                required
                render={({ name, value, onChange }) => (
                    <input
                        id={name}
                        name={name}
                        type="text"
                        value={value as string}
                        onChange={onChange}
                        disabled={form.isSubmitted}
                        style={{ display: "block", width: "100%", padding: "0.5rem" }}
                    />
                )}
            />

            <Field<SampleFormData, "email">
                name="email"
                label="Email"
                required
                render={({ name, value, onChange }) => (
                    <input
                        id={name}
                        name={name}
                        type="email"
                        value={value as string}
                        onChange={onChange}
                        disabled={form.isSubmitted}
                        style={{ display: "block", width: "100%", padding: "0.5rem" }}
                    />
                )}
            />
        </Form>

    );
}
