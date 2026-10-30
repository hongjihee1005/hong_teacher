/* ───────── 아이콘 ───────── */
const I={
 left:'<path d="M15 6l-6 6 6 6"/>',right:'<path d="M9 6l6 6-6 6"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
 why:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0012 3z"/>',
 care:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
 speak:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 9a4 4 0 010 6"/><path d="M19 6.5a8 8 0 010 11"/>',
 drop:'<path d="M12 3.5c3.5 4.4 6 7.6 6 10.5a6 6 0 01-12 0c0-2.9 2.5-6.1 6-10.5z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 thermo:'<path d="M10 14.5V5a2 2 0 014 0v9.5a4 4 0 11-4 0z"/><path d="M12 10v7"/>',
 seed:'<ellipse cx="12" cy="13" rx="5" ry="7" transform="rotate(30 12 13)"/><path d="M10 9.5c1.2 1.6 1.8 3.6 1.6 6"/>',
 cup:'<path d="M5 5h14l-1.6 14a2 2 0 01-2 1.8H8.6a2 2 0 01-2-1.8z"/><path d="M6 12h12"/>',
 place:'<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/>',
 box:'<path d="M3.5 8 12 4l8.5 4v9L12 21l-8.5-4z"/><path d="M3.5 8 12 12l8.5-4M12 12v9"/>',
 leaf:'<path d="M5 19C5 10 10 5 20 4c-.5 9-5.5 15-15 15z"/><path d="M5 19l8-8"/>',
 ruler:'<path d="M4 17 17 4l3 3L7 20z"/><path d="M8 13l1.5 1.5M10.5 10.5l1.5 1.5M13 8l1.5 1.5"/>',
 sprout:'<path d="M12 21v-8"/><path d="M12 13C12 9 9 6.5 4.5 6.5 4.5 10.5 7.5 13 12 13z"/><path d="M12 11c0-3.5 2.5-6 7.5-6 0 4-3 6-7.5 6z"/>',
 pot:'<path d="M6 12h12l-1.5 8h-9z"/><path d="M12 12V7M12 8c-2-3-5-3-6-1 2 2 4 2 6 1zM12 9c2-3 5-3 6-1-2 2-4 2-6 1z"/>',
 print:'<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="2"/><path d="M7 14h10v6.5H7z"/>',
 replay:'<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4.5h4.5"/>',
 hand:'<path d="M8 13V5.5a1.5 1.5 0 013 0V11"/><path d="M11 10.5V4a1.5 1.5 0 013 0v6.5"/><path d="M14 10.5V5.5a1.5 1.5 0 013 0V14c0 4-2.5 7-6.5 7S5 18.5 4 16l-1-2.5a1.5 1.5 0 012.6-1.4L8 15"/>',
 clip:'<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 14h7M8.5 18h4"/>',
 cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
 home:'<path d="M3.5 10.5 12 3.8l8.5 6.7"/><path d="M5.5 9.2V20h13V9.2"/><path d="M10 20v-5.5h4V20"/>',
 list:'<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r=".8"/><circle cx="4" cy="12" r=".8"/><circle cx="4" cy="18" r=".8"/>',
 lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
 flask:'<path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 006 21h12a1.7 1.7 0 001.5-2.5L14 9V3"/><path d="M7.3 15h9.4"/>',
 grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
 minus:'<path d="M6 12h12"/>',plus:'<path d="M6 12h12M12 6v12"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 text:'<path d="M4 20 9 6h1l5 14M6 15h7"/><path d="M15 20l3-8h.5l3 8M16 17.5h4.5"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'};
const ic=(n,c)=>'<svg class="lb-ic'+(c?' '+c:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+I[n]+'</svg>';
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
