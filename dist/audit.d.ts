/**
 * Pure SEO scoring — no I/O, so it's trivially testable. Extracts the SEO
 * essentials from an HTML string and scores them out of six presence checks.
 */
export interface SeoAudit {
    url: string;
    title: string | null;
    description: string | null;
    h1: string | null;
    ogImage: string | null;
    hasViewport: boolean;
    canonical: string | null;
    score: number;
    issues: string[];
}
export declare function auditHtml(url: string, html: string): SeoAudit;
