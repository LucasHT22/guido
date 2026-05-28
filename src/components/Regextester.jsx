"use client";

import { useState, useMemo } from "react";
import { G, shared, font } from "./guidotheme";

const FLAGS_LIST = [
    { flag: "g", label: "global" },
    { flag: "i", label: "ignore case" },
    { flag: "m", label: "multiline" },
    { flag: "s", label: "dot all" },
];

const PRESETS = [
    { label: "Email", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "g" },
    { label: "URL", pattern: "https?:\\/\\/[^\\s]+", flags: "g" },
    { label: "Phone", pattern: "(\\+?\\d[\\d\\s\\-().]}\\d)", flags: "g" },
    { label: "Hex color", pattern: "#([0-9a-fA-F]{3}){1,2}\\b", flags: "g" },
    { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
    { label: "Date", pattern: "\\d{4}[-/]\\d{2}[-/]\\d{2}", flags: "g" },
];

function highlight(text, regex) {
    const parts = [];
    let last = 0;
    let m;
    regex.lastIndex = 0;
    while ((m = regex.exec(text)) !== null) {
        if (m.index > last) parts.push({ text: text.slice(last, m.index), match: false });
        parts.push({ text: m[0], match: true });
        last = m.index + m[0].length;
        if (!regex.global) break;
    }
    if (last < text.length) parts.push({ text: text.slice(last), match: false });
    return parts;
}

const st = {
    //
};

export default function RegexTester() {
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState(new Set(["g"]));
    const [text, setText] = useState("");

    function toggleFlag(f) {
        setFlags(prev => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n; });
    }

    const { regex, error } = useMemo(() => {
        if (!pattern) return { regex: null, error: null };
        try { return { regex: new RegExp(pattern, [...flags].join("")), error: null }; } catch(e) { return { regex: null, error: e.message }; }
    }, [pattern, flags]);

    const parts = useMemo(() => regex && text ? highlight(text, regex) : null, [regex, text]);
    const matches = useMemo(() => {
        if (!regex || !text) return [];
        regex.lastIndex = 0;
        const ms = [];
        let m;
        while ((m = new RegExp(pattern, [...flags].join("")).exec(text)) !== null) {
            ms.push({ full: m[0], groups: m.slice(1), index: m.index });
            if (!flags.has("g")) break;
        }
        return ms;
    }, [regex, text, pattern, flags]);

    return (
        //
    );
}