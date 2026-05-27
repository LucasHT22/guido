"use client";

import { useState } from "react";
import { G, shared, font } from "./guidotheme";

const FLIP_MAP = {a:"ɐ",b:"q",c:"ɔ",d:"p",e:"ǝ",f:"ɟ",g:"ƃ",h:"ɥ",i:"ᴉ",j:"ɾ",k:"ʞ",l:"l",m:"ɯ",n:"u",o:"o",p:"d",q:"b",r:"ɹ",s:"s",t:"ʇ",u:"n",v:"ʌ",w:"ʍ",x:"x",y:"ʎ",z:"z",A:"∀",B:"ꓭ",C:"Ɔ",D:"ᗡ",E:"Ǝ",F:"Ⅎ",G:"פ",H:"H",I:"I",J:"ſ",K:"ʞ",L:"˥",M:"W",N:"N",O:"O",P:"Ԁ",Q:"Q",R:"ɹ",S:"S",T:"┴",U:"∩",V:"Λ",W:"M",X:"X",Y:"⅄",Z:"Z","0":"0","1":"Ɩ","2":"ᄅ","3":"Ɛ","4":"ㄣ","5":"ϛ","6":"9","7":"L","8":"8","9":"6","!":"¡","?":"¿",".":"˙",",":"'","'":","," ":" "};
const MORSE = {A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--.."," ":"/"};
const LEET = {a:"4",e:"3",i:"1",o:"0",s:"5",t:"7",l:"1",g:"9",b:"8"};
const ZALGO_UP = ["̍","̎","̄","̅","̿","̑","̆","̐","͒","͗","͑","̇","̈","̊","͂","̓","̈","͊","͋","͌","̃","̂","̌","͐","́","̋","̏","̽","̉","ͣ","ͤ","ͥ","ͦ","ͧ","ͨ","ͩ","ͪ","ͫ","ͬ","ͭ","͆","̴","̵","̶"];

function toSlug(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");
}

function toFlip(s) {
    return s.split("").map(c => FLIP_MAP[c] || c).reverse().join("");
}

function toMorse(s) {
    return s.toUpperCase().split("").map(c => MORSE[c] || c).join(" ");
}

function toLeet(s) {
    return s.split("").map(c => LEET[c.toLowerCase()] || c).join("");
}

function toPigLatin(s) {
    return s.split(" ").map(w => { const m = w.match(/^([^aeiou]*)([aeiou].*)$/i); if (!m) return w + "ay"; return m[2] + m[1] + "ay"; }).join(" ");
}

function toRot13(s) {
    return s.replace(/[a-zA-Z]/g, c => { const base = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base); });
}

function toZalgo(s) {
    return s.split("").map(c => { if (c === " ") return c; let r = c; const n = Math.floor(Math.random() * 4) + 1; for (let i = 0; i < n; i++) r += ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)]; return r; }).join("");
}

function toBase64Enc(s) { try { return btoa(unescape(encodeURIComponent(s))); } catch { return "[invalid input]"; } }

function toBase64Dec(s) { try { return decodeURIComponent(escape(atob(s.trim()))); } catch { return "[invalid base64]"; } }

function stripHtml(s) { return s.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"); }

function sortLines(s) { return s.split("\n").sort((a,b) => a.localeCompare(b)).join("\n"); }

function dedupLines(s) { const seen = new Set(); return s.split("\n").filter(l => { if (seen.has(l)) return false; seen.add(l); return true; }).join("\n"); }

function trimAll(s) { return s.trim().replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n"); }

function jsonStringify(s) { return JSON.stringify(s); }

const GROUPS = [
    {
        label: "Case",
        transforms: [
            { id: "lower", label: "lowercase", fn: s => s.toLowerCase() },
            { id: "upper", label: "UPPERCASE", fn: s => s.toUpperCase() },
            { id: "title", label: "Title Case", fn: s => s.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()) },
            { id: "sentence", label: "Sentence case", fn: s => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()) },
            { id: "alternating", label: "aLtErNaTiNg", fn: s => s.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("") },
            { id: "inverse", label: "iNVERSE cASE", fn: s => s.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("") },
        ],
    },
    {
        label: "Code",
        transforms: [
            { id: "camel", label: "camelCase", fn: s => s.toLowerCase().replace(/[â-z0-9]+(.)/gi, (_,c) => c.toUpperCase()) },
            { id: "pascal", label: "PascalCase", fn: s => s.toLowerCase().replace(/(^.|[^a-z0-9]+.)/gi, (_, c) => c.toUpperCase()) },
            { id: "snake", label: "snake_case", fn: s => s.trim().replace(/[^a-z0-9]+/gi, "_").toLowerCase() },
            { id: "kebab", label: "kebab-case", fn: s => s.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase() },
            { id: "constant", label: "CONSTANT_CASE", fn: s => s.trim().replace(/[^a-z0-9]+/gi, "_").toUpperCase() },
            { id: "dot", label: "dot.case", fn: s => s.trim().replace(/[^a-z0-9]+/gi, ".").toLowerCase() },
            { id: "slug", label: "url-slug", fn: toSlug },
        ],
    },
    {
        label: "Dev",
        transforms: [
            { id: "base64enc", label: "Base64 encode", fn: toBase64Enc },
            { id: "base64dec", label: "Base64 decode", fn: toBase64Dec },
            { id: "striphtml", label: "Strip HTML", fn: stripHtml },
            { id: "jsonstr", label: "JSON stringify", fn: jsonStringify },
            { id: "sortlines", label: "Sort lines", fn: sortLines },
            { id: "deduplines", label: "Deduplicate lines", fn: dedupLines },
            { id: "trim", label: "Trim spaces", fn: trimAll },
        ],
    },
    {
        label: "Fun",
        transforms: [
            { id: "flip", label: "ʇdılɟ", fn: toFlip },
            { id: "leet", label: "1337", fn: toLeet },
            { id: "morse", label: "Morse code", fn: toMorse },
            { id: "piglatin", label: "Pig Latin", fn: toPigLatin },
            { id: "zalgo", label: "Z̴a̷l̸g̵o̶", fn: toZalgo },
        ],
    },
];

const ALL = GROUPS.flatMap(g => g.transforms);

function stats(s) {
    const chars = s.length;
    const words = s.trim() === "" ? 0 : s.trim().split(/\s+/).length;
    const lines = s === "" ? 0 : s.split("\n").length;
    return { chars, words, lines };
}

const st = {
    //
}

export default function TextFormatter() {
    const [input, setInput] = useState("");
    const [activeGroup, setActiveGroup] = useState("Case");
    const [activeId, setActiveId] = useState("lower");
    const [copied, setCopied] = useState(false);

    const group = GROUPS.find(g => g.label === activeGroup);
    const active = ALL.find(t => t.id === activeId) || group.transforms[0];
    const output = active.fn(input);
    const s = stats(input);

    async function handleCopy() {
        if (!output) return;
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    }

    function selectGroup(label) {
        setActiveGroup(label);
        const g = GROUPS.find(g => g.label === label);
        setActiveId(g.transforms[0].id);
    }

    return (
        //
    );
}