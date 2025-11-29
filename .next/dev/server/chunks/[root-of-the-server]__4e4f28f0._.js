module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const SYSTEM_PROMPT = `You are a helpful AI productivity assistant integrated into a smart calendar app. Your role is to:
- Provide personalized productivity advice
- Help users with time management strategies
- Give tips on effective time blocking and scheduling
- Suggest productivity techniques and best practices
- Help users analyze their schedule and habits
- Motivate users to stay focused and productive

Be conversational, supportive, and practical. Keep responses concise but informative. Focus on actionable advice that users can immediately implement.`;
async function POST(request) {
    try {
        const { message, conversationHistory } = await request.json();
        if (!message || typeof message !== "string") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid message"
            }, {
                status: 400
            });
        }
        // Determine which provider to use: Gemini (Google) or OpenAI.
        const useGemini = String(process.env.USE_GEMINI ?? "false").toLowerCase() === "true";
        const useOpenAI = String(process.env.USE_OPENAI ?? "true").toLowerCase() !== "false";
        const geminiKey = process.env.GEMINI_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        // If Gemini is explicitly requested and key present, call Gemini.
        if (useGemini && geminiKey) {
            // Build a prompt by concatenating system prompt + conversation history + user message
            const promptParts = [
                SYSTEM_PROMPT
            ];
            if (conversationHistory && Array.isArray(conversationHistory)) {
                for (const item of conversationHistory){
                    const role = item.role === "assistant" ? "Assistant" : "User";
                    promptParts.push(`${role}: ${item.content}`);
                }
            }
            promptParts.push(`User: ${message}`);
            const promptText = promptParts.join("\n\n");
            // Allow overriding the Gemini model via env var; default to text-bison-001
            const geminiModelRaw = String(process.env.GEMINI_MODEL ?? "text-bison-001").trim();
            const modelCandidates = [];
            // Accept forms like "text-bison-001" or "models/text-bison-001"
            if (geminiModelRaw.startsWith("models/")) {
                modelCandidates.push(geminiModelRaw);
                modelCandidates.push(geminiModelRaw.replace(/^models\//, ""));
            } else {
                modelCandidates.push(geminiModelRaw);
                modelCandidates.push(`models/${geminiModelRaw}`);
            }
            // Try each candidate model path until one succeeds
            let lastErrorBody = null;
            for (const candidate of modelCandidates){
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta2/models/${encodeURIComponent(candidate)}:generateText?key=${encodeURIComponent(geminiKey)}`;
                try {
                    const geminiResp = await fetch(geminiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            prompt: {
                                text: promptText
                            },
                            // parameters can be adjusted if desired
                            temperature: 0.7,
                            maxOutputTokens: 512
                        })
                    });
                    if (!geminiResp.ok) {
                        let errorBody = null;
                        try {
                            errorBody = await geminiResp.json();
                        } catch (e) {
                        // ignore
                        }
                        lastErrorBody = errorBody;
                        console.error(`Gemini API error for model ${candidate}:`, errorBody);
                        // If it's a NOT_FOUND for this candidate, try the next candidate
                        const status = errorBody?.error?.status || errorBody?.status || null;
                        const code = errorBody?.error?.code || errorBody?.code || null;
                        const msg = errorBody?.error?.message || errorBody?.message || "";
                        // If model-specific 404/NOT_FOUND, continue to try other candidate strings
                        if (geminiResp.status === 404 || status === "NOT_FOUND" || /not found/i.test(String(msg))) {
                            continue;
                        }
                        // Map common quota / resource errors to insufficient_quota
                        if (code === "RESOURCE_EXHAUSTED" || /quota|exceed|exceeded/i.test(String(msg))) {
                            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                                error: "insufficient_quota",
                                message: "Gemini (Google) quota exceeded. Please check your Google Cloud billing and quotas or set USE_GEMINI=false to use a different provider or mock responses."
                            }, {
                                status: 402
                            });
                        }
                        continue;
                    }
                    // Success
                    const geminiData = await geminiResp.json().catch(()=>null);
                    const geminiText = geminiData?.candidates?.[0]?.content || geminiData?.candidates?.[0]?.output?.[0]?.content || geminiData?.output?.[0]?.content || null;
                    if (geminiText) {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            response: geminiText
                        });
                    }
                    // If no usable text, record warning and try next
                    lastErrorBody = {
                        message: "Gemini returned no text"
                    };
                } catch (e) {
                    // network / unexpected error - record and continue
                    lastErrorBody = {
                        message: String(e)
                    };
                    console.error("Gemini request failed:", e);
                }
            }
            // If we tried candidates and none worked, provide a clear NOT_FOUND / model guidance
            const errMsg = lastErrorBody?.error?.message || lastErrorBody?.message || "Requested Gemini model not found or inaccessible.";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "gemini_model_not_found",
                message: `Gemini model not found or inaccessible. Tried model variants: ${modelCandidates.join(", ")}.\nError: ${errMsg}\nEnsure the Generative Language API is enabled and your API key has access to the requested model (and billing is enabled).`
            }, {
                status: 404
            });
        }
        // If OpenAI is enabled and key present, use OpenAI next
        if (!useOpenAI || !openaiKey) {
            // Return a mock response if no provider is available or OpenAI disabled
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                response: generateMockResponse(message)
            });
        }
        // Build messages array for OpenAI
        const messages = [
            {
                role: "system",
                content: SYSTEM_PROMPT
            },
            ...conversationHistory || [],
            {
                role: "user",
                content: message
            }
        ];
        // Call OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });
        if (!response.ok) {
            // Try to parse the error body from OpenAI to provide helpful feedback
            let errorBody = null;
            try {
                errorBody = await response.json();
            } catch (e) {
            // ignore
            }
            console.error("OpenAI API error:", errorBody);
            const openaiErrorCode = errorBody?.error?.code || errorBody?.error?.type || null;
            // If the error indicates insufficient quota, return a clear error payload
            if (openaiErrorCode === "insufficient_quota" || openaiErrorCode === "insufficient_quota") {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "insufficient_quota",
                    message: "OpenAI quota exceeded. Please check your OpenAI billing and plan at https://platform.openai.com/account/usage or set USE_OPENAI=false to use mock responses."
                }, {
                    status: 402
                });
            }
            // For other errors, fall back to the mock response but include error info
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                response: generateMockResponse(message),
                warning: errorBody?.error?.message || "OpenAI API returned an error, using fallback response"
            });
        }
        const data = await response.json();
        const assistantMessage = data.choices?.[0]?.message?.content || "I couldn't generate a response.";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            response: assistantMessage
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
// Mock response generator for when API key is not configured
function generateMockResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    // Time blocking tips
    if (lowerMessage.includes("time block") || lowerMessage.includes("schedule")) {
        return "Great question about time blocking! Here are some tips:\n\n✓ Block 90 minutes for deep work sessions - this is the optimal duration for focused work\n✓ Include buffer time (15-30 minutes) between meetings or classes\n✓ Schedule breaks every 2 hours - even 5-10 minutes helps maintain productivity\n✓ Batch similar tasks together to reduce context switching\n✓ Be realistic about how long tasks actually take\n✓ Protect your deep work blocks - they're precious!";
    }
    // Productivity advice
    if (lowerMessage.includes("productivity") || lowerMessage.includes("focus")) {
        return "Here are some proven productivity strategies:\n\n🎯 Pomodoro Technique: Work for 25 minutes, then take a 5-minute break\n🎯 Energy Management: Schedule high-priority tasks during your peak energy hours\n🎯 Single-tasking: One task at a time is more effective than multitasking\n🎯 Remove distractions: Turn off notifications during focused work\n🎯 Track your progress: Seeing progress is motivating!\n\nWhat specific area would you like help with?";
    }
    // Stress/overwhelm
    if (lowerMessage.includes("overwhelm") || lowerMessage.includes("stress") || lowerMessage.includes("busy")) {
        return "Feeling overwhelmed is common! Here's how to manage it:\n\n1. List everything on your mind - get it out of your head\n2. Prioritize ruthlessly - focus on what truly matters\n3. Break large projects into smaller, manageable tasks\n4. Say no to non-essential commitments\n5. Schedule breaks and downtime - rest is productive\n6. Celebrate small wins - progress builds momentum\n\nRemember: You can't do everything. Focus on what matters most!";
    }
    // Default response
    return "That's a great question! Here are some thoughts:\n\n• Start by identifying your most important tasks\n• Block time for deep, focused work on these priorities\n• Use your calendar to visualize your time and spot patterns\n• Track which activities are actually productive for you\n• Adjust your schedule based on what works best\n\nWhat specific productivity challenge are you facing? I'm here to help!";
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4e4f28f0._.js.map