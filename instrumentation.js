import { Client } from "langsmith";
import { registerOTel } from "@vercel/otel";
import { AISDKExporter } from "langsmith/vercel";

const langsmithClient = new Client({
    apiKey: process.env.LANGSMITH_API_KEY || "YOUR_API_KEY",
    apiUrl: process.env.LANGSMITH_ENDPOINT || "https://api.smith.langchain.com",
});

export function registerInstrumentation() {
    registerOTel({
        serviceName: "langsmith-vercel-ai-sdk",
        traceExporter: new AISDKExporter({ client: langsmithClient }),
    });
} 