(function(){var q=function(s){return document.querySelectorAll(s)};
q('.tag[style],.legend span[style]').forEach(function(e){var b=e.style.backgroundColor||e.style.background;if(b){e.style.setProperty('--acc',b);e.style.background='';e.style.color=''}});})();
