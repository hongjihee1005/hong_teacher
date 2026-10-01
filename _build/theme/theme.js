(function(){var q=function(s){return document.querySelectorAll(s)};
q('.tag[style],.legend span[style]').forEach(function(e){var b=e.style.backgroundColor||e.style.background;if(b){e.style.setProperty('--acc',b);e.style.background='';e.style.color=''}});})();
(function(){var tg=[].slice.call(document.querySelectorAll('.r-tg'));if(!tg.length)return;
function close(ex){tg.forEach(function(b){if(b!==ex&&b.getAttribute('aria-expanded')==='true'){b.setAttribute('aria-expanded','false');document.getElementById(b.getAttribute('aria-controls')).hidden=true;b.closest('.rw').classList.remove('open')}})}
tg.forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var o=b.getAttribute('aria-expanded')==='true';close(b);
 b.setAttribute('aria-expanded',o?'false':'true');document.getElementById(b.getAttribute('aria-controls')).hidden=o;b.closest('.rw').classList.toggle('open',!o)})});
document.addEventListener('click',function(e){if(!e.target.closest('.rw'))close()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});})();
