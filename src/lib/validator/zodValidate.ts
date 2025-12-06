import { ZodSchema } from "zod";
import { FormikErrors } from "formik";

export function zodValidate(schema: ZodSchema<any>) {
    return (values: Record<string, any>): FormikErrors<Record<string, any>> => {
        const parsed = schema.safeParse(values);
        if (parsed.success) return {};

        const formikErrors: FormikErrors<Record<string, any>> = {};

        for (const issue of parsed.error.issues) {
            const key = issue.path.join(".") || "form";
            if (!(key in formikErrors)) {
                (formikErrors as Record<string, string>)[key] = issue.message;
            }
        }

        return formikErrors;
    };
}