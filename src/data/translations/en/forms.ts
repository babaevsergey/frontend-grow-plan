import type { ContentTranslationMap } from "../types";

export const formsEn: ContentTranslationMap = {
  "forms-rhf-register-vs-controller": {
    title: "React Hook Form: register vs Controller",
    shortExplanation:
      "register directly wires a native DOM input into the form via ref, without triggering a re-render on every keystroke; Controller is an adapter for integrating controlled components (a custom select, a date picker) that have no regular DOM value/onChange to hook a ref into.",
    detailedExplanation:
      "register('fieldName') returns a set of props (ref, onChange, onBlur, name) wired directly into a native input — React Hook Form tracks the value via ref and native events, never triggering a re-render of the form component on keystrokes, which is the main source of the library's performance edge. The problem arises with UI-kit components (MUI Select, a custom DatePicker) that don't accept a ref directly or use their own internal value-management model incompatible with a native input's onChange — register doesn't work for these. Controller wraps such a component and hands it a field object ({ value, onChange, onBlur, ref }) via a render prop, taking on the job of bridging React Hook Form's internal model with the third-party component's API — because of this, Controller does re-render the wrapped component on every change (unlike register), since that's the only way to sync the value for a controlled component.",
    whereUsed:
      "register — for regular native input/textarea/select. Controller — for any third-party or custom form components (MUI, Ant Design, custom date pickers/selects/rich-text editors) that aren't plain native elements.",
    pitfalls: [
      "Trying to use register directly on a third-party controlled component with no ref support — the library won't be able to track the value correctly.",
      "Wrapping a plain native input in Controller where a simple register would do — adds an unnecessary re-render.",
    ],
  },
  "forms-validation-zod-yup": {
    title: "Form Validation: Zod / Yup",
    shortExplanation:
      "Zod and Yup are schema-validation libraries: instead of scattered manual checks per field, rules are described declaratively in a single schema, which both validates data at runtime and (for Zod) derives a TypeScript type from itself.",
    detailedExplanation:
      "A schema describes the form's shape and data constraints declaratively (z.string().email(), z.number().min(18)), and it can be reused in several places: to validate the form on the client, to validate a request body on the server (if the backend is also Node/TypeScript), and as the source of a TypeScript type via z.infer<typeof schema>, eliminating drift between 'what we validate' and 'what type we expect'. React Hook Form integrates with schema validators via resolvers (zodResolver(schema), yupResolver(schema)) — this means you don't hand-write field validation inside register, you just pass a ready-made schema to useForm({ resolver }), and all validation applies automatically on submit (and optionally on change/blur). Zod is generally more 'TypeScript-first' (types are derived automatically from the schema), while Yup historically came from the plain JavaScript world and requires either a separately written type or inference via InferType, which is slightly less direct.",
    whereUsed:
      "Any form with non-trivial validation (registration, checkout, profile settings), especially where it matters to keep client-side validation in sync with the API contract and TypeScript types.",
    pitfalls: [
      "Duplicating validation rules separately on the client and server instead of reusing the same schema (where the stack allows it).",
      "Making a validation schema overly strict for intermediate form states (e.g. requiring a field to be filled before the user has even touched it).",
    ],
  },
  "forms-large-form-optimization": {
    title: "Optimizing Large Forms",
    shortExplanation:
      "A large form (dozens of fields, dynamic sections, nested arrays) needs dedicated performance attention: the wrong architecture makes the entire form re-render on every keystroke in any field.",
    detailedExplanation:
      "The uncontrolled approach (register in React Hook Form) is the first and most important step: it fundamentally doesn't trigger a form re-render on input, unlike controlled inputs backed by useState per field, where changing one field re-renders the component containing all the other fields. For dynamic field lists (phone numbers, shipping addresses), useFieldArray manages the field array efficiently without recreating every row when one is added/removed. To show an error or value for just one specific field instead of the whole form component reacting to any change, useWatch with a specific field name is used, or a subscription-pattern component that subscribes narrowly rather than reading the entire formState via a top-level hook. Finally, expensive computations depending on form values (complex cross-field validation, computing a total) should be memoized and, where possible, debounced, if they're costly and don't need to recompute on every keystroke.",
    whereUsed:
      "Multi-step onboarding forms, checkout forms with dynamic line items, admin forms with dozens of settings, forms with cross-validation of several dependent fields.",
    pitfalls: [
      "Using one shared useState object for the whole form with fully controlled inputs across 50+ fields.",
      "Subscribing to the entire formState via a top-level hook where only one specific field's value is needed.",
    ],
  },
};
