"use client"

import { useState } from "react";
import { G, shared, font } from "./guidotheme";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function word(exclude = "") {
    let w; do { w = WORDS[Math.floor(Math.random() * WORDS.length)]; } while (w === exclude);
    return w;
}

function sentence(minWords = 8, maxWords = 18) {
    const len = minWords + Math.floor(Math.random() * (maxWords - minWords));
    const words = Array.from({ length: len }, (_, i) => i === 0 ? word() : word());
    words[0] = words[0][0].toUpperCase() + words[0].slice(1);
    return words.join(" ") + ".";
}

function paragraph(minSentences = 3, maxSentences = 7) {
    const len = minSentences + Math.floor(Math.random() * (maxSentences - minSentences));
    return Array.from({ length: len }, () => sentence()).join(" ");
}

function generate(type, count, startClassic) {
    const prefix = startClassic ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " : "";
    if (type === "words") {
        const ws = Array.from({ length: count }, (_, i) => word());
        ws[0] = ws[0][0].toUpperCase() + w[0].slice(1);
        return prefix + ws.join(" ") + ".";
    }
    if (type === "sentences") {
        return prefix + Array.from({ length: count }, () => sentence()).join(" ");
    }
    return prefix + Array.from({ length: count }, () => paragraph()).join("\n\n");
}

const st = {
    //
};

export default function LoremGenerator() {
    const [type, setType] = useState("paragraphs");
    const [count, setCount] = useState(3);
    const [startClassic, setClassic] = useState(true);
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    function handleGenerate() {
        setOutput(generate(type, Math.max(1, count), startClassic));
    }

    async function handleCopy() {
        if (!output) return;
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    }

    const charCount = output.length;
    const wordCount = output.trim() === "" ? 0 : output.trim().split(/\s+/).length;

    return (
        //
    );
}