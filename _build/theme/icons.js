(function(){/* 메뉴 페이지 이모지 → 같은 굵기의 선 아이콘(직접 그린 24×24, 선 1.8) */
var P={
dove:'<path d="M3.5 13.5c3 .4 5.6-.6 7.4-3l2.6-3.4a3 3 0 0 1 5.2 1.6l2.3 1-2.4 1c-.6 4.6-4.3 7.6-9.4 7.3l-2.7 2.3v-2.9c-1.6-.9-2.6-2.2-3-3.9Z"/><path d="M16.4 8.2h.01" stroke-width="2.6"/>',
hand:'<path d="M8 12.5V6.2a1.5 1.5 0 0 1 3 0v5M11 11V4.8a1.5 1.5 0 0 1 3 0V11M14 11V6.2a1.5 1.5 0 0 1 3 0v6.6c0 4.2-2.6 7.4-6.3 7.4-2.4 0-3.9-1-5.2-3l-2.3-3.6a1.5 1.5 0 0 1 2.4-1.8L8 14"/>',
teddy:'<circle cx="12" cy="13.2" r="6.6"/><circle cx="6.2" cy="6.6" r="2.3"/><circle cx="17.8" cy="6.6" r="2.3"/><path d="M9.6 12.2h.01M14.4 12.2h.01" stroke-width="2.6"/><path d="M10.2 15.6q1.8 1.5 3.6 0"/>',
origami:'<path d="M2.8 9.4 9 12.6l3-7.8 3 7.8 6.2-3.2-3.5 6.2L12 19.2l-5.7-3.6Z"/><path d="M12 4.8v14.4M9 12.6l3 6.6 3-6.6"/>',
drum:'<ellipse cx="12" cy="8.5" rx="8" ry="3"/><path d="M4 8.5v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7M7.5 3.5l3.5 5M16.5 3.5l-3.5 5"/>',
piano:'<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M8.5 5v14M15.5 5v14M3.5 12h17"/>',
violin:'<path d="M19.5 4.5l-7 7"/><path d="M17.5 3l3.5 3.5"/><path d="M11.5 9.5c-2.2-.9-4.7-.2-6 1.6-1.3 1.9-1 4.4.6 6s4.1 1.9 6 .6c1.8-1.3 2.5-3.8 1.6-6"/><path d="M8.5 13.5l2 2"/>',
bag:'<path d="M8 7.5V6a4 4 0 0 1 8 0v1.5"/><rect x="4.5" y="7.5" width="15" height="13" rx="3"/><path d="M8.5 13.5h7v3h-7Z"/>',
brush:'<path d="M14.5 4.5l5 5-7.8 7.8-5-5Z"/><path d="M6.7 12.3c-2.2.6-3.2 2.4-3.2 4.7 0 1.4-.4 2.4-1 3 3.6.4 6.6-.6 8-3.1"/><path d="M16.8 2.8l4.4 4.4"/>',
book:'<path d="M12 6.6C10.2 5.3 7.8 4.7 3.8 4.7v13.4c4 0 6.4.6 8.2 1.9 1.8-1.3 4.2-1.9 8.2-1.9V4.7c-4 0-6.4.6-8.2 1.9Z"/><path d="M12 6.6V20"/>',
pie:'<circle cx="12" cy="12" r="8.4"/><path d="M12 12V3.6M12 12l7.3 4.2"/>',
trophy:'<path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0Z"/><path d="M7.5 6H4.5a3 3 0 0 0 3 4M16.5 6h3a3 3 0 0 1-3 4M12 13.5v3.5M8.5 20h7M9.5 17h5"/>',
math:'<path d="M7.5 4.5v6M4.5 7.5h6M13.5 7.5h6M5.4 14.4l4.2 4.2M9.6 14.4l-4.2 4.2M13.5 16.5h6"/><path d="M16.5 13.6h.01M16.5 19.4h.01" stroke-width="2.6"/>',
map:'<path d="M9 4.5 3.8 6.4v13.1L9 17.6l6 1.9 5.2-1.9V4.5L15 6.4 9 4.5Z"/><path d="M9 4.5v13.1M15 6.4v13.1"/>',
flask:'<path d="M9.3 3.5h5.4M10.5 3.5v5.4l-5.4 9.3a1.5 1.5 0 0 0 1.3 2.3h11.2a1.5 1.5 0 0 0 1.3-2.3l-5.4-9.3V3.5"/><path d="M7.6 14.3h8.8"/>',
sprout:'<path d="M12 20.5v-8.3"/><path d="M12 12.2C12 8.7 9.6 6.4 5.6 6.4c0 3.5 2.4 5.8 6.4 5.8Z"/><path d="M12 10.2c0-3.2 2.3-5.4 6.4-5.4 0 3.2-2.3 5.4-6.4 5.4Z"/>',
leaf:'<path d="M5.5 18.5C5.5 10 10.6 4.8 19.5 4.5c-.3 8.9-5.5 14-14 14Z"/><path d="M4 20l9.5-9.5"/>',
teacher:'<circle cx="7.6" cy="8.2" r="2.6"/><path d="M3.6 19.8v-1.6a4 4 0 0 1 8 0v1.6"/><path d="M11.2 4.5h9.3v9.2h-6"/><path d="M12.2 11.6l3.4-3"/>',
clock:'<circle cx="12" cy="12" r="8.4"/><path d="M12 7.6V12l2.9 1.9"/>',
apple:'<path d="M12 7.6c-1.3-.9-2.9-1.3-4.4-.9C5.1 7.3 4 9.6 4 12.2c0 4 2.8 8.3 5.1 8.3 1.2 0 1.7-.6 2.9-.6s1.7.6 2.9.6c2.3 0 5.1-4.3 5.1-8.3 0-2.6-1.1-4.9-3.6-5.5-1.5-.4-3.1 0-4.4.9Z"/><path d="M12 7.6c0-2 1.1-3.5 3.1-4.1"/>',
school:'<path d="M3.5 20.5h17M5.5 20.5v-8.8L12 7.3l6.5 4.4v8.8M12 7.3V3.5h3.6M10 20.5v-4h4v4"/><circle cx="12" cy="12.3" r="1.5"/>',
sparkle:'<path d="M11 3.8l1.7 4.9 4.9 1.7-4.9 1.7-1.7 4.9-1.7-4.9-4.9-1.7 4.9-1.7Z"/><path d="M18 14.8l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7Z"/>',
calendar:'<rect x="3.8" y="5.3" width="16.4" height="14.9" rx="2.2"/><path d="M3.8 9.8h16.4M8.2 3.5v3.6M15.8 3.5v3.6"/>',
image:'<rect x="3.8" y="4.5" width="16.4" height="15" rx="2.2"/><circle cx="9" cy="9.6" r="1.6"/><path d="m20.2 15.4-4.3-4.3-8.6 8.4"/>',
music:'<path d="M9 17.5V5.8l10.5-2v11.7"/><circle cx="6.6" cy="17.5" r="2.4"/><circle cx="17.1" cy="15.5" r="2.4"/>',
books:'<rect x="4" y="4" width="4.2" height="16" rx="1"/><rect x="8.2" y="6.5" width="4.2" height="13.5" rx="1"/><path d="m13.6 7.4 3.9-1.1 3.2 12.6-3.9 1.1Z"/>',
chart:'<path d="M4 20h16M7 16.5v-5M12 16.5V6.8M17 16.5v-8"/>',
brain:'<path d="M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2A3.2 3.2 0 0 0 7 18a2.8 2.8 0 0 0 5 1.4V5.6A2.6 2.6 0 0 0 9 4.5Z"/><path d="M15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2A3.2 3.2 0 0 1 17 18a2.8 2.8 0 0 1-5 1.4"/><path d="M8.5 10.5c1.2 0 2 .8 2 2M15.5 10.5c-1.2 0-2 .8-2 2"/>',
magicsq:'<rect x="4" y="4" width="16" height="16" rx="2.4"/><path d="M9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16"/>',
tangram:'<path d="M4 4h16L12 12Z"/><path d="M4 4v16l8-8Z"/><path d="M20 4v8l-4 4-4-4Z"/><path d="M4 20h16v-8"/>',
tower:'<path d="M12 4v15"/><path d="M3.5 20h17"/><rect x="8.5" y="8" width="7" height="3" rx="1"/><rect x="6.5" y="11.5" width="11" height="3.2" rx="1"/><rect x="4.5" y="15.2" width="15" height="3.4" rx="1"/>',
pixel:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9.3h16M4 14.7h16M9.3 4v16M14.7 4v16" stroke-width="1.2"/><path d="M5 5h4v4H5zM15 10h4v4h-4zM10 15h4v4h-4z" fill="currentColor" stroke="none"/>',
target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
fire:'<path d="M12 3.5c.6 3.2 4.8 5 4.8 9.8a4.8 4.8 0 0 1-9.6 0c0-2.3 1.2-3.6 2.3-4.8.3 1.6 1 2.5 2 2.8-.6-2.6-.2-5.3.5-7.8Z"/>',
cubes:'<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9Z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
circlepi:'<circle cx="12" cy="12" r="9"/><path d="M8 9.5h8M10 9.5v6M14 9.5v4.5q0 1.5 1.5 1.5"/>',
rabbit:'<path d="M9 10C8 6 8 3 9.5 3S11 6 11 9.5M15 10c1-4 1-7-.5-7S13 6 13 9.5"/><path d="M6.5 15.5a5.5 5 0 0 1 11 0c0 3-2.5 5-5.5 5s-5.5-2-5.5-5Z"/><path d="M10 15h.01M14 15h.01"/>',
turtle:'<path d="M4.5 15a7.5 6.5 0 0 1 15 0Z"/><path d="M9 10.5 12 15l3-4.5M7 15l-1.5 3M17 15l1.5 3M19.5 13.5H21a1.5 1.5 0 0 0 0-3h-1"/>',
bridge:'<path d="M2.5 15h19M2.5 9.5h19"/><path d="M4 15v-2a8 5 0 0 1 16 0v2"/><path d="M8 9.5v2M12 9.5v1.5M16 9.5v2M3 19q2.25-1.5 4.5 0t4.5 0 4.5 0 4.5 0"/>',
mail:'<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6.5L20.5 7"/>',
car:'<path d="M4 16.5V12l2-5h12l2 5v4.5Z"/><path d="M4 12h16M7 16.5V19M17 16.5V19"/><circle cx="7.5" cy="14.3" r=".6"/><circle cx="16.5" cy="14.3" r=".6"/>',
ball:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.6"/><path d="M11.2 10.8h1.6v2.4"/>',
toolbox:'<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8M3 13h18M10 13v2h4v-2"/>',
bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7Z"/>',
orb:'<circle cx="12" cy="10" r="7"/><path d="M6 20h12M8 17.5l-1 2.5M16 17.5l1 2.5M9 8a3 3 0 0 1 3-2"/>',
basket:'<path d="M4 9h16l-2 10H6Z"/><path d="M8 9 11 4M16 9l-3-5M9 13v3M12 13v3M15 13v3"/>',
palette:'<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5S14 15 15 15h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
coin:'<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="5"/>',
moneybag:'<path d="M9 3.5h6l-1.8 3.2h-2.4Z"/><path d="M10.8 6.7C6.5 9 4.5 12.5 4.5 15.5c0 3 2.5 5 7.5 5s7.5-2 7.5-5c0-3-2-6.5-6.3-8.8"/><path d="M13.6 11.6c-.5-.6-1.1-.9-1.8-.9-1 0-1.8.6-1.8 1.4 0 1.9 3.8 1.1 3.8 3 0 .8-.9 1.4-2 1.4-.8 0-1.5-.3-2-.9M12 9.6v1.1M12 16.5v1.1"/>',
pan:'<circle cx="10" cy="13" r="6.5"/><path d="M16 10.5 21 6"/><circle cx="10" cy="13" r="2.2"/>',
stones:'<path d="M4 4h16v16H4z"/><path d="M4 12h16M12 4v16"/><circle cx="8" cy="8" r="3" fill="currentColor"/><circle cx="16" cy="16" r="3" fill="#fff"/>',
pin:'<path d="M12 21v-6"/><path d="M8 4h8l-1 6 3 3H6l3-3Z"/>',
diamond:'<path d="M12 3 21 12 12 21 3 12Z"/>',
hat:'<path d="M7 16V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v9"/><path d="M3 16h18v2H3ZM7 12h10"/>',
pento:'<path d="M4 9h5V4h5v5h5v5h-5v6H9v-6H4Z"/><path d="M9 9h5v5H9Z" stroke-width="1.4"/>',
gamepad:'<path d="M7.2 7.5h9.6a4.3 4.3 0 0 1 4.2 3.4l1 4.9a2.6 2.6 0 0 1-4.5 2.2L15.6 16H8.4l-1.9 2a2.6 2.6 0 0 1-4.5-2.2l1-4.9a4.3 4.3 0 0 1 4.2-3.4Z"/><path d="M8 10.3v3.4M6.3 12h3.4"/><path d="M15.4 11h.01M17.4 13h.01" stroke-width="2.6"/>',
dice:'<rect x="4" y="4" width="16" height="16" rx="3.4"/><path d="M8.6 8.6h.01M15.4 8.6h.01M12 12h.01M8.6 15.4h.01M15.4 15.4h.01" stroke-width="2.7"/>',
house:'<path d="M3.5 10.5 12 3.8l8.5 6.7M5.5 9.2V20h13V9.2M10 20v-5.5h4V20"/>',
bulb:'<path d="M9 17.2h6M10 20.5h4M12 3.5a6 6 0 0 0-3.6 10.8c.4.3.6.8.6 1.3v1.6h6v-1.6c0-.5.2-1 .6-1.3A6 6 0 0 0 12 3.5Z"/>',
laptop:'<rect x="5" y="5" width="14" height="10" rx="1.6"/><path d="M3 18.8h18"/>',
printer:'<path d="M7 8.5V3.8h10v4.7"/><rect x="3.8" y="8.5" width="16.4" height="7.5" rx="2"/><path d="M7 13.5h10v6.7H7Z"/>',
file:'<path d="M14 3.8H7a1.8 1.8 0 0 0-1.8 1.8v12.8A1.8 1.8 0 0 0 7 20.2h10a1.8 1.8 0 0 0 1.8-1.8V8.6Z"/><path d="M14 3.8v4.8h4.8M9 13h6M9 16.4h4"/>',
lock:'<rect x="5" y="10.5" width="14" height="9.7" rx="2"/><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7"/>',
star:'<path d="m12 3.9 2.5 5.1 5.6.8-4.1 4 1 5.6-5-2.7-5 2.7 1-5.6-4.1-4 5.6-.8Z"/>',
check:'<circle cx="12" cy="12" r="8.4"/><path d="m8.4 12.2 2.4 2.4 4.8-4.9"/>',
help:'<circle cx="12" cy="12" r="8.4"/><path d="M9.6 9.6a2.5 2.5 0 0 1 4.8.8c0 1.7-2.4 2.2-2.4 3.7M12 17h.01"/>',
timer:'<circle cx="12" cy="13.3" r="7.2"/><path d="M12 9.6v3.7l2.2 1.6M9.6 3.5h4.8"/>',
msg:'<path d="M4.2 6.3a2 2 0 0 1 2-2h11.6a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H10l-4.5 3.6v-3.6h.7a2 2 0 0 1-2-2Z"/>',
search:'<circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.5 15.5 4.7 4.7"/>',
pencil:'<path d="M15.6 4.6a2 2 0 0 1 2.8 0l1 1a2 2 0 0 1 0 2.8L8.6 19.2l-4.4 1 1-4.4Z"/><path d="m13.6 6.6 3.8 3.8"/>',
mic:'<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.8 11.5a6.2 6.2 0 0 0 12.4 0M12 17.7v2.8"/>',
vol:'<path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3Z"/><path d="M15.8 9a4.2 4.2 0 0 1 0 6M18.4 6.4a8 8 0 0 1 0 11.2"/>',
scale:'<path d="M12 4v16M8 20h8M5 7.3h14M12 4.6l-.01 0"/><path d="M5 7.3 2.8 13a3 3 0 0 0 4.4 0Zm14 0L16.8 13a3 3 0 0 0 4.4 0Z"/>',
ruler:'<path d="m3.8 15.6 11.8-11.8 4.6 4.6L8.4 20.2Z"/><path d="m7.6 11.8 1.8 1.8M10.4 9l1.2 1.2M13.2 6.2l1.8 1.8"/>',
palette:'<path d="M12 3.8a8.2 8.2 0 0 0 0 16.4c1 0 1.6-.8 1.6-1.6 0-1.3-1-1.6-1-2.6 0-.9.7-1.6 1.6-1.6h2.1a3.8 3.8 0 0 0 3.9-3.8c0-3.7-3.7-6.8-8.2-6.8Z"/><path d="M7.8 11h.01M10 7.6h.01M14.3 7.6h.01" stroke-width="2.6"/>',
puzzle:'<path d="M9 4.5h3.2v1.6a1.8 1.8 0 1 0 3.6 0V4.5H19v3.7h-1.4a1.8 1.8 0 1 0 0 3.6H19v7.7H5v-7.7h1.4a1.8 1.8 0 1 0 0-3.6H5V4.5Z"/>',
users:'<circle cx="9" cy="8.3" r="3"/><path d="M3.8 19.5v-1.2a5.2 5.2 0 0 1 10.4 0v1.2M15.6 5.6a3 3 0 0 1 0 5.6M17.6 13.6a5 5 0 0 1 2.6 4.6v1.3"/>',
phone:'<rect x="7" y="3.5" width="10" height="17" rx="2.2"/><path d="M11 17.4h2"/>',
refresh:'<path d="M19.5 12a7.5 7.5 0 0 1-13.2 4.9M4.5 12a7.5 7.5 0 0 1 13.2-4.9"/><path d="M18 3.8v3.6h-3.6M6 20.2v-3.6h3.6"/>',
hourglass:'<path d="M6.5 3.8h11M6.5 20.2h11M7.8 3.8c0 4.2 4.2 5.3 4.2 8.2S7.8 16 7.8 20.2M16.2 3.8c0 4.2-4.2 5.3-4.2 8.2s4.2 4 4.2 8.2"/>',
globe:'<circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8M12 3.6c2.3 2.3 3.4 5.1 3.4 8.4s-1.1 6.1-3.4 8.4c-2.3-2.3-3.4-5.1-3.4-8.4S9.7 5.9 12 3.6Z"/>',
clipboard:'<rect x="5.2" y="5" width="13.6" height="15.2" rx="2"/><path d="M9 3.8h6v2.6H9ZM8.8 11.2h6.4M8.8 14.8h4.4"/>',
news:'<rect x="3.8" y="4.6" width="16.4" height="14.8" rx="2"/><path d="M7.4 8.6h9.2M7.4 12h4.2M7.4 15.4h4.2M14.6 12h2v3.4h-2Z"/>',
camera:'<path d="M4 8.6a2 2 0 0 1 2-2h2l1.5-2h5l1.5 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><circle cx="12" cy="12.8" r="3.3"/>',
compass:'<circle cx="12" cy="12" r="8.4"/><path d="m15.4 8.6-2 4.8-4.8 2 2-4.8Z"/>',
landmark:'<path d="M3.8 20.2h16.4M5 9.4h14L12 4.2ZM6.8 9.4v8M10.3 9.4v8M13.7 9.4v8M17.2 9.4v8M5 17.4h14"/>',
monitor:'<rect x="3.6" y="4.4" width="16.8" height="11.4" rx="1.8"/><path d="M9 20h6M12 15.8V20"/>',
box:'<path d="m12 3.6 7.8 4.2v8.4L12 20.4l-7.8-4.2V7.8Z"/><path d="m4.2 7.8 7.8 4.3 7.8-4.3M12 12.1v8.3"/>',
layers:'<path d="m12 4 8.4 4.4L12 12.8 3.6 8.4Z"/><path d="m3.6 12.6 8.4 4.4 8.4-4.4M3.6 16.4 12 20.8l8.4-4.4"/>',
info:'<circle cx="12" cy="12" r="8.4"/><path d="M12 11v5.2M12 7.9h.01"/>',
dot:'<circle cx="12" cy="12" r="3.2"/>'};
var E={};function m(k,s){s.split(' ').forEach(function(c){E[c]=k})}
m('book','📖 📕 📒 📓 📗 📘 📙');m('math','🔢 🧮 ➕ ➖ ➗ ✖ 🔟');m('pie','🍕 🍰');m('trophy','🏆 🏅');m('map','🗺 🧭');m('flask','🔬 🧪 ⚗');m('sprout','🌸 🌱 🌼 🌿 🪴 🌳 🌾 🍃 🐣 🦋');m('leaf','🍂 🍁');
m('teacher','🧑‍🏫 👩‍🏫 👨‍🏫');m('clock','🚧 ⏰ 🕰');m('apple','🍎 🍏');m('school','🏫 🏢 🎓');m('sparkle','🌟 ✨ 💫 🌈 🚀');m('star','⭐ ★');m('calendar','📅 📆 🗓');
m('image','🖼');m('music','🎵 🎶 🎼');m('books','📚');m('chart','📊 📈');m('dice','🎲 🃏 🁫');m('house','🏠 🏡 🏘');m('bulb','💡');m('laptop','💻');m('monitor','🖥');
m('printer','🖨');m('file','📄 📃 📝');m('layers','📑');m('lock','🔒 🔐');m('check','✅ ☑ ✔');m('help','❓ ❔');m('timer','⏱ ⏲');m('hourglass','⏳ ⌛');m('msg','💬 🗨');
m('search','🔎 🔍');m('pencil','✏ ✍ 🖊 🖍');m('mic','🎙 🎤');m('vol','🔈 🔉 🔊 📢');m('scale','⚖');m('ruler','📏 📐');m('puzzle','🧩 🧵');m('users','🤝 👥 🧑‍🤝‍🧑');
m('phone','📱 📞');m('refresh','🔄 🔁 ↻');m('globe','🌏 🌍 🌎');m('clipboard','📋');m('news','📰');m('camera','📷 📸');m('landmark','🏛');m('box','📦');m('teddy','🧸');m('gamepad','🎮 🕹');m('brain','🧠');m('target','🎯');m('fire','🔥');m('pento','🟩 🟥');m('pin','📌 📍');m('basket','🛒');m('stones','⚫ ⚪');m('coin','🪙');m('moneybag','💰');m('pan','🍳');m('palette','🎨');m('box','🗳');m('toolbox','🧰');m('diamond','🔷 🔶');m('hat','🎩');m('bolt','⚡');m('orb','🔮');m('sun','☀');m('circlepi','🔵');m('rabbit','🐰 🐇');m('turtle','🐢');m('bridge','🌉');m('mail','✉');m('car','🚕 🚗');m('ball','🎱');m('cubes','🧊');m('magicsq','✳');m('tangram','🔺');m('tower','🗼');m('pixel','🔳');m('dove','🕊');m('hand','🙌 ✋ 🙋');m('bag','🎒');m('brush','🖌');m('drum','🥁 🪘');m('piano','🎹');m('violin','🎻 🪕');m('origami','🦢');m('compass','🧭');m('info','ℹ');
var RX=/(?:\p{Extended_Pictographic}|[★➕➗✖ℹ↻])(?:️|‍\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}])*️?/gu;
function key(e){return e.replace(/[️\u{1F3FB}-\u{1F3FF}]/gu,'')}
function svg(k,c){return '<svg class="'+(c||'hj-li')+'" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+P[k]+'</svg>'}
var TILE='.ico,.h-ico,.r-ico,.ts-chip>i,.td-ico',STRIP='.card:not(.room) .nm,main h2:not(.td-h),main h3';
function grade(el){var c=el.closest('a,h1,.r-item')||el.parentNode,t=(c.querySelector('.nm')||c).textContent;var g=t.replace(RX,'').trim().match(/^(\d)학년$/);return g?g[1]:''}
function tile(el){if(el.dataset.li)return;var raw=el.textContent.trim(),g=grade(el);el.dataset.li='1';
 if(g){el.innerHTML='<b class="hj-gn">'+g+'</b>';return}
 var sec=el.closest('#event,#quote,#art,#music,#book'),TD={event:'calendar',quote:'msg',art:'image',music:'music',book:'books'};
 if(sec&&el.classList.contains('td-ico')){el.innerHTML=svg(TD[sec.id]);return}
 var ms=raw.match(RX);el.innerHTML=svg(ms&&E[key(ms[0])]||'dot');}
function texts(root){var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode;
 if(!p||p.closest('script,style,svg,textarea,.hj-contact,[data-li]'))return 2;RX.lastIndex=0;return RX.test(n.nodeValue)?1:2}}),a=[],n;while(n=w.nextNode())a.push(n);return a}
function run(root){root=root||document.body;
 (root.matches&&root.matches(TILE)?[root]:[]).concat([].slice.call(root.querySelectorAll(TILE))).forEach(tile);
 texts(root).forEach(function(n){var p=n.parentNode,strip=!!p.closest(STRIP),v=n.nodeValue;RX.lastIndex=0;
  if(strip){v=v.replace(new RegExp(RX.source+'\\s*','gu'),'');n.nodeValue=n===p.firstChild?v.replace(/^\s+/,''):v;return}
  var f=document.createDocumentFragment(),last=0;v.replace(RX,function(e,i){f.appendChild(document.createTextNode(v.slice(last,i)));last=i+e.length;
   var k=E[key(e)];if(k){var s=document.createElement('span');s.className='hj-ii';s.dataset.li='1';s.innerHTML=svg(k);f.appendChild(s)}
   else if(v.charAt(last)===' ')last++;return e});
  f.appendChild(document.createTextNode(v.slice(last)));p.replaceChild(f,n)});}
run();
new MutationObserver(function(ms){ms.forEach(function(r){r.addedNodes.forEach(function(x){if(x.nodeType===1&&!x.closest('[data-li],svg'))run(x);
 else if(x.nodeType===3&&x.parentNode){RX.lastIndex=0;if(RX.test(x.nodeValue))run(x.parentNode)}})})}).observe(document.body,{childList:true,subtree:true});
})();
