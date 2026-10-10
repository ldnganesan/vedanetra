/* Shared behaviour for the Learn presentations:
   - highlights the nav-rail entry for the section in view
   - ← / → (and PageUp / PageDown) step one section at a time, for presenting
   - optional slide counter when the page has a .counter element */
(function(){
  const sections = Array.from(document.querySelectorAll("main > section"));
  const rail = document.querySelector("nav.rail");
  const links = rail ? Array.from(rail.querySelectorAll("a")) : [];
  const counter = document.querySelector(".counter");
  let current = 0;

  // rail entries mark the start of a run of sections; the active one is the last start at or before the current section
  const starts = links.map(a => sections.findIndex(s => s.id === a.getAttribute("href").slice(1)));

  function setCurrent(i){
    current = i;
    let active = -1;
    starts.forEach((s, k) => { if (s !== -1 && s <= i) active = k; });
    links.forEach((l, k) => k === active ? l.setAttribute("aria-current", "true") : l.removeAttribute("aria-current"));
    if (active >= 0 && rail.scrollHeight > rail.clientHeight + 4) {
      links[active].scrollIntoView({block:"nearest", inline:"nearest"});
    }
    if (counter) counter.textContent = (i + 1) + " / " + sections.length;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setCurrent(sections.indexOf(e.target)); });
  }, {rootMargin:"-45% 0px -45% 0px", threshold:0});
  sections.forEach(s => obs.observe(s));

  document.addEventListener("keydown", e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "summary") return;
    let step = 0;
    if (e.key === "ArrowRight" || e.key === "PageDown") step = 1;
    if (e.key === "ArrowLeft" || e.key === "PageUp") step = -1;
    if (!step) return;
    const next = Math.max(0, Math.min(sections.length - 1, current + step));
    if (next !== current) {
      e.preventDefault();
      sections[next].scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
    }
  });
  setCurrent(0);
})();
