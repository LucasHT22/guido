"use client";

import { useState } from "react";

const TRANSFORMS = [
    { id: "lower", label: "lowercase", fn: s => s.toLowerCase() },
    { id: "upper", label: "UPPERCASE", fn: s => s.toUpperCase() },
    { id: "title", label: "Title Case", fn: s => s.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()) },
    { id: "sentence", label: "Sentence case", fn: s => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()) },
    { id: "camel", label: "camelCase", fn: s => s.toLowerCase().replace(/[â-z0-9]+(.)/gi, (_,c) => c.toUpperCase()) },
    { id: "pascal", label: "PascalCase", fn: s => s.toLowerCase().replace(/(^.|[^a-z0-9]+.)/gi, (_, c) => c.toUpperCase()) },
    { id: "snake", label: "snake_case", fn: s => s.trim().replace(/[^a-z0-9]+/gi, "_").toLowerCase() },
    { id: "kebab", label: "kebab-case", fn: s => s.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase() },
    { id: "constant", label: "CONSTANT_CASE", fn: s => s.trim().replace(/[^a-z0-9]+/gi, "_").toUpperCase() },
    { id: "dot", label: "dot.case", fn: s => s.trim().replace(/[^a-z0-9]+/gi, ".").toLowerCase() },
    { id: "alternating", label: "aLtErNaTiNg", fn: s => s.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("") },
    { id: "inverse", label: "iNVERSE cASE", fn: s => s.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("") },
];

export default function TextFormatter() {
    const [input, setInput] = useState("");
    const [activeId, setActiveId] = useState("lower");
    const [copied, setCopied] = useState(false);

    const active = TRANSFORMS.find(t => t.id === activeId);
    const output = active ? active.fn(input) : input;

    async function handleCopy() {
        if (!output) return;
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    }

    return (
        //
    );
}