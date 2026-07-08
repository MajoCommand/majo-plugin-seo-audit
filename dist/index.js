// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Majo SEO Audit — a standalone plugin (its own repo) that fetches every
 * deployed project's live site and scores its on-page SEO. Reads the workspace
 * only through the scoped API it's handed; reaches the sites via http:outbound.
 *
 * Route: GET /api/plugins/majo.seo-audit/audit
 */
import { definePlugin } from "@majo/plugin-sdk";
import { auditHtml } from "./audit";
export { auditHtml } from "./audit";
export default definePlugin({
    manifest: {
        id: "majo.seo-audit",
        name: "SEO Audit",
        version: "0.1.0",
        description: "Scores each deployed project's live site on core on-page SEO.",
        permissions: ["projects:read", "http:outbound", "api:route"],
        official: true,
        tier: "core",
    },
    register(ctx) {
        ctx.registerRoute({
            method: "GET",
            path: "/audit",
            handler: async () => {
                const projects = (await ctx.api.projects.list()).filter((p) => p.liveUrl !== null);
                const results = [];
                for (const project of projects) {
                    const url = project.liveUrl;
                    try {
                        const response = await fetch(url, { redirect: "follow" });
                        const html = await response.text();
                        results.push({ project: project.title, ...auditHtml(url, html) });
                    }
                    catch {
                        results.push({ project: project.title, url, error: "unreachable" });
                    }
                }
                return new Response(JSON.stringify({ audited: results.length, results }, null, 2), {
                    status: 200,
                    headers: { "content-type": "application/json" },
                });
            },
        });
    },
});
