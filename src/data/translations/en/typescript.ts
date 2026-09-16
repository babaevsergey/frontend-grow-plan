import type { ContentTranslationMap } from "../types";

export const typescriptEn: ContentTranslationMap = {
  "ts-generics": {
    title: "Generics",
    shortExplanation:
      "Generics let you write functions, types, and components that work with different data types while preserving type safety.",
    detailedExplanation:
      "Instead of writing a separate function for every data type or using any (losing type checking entirely), generics introduce a 'type parameter' — like <T> — that gets substituted with a real type at the call site. TypeScript infers T automatically from the arguments, but it can also be specified explicitly. Generics are used heavily in React (e.g. useState<T>()), in array utilities, and in API clients. Constraints via extends (e.g. <T extends { id: string }>) let you require a minimal set of properties on the type parameter while keeping flexibility: the function still accepts any type that definitely has an id, instead of locking in one specific interface. Multiple generic parameters at once are common — as in the groupBy example below, where T describes the array element type and K the grouping key type, with TypeScript linking them via the getKey: (item: T) => K signature. Default values for generic parameters (<T = string>) are handy in components and utilities mostly used with one particular type, while still allowing an explicit override. It's worth distinguishing a generic function from one accepting a union of all possible types: a union forces you to write the same branching logic for every variant, while a generic writes the logic once and merely parameterizes the type, preserving the input-output relationship for each specific call.",
    pitfalls: [
      "Using a generic where a simple concrete type would do — adds reading overhead with no benefit.",
      "Confusing a generic parameter with any when no constraint (extends) is given.",
    ],
    practiceTask:
      "Write a generic function groupBy<T, K extends string | number>(items: T[], getKey: (item: T) => K): Record<K, T[]>.",
  },
  "ts-union-types": {
    title: "Union Types",
    shortExplanation:
      "A union type is a type whose value can be one of several listed types, e.g. string | number.",
    detailedExplanation:
      "Union types (A | B) describe a value that can genuinely take different shapes — a typical example: a request result { status: 'loading' } | { status: 'success', data: T } | { status: 'error', error: string }. TypeScript forces you to check which variant you're dealing with (via narrowing) before accessing fields specific to one of them. A union of objects sharing a common discriminator field (status, in the example below) is called a discriminated union, and it's the most practical kind of union in real code: TypeScript can narrow the entire object with a single comparison on that field, instead of checking every property separately. Unions can be built from primitives (string | number) or literal values ('idle' | 'loading' | 'error') too, and it's worth stressing the difference from an intersection (A & B): a union is 'one of', an intersection is 'all at once', and they're often confused precisely because the syntax differs by a single character. Accessing a field shared by all union members doesn't require narrowing — the problem only arises with fields that aren't present in every variant. In practice, a discriminated union is a type-safe replacement for the 'one big object with a bunch of optional fields and implicit rules about which fields go together' pattern, ruling out a whole class of bugs like 'what if result.data exists while result.status is error'.",
    pitfalls: [
      "Forgetting to handle one of the union's variants — TypeScript will flag it via an exhaustiveness check with never.",
      "Making unions too broad (string | number | boolean | object), losing the point of having a type at all.",
    ],
    practiceTask:
      "Describe a discriminated union for a Shape = Circle | Square | Rectangle and write an area(shape: Shape): number function with a full switch breakdown.",
  },
  "ts-narrowing": {
    title: "Narrowing",
    shortExplanation:
      "Narrowing is the process by which TypeScript refines (narrows) a broad type down to a more specific one, based on checks in the code.",
    detailedExplanation:
      "TypeScript analyzes conditions — typeof, instanceof, in, comparison against a literal, custom type guard functions (value is Type) — and 'narrows' the variable's type inside the corresponding branch of code. This lets you safely work with union types without explicit type casts (as). Narrowing works not just on function parameters, but on any variable accessible in the enclosing scope — including object properties and array elements, if TypeScript can prove the value couldn't have changed between the check and the use (e.g. via another function with a side effect). That's exactly why storing a value in an intermediate const sometimes helps the compiler 'not lose' the narrowing: if you check obj.value directly instead of a previously saved const value = obj.value, TypeScript might decide value is a getter that could have changed between the check and the use, and refuse to narrow the type. Custom type guard functions (value is Type) are especially useful where built-in operators aren't enough — for instance, checking the shape of an arbitrary object that arrived from the server as unknown, where typeof and instanceof can't distinguish a specific data shape. Unlike a type cast via as, which merely 'promises' the compiler that the type is what you said (and might be false at runtime), a properly written type guard genuinely checks the condition at runtime, so its narrowing is safer and can't 'lie' to the compiler.",
    pitfalls: [
      "Relying on as instead of real narrowing — the compiler stops actually verifying correctness.",
      "Forgetting that narrowing 'breaks' if the variable is reassigned via a closure between the check and its use.",
    ],
    practiceTask:
      "Write a type guard isError(value: unknown): value is Error and use it inside a try/catch block to safely access error.message.",
  },
  "ts-never": {
    title: "never",
    shortExplanation:
      "never is a type meaning 'a value that will never occur': the function never completes normally, or the branch of code is unreachable.",
    detailedExplanation:
      "never is used in two main cases: for functions that always throw or loop forever (function fail(): never { throw new Error() }), and for exhaustiveness checking in union types — if, after handling every switch case, a value of type never remains, that means every case is covered. If a new variant is later added to the union and handling it is forgotten, TypeScript flags the error right at the never line. never occupies a special place in the type hierarchy: it's the 'bottom' type, a subtype of literally every other type — so a value of type never can be assigned to a variable of any type, but not the other way around (no other value can be assigned to a never-typed variable except never itself). This same property makes never an 'absorbing' element in a union: A | never always simplifies back to A, because never literally contributes zero possible values to the union. For functions returning never, it's important not to confuse 'never completes normally' with 'returns nothing' — a function that logs an error and returns undefined has type void, not never, even if it's essentially 'doing nothing useful'. The exhaustiveness-check pattern is especially valuable in team development: if a colleague adds a new union variant somewhere else six months from now, the compiler itself will point to every place where a switch on that union needs updating — instead of relying on someone remembering to manually find every such switch across the project.",
    pitfalls: [
      "Confusing never with void in function signatures.",
      "Skipping exhaustiveness checks and getting unhandled cases at runtime that the compiler could have caught.",
    ],
    practiceTask:
      "Add a third variant ('triangle') to Shape from the example and confirm the compiler complains at the never line until you add handling for it.",
  },
  "ts-mapped-types": {
    title: "Mapped Types",
    shortExplanation:
      "Mapped types let you build a new type by iterating over all keys of an existing type and transforming them (e.g. making every field optional).",
    detailedExplanation:
      "The syntax { [K in keyof T]: ... } iterates over every key of type T and applies the given transformation to each field. The built-in utility types Partial<T>, Required<T>, Readonly<T>, Pick<T, K>, Record<K, V> are exactly mapped types defined in TypeScript's standard library. You can write your own too — for instance, a type that turns every field of an object into a getter function. Modifiers inside a mapped type can be removed as well as added, via a minus prefix: -readonly and -? strip readonly and optionality respectively — that's exactly how Required<T> (the inverse of Partial<T>) is defined in the standard library, removing the question mark from every field instead of adding one. Key remapping via as (as in the Getters<T> example below) landed in TypeScript 4.1 and lets you not just copy keys one-to-one, but transform their names too — adding a get prefix, filtering out some keys via never in the as position (which drops the key from the resulting type entirely), or combining several conditions. Mapped types are often combined with conditional types (T extends U ? X : Y) for a finer-grained transformation of each field based on its own type — for instance, wrapping only the fields that weren't originally functions in a Promise. Worth stressing: all of this happens entirely at compile time and produces no runtime code — no trace of Partial<User> survives in the compiled JavaScript, unlike classes or enums, which generate real objects.",
    pitfalls: [
      "Manually duplicating interfaces for an 'almost identical' type instead of using mapped types.",
      "Forgetting about key remapping (as) and not being able to rename keys in the new type.",
    ],
    practiceTask:
      "Write your own mapped type Nullable<T> that makes every field of T either its original type or null.",
  },
  "ts-type-vs-interface": {
    title: "type vs interface",
    shortExplanation:
      "interface and type are largely interchangeable for describing an object's shape, but their extension mechanics and capability sets differ: interface can be augmented after declaration (declaration merging), while type can describe unions, intersections, primitives, and conditional types.",
    detailedExplanation:
      "interface supports declaration merging — declaring the same interface twice makes TypeScript automatically merge their fields into one type; libraries deliberately use this to extend other people's types (e.g. augmenting the global Window or Express's Request types). type doesn't merge this way — redeclaring the same type in one scope is a compile error. On the other hand, only type can describe a union (A | B), a primitive alias (type ID = string), or the result of a mapped/conditional type — interface is fundamentally limited to describing the shape of objects (and classes). Different syntax is used for extension: interface extends Other, while type intersects via &.",
    pitfalls: [
      "Trying to describe a union with interface — impossible, interface only describes an object's shape.",
      "Not realizing declaration merging for interface is a feature, not a bug, and stumbling into it accidentally (e.g. two same-named interfaces in different files silently merging).",
    ],
  },
  "ts-intersection-types": {
    title: "Intersection Types",
    shortExplanation:
      "An intersection type (A & B) describes a value that satisfies all listed types simultaneously — unlike a union (A | B), where a value matches at least one of them.",
    detailedExplanation:
      "Intersections are most often used for composition: taking a base type and 'adding' extra fields to it without modifying the original definition — for instance, WithLoading<T> = T & { isLoading: boolean }. If two intersected types have a same-named field with different disjoint primitive types (e.g. { id: string } & { id: number }), the id field becomes never, because no value can be both a string and a number at once — a common cause of unexpected errors when intersecting complex types. Intersecting object types behaves predictably (merges all fields), but intersecting primitives or a union with a primitive almost always yields a meaningless or empty result, which is why intersection is rarely used outside object shapes.",
    pitfalls: [
      "Intersecting primitive types directly (string & number) hoping for something meaningful — the result is always never.",
      "Missing a field conflict when intersecting complex types and being confused by an unexplained 'Type X is not assignable to type never' error.",
    ],
  },
  "ts-type-guards": {
    title: "Type Guards",
    shortExplanation:
      "A type guard is a function that checks a value at runtime and tells the compiler, via a special signature (value is Type), that inside the true branch the value can safely be treated as a narrower type.",
    detailedExplanation:
      "The signature function isUser(value: unknown): value is User tells the compiler: 'if this function returned true, treat value as User from here on' — the check inside the function itself is just ordinary code (e.g. 'id' in value && typeof (value as any).id === 'string'). A type guard is especially useful for unknown data coming from outside (an API response, localStorage, postMessage), where no built-in typeof/instanceof operator can distinguish a complex object shape. A type guard can be combined with arrays via .filter(isUser) — TypeScript can narrow the result's type from (User | null)[] to User[], as long as the predicate has a correct is signature. Unlike a plain cast via as, a guard actually runs the check at runtime — so it can't 'lie' to the compiler if it's written correctly.",
    pitfalls: [
      "Writing a guard whose signature (value is Type) doesn't match what the function actually checks — the compiler trusts the signature even if the check inside is incomplete.",
      "Using as instead of a guard for server-provided data just because 'it should formally be this shape'.",
    ],
  },
  "ts-unknown-vs-any": {
    title: "unknown vs any",
    shortExplanation:
      "any completely disables type checking for a value — anything can be done with it with no compile errors; unknown also accepts a value of any type, but doesn't allow doing anything with it until the type has been narrowed by an explicit check.",
    detailedExplanation:
      "A value can be assigned to any from anywhere, and from that point TypeScript simply stops checking anything for that variable — it's effectively an official 'escape hatch' from the type system that can silently propagate through the whole chain of subsequent calls. unknown, by contrast, is safe: anything can be assigned to a value of type unknown, but it can't be used (calling a method, accessing a property, passing it somewhere a specific type is expected) until TypeScript is convinced, via narrowing (typeof, instanceof, a type guard), that the type has been narrowed to something concrete. That's exactly why unknown is the right default type for data arriving from outside (a fetch response, JSON.parse, catch (error)), where the real type is unknown at compile time — it's recommended as a replacement for any 'for external data that hasn't been validated yet'.",
    pitfalls: [
      "Using any 'to get TypeScript off your back' instead of unknown with subsequent narrowing — this silently disables type checking for the entire chain of the value's use.",
      "Accessing properties on an unknown value directly with no prior check — the compiler correctly flags this as an error.",
    ],
  },
  "ts-keyof": {
    title: "keyof",
    shortExplanation:
      "keyof T is a type-level operator that returns a union of all key names of type T as string (or number/symbol) literals.",
    detailedExplanation:
      "For type User = { id: string; name: string; age: number }, the type keyof User is equivalent to 'id' | 'name' | 'age' — a union of literals, not a runtime value. This lets you write functions that accept 'a key of this object' and get type-level protection against typos and access to non-existent fields — e.g. getProp<T, K extends keyof T>(obj: T, key: K): T[K]. keyof underlies most of the built-in mapped types (Partial, Pick, Record, and others), which internally iterate over exactly keyof T to build a new type from the existing keys.",
    pitfalls: [
      "Typing a property-name parameter as plain string instead of keyof T — all typo protection is lost.",
      "Forgetting that keyof is a purely type-level construct with no presence in the compiled JS, so it can't be used directly as a runtime value.",
    ],
  },
  "ts-typeof-operator": {
    title: "typeof as a Type Operator",
    shortExplanation:
      "In a type position, typeof someValue takes an already-existing runtime value (a variable, constant, or function) and turns its shape into a type — a separate TypeScript feature, not to be confused with the runtime typeof x operator, which returns a string.",
    detailedExplanation:
      "This is especially useful when the 'source of truth' is a value rather than a separately declared type — a config object, a const array, or an object from a third-party library, for instance. Instead of duplicating the structure in a separate interface (risking it drifting out of sync with the real value), you can derive the type directly from the value via typeof config, and the type updates automatically whenever config changes. A common combination is typeof together with keyof: typeof someObject gives the shape of the object, and keyof typeof someObject gives a union of its actual keys, which is handy for strictly typed enum-like objects.",
    pitfalls: [
      "Confusing the type-level typeof with the runtime typeof operator, as if they were the same construct working the same way 'everywhere'.",
      "Manually duplicating an object's structure in a separate interface instead of deriving it via typeof from an existing value.",
    ],
  },
  "ts-infer": {
    title: "infer",
    shortExplanation:
      "infer is used inside a conditional type to 'extract' and name a part of a type that the compiler infers from context — e.g. a function's return type, or the type wrapped inside a Promise/array.",
    detailedExplanation:
      "infer only works inside an extends condition: T extends (...args: any[]) => infer R ? R : never — here TypeScript tries to match T against a function signature, and if it succeeds, R becomes that function's return type. This is exactly how the built-in ReturnType<T> (extracts a function's return type) and Awaited<T> (recursively unwraps nested Promise<Promise<...>> down to the final value) utilities are built internally. infer can be used for your own needs too — e.g. to get an array's element type (T extends (infer U)[] ? U : never), or a component's props type without touching its source code.",
    pitfalls: [
      "Trying to use infer outside an extends position — syntactically invalid, infer only works inside a conditional type.",
      "Writing deeply nested conditional types with multiple infer clauses — such code becomes extremely hard to read and debug.",
    ],
  },
  "ts-conditional-types": {
    title: "Conditional Types",
    shortExplanation:
      "A conditional type is a construct of the form T extends U ? X : Y, which at the type level works like a ternary operator: it picks one of two types depending on whether T is a subtype of U.",
    detailedExplanation:
      "If T is a union, a conditional type automatically distributes (distributive conditional types) over each union member separately, then the results are unioned back together — e.g. ToArray<string | number> becomes string[] | number[], not (string | number)[], unless T is wrapped in brackets to disable this behavior. Conditional types are especially powerful combined with infer (see the separate topic) — that's exactly how every utility that extracts part of a type based on a condition (ReturnType, Parameters, Awaited) is built. Library code often uses chains of conditional types to implement type-level 'overloading' — different results for different shapes of the input type without writing a separate function for each case.",
    pitfalls: [
      "Not accounting for distributive behavior when passing a union into a conditional type and getting an unexpected union of results instead of one combined type.",
      "Overusing deeply nested conditional types where a regular function overload or a couple of separate types would read far more simply.",
    ],
  },
  "ts-utility-types": {
    title: "Utility Types: Partial, Pick, Omit, Record, Required, Readonly, ReturnType, Parameters, Awaited",
    shortExplanation:
      "Utility types are generic types built into TypeScript's standard library for common transformations: making fields optional/required, picking or excluding some fields, describing a dictionary, or extracting a type from a function/promise.",
    detailedExplanation:
      "Partial<T> makes every field of T optional (handy for edit forms or partial updates via PATCH requests), while Required<T> does the opposite, making every field mandatory by stripping the ? mark. Pick<T, K> keeps only the listed keys K, while Omit<T, K> excludes them — especially useful for forms: Omit<User, 'id' | 'createdAt'>, for instance, describes the data needed to create a user, without the fields the server generates. Record<K, V> builds a dictionary type with keys K and values V (Record<string, number> is an object shaped like { [key: string]: number }), and Readonly<T> forbids reassigning fields at the type level (though it doesn't prevent runtime mutation). ReturnType<T> and Parameters<T> extract, respectively, a function's return type and its argument-tuple type, and Awaited<T> recursively unwraps a Promise, which is especially handy for getting an async function's result type without describing it manually.",
    pitfalls: [
      "Using Partial<T> for an API response type where every field is actually required — this hides real bugs instead of catching them.",
      "Forgetting Readonly<T> is only a compile-time check; at runtime the object can still be mutated directly or via as.",
    ],
  },
  "ts-as-const": {
    title: "as const",
    shortExplanation:
      "as const turns a literal value (array, object, string) into its narrowest possible, immutable (readonly) type — instead of string, TypeScript infers the specific literal 'admin', and an array becomes a tuple with readonly fields.",
    detailedExplanation:
      "Without as const, TypeScript usually 'widens' literals during inference: const status = 'active' inside an object or array, with no explicit annotation, is often inferred as string rather than the literal 'active' — convenient for variables that get reassigned later, but inconvenient when preserving the exact value matters, e.g. for a discriminated union. as const after a value locks in exactly the literals written in the code, and additionally makes arrays/objects readonly, forbidding mutation at the type level. This is especially useful together with typeof and keyof: as const on a config object lets you derive a strict union of valid values from it instead of duplicating that union manually in a separate type.",
    pitfalls: [
      "Forgetting as const on a config object and being surprised that typeof config[key] gives string instead of specific literals.",
      "Trying to mutate an array/object marked as const — TypeScript correctly flags this as an error, which can be surprising to someone unaware of the readonly effect.",
    ],
  },
  "ts-satisfies": {
    title: "satisfies",
    shortExplanation:
      "satisfies checks that a value matches a given type, but, unlike an explicit annotation (: Type), doesn't 'widen' the value's inferred type — the compiler still knows the exact literals and exact shape the value actually had.",
    detailedExplanation:
      "If you write const config: Record<string, string | number> = {...}, TypeScript does check compatibility, but from then on treats every field of config as string | number, even if it's actually always a specific number — so accessing config.retries loses its exact literal/numeric type. const config = {...} satisfies Record<string, string | number> performs the same compatibility check against the type, but the type of the config variable itself is inferred from the original literal as usual (with all its exact fields), rather than being narrowed to the checked type. This is especially valuable combined with as const: satisfies first checks the structure matches the expected shape (e.g. that every value is either a string or a number), and as const additionally locks in exact literals for later use via typeof/keyof.",
    pitfalls: [
      "Using a regular annotation where preserving exact literal types matters (e.g. for strict discriminated-union configs).",
      "Confusing satisfies with as — satisfies actually checks compatibility and errors on mismatch, while as simply 'forces belief' with no check at all.",
    ],
  },
  "ts-enums-vs-union-literals": {
    title: "Enums vs Union Literals",
    shortExplanation:
      "enum creates a real runtime structure (an object in the compiled JS), whereas a union of string literals ('active' | 'inactive') exists only at the type level and produces no JS code at all.",
    detailedExplanation:
      "A numeric enum, by default, generates a two-way mapping (Status.Active === 0 and Status[0] === 'Active' simultaneously), which bloats the compiled output and can cause confusion when serializing to JSON. const enum solves the bloated-output problem (values are inlined at compile time), but is incompatible with some bundlers/modes (isolatedModules, used by most modern toolchains like Vite/esbuild), which is why its use is now often discouraged. A union of string literals requires no runtime object import, serializes to JSON exactly as-is, and is generally considered the more idiomatic choice for React/TS projects today — especially combined with as const on a dictionary object, if you still need 'by-value' access rather than just a type.",
    pitfalls: [
      "Using const enum in a project built with esbuild/Vite/Babel under isolatedModules — this can cause a build error or incorrect transpilation.",
      "Relying on a numeric enum's automatic numbering and inserting a new value in the middle of the list — this shifts the numeric values of every subsequent member.",
    ],
  },
  "ts-typing-react-props": {
    title: "Typing React Props",
    shortExplanation:
      "Component props are usually described with an interface or type suffixed Props, including optional fields marked with ?, default values via destructuring, and a special type for children.",
    detailedExplanation:
      "React.ReactNode is the broadest, and usually correct, type for children (accepts strings, numbers, JSX, arrays, null/undefined), whereas JSX.Element is narrower — it doesn't include null or a string, and only fits where a component is guaranteed to render exactly a JSX element. For a prop accepting an event handler, the right type isn't just Function, but a specific signature like (event: React.MouseEvent<HTMLButtonElement>) => void, which gives autocomplete on the event's fields. A component with generic props (a universal List<T>, say) is described as a generic function: function List<T>(props: { items: T[]; renderItem: (item: T) => ReactNode }) — this gives you typing linking 'array element' to 'what renderItem renders' for whatever concrete T is used at each call site.",
    pitfalls: [
      "Typing children as JSX.Element and hitting compile errors on completely ordinary text content in a component.",
      "Typing an event handler as a generic Function instead of a concrete React event signature — losing autocomplete and protection against an incorrect callback signature.",
    ],
  },
  "ts-typing-events": {
    title: "Typing Events (React SyntheticEvent)",
    shortExplanation:
      "React wraps native DOM events in SyntheticEvent — a cross-browser wrapper with the same API as the native event — and types its specific variants via a generic parameterized by the DOM element type.",
    detailedExplanation:
      "Every event type in React has a specialized TypeScript type — React.ChangeEvent<HTMLInputElement> for an input's onChange, React.FormEvent<HTMLFormElement> for a form's onSubmit, React.KeyboardEvent<HTMLInputElement> for onKeyDown — the generic parameter specifies exactly what event.currentTarget will be, giving correct autocomplete for currentTarget.value, currentTarget.checked, and similar fields. It's important to distinguish event.target from event.currentTarget: target is the element the event actually occurred on (which can be a child, if the event bubbled), while currentTarget is specifically the element the handler is attached to — and in TypeScript, only currentTarget is typed via the event signature's generic. For handlers declared outside JSX (not inline), the event type needs to be specified manually in the function signature, otherwise TypeScript can't infer it automatically.",
    pitfalls: [
      "Accessing event.target.value in an input handler and getting a type error — event.currentTarget.value is the correct choice.",
      "Forgetting to specify the element's generic parameter on the event type in a handler declared separately from JSX — then autocomplete on currentTarget doesn't work at all.",
    ],
  },
  "ts-typing-refs": {
    title: "Typing Refs",
    shortExplanation:
      "useRef<T>(initialValue) is typed via a parameter T matching either a DOM element (useRef<HTMLInputElement>(null) for a reference to a DOM node) or an arbitrary mutable value unrelated to rendering.",
    detailedExplanation:
      "For a DOM ref, the typical signature is useRef<HTMLInputElement>(null): an initial value of null is required, because the actual DOM node only appears after the first render, and TypeScript accordingly infers ref.current's type as HTMLInputElement | null — so a null check is usually needed before use (ref.current.focus()). For a 'regular' mutable value (a render counter, a timer id, a prop's previous value), useRef<number>(0) is used without null — here ref.current has a concrete type right away with no check needed, because the initial value is set immediately rather than appearing later, asynchronously. When passing a ref to a child component via forwardRef, the signature looks like forwardRef<HTMLInputElement, Props>((props, ref) => ...) — the first generic parameter describes the ref's own type, the second the component's regular props type.",
    pitfalls: [
      "Accessing ref.current directly with no null check right after declaring useRef, before the component has actually mounted.",
      "Typing a 'regular' (non-DOM) mutable ref as accepting null where the initial value is set immediately and null is logically impossible.",
    ],
  },
  "ts-typing-api-responses": {
    title: "Typing API Responses",
    shortExplanation:
      "A fetch/axios response is untyped by default (any or unknown after .json()), so real type safety comes either from manually describing the response interface, or from runtime schema validation (Zod/Yup), which validates the data and derives a TypeScript type from the schema at the same time.",
    detailedExplanation:
      "response.json() in fetch returns Promise<any> — TypeScript can't statically know the shape of data that actually arrived over the network, so a simple cast via as ApiResponse is merely a programmer's promise backed by nothing at runtime: if the backend changes the response shape, the app keeps compiling but breaks at runtime on real data. The right approach is runtime validation: describe a schema via Zod (const UserSchema = z.object({ id: z.string(), name: z.string() })) and get the TypeScript type automatically via z.infer<typeof UserSchema>, then run the actual response through UserSchema.parse(rawData), which both validates the data at runtime and produces a type-safe result. For edge cases (a response can be either success or error), a good practice is an explicit discriminated union ApiResult<T> = { status: 'success'; data: T } | { status: 'error'; error: string } instead of mixing optional fields into one flat object.",
    pitfalls: [
      "Casting an API response via as instead of real runtime validation, and only finding out about schema drift from production bugs.",
      "Describing an API response as one flat interface with a pile of optional fields instead of a success/error discriminated union.",
    ],
  },
  "ts-dto-vs-viewmodel": {
    title: "DTO vs ViewModel",
    shortExplanation:
      "A DTO (Data Transfer Object) is the shape of data exactly as the server sends it per the API contract; a ViewModel is the same data reshaped for the needs of a specific screen/UI component, and the two shapes need not match.",
    detailedExplanation:
      "A DTO often contains fields that are awkward or redundant for the UI directly: dates as ISO-format strings instead of Date objects, nested ids instead of resolved objects, fields named per backend conventions (snake_case), redundant technical fields (internal record versions, service flags). A ViewModel is the result of mapping a DTO into something convenient specifically for rendering: formatted date strings, computed derived fields (fullName from firstName + lastName), keys renamed to frontend conventions, data filtered down to what a given screen actually needs. Separating DTO from ViewModel is a protective layer at the application boundary: if the backend changes its response shape, only the mapper (DTO -> ViewModel) needs to change, in one place, rather than dozens of components across the app that would otherwise rely on the raw API shape directly.",
    pitfalls: [
      "Passing a DTO straight down into deeply nested components with no single transformation point — an API contract change then scatters across the whole component tree.",
      "Making a ViewModel a one-to-one copy of the DTO with no real benefit — then it's just an extra layer with no added value.",
    ],
  },
};
