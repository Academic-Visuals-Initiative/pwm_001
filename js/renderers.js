function labelStyle(d) {
    return d.label_color ? ' style="color:' + d.label_color + ';"' : '';
}

var renderers = {};

renderers.contact = function(data) {
    var d = data.data;
    var icons = '';
    d.icons.forEach(function(ic) {
        icons += '<a href="' + ic.url + '" target="_blank" title="' + escapeHTML(ic.label) + '">' +
            '<img src="assets/icons/academic social icons/' + ic.name + '.svg" alt="' + escapeHTML(ic.label) + '" style="display:block;width:24px;height:24px;object-fit:contain;opacity:0.7;transition:opacity .2s;">' +
        '</a>';
    });
    var addr = d.address ? '<p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:4px;">' + formatText(escapeHTML(d.address)) + '</p>' : '';
    var extra = d.extra_line ? '<p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:20px;">' + formatText(escapeHTML(d.extra_line)) + '</p>' : '';
    return '<div class="section">' +
        '<span class="section-label"' + labelStyle(d) + '>' + escapeHTML(d.label) + '</span>' +
        '<p style="margin-bottom:10px;">' + formatText(escapeHTML(d.text || '')) + '</p>' +
        addr + extra +
        '<div style="display:flex;gap:12px;flex-wrap:wrap;">' + icons + '</div>' +
    '</div>';
};

renderers.education = function(data) {
    var d = data.data;
    var items = '';
    d.items.forEach(function(item) {
        items += '<div style="margin-bottom:20px;">' +
            '<div style="font-size:0.85rem;font-weight:600;">' + formatText(escapeHTML(item.degree)) + '</div>' +
            '<div style="font-size:0.85rem;color:var(--text-muted);">' + formatText(escapeHTML(item.institution)) + ' &mdash; ' + formatText(escapeHTML(item.year)) + '</div>' +
            (item.description ? '<p style="font-size:0.9rem;margin-top:6px;">' + formatText(escapeHTML(item.description)) + '</p>' : '') +
        '</div>';
    });
    return '<div class="section">' +
        '<span class="section-label"' + labelStyle(d) + '>' + escapeHTML(d.label) + '</span>' +
        items +
    '</div>';
};

renderers.about = function(data) {
    var d = data.data;
    var paras = '';
    d.paragraphs.forEach(function(p) {
        paras += '<p>' + formatText(p) + '</p>';
    });
    return '<div class="section">' +
        '<span class="section-label"' + labelStyle(d) + '>' + escapeHTML(d.label) + '</span>' +
        paras +
    '</div>';
};

renderers.publications = function(data) {
    var d = data.data;
    var papers = '';
    d.papers.forEach(function(p, i) {
        papers += '<div style="display:flex;gap:8px;margin-bottom:20px;">' +
            '<span style="font-weight:600;min-width:20px;">' + (i + 1) + '.</span>' +
            '<div><p style="margin-bottom:2px;"><strong><a href="' + p.url + '">' + formatText(escapeHTML(p.title)) + '</a></strong></p>' +
            (p.authors ? '<p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:2px;">' + formatText(escapeHTML(p.authors)) + '</p>' : '') +
            '<p style="font-size:0.85rem;color:var(--text-muted);font-style:italic;">' + formatText(escapeHTML(p.meta)) + '</p></div>' +
        '</div>';
    });
    return '<div class="section">' +
        '<span class="section-label"' + labelStyle(d) + '>' + escapeHTML(d.label) + '</span>' +
        papers +
    '</div>';
};

renderers.research = function(data) {
    var d = data.data;
    var html = '';
    if (d.paragraphs) {
        d.paragraphs.forEach(function(p) { html += '<p>' + formatText(p) + '</p>'; });
    } else if (d.texts) {
        d.texts.forEach(function(t) { html += '<p>' + formatText(t) + '</p>'; });
    } else if (d.items) {
        html += '<ul>';
        d.items.forEach(function(item) { html += '<li>' + formatText(escapeHTML(item.label)) + ': ' + formatText(escapeHTML(item.value)) + '</li>'; });
        html += '</ul>';
    }
    return '<div class="section">' +
        '<span class="section-label"' + labelStyle(d) + '>' + escapeHTML(d.label) + '</span>' +
        html +
    '</div>';
};
