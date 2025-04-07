javascript: (function () {
  "use strict";

  // If panel already exists, do nothing
  if (document.getElementById("toc-panel") || document.getElementById("toc-handle")) {
    return;
  }

  // --- Insert CSS with dark mode support ---
  const css = document.createElement("style");
  css.textContent = `
    /* Panel */
    #toc-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 280px;
      height: 100%;
      background: #fafafa;
      box-shadow: -4px 0 8px rgba(0,0,0,0.1);
      font-family: sans-serif;
      font-size: 0.8rem;
      border-left: 1px solid #ddd;
      display: flex;
      flex-direction: column;
      z-index: 9998;
      transform: translateX(0);
      transition: transform 0.3s ease, width 0.1s ease;
    }
    #toc-panel.collapsed {
      transform: translateX(100%);
    }
    
    /* Resize handle */
    #toc-resize-handle {
      position: absolute;
      top: 0;
      left: 0;
      width: 5px;
      height: 100%;
      cursor: ew-resize;
      background: transparent;
      z-index: 9999;
    }
    #toc-resize-handle:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    .resize-active {
      pointer-events: none;
    }
    .resize-active #toc-resize-handle {
      background: rgba(0, 0, 0, 0.2);
    }

    /* Panel Header */
    #toc-header {
      padding: 6px 10px;
      background: #ddd;
      border-bottom: 1px solid #ccc;
      font-weight: bold;
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    #toc-header-text {
      flex: 1;
    }
    
    #toc-expand-all, #toc-collapse-all {
      cursor: pointer;
      padding: 0 4px;
      font-size: 0.8rem;
      opacity: 0.8;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    #toc-expand-all:hover, #toc-collapse-all:hover {
      opacity: 1;
    }
    
    .toc-icon {
      width: 14px;
      height: 14px;
      display: inline-block;
    }

    /* TOC Items */
    #toc-list {
      list-style: none;
      flex: 1;
      overflow-y: auto;
      margin: 0;
      padding: 6px;
    }
    #toc-list li {
      padding: 4px;
      cursor: pointer;
      border-radius: 3px;
      transition: background-color 0.2s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    #toc-list li:hover {
      background: #f0f0f0;
    }
    #toc-list ul {
      margin-left: 16px;
      padding: 0;
      width: 100%;
    }
    #toc-list ul li::before {
      content: "";
    }
    #toc-list ul ul li {
      font-size: 0.75rem;
      color: #555;
    }
    
    /* Collapsible items */
    .toc-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      margin-right: 4px;
      cursor: pointer;
      transition: transform 0.2s;
      flex-shrink: 0;
    }
    
    .toc-item-content {
      display: inline-block;
      max-width: calc(100% - 18px);
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: bottom;
      pointer-events: none;
    }
    
    .toc-collapse-trigger {
      cursor: pointer;
      user-select: none;
      flex-direction: row;
      align-items: flex-start;
    }

    .toc-collapsed-trigger-content {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .toc-collapsed > ul {
      display: none;
    }
    
    .toc-clickable-content {
      flex: 1;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-left: 2px;
    }

    /* Always-visible handle */
    #toc-handle {
      position: fixed;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 30px;
      height: 80px;
      background: #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      cursor: pointer;
      font-weight: bold;
      user-select: none;
      z-index: 9999;
      transition: background 0.2s;
    }
    #toc-handle:hover {
      background: #bbb;
    }

    /* Highlighting headings in the chat */
    @keyframes highlightFade {
      0% { background-color: #fffa99; }
      100% { background-color: transparent; }
    }
    .toc-highlight {
      animation: highlightFade 1.5s forwards;
    }

    /* ------ Dark Mode Support ------ */
    @media (prefers-color-scheme: dark) {
      #toc-panel {
        background: #333;
        border-left: 1px solid #555;
        box-shadow: -4px 0 8px rgba(0,0,0,0.7);
      }
      #toc-header {
        background: #555;
        border-bottom: 1px solid #666;
        color: #eee;
      }
      #toc-list li:hover {
        background: #444;
      }
      #toc-list {
        color: #eee;
      }
      #toc-list ul ul li {
        color: #aaa;
      }
      #toc-handle {
        background: #555;
        color: #ddd;
      }
      #toc-handle:hover {
        background: #666;
      }
      #toc-resize-handle:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .resize-active #toc-resize-handle {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  `;
  document.head.appendChild(css);

  // SVG Icons
  const plusSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" class="toc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
  const minusSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" class="toc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';

  // Default panel width
  const DEFAULT_PANEL_WIDTH = 280;

  // --- Create panel & handle ---
  const panel = document.createElement("div");
  panel.id = "toc-panel";
  panel.innerHTML = `
    <div id="toc-resize-handle" title="Drag to resize"></div>
    <div id="toc-header">
      <span id="toc-header-text">Conversation TOC</span>
      <span id="toc-expand-all" title="Expand All">${plusSvg}</span>
      <span id="toc-collapse-all" title="Collapse All">${minusSvg}</span>
    </div>
    <ul id="toc-list"></ul>
  `;
  document.body.appendChild(panel);

  const handle = document.createElement("div");
  handle.id = "toc-handle";
  handle.textContent = "TOC";
  document.body.appendChild(handle);

  // Set initial handle position to match panel width
  handle.style.right = DEFAULT_PANEL_WIDTH + "px";

  // Observed container, observer, etc.
  let chatContainer = null;
  let observer = null;
  let isScheduled = false;
  let timerId = null;

  // Helper for creating TOC items with proper truncation
  function createTocItem(text, element, isSubpoint = false, canHaveChildren = false) {
    const li = document.createElement("li");
    const txt = (text || "").trim() || (isSubpoint ? "Point" : "Section");

    if (canHaveChildren) {
      li.classList.add("toc-collapse-trigger");
      li.innerHTML = `<div class="toc-collapsed-trigger-content 11">
                   <span class="toc-toggle" role="button" aria-label="Toggle section">${minusSvg}</span>
                   <span class="toc-clickable-content" title="${txt}">${txt}</span>
                 </div>`;

      // Add click handler specifically for the toggle
      const toggle = li.querySelector(".toc-toggle");
      toggle.addEventListener("click", function (ev) {
        const isExpanded = !li.classList.contains("toc-collapsed");

        if (isExpanded) {
          // Collapse
          li.classList.add("toc-collapsed");
          toggle.innerHTML = plusSvg;
        } else {
          // Expand
          li.classList.remove("toc-collapsed");
          toggle.innerHTML = minusSvg;
        }
        ev.stopPropagation();
      });

      // Add click handler for the content (scroll to element)
      const content = li.querySelector(".toc-clickable-content");
      content.addEventListener("click", function (ev) {
        element.classList.remove("toc-highlight");
        // Force reflow to restart animation
        element.offsetWidth;
        element.classList.add("toc-highlight");
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        ev.stopPropagation();
      });
    } else {
      // No children, just a simple clickable item
      li.innerHTML = `<div style="width: 100%;">
                              <span class="toc-clickable-content" title="${txt}">${txt}</span>
                            </div>`;

      // Add click handler
      const content = li.querySelector(".toc-clickable-content");
      content.addEventListener("click", function (ev) {
        element.classList.remove("toc-highlight");
        // Force reflow to restart animation
        element.offsetWidth;
        element.classList.add("toc-highlight");
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        ev.stopPropagation();
      });
    }

    return li;
  }

  // Debounce the TOC build to avoid high CPU usage on rapid changes
  function debounceBuildTOC() {
    if (isScheduled) return;
    isScheduled = true;
    timerId = setTimeout(function () {
      buildTOC();
      isScheduled = false;
    }, 300);
  }

  // Expand or collapse all TOC items
  function toggleAllItems(expand) {
    const triggers = document.querySelectorAll(".toc-collapse-trigger");
    triggers.forEach((item) => {
      const toggle = item.querySelector(".toc-toggle");
      if (expand) {
        item.classList.remove("toc-collapsed");
        toggle.innerHTML = minusSvg;
      } else {
        item.classList.add("toc-collapsed");
        toggle.innerHTML = plusSvg;
      }
    });
  }

  // Build/refresh the TOC
  function buildTOC() {
    const list = document.getElementById("toc-list");
    if (!list) return;
    list.innerHTML = "";

    // Find conversation turns - support both ChatGPT and Grok formats
    const grokResponses = (chatContainer || document).querySelectorAll(
      ".relative.group.flex.flex-col.justify-center.w-full.max-w-3xl.md\\:px-4.pb-2.gap-2.items-start",
    );
    const chatGptArticles = (chatContainer || document).querySelectorAll("article[data-testid^='conversation-turn-']");

    if (grokResponses.length === 0 && chatGptArticles.length === 0) {
      list.innerHTML = '<li style="opacity:0.7;font-style:italic;">Empty chat</li>';
      return;
    }

    // Process Grok format if we have Grok responses
    if (grokResponses.length > 0) {
      let responseCount = 0;
      let userCount = 0;

      // Loop over all elements that could be user or AI responses
      for (let i = 0; i < grokResponses.length; i++) {
        const response = grokResponses[i];
        const li = document.createElement("li");
        li.classList.add("toc-collapse-trigger");

        // Check if it's an AI response (has h3 elements and other rich formatting)
        const hasH3 = response.querySelectorAll("h3").length > 0;

        let label = "";
        if (hasH3) {
          responseCount++;
          label = `Response ${responseCount} (Grok)`;
        } else {
          userCount++;
          label = `Turn ${userCount} (You)`;
        }

        li.innerHTML = `
                    <div class="toc-collapsed-trigger-content"">
                        <span class="toc-toggle" role="button" aria-label="Toggle turn">${minusSvg}</span>
                        <span class="toc-clickable-content" title="${label}">${label}</span>
                    </div>
                `;

        // Add collapsible functionality
        const toggle = li.querySelector(".toc-toggle");
        toggle.addEventListener("click", function (ev) {
          const isExpanded = !li.classList.contains("toc-collapsed");

          if (isExpanded) {
            // Collapse
            li.classList.add("toc-collapsed");
            toggle.innerHTML = plusSvg;
          } else {
            // Expand
            li.classList.remove("toc-collapsed");
            toggle.innerHTML = minusSvg;
          }
          ev.stopPropagation();
        });

        // On click: scroll to the response
        const content = li.querySelector(".toc-clickable-content");
        content.addEventListener("click", function (ev) {
          response.scrollIntoView({ behavior: "smooth", block: "start" });
          ev.stopPropagation();
        });

        // Process headings in Grok's response (only for AI responses)
        if (hasH3) {
          const subUl = document.createElement("ul");
          const h3Elements = response.querySelectorAll("h3");

          // Process each h3 element (main section titles)
          for (let h = 0; h < h3Elements.length; h++) {
            const h3 = h3Elements[h];
            // Skip headings inside <pre> or <code>
            let skip = false;
            let p = h3;
            while (p) {
              if (p.tagName === "PRE" || p.tagName === "CODE") {
                skip = true;
                break;
              }
              p = p.parentElement;
            }
            if (skip) continue;

            // Create section item (can have children)
            const sectionLi = createTocItem(h3.textContent, h3, false, true);

            // Find h4s, ordered lists, or strong elements that follow this h3 until the next h3
            const h4Subpoints = document.createElement("ul");

            // Get all following elements until next h3
            let nextElement = h3.nextElementSibling;
            let foundSubpoints = false;
            let currentH4 = null;
            let currentH4Li = null;

            while (nextElement && nextElement.tagName !== "H3") {
              // Handle H4 headings
              if (nextElement.tagName === "H4") {
                currentH4 = nextElement;
                currentH4Li = createTocItem(nextElement.textContent, nextElement, true, true);
                h4Subpoints.appendChild(currentH4Li);
                foundSubpoints = true;
              }
              // Handle ordered lists (OL) - they should be children of the previous H4
              else if (nextElement.tagName === "OL" && currentH4Li) {
                const olUl = document.createElement("ul");
                const liItems = nextElement.querySelectorAll("li");

                for (let l = 0; l < liItems.length; l++) {
                  const liItem = liItems[l];
                  // Look for strong tag inside the LI
                  const strongElement = liItem.querySelector("strong");
                  if (strongElement) {
                    const listItemLi = createTocItem(strongElement.textContent, liItem, true);
                    olUl.appendChild(listItemLi);
                  }
                }

                if (olUl.children.length > 0) {
                  currentH4Li.appendChild(olUl);
                }
              }
              // Check for strong elements inside paragraphs (when there's no H4 parent)
              else if (nextElement.tagName === "P" && !currentH4) {
                const strongElements = nextElement.querySelectorAll("strong");
                if (strongElements.length > 0) {
                  // Use the first strong element as a subpoint
                  const strongEl = strongElements[0];
                  const pointLi = createTocItem(strongEl.textContent, nextElement, true);
                  h4Subpoints.appendChild(pointLi);
                  foundSubpoints = true;
                }
              }

              nextElement = nextElement.nextElementSibling;
            }

            // Add the subpoints if any were found
            if (foundSubpoints) {
              sectionLi.appendChild(h4Subpoints);
            }

            subUl.appendChild(sectionLi);
          }

          if (subUl.children.length > 0) {
            li.appendChild(subUl);
          }
        }

        list.appendChild(li);
      }
    } else if (chatGptArticles.length > 0) {
      // Original ChatGPT processing
      // Loop over turns
      for (let i = 0; i < chatGptArticles.length; i++) {
        const art = chatGptArticles[i];
        const li = document.createElement("li");
        li.classList.add("toc-collapse-trigger");

        // Check if AI
        const sr = art.querySelector("h6.sr-only");
        let isAI = false;
        let label = "";

        if (sr && sr.textContent.indexOf("ChatGPT said:") >= 0) {
          isAI = true;
          label = `Turn ${i + 1} (AI)`;
        } else {
          label = `Turn ${i + 1} (You)`;
        }

        li.innerHTML = `
                    <div class="toc-collapsed-trigger-content">
                        <span class="toc-toggle" role="button" aria-label="Toggle turn">${minusSvg}</span>
                        <span class="toc-clickable-content" title="${label}">${label}</span>
                    </div>
                `;

        // Add collapsible functionality
        const toggle = li.querySelector(".toc-toggle");
        toggle.addEventListener("click", function (ev) {
          const isExpanded = !li.classList.contains("toc-collapsed");

          if (isExpanded) {
            // Collapse
            li.classList.add("toc-collapsed");
            toggle.innerHTML = plusSvg;
          } else {
            // Expand
            li.classList.remove("toc-collapsed");
            toggle.innerHTML = minusSvg;
          }
          ev.stopPropagation();
        });

        // On click: scroll to turn
        const content = li.querySelector(".toc-clickable-content");
        content.addEventListener("click", function (ev) {
          art.scrollIntoView({ behavior: "smooth", block: "start" });
          ev.stopPropagation();
        });

        // AI subheadings
        if (isAI) {
          const subUl = document.createElement("ul");
          const heads = art.querySelectorAll("h3:not(.sr-only)");
          for (let h = 0; h < heads.length; h++) {
            const hd = heads[h];
            // Skip headings inside <pre> or <code>
            let skip = false;
            let p = hd;
            while (p) {
              if (p.tagName === "PRE" || p.tagName === "CODE") {
                skip = true;
                break;
              }
              p = p.parentElement;
            }
            if (skip) continue;

            // Create section item
            const sectionLi = createTocItem(hd.textContent, hd, false, true);
            subUl.appendChild(sectionLi);
          }

          if (subUl.children.length > 0) {
            li.appendChild(subUl);
          }
        }

        list.appendChild(li);
      }
    }

    // Setup the expand/collapse all buttons
    document.getElementById("toc-expand-all").addEventListener("click", function (e) {
      toggleAllItems(true);
      e.stopPropagation();
    });

    document.getElementById("toc-collapse-all").addEventListener("click", function (e) {
      toggleAllItems(false);
      e.stopPropagation();
    });
  }

  // Attach observer to new container if needed
  function attachObserver() {
    // Attempt to locate the main chat container
    const grokContainer = document.querySelector("main") || null;
    const chatGptContainer = document.querySelector("main#main") || document.querySelector(".chat-container") || null;

    const c = grokContainer || chatGptContainer;

    if (c !== chatContainer) {
      chatContainer = c;
      // Disconnect old observer if any
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      // Attach new observer if container found
      if (chatContainer) {
        observer = new MutationObserver(function () {
          debounceBuildTOC();
        });
        observer.observe(chatContainer, { childList: true, subtree: true });
        buildTOC();
      }
    }
  }

  // Attempt to attach on load
  attachObserver();
  // Re-check every 2s in case container changes
  const reAttachInterval = setInterval(attachObserver, 2000);

  // Panel resize functionality
  const resizeHandle = document.getElementById("toc-resize-handle");
  let startX, startWidth;

  function startResize(e) {
    // Don't start resize if panel is collapsed
    if (panel.classList.contains("collapsed")) return;

    startX = e.clientX;
    startWidth = parseInt(window.getComputedStyle(panel).width, 10);
    document.documentElement.classList.add("resize-active");
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
    e.preventDefault();
  }

  function resize(e) {
    // Extra check to ensure we don't resize a collapsed panel
    if (panel.classList.contains("collapsed")) {
      stopResize();
      return;
    }

    // Calculate new width (moving right to left)
    const newWidth = startWidth + (startX - e.clientX);

    // Enforce minimum width
    if (newWidth >= DEFAULT_PANEL_WIDTH) {
      panel.style.width = newWidth + "px";

      // Update handle position when panel is expanded
      if (!panel.classList.contains("collapsed")) {
        handle.style.right = newWidth + "px";
      }
    } else {
      panel.style.width = DEFAULT_PANEL_WIDTH + "px";

      // Update handle position for minimum width
      if (!panel.classList.contains("collapsed")) {
        handle.style.right = DEFAULT_PANEL_WIDTH + "px";
      }
    }
  }

  function stopResize() {
    document.documentElement.classList.remove("resize-active");
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  }

  resizeHandle.addEventListener("mousedown", startResize);

  // Panel toggle with handle position adjustment
  handle.addEventListener("click", function () {
    const isCollapsed = panel.classList.contains("collapsed");
    panel.classList.toggle("collapsed");

    // Reset handle position based on panel state
    if (isCollapsed) {
      // Panel is being expanded, move handle to panel width
      const panelWidth = parseInt(panel.style.width || DEFAULT_PANEL_WIDTH, 10);
      handle.style.right = panelWidth + "px";
    } else {
      // Panel is being collapsed, reset handle to edge
      handle.style.right = "0";
    }
  });
})();
