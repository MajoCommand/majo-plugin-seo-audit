function firstMatch(html, re) {
    const m = html.match(re);
    return m && m[1] !== undefined ? m[1].trim() : null;
}
export function auditHtml(url, html) {
    const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
    const ogImage = firstMatch(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);
    const canonical = firstMatch(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
    const rawH1 = firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1 = rawH1 === null ? null : rawH1.replace(/<[^>]+>/g, "").trim() || null;
    const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    const issues = [];
    let passed = 0;
    const check = (ok, issue) => {
        if (ok) {
            passed += 1;
        }
        else {
            issues.push(issue);
        }
    };
    check(title !== null, "Missing <title>");
    check(description !== null, "Missing meta description");
    check(h1 !== null, "Missing an <h1> heading");
    check(ogImage !== null, "No og:image — social shares won't have a preview");
    check(hasViewport, "No viewport meta — the page isn't mobile-ready");
    check(canonical !== null, "No canonical URL");
    // Advisory (don't lower the score, but worth flagging).
    if (title !== null && title.length > 60) {
        issues.push("Title is longer than 60 characters");
    }
    if (description !== null && description.length > 160) {
        issues.push("Meta description is longer than 160 characters");
    }
    return {
        url,
        title,
        description,
        h1,
        ogImage,
        hasViewport,
        canonical,
        score: Math.round((passed / 6) * 100),
        issues,
    };
}
