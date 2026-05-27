"use client";

import { useState, useMemo } from "react";
import { G, shared, font } from "./guidotheme";

function computeDiff(a, b) {
    const aLines = a.split("\n");
    const bLines = b.split("\n");
    const result = [];

    const m = aLines.length, n = bLines.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--)
        for (let j = n - 1; j >= 0; j--)
            dp[i][j] = aLines[i] === bLines[j] ? dp[i+1][j+1] + 1 : Math.max(dp[i+1][j], dp[i][j+1]);

    let i = 0, j = 0;
    while (i < m || j < n) {
    if (i < m && j < n && aLines[i] === bLines[j]) {
        result.push({ type: "same", text: aLines[i] });
        i++; j++;
    } else if (j < n && (i >= m || dp[i+1] && dp[i][j+1] >= (dp[i+1]?.[j] ?? 0))) {
        result.push({ type: "added", text: bLines[j] });
        j++;
    } else {
        result.push({ type: "removed", text: aLines[i] });
        i++;
    }
  }
  return result;
}

const st = {
    //
}

export default function Diffchecker() {
    const [left, setLeft] = useState("");
    const [right, setRight] = useState("");

    const diff = useMemo(() => computeDiff(left, right), [left, right]);
    const added = diff.filter(d => d.type === "added").length;
    const removed = diff.filter(d => d.type === "removed").length;
    const same = diff.filter(d => d.type === "same").length;

    return (
        //
    );
}