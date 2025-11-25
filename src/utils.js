export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const esc = s => (s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

export const fmtSize = n => {
    n = parseInt(n || 0, 10); if (!n) return '';
    const u = ['B', 'KB', 'MB', 'GB', 'TB']; let i = 0;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return (n < 10 ? n.toFixed(2) : n.toFixed(1)) + ' ' + u[i];
};

export const fmtDate = t => t ? new Date(t).toLocaleDateString() : '-';

export const fmtDur = s => {
    if (!s) return ''; s = parseInt(s, 10);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sc = s % 60;
    return (h > 0 ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(sc).padStart(2, '0');
};