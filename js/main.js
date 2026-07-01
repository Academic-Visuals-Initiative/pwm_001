(function() {
    'use strict';

    var app = document.getElementById('app');

    function setHeader(header) {
        var nameEl = document.getElementById('headerName');
        var subtitleEl = document.getElementById('headerSubtitle');
        var instEl = document.getElementById('headerInstitution');
        var imgEl = document.getElementById('headerImage');
        if (nameEl && header.name) nameEl.textContent = header.name;
        if (nameEl && header.name_color) nameEl.style.color = header.name_color;
        if (subtitleEl && header.subtitle) subtitleEl.textContent = header.subtitle;
        if (subtitleEl && header.subtitle_color) subtitleEl.style.color = header.subtitle_color;
        if (instEl && header.institution) instEl.textContent = header.institution;
        if (imgEl && header.image) {
            imgEl.src = header.image;
            if (header.image_alt) imgEl.alt = header.image_alt;
        }
    }

    function setMeta(siteData) {
        if (siteData.title) {
            var titleEl = document.getElementById('pageTitle');
            if (titleEl) titleEl.textContent = siteData.title;
        }
        if (siteData.description) {
            var meta = document.querySelector('meta[name="description"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'description';
                document.head.appendChild(meta);
            }
            meta.content = siteData.description;
        }
    }

    function initCV(siteData) {
        var cv = siteData.cv;
        var btn = document.getElementById('cvBtn');
        if (!btn || !cv || !cv.enabled) { if (btn) btn.style.display = 'none'; return; }
        btn.textContent = cv.label || 'CV';
        btn.addEventListener('click', function() {
            if (cv.mode === 'view' && cv.viewer) {
                window.open(cv.viewer + '?url=' + encodeURIComponent('../' + cv.path), '_blank');
            } else {
                var a = document.createElement('a');
                a.href = cv.path;
                a.download = 'cv.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        });
    }

    function init() {
        fetchJSON('data/site.json').then(function(siteData) {
            setMeta(siteData);
            if (siteData.highlight_color) {
                document.documentElement.style.setProperty('--hl-color', siteData.highlight_color);
            }
            if (siteData.header) setHeader(siteData.header);
            initCV(siteData);

            var sections = siteData.sections || [];
            var promises = [];

            sections.forEach(function(sectionConfig) {
                if (sectionConfig.enabled === false) {
                    promises.push(null);
                    return;
                }
                promises.push(
                    fetchJSON(sectionConfig.file).then(function(sectionData) {
                        var render = renderers[sectionData.type];
                        if (render) return render(sectionData);
                        return null;
                    }).catch(function(err) {
                        console.warn('Skipped section:', sectionConfig.file, err.message);
                        return null;
                    })
                );
            });

            return Promise.all(promises).then(function(htmls) {
                app.innerHTML = htmls.filter(function(h) { return h !== null; }).join('');
                var footer = document.getElementById('siteFooter');
                if (footer) footer.style.visibility = 'visible';
            });
        }).catch(function(err) {
            app.innerHTML = '<p style="padding:4rem;text-align:center;color:var(--text-muted);">Failed to load site data.</p>';
            console.error(err);
        });
    }

    init();
})();
