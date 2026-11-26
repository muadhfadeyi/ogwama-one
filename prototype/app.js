// OGWAMA One — Apple HIG Simple & Self-Explanatory Prototype Controller

(function () {
  const state = {
    view: "dashboard",
    dept: "all",
    splitTrack: "industrial", // 'industrial' | 'estate'
    selectedClientId: OGWAMA_DATA.industrialClients[0].id,
    selectedEstateId: OGWAMA_DATA.estates[0].id,
    customAmount: OGWAMA_DATA.industrialClients[0].monthlyBill,
    estateUnits: OGWAMA_DATA.estates[0].units,
    estateRate: OGWAMA_DATA.estates[0].ratePerUnit,
    escrowGuard: true,
    splitStep: 0,
    txFilter: "All",
    licensingTab: "apply", // 'apply' | 'queue' | 'registry'
    applyTrack: "PSP Annual License",
    verifyQuery: "OGW-VND-2027-0148",
    selectedWardId: OGWAMA_DATA.wards[0].id,
    transactions: [...OGWAMA_DATA.transactions],
    pendingApplications: [...OGWAMA_DATA.pendingApplications],
    licenses: [...OGWAMA_DATA.licenses],
    recyclingManifests: [...OGWAMA_DATA.recyclingManifests],
    activityFeed: [...OGWAMA_DATA.activityFeed],
    wards: [...OGWAMA_DATA.wards],
    baseCollections: 48620000,
    basePspSettled: 29172000,
    baseActiveLicenses: 212
  };

  const fmtNaira = (n) => "₦" + Math.round(n).toLocaleString("en-NG");
  const fmtMillions = (n) => "₦" + (n / 1000000).toFixed(2) + "M";

  function showToast(msg) {
    const stack = document.getElementById("toastStack");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    stack.appendChild(el);
    setTimeout(() => el.remove(), 3800);
  }

  function openModal(title, html) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBody").innerHTML = html;
    document.getElementById("modalBackdrop").classList.remove("hidden");
  }

  function closeModal() {
    document.getElementById("modalBackdrop").classList.add("hidden");
  }

  function generateQrSvg(text, size = 96) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const cells = 15;
    const cellSize = size / cells;
    let rects = "";
    const isFinder = (r, c) =>
      (r < 5 && c < 5) || (r < 5 && c >= cells - 5) || (r >= cells - 5 && c < 5);

    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        let on = false;
        if (isFinder(r, c)) {
          const lr = r < 5 ? r : r - (cells - 5);
          const lc = c < 5 ? c : c - (cells - 5);
          on = lr === 0 || lr === 4 || lc === 0 || lc === 4 || (lr === 2 && lc === 2);
        } else {
          const bit = ((hash >>> ((r * cells + c) % 29)) ^ (r * 7 + c * 13)) & 1;
          on = bit === 1;
        }
        if (on) {
          rects += `<rect x="${(c * cellSize).toFixed(1)}" y="${(r * cellSize).toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}" rx="1" fill="#1d1d1f"/>`;
        }
      }
    }
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="#ffffff"/>${rects}</svg>`;
  }

  function updateBadge() {
    const badge = document.getElementById("pendingBadge");
    if (badge) {
      badge.textContent = state.pendingApplications.length;
      badge.style.display = state.pendingApplications.length > 0 ? "inline-flex" : "none";
    }
  }

  // =========================================================
  // 1. OVERVIEW (EXECUTIVE & PRS)
  // =========================================================
  function renderDashboard() {
    const deptObj = OGWAMA_DATA.departments.find((d) => d.id === state.dept) || OGWAMA_DATA.departments[0];
    const focusClass = (k) => (state.dept !== "all" && deptObj.highlightKpis.includes(k) ? "focus" : "");

    const addedTx = state.transactions.slice(0, state.transactions.length - OGWAMA_DATA.transactions.length);
    const totalCollections = state.baseCollections + addedTx.reduce((s, t) => s + t.gross, 0);
    const totalPspSettled = state.basePspSettled + addedTx.reduce((s, t) => s + t.pspShare, 0);
    const totalLicenses = state.baseActiveLicenses + (state.licenses.length - OGWAMA_DATA.licenses.length);

    // Minimal Apple Health-style Bar Chart
    const trend = OGWAMA_DATA.monthlyTrend;
    const maxVal = 62;
    const svgW = 500, svgH = 195, padL = 8, padB = 26, padT = 22;
    const plotH = svgH - padB - padT;
    const barW = 40;
    const step = (svgW - padL * 2) / trend.length;

    let chartSvg = "";
    trend.forEach((m, i) => {
      const total = m.industrial + m.residential + m.licensing;
      const h = (total / maxVal) * plotH;
      const x = padL + i * step + (step - barW) / 2;
      const y = padT + plotH - h;
      const isLast = i === trend.length - 1;
      chartSvg += `
        <rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="10" fill="${isLast ? "#00704a" : "#d8e7e0"}">
          <title>${m.month}: ₦${total.toFixed(1)}M total</title>
        </rect>
        <text x="${x + barW / 2}" y="${y - 7}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${isLast ? "#00704a" : "#6e6e73"}">₦${total.toFixed(1)}M</text>
        <text x="${x + barW / 2}" y="${svgH - 6}" text-anchor="middle" font-size="12" font-weight="${isLast ? "700" : "500"}" fill="${isLast ? "#1d1d1f" : "#86868b"}">${m.month}</text>
      `;
    });

    const deptShortLabels = {
      all: "All Agency",
      finance: "Finance",
      commercial: "Commercial",
      operations: "Operations",
      prs: "PRS",
      recycling: "Recycling"
    };

    return `
      <section class="page-hero">
        <div>
          <div class="hero-kicker">Ogun State Waste Management Authority</div>
          <h1>One calm place to run OGWAMA.</h1>
          <p>Collect waste bills with instant PSP splits, move 2027 licensing online, and see real-time compliance across every ward—at &#8358;0 upfront cost to Ogun State.</p>
        </div>
        <button class="btn btn-primary" data-jump="splitpay">Try Instant Split Demo &rarr;</button>
      </section>

      <!-- DEPARTMENTAL LENS -->
      <div class="caption-strip">
        <div class="segmented" role="tablist">
          ${OGWAMA_DATA.departments.map((d) => `
            <button class="seg-btn ${state.dept === d.id ? "active" : ""}" data-dept="${d.id}">${deptShortLabels[d.id] || d.label}</button>
          `).join("")}
        </div>
        <p style="flex:1;min-width:260px"><strong>${deptShortLabels[state.dept]}:</strong> ${deptObj.bannerText}</p>
      </div>

      <!-- 3 BIG CALM METRICS -->
      <div class="grid-3">
        <div class="metric-tile ${focusClass("collections")}">
          <div class="metric-label">Monthly Collections</div>
          <div class="metric-value num">${fmtMillions(totalCollections)}</div>
          <div class="metric-note"><span class="pill green">+34% YoY</span> 4,770 enumerated entities</div>
        </div>
        <div class="metric-tile ${focusClass("settled")}">
          <div class="metric-label">Instant PSP Payouts</div>
          <div class="metric-value num">${fmtMillions(totalPspSettled)}</div>
          <div class="metric-note"><span class="pill accent">Avg 43 sec</span> Down from 45–90 days</div>
        </div>
        <div class="metric-tile ${focusClass("licenses")}">
          <div class="metric-label">2027 Digital Licenses</div>
          <div class="metric-value num">${totalLicenses}</div>
          <div class="metric-note"><span class="pill blue">${state.pendingApplications.length} pending</span> PSPs &amp; &#8358;200k Vendors</div>
        </div>
      </div>

      <!-- 2 SIDE-BY-SIDE VISUALS -->
      <div class="grid-2">
        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Monthly Revenue Growth</div>
              <div class="card-sub">Industrial 60/40, Estate 80/20 &amp; 2027 licensing combined</div>
            </div>
            <span class="pill green">Auto PRS Report</span>
          </div>
          <svg viewBox="0 0 ${svgW} ${svgH}" width="100%" style="display:block">${chartSvg}</svg>
        </div>

        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Service vs. Payment Gap</div>
              <div class="card-sub">Comparing verified pickups against paid bills by corridor</div>
            </div>
          </div>
          ${OGWAMA_DATA.corridorGap.slice(0, 4).map((c) => `
            <div class="meter-item">
              <div class="meter-top">
                <strong>${c.corridor.split(" (")[0]}</strong>
                <span>${c.pickupRate}% pickups &bull; <strong>${c.payCompliance}% paid</strong></span>
              </div>
              <div class="meter-track">
                <div class="meter-fill" style="width:${c.payCompliance}%;background:${c.payCompliance >= 80 ? "#00704a" : c.payCompliance >= 70 ? "#f59e0b" : "#ef4444"}"></div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- RECENT ACTIVITY (UPDATES LIVE) -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Live Agency Activity</div>
            <div class="card-sub">Updates automatically whenever you run a split payment or approve a 2027 license</div>
          </div>
          <button class="btn btn-soft btn-sm" data-jump="licensing">Review ${state.pendingApplications.length} Pending Licenses</button>
        </div>
        <div class="ios-list">
          ${state.activityFeed.slice(0, 4).map((f) => `
            <div class="ios-row">
              <div>
                <div class="row-title">${f.title}</div>
                <div class="row-sub">${f.sub}</div>
              </div>
              <span class="pill ${f.color === "#16a34a" ? "green" : f.color === "#b42318" ? "red" : "amber"}">Live</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // =========================================================
  // 2. INSTANT SPLIT PAY (60/40 & 80/20)
  // =========================================================
  function renderSplitPay() {
    const isInd = state.splitTrack === "industrial";
    const client = OGWAMA_DATA.industrialClients.find((c) => c.id === state.selectedClientId) || OGWAMA_DATA.industrialClients[0];
    const estate = OGWAMA_DATA.estates.find((e) => e.id === state.selectedEstateId) || OGWAMA_DATA.estates[0];

    const gross = isInd ? Number(state.customAmount || 0) : Number(state.estateUnits || 0) * Number(state.estateRate || 0);
    const pspPct = isInd ? 0.6 : 0.8;
    const govtPct = isInd ? 0.4 : 0.2;
    const feePct = isInd ? 0.02 : 0.015;

    const pspShare = gross * pspPct;
    const govtShare = gross * govtPct;
    const platformFee = gross * feePct;

    const filteredTx = state.txFilter === "All"
      ? state.transactions
      : state.transactions.filter((t) => t.track === state.txFilter);

    const stepCls = (n) => (state.splitStep > n ? "done" : state.splitStep === n ? "active" : "");

    return `
      <section class="page-hero">
        <div>
          <div class="hero-kicker">Instant Settlement Engine</div>
          <h1>Pay once. Split automatically.</h1>
          <p>When a company or estate pays an OGWAMA bill, funds split at the payment gateway—so PSPs are paid in seconds without waiting for treasury approvals.</p>
        </div>
      </section>

      <!-- SIMPLE BEFORE / AFTER -->
      <div class="explainer-pair">
        <div class="explainer-card">
          <div class="explainer-tag" style="color:var(--red)">Before &bull; Why PSPs Waited Months</div>
          <p>100% landed in one government account first. Getting the PSP's 60% back out required formal claim letters and multi-stage approval.</p>
        </div>
        <div class="explainer-card">
          <div class="explainer-tag" style="color:var(--accent)">With OGWAMA One &bull; Instant Pre-Split</div>
          <p>A single pre-authorized split mandate routes <strong>${isInd ? "60% to the PSP & 40% to OGWAMA" : "80% to the PSP & 20% to OGWAMA"}</strong> simultaneously at checkout.</p>
        </div>
      </div>

      <!-- TWO-COLUMN CHECKOUT + APPLE WALLET CARD -->
      <div class="grid-split">
        <div class="card">
          <div class="card-head" style="margin-bottom:18px">
            <div>
              <div class="card-title">Simulate a Live Payment</div>
              <div class="card-sub">Choose a billing track and watch both accounts settle in real time</div>
            </div>
          </div>

          <div class="segmented" style="margin-bottom:20px">
            <button class="seg-btn ${isInd ? "active" : ""}" data-split-track="industrial">Industrial &amp; Commercial (60/40)</button>
            <button class="seg-btn ${!isInd ? "active" : ""}" data-split-track="estate">Estate &amp; CDC Bulk (80/20)</button>
          </div>

          <div class="form-stack">
            ${isInd ? `
              <div class="field">
                <label>Company / Commercial Facility</label>
                <select id="simClientSelect">
                  ${OGWAMA_DATA.industrialClients.map((c) => `
                    <option value="${c.id}" ${c.id === client.id ? "selected" : ""}>${c.name} — ${c.corridor}</option>
                  `).join("")}
                </select>
              </div>
              <div class="form-row-2">
                <div class="field">
                  <label>Assigned PSP</label>
                  <input type="text" value="${client.assignedPsp}" disabled />
                </div>
                <div class="field">
                  <label>Invoice Amount (&#8358;)</label>
                  <input type="number" id="simAmountInput" value="${gross}" min="50000" step="50000" />
                </div>
              </div>
            ` : `
              <div class="field">
                <label>Organised Estate / CDC</label>
                <select id="simEstateSelect">
                  ${OGWAMA_DATA.estates.map((e) => `
                    <option value="${e.id}" ${e.id === estate.id ? "selected" : ""}>${e.name}</option>
                  `).join("")}
                </select>
              </div>
              <div class="form-row-2">
                <div class="field">
                  <label>Enumerated Housing Units</label>
                  <input type="number" id="simUnitsInput" value="${state.estateUnits}" min="10" step="5" />
                </div>
                <div class="field">
                  <label>Monthly Tariff per Unit (&#8358;)</label>
                  <input type="number" id="simRateInput" value="${state.estateRate}" min="500" step="500" />
                </div>
              </div>
            `}

            <label class="ios-switch-row">
              <div>
                <div style="font-size:14px;font-weight:600">Hold PSP payout until pickup verified</div>
                <div style="font-size:12.5px;color:var(--ink-2)">Optional safeguard linking payment release to GPS pickup or dumpsite drop</div>
              </div>
              <span class="switch">
                <input type="checkbox" id="simEscrowToggle" ${state.escrowGuard ? "checked" : ""} />
                <span class="slider"></span>
              </span>
            </label>

            <button class="btn btn-primary btn-full" id="runSplitBtn">
              Pay ${fmtNaira(gross)} &amp; Split Instantly
            </button>
          </div>
        </div>

        <!-- WALLET PREVIEW CARD -->
        <div class="wallet-card">
          <div class="wallet-eyebrow">
            <span>OGWAMA Pre-Split Settlement</span>
            <span style="color:#86efac">&bull; Active Mandate</span>
          </div>
          <div class="wallet-total num" id="walletTotal">${fmtNaira(gross)}</div>

          <div class="split-bar">
            <div class="split-psp" style="width:${pspPct * 100}%"></div>
            <div class="split-ogw" style="width:${govtPct * 100}%"></div>
          </div>

          <div class="wallet-breakdown">
            <div class="wb-row">
              <span>Assigned PSP (${Math.round(pspPct * 100)}%) &mdash; Instant</span>
              <strong class="num" id="walletPsp" style="color:#86efac">${fmtNaira(pspShare)}</strong>
            </div>
            <div class="wb-row">
              <span>OGWAMA Treasury (${Math.round(govtPct * 100)}%) &mdash; Intact</span>
              <strong class="num" id="walletGovt" style="color:#fde68a">${fmtNaira(govtShare)}</strong>
            </div>
            <div class="wb-row">
              <span>Portal Convenience Fee (${(feePct * 100).toFixed(1)}% paid by payer)</span>
              <strong class="num" id="walletFee" style="color:rgba(255,255,255,0.88)">${fmtNaira(platformFee)}</strong>
            </div>
          </div>

          <div class="stepper">
            <div class="step-node ${stepCls(1)}"><div class="step-dot">1</div>Verify Bill</div>
            <div class="step-node ${stepCls(2)}"><div class="step-dot">2</div>Split Mandate</div>
            <div class="step-node ${stepCls(3)}"><div class="step-dot">3</div>Dual Credit</div>
            <div class="step-node ${stepCls(4)}"><div class="step-dot">4</div>QR Receipt</div>
          </div>
        </div>
      </div>

      <!-- CLEAN APPLE-CARD STYLE TRANSACTION LIST -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Recent Instant Settlements</div>
            <div class="card-sub">Click any transaction to view its official QR audit receipt</div>
          </div>
          <div class="segmented">
            ${["All", "Industrial 60/40", "Estate/CDC 80/20", "2027 Licensing"].map((f) => `
              <button class="seg-btn ${state.txFilter === f ? "active" : ""}" data-tx-filter="${f}">${f}</button>
            `).join("")}
          </div>
        </div>
        <div class="ios-list">
          ${filteredTx.map((t) => `
            <div class="ios-row clickable" data-receipt="${t.ref}">
              <div>
                <div class="row-title">${t.payer}</div>
                <div class="row-sub">${t.track} &bull; PSP ${fmtNaira(t.pspShare)} / OGWAMA ${fmtNaira(t.ogwamaShare)} &bull; ${t.time}</div>
              </div>
              <div class="row-right">
                <div class="row-title num">${fmtNaira(t.gross)}</div>
                <div class="row-sub"><span style="color:var(--green);font-weight:600">Settled in ${t.settlementTime}</span></div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // =========================================================
  // 3. 2027 ONLINE LICENSING
  // =========================================================
  function renderLicensing() {
    const isPsp = state.applyTrack === "PSP Annual License";
    const isVendor = state.applyTrack === "Waste Vendor License";
    const fee = isPsp ? 350000 : isVendor ? 200000 : 150000;

    return `
      <section class="page-hero">
        <div>
          <div class="hero-kicker">2027 Digital Mandate</div>
          <h1>Paperless licensing, built in.</h1>
          <p>Replaces downloadable PDFs on ogwama.og.gov.ng. Operators apply online, Operations approves in one click, and OGWAMA issues an instant QR digital license.</p>
        </div>
        <div class="segmented">
          <button class="seg-btn ${state.licensingTab === "apply" ? "active" : ""}" data-lic-tab="apply">Apply Online</button>
          <button class="seg-btn ${state.licensingTab === "queue" ? "active" : ""}" data-lic-tab="queue">Pending Review (${state.pendingApplications.length})</button>
          <button class="seg-btn ${state.licensingTab === "registry" ? "active" : ""}" data-lic-tab="registry">Issued 2027 Licenses</button>
        </div>
      </section>

      ${state.licensingTab === "apply" ? `
        <div class="grid-split">
          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">New 2027 Application</div>
                <div class="card-sub">Select a license track to preview automatic ward-overlap &amp; conflict checks</div>
              </div>
            </div>

            <div class="segmented" style="margin-bottom:20px">
              ${["PSP Annual License", "Waste Vendor License", "Special Permit"].map((tr) => `
                <button class="seg-btn ${state.applyTrack === tr ? "active" : ""}" data-apply-track="${tr}">${tr}</button>
              `).join("")}
            </div>

            <form id="licApplyForm" class="form-stack">
              <div class="form-row-2">
                <div class="field">
                  <label>Company Name</label>
                  <input type="text" id="appCompany" placeholder="${isPsp ? "e.g., Abeokuta GreenCompactors Ltd" : isVendor ? "e.g., Ogun Circular Plastics Ltd" : "e.g., Metro Clinical Waste Ltd"}" required />
                </div>
                <div class="field">
                  <label>CAC RC Number</label>
                  <input type="text" id="appRc" placeholder="e.g., RC-2045190" required />
                </div>
              </div>

              ${isPsp ? `
                <div class="field">
                  <label>Political Ward Allocation (Assigned wards are automatically locked)</label>
                  <select id="appScope">
                    ${OGWAMA_DATA.availableWardsFor2027.map((w) => `
                      <option value="${w.label}" ${w.locked ? "disabled" : ""}>${w.locked ? "Locked — " : "Open — "}${w.label}</option>
                    `).join("")}
                  </select>
                </div>
                <div class="form-row-2">
                  <div class="field">
                    <label>Compactors / Trucks &amp; Plates</label>
                    <input type="text" id="appTrucks" value="2 Compactors (OG-904-AB, OG-905-AB)" required />
                  </div>
                  <div class="field">
                    <label>Bank Account for Instant Split</label>
                    <input type="text" id="appBank" value="GTBank • 0234918821" required />
                  </div>
                </div>
              ` : isVendor ? `
                <div class="field">
                  <label>Designated Industrial Companies (Multiple vendors may share one factory)</label>
                  <input type="text" id="appScope" value="Agbara Packaging & Foods Ltd; Sagamu Steel Plc (PET & Cartons)" required />
                </div>
                <div class="field">
                  <label>Recycling Plant &amp; Delivery Vehicle</label>
                  <input type="text" id="appTrucks" value="Ota Polymer Plant • Covered Van (OG-612-RV)" required />
                </div>
              ` : `
                <div class="field">
                  <label>Permit Purpose (Medical / Construction / Event)</label>
                  <input type="text" id="appScope" value="Temporary Construction Haulage — Abeokuta South" required />
                </div>
                <div class="field">
                  <label>Approved Vehicle</label>
                  <input type="text" id="appTrucks" value="1 Covered Tipper (OG-330-SP)" required />
                </div>
              `}

              <div class="field">
                <label>Mandatory Statutory Documents</label>
                <div class="check-list">
                  <label class="check-item"><input type="checkbox" checked required /> CAC Certificate</label>
                  <label class="check-item"><input type="checkbox" checked required /> 3-Year Ogun Tax Clearance</label>
                  <label class="check-item"><input type="checkbox" checked required /> Procurement Registration</label>
                  <label class="check-item"><input type="checkbox" checked required /> ${isPsp ? "Truck Ownership Proof" : "Off-Taker Agreement"}</label>
                </div>
              </div>

              <div style="display:flex;justify-content:space-between;align-items:center;padding-top:6px;gap:12px;flex-wrap:wrap">
                <div style="font-size:13.5px;color:var(--ink-2)">
                  Fee: <strong style="color:var(--ink)">${fmtNaira(fee)}</strong> + &#8358;7,500 portal fee
                </div>
                <button type="submit" class="btn btn-primary">Submit 2027 Application &rarr;</button>
              </div>
            </form>
          </div>

          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Automatic Legal Safeguards</div>
                <div class="card-sub">Checked automatically before Operations ever reviews a file</div>
              </div>
            </div>
            <div class="ios-list">
              <div class="ios-row">
                <div>
                  <div class="row-title">Zero Ward Overlap</div>
                  <div class="row-sub">Already-assigned political wards cannot be selected by another PSP.</div>
                </div>
                <span class="pill green">Active</span>
              </div>
              <div class="ios-row">
                <div>
                  <div class="row-title">PSP vs. Vendor Conflict Lock</div>
                  <div class="row-sub">Blocks any single RC number from operating as both a PSP and a Waste Vendor.</div>
                </div>
                <span class="pill green">Active</span>
              </div>
              <div class="ios-row">
                <div>
                  <div class="row-title">3-Year Ogun TCC Verification</div>
                  <div class="row-sub">Ensures full Ogun State tax compliance and verified truck ownership.</div>
                </div>
                <span class="pill green">Active</span>
              </div>
              <div class="ios-row">
                <div>
                  <div class="row-title">Instant QR Certificate</div>
                  <div class="row-sub">Approval mints a scannable 2027 digital license verifiable at any factory gate.</div>
                </div>
                <span class="pill accent">Instant</span>
              </div>
            </div>
          </div>
        </div>
      ` : state.licensingTab === "queue" ? `
        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Operations Approval Queue</div>
              <div class="card-sub">One click approves the operator, records the fee, and issues a live 2027 QR Certificate</div>
            </div>
          </div>
          ${state.pendingApplications.length === 0 ? `
            <p style="color:var(--ink-2);padding:12px 0">Every pending application has been approved. Submit a new one under <strong>Apply Online</strong> to test again.</p>
          ` : `
            <div class="ios-list">
              ${state.pendingApplications.map((a) => `
                <div class="ios-row">
                  <div>
                    <div class="row-title">${a.company} <span class="pill gray" style="margin-left:6px">${a.type}</span></div>
                    <div class="row-sub">${a.wardOrScope} &bull; ${a.trucks} &bull; <strong>${fmtNaira(a.feePaid)} paid</strong></div>
                    <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
                      <span class="pill green">CAC Verified</span>
                      <span class="pill green">3-Yr TCC</span>
                      <span class="pill green">Zero Overlap</span>
                      <span class="pill green">No Conflict</span>
                    </div>
                  </div>
                  <button class="btn btn-primary btn-sm" data-approve-app="${a.appId}">Approve &amp; Issue QR</button>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      ` : `
        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Issued 2027 Digital Licenses</div>
              <div class="card-sub">Every approved PSP and &#8358;200k Waste Vendor carries a verifiable digital pass</div>
            </div>
          </div>
          <div class="ios-list">
            ${state.licenses.filter((l) => l.status === "VALID").map((l) => `
              <div class="ios-row">
                <div>
                  <div class="row-title">${l.company} <span class="pill accent" style="margin-left:6px">${l.licenseId}</span></div>
                  <div class="row-sub">${l.type} &bull; ${l.assignedArea}</div>
                </div>
                <button class="btn btn-soft btn-sm" data-view-cert="${l.licenseId}">View QR Pass</button>
              </div>
            `).join("")}
          </div>
        </div>
      `}
    `;
  }

  // =========================================================
  // 4. QR VERIFY & INDUSTRIAL RECYCLING COMPLIANCE
  // =========================================================
  function renderVerify() {
    const q = (state.verifyQuery || "").trim().toUpperCase();
    const match = state.licenses.find((l) => l.licenseId.toUpperCase() === q);
    const isValid = match && match.status === "VALID";

    return `
      <section class="page-hero">
        <div>
          <div class="hero-kicker">Field &amp; Factory Gate Verification</div>
          <h1>Verify any operator in 3 seconds.</h1>
          <p>Factory security, Commercial Officers, and Waste Police scan a QR pass to confirm licenses—stopping unlicensed scrap buyers and HSE double-crossing.</p>
        </div>
      </section>

      <div class="grid-split">
        <!-- QR CHECKER -->
        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Instant QR License Check</div>
              <div class="card-sub">Tap a sample license below or type any ID to test live verification</div>
            </div>
          </div>

          <div style="display:flex;gap:10px;margin-bottom:14px">
            <input type="text" id="verifyInput" value="${state.verifyQuery}" placeholder="Enter License ID (e.g., OGW-VND-2027-0148)" />
            <button class="btn btn-dark" id="verifyBtn">Check</button>
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:20px">
            ${state.licenses.map((l) => `
              <button class="btn btn-sm ${q === l.licenseId ? "btn-primary" : "btn-soft"}" data-quick-verify="${l.licenseId}">
                ${l.status === "VALID" ? "✓" : "!"} ${l.licenseId}
              </button>
            `).join("")}
          </div>

          <div class="pass-card ${isValid ? "valid" : "invalid"}">
            ${match ? `
              <div class="pass-head">
                <div>
                  <span class="pill ${isValid ? "green" : "red"}">${isValid ? "Verified 2027 License" : "Unlicensed / Blocked"}</span>
                  <div class="pass-verdict">${match.company}</div>
                  <div style="font-size:13px;color:var(--ink-2);margin-top:2px">${match.licenseId} &bull; ${match.type}</div>
                </div>
                <div class="qr-box">${generateQrSvg(match.licenseId, 74)}</div>
              </div>
              <div class="ios-list">
                <div class="ios-row" style="padding:9px 0"><span style="color:var(--ink-2);font-size:13px">Scope</span><strong style="font-size:13.5px;text-align:right">${match.scope}</strong></div>
                <div class="ios-row" style="padding:9px 0"><span style="color:var(--ink-2);font-size:13px">Assignment</span><strong style="font-size:13.5px;text-align:right;max-width:66%">${match.assignedArea}</strong></div>
                <div class="ios-row" style="padding:9px 0"><span style="color:var(--ink-2);font-size:13px">Valid Until</span><strong style="font-size:13.5px">${match.validUntil}</strong></div>
              </div>
              <div class="pass-notice" style="background:${isValid ? "rgba(52,199,89,0.16)" : "rgba(255,59,48,0.15)"};color:${isValid ? "var(--green)" : "var(--red)"}">
                ${match.warningNote}
              </div>
            ` : `
              <span class="pill red">Not Found</span>
              <div class="pass-verdict">No 2027 license matches "${q}"</div>
              <p style="font-size:13.5px;color:var(--ink-2);margin-top:6px">Do not release waste or recyclables. Escalate to OGWAMA Commercial Enforcement.</p>
            `}
          </div>
        </div>

        <!-- FACTORY CHAIN OF CUSTODY + HUBS -->
        <div style="display:flex;flex-direction:column;gap:20px">
          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Factory Waste Separation Monitor</div>
                <div class="card-sub">Ensures general waste goes to the PSP and recyclables go only to licensed vendors</div>
              </div>
            </div>
            <div class="ios-list">
              ${state.recyclingManifests.map((m) => `
                <div class="ios-row">
                  <div>
                    <div class="row-title">${m.factory}</div>
                    <div class="row-sub">PSP: ${m.generalPsp} &bull; Vendor: ${m.licensedVendor}</div>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="pill ${m.hseStatus === "Compliant" ? "green" : "red"}">${m.hseStatus}</span>
                    <button class="btn btn-danger-soft btn-sm" data-flag-hse="${m.id}">Flag HSE</button>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Community Recycling Hubs</div>
                <div class="card-sub">Incentivizing residential aggregators, scavengers &amp; households</div>
              </div>
              <span class="pill accent">Circular Economy</span>
            </div>
            <div class="ios-list">
              ${OGWAMA_DATA.communityHubs.map((h) => `
                <div class="ios-row">
                  <div>
                    <div class="row-title">${h.hub}</div>
                    <div class="row-sub">${h.aggregators} registered aggregators &bull; ${h.kgMonth} sorted</div>
                  </div>
                  <strong class="num" style="color:var(--accent)">${h.incentivePaid}</strong>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================
  // 5. WARD MAP & CITIZEN DESK
  // =========================================================
  function renderWards() {
    const sel = state.wards.find((w) => w.id === state.selectedWardId) || state.wards[0];

    return `
      <section class="page-hero">
        <div>
          <div class="hero-kicker">Political-Ward Allocation</div>
          <h1>Every ward. One clear PSP.</h1>
          <p>Replaces the empty PSP table and missing map on ogwama.og.gov.ng. Citizens find their ward collector in seconds and report missed pickups or dumping directly.</p>
        </div>
      </section>

      <div class="grid-split">
        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Select an Ogun Political Ward</div>
              <div class="card-sub">Non-overlapping zones across Abeokuta, Agbara, Sagamu &amp; Ijebu-Ode</div>
            </div>
          </div>
          <div class="ward-grid">
            ${state.wards.map((w) => `
              <button class="ward-card ${w.id === sel.id ? "selected" : ""}" data-ward="${w.id}">
                <div style="font-size:11.5px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.04em">${w.lga}</div>
                <div style="font-size:15px;font-weight:700;color:var(--ink);margin:4px 0 4px">${w.ward.replace(/^Ward \d+ — /, "")}</div>
                <div style="font-size:12.5px;color:var(--ink-2);margin-bottom:10px">${w.psp}</div>
                <span class="pill ${!w.occupied ? "blue" : w.pickupCompliance >= 85 ? "green" : "amber"}">
                  ${w.occupied ? w.pickupCompliance + "% pickups" : "Open 2027 Slot"}
                </span>
              </button>
            `).join("")}
          </div>
        </div>

        <div class="card">
          <div class="card-head">
            <div>
              <div class="card-title">${sel.ward}</div>
              <div class="card-sub">${sel.lga} &bull; ${sel.occupied ? "Exclusive PSP Assigned" : "Available for 2027 Allocation"}</div>
            </div>
          </div>

          <div class="ios-list" style="margin-bottom:20px">
            <div class="ios-row" style="padding:10px 0"><span style="color:var(--ink-2);font-size:13.5px">Assigned PSP</span><strong>${sel.psp}</strong></div>
            <div class="ios-row" style="padding:10px 0"><span style="color:var(--ink-2);font-size:13.5px">Pickup Schedule</span><strong>${sel.schedule}</strong></div>
            <div class="ios-row" style="padding:10px 0"><span style="color:var(--ink-2);font-size:13.5px">Compactors / Free Dumpsite Drops</span><strong>${sel.compactors} trucks &bull; ${sel.dumpsiteDrops} drops</strong></div>
            <div class="ios-row" style="padding:10px 0"><span style="color:var(--ink-2);font-size:13.5px">Open Citizen Tickets</span><span class="pill ${sel.openTickets > 3 ? "red" : "gray"}">${sel.openTickets} open</span></div>
          </div>

          <form id="wardTicketForm" class="form-stack">
            <div class="field">
              <label>Quick Citizen Report or Enforcement Dispatch</label>
              <select id="ticketType">
                <option value="Missed Doorstep Pickup">Missed Doorstep Pickup (Notify Ward PSP)</option>
                <option value="Indiscriminate Highway Dumping">Illegal Highway Dumping (Dispatch Waste Police)</option>
                <option value="Shop / Market Non-Compliance">Shop Non-Compliance (Sanitation Dept)</option>
              </select>
            </div>
            <div class="field">
              <input type="text" id="ticketLocation" placeholder="Street or landmark (e.g., Quarry Road Junction)" required />
            </div>
            <button type="submit" class="btn btn-primary btn-full">Send Alert to Ward PSP &amp; Waste Police</button>
          </form>
        </div>
      </div>
    `;
  }

  // =========================================================
  // APPLE SHEET MODALS (RECEIPT & QR PASS)
  // =========================================================
  function showReceiptModal(ref) {
    const t = state.transactions.find((x) => x.ref === ref);
    if (!t) return;
    openModal("Split-Settlement Receipt", `
      <div style="text-align:center;margin-bottom:18px">
        <span class="pill green">${t.status} in ${t.settlementTime}</span>
        <div class="num" style="font-size:34px;font-weight:700;letter-spacing:-0.03em;margin-top:8px">${fmtNaira(t.gross)}</div>
        <div style="font-size:13.5px;color:var(--ink-2)">${t.payer} &bull; ${t.ref}</div>
      </div>
      <div class="ios-list" style="margin-bottom:18px">
        <div class="ios-row" style="padding:10px 0"><span style="color:var(--ink-2)">PSP Instant Credit (${t.psp})</span><strong class="num" style="color:var(--green)">${fmtNaira(t.pspShare)}</strong></div>
        <div class="ios-row" style="padding:10px 0"><span style="color:var(--ink-2)">OGWAMA Treasury Credit</span><strong class="num">${fmtNaira(t.ogwamaShare)}</strong></div>
        <div class="ios-row" style="padding:10px 0"><span style="color:var(--ink-2)">Portal Convenience Fee (Payer)</span><strong class="num">${fmtNaira(t.platformFee)}</strong></div>
        <div class="ios-row" style="padding:10px 0"><span style="color:var(--ink-2)">Manual PSP Claim Letter Needed</span><strong>None (Auto-Settled)</strong></div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface-subtle);padding:14px 16px;border-radius:16px">
        <div>
          <div style="font-size:13px;font-weight:600">Audit &amp; BPMS Verification QR</div>
          <div style="font-size:12px;color:var(--ink-2)">Immutable reconciliation record for Finance &amp; OGIRS</div>
        </div>
        <div class="qr-box">${generateQrSvg(t.ref + "|" + t.gross, 76)}</div>
      </div>
    `);
  }

  function showCertModal(licenseId) {
    const l = state.licenses.find((x) => x.licenseId === licenseId);
    if (!l) return;
    openModal("2027 OGWAMA Digital Pass", `
      <div class="pass-card valid" style="margin-bottom:16px">
        <div class="pass-head">
          <div>
            <span class="pill green">${l.licenseId}</span>
            <div class="pass-verdict">${l.company}</div>
            <div style="font-size:13px;color:var(--ink-2)">${l.type} &bull; ${l.rcNumber}</div>
          </div>
          <div class="qr-box">${generateQrSvg(l.licenseId, 82)}</div>
        </div>
        <div class="ios-list">
          <div class="ios-row" style="padding:9px 0"><span style="color:var(--ink-2);font-size:13px">Scope</span><strong style="font-size:13px;text-align:right">${l.scope}</strong></div>
          <div class="ios-row" style="padding:9px 0"><span style="color:var(--ink-2);font-size:13px">Assignment</span><strong style="font-size:13px;text-align:right;max-width:65%">${l.assignedArea}</strong></div>
          <div class="ios-row" style="padding:9px 0"><span style="color:var(--ink-2);font-size:13px">Valid Until</span><strong style="font-size:13px">${l.validUntil}</strong></div>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px">
        <button class="btn btn-soft btn-sm" id="testInVerifierBtn">Scan in QR Verifier &rarr;</button>
        <button class="btn btn-primary btn-sm" onclick="window.print()">Print Pass</button>
      </div>
    `);
    const btn = document.getElementById("testInVerifierBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        state.verifyQuery = l.licenseId;
        closeModal();
        switchView("verify");
      });
    }
  }

  // =========================================================
  // ROUTING & EVENT WIRING
  // =========================================================
  function switchView(view) {
    state.view = view;
    document.querySelectorAll("#mainNav .nav-tab").forEach((b) => {
      b.classList.toggle("active", b.dataset.view === view);
    });
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function render() {
    updateBadge();
    const root = document.getElementById("appContent");
    if (state.view === "dashboard") root.innerHTML = renderDashboard();
    else if (state.view === "splitpay") root.innerHTML = renderSplitPay();
    else if (state.view === "licensing") root.innerHTML = renderLicensing();
    else if (state.view === "verify") root.innerHTML = renderVerify();
    else if (state.view === "wards") root.innerHTML = renderWards();
    bindViewEvents();
  }

  function bindViewEvents() {
    document.querySelectorAll("[data-jump]").forEach((b) => {
      b.addEventListener("click", () => switchView(b.dataset.jump));
    });

    document.querySelectorAll("[data-dept]").forEach((b) => {
      b.addEventListener("click", () => {
        state.dept = b.dataset.dept;
        render();
      });
    });

    document.querySelectorAll("[data-split-track]").forEach((b) => {
      b.addEventListener("click", () => {
        state.splitTrack = b.dataset.splitTrack;
        state.splitStep = 0;
        render();
      });
    });

    const clientSel = document.getElementById("simClientSelect");
    if (clientSel) {
      clientSel.addEventListener("change", (e) => {
        state.selectedClientId = e.target.value;
        const c = OGWAMA_DATA.industrialClients.find((x) => x.id === state.selectedClientId);
        if (c) state.customAmount = c.monthlyBill;
        state.splitStep = 0;
        render();
      });
    }

    const updateWalletLive = (gross, pspPct, govtPct, feePct) => {
      const el = (id) => document.getElementById(id);
      if (el("walletTotal")) el("walletTotal").textContent = fmtNaira(gross);
      if (el("walletPsp")) el("walletPsp").textContent = fmtNaira(gross * pspPct);
      if (el("walletGovt")) el("walletGovt").textContent = fmtNaira(gross * govtPct);
      if (el("walletFee")) el("walletFee").textContent = fmtNaira(gross * feePct);
      if (el("runSplitBtn")) el("runSplitBtn").textContent = `Pay ${fmtNaira(gross)} & Split Instantly`;
    };

    const amtInput = document.getElementById("simAmountInput");
    if (amtInput) {
      amtInput.addEventListener("input", (e) => {
        state.customAmount = Number(e.target.value || 0);
        updateWalletLive(state.customAmount, 0.6, 0.4, 0.02);
      });
    }

    const estSel = document.getElementById("simEstateSelect");
    if (estSel) {
      estSel.addEventListener("change", (e) => {
        state.selectedEstateId = e.target.value;
        const est = OGWAMA_DATA.estates.find((x) => x.id === state.selectedEstateId);
        if (est) {
          state.estateUnits = est.units;
          state.estateRate = est.ratePerUnit;
        }
        state.splitStep = 0;
        render();
      });
    }

    const unitsInput = document.getElementById("simUnitsInput");
    const rateInput = document.getElementById("simRateInput");
    const syncEstate = () => {
      state.estateUnits = Number(unitsInput.value || 0);
      state.estateRate = Number(rateInput.value || 0);
      updateWalletLive(state.estateUnits * state.estateRate, 0.8, 0.2, 0.015);
    };
    if (unitsInput) unitsInput.addEventListener("input", syncEstate);
    if (rateInput) rateInput.addEventListener("input", syncEstate);

    const escrowToggle = document.getElementById("simEscrowToggle");
    if (escrowToggle) {
      escrowToggle.addEventListener("change", (e) => {
        state.escrowGuard = e.target.checked;
      });
    }

    const runBtn = document.getElementById("runSplitBtn");
    if (runBtn) {
      runBtn.addEventListener("click", () => {
        runBtn.disabled = true;
        state.splitStep = 1;
        render();

        [2, 3, 4, 5].forEach((stepVal, idx) => {
          setTimeout(() => {
            state.splitStep = stepVal;
            if (stepVal === 5) {
              const isInd = state.splitTrack === "industrial";
              const client = OGWAMA_DATA.industrialClients.find((c) => c.id === state.selectedClientId);
              const estate = OGWAMA_DATA.estates.find((e) => e.id === state.selectedEstateId);
              const gross = isInd ? Number(state.customAmount || 0) : state.estateUnits * state.estateRate;
              const pspShare = gross * (isInd ? 0.6 : 0.8);
              const ogwamaShare = gross * (isInd ? 0.4 : 0.2);
              const platformFee = gross * (isInd ? 0.02 : 0.015);
              const ref = "OGW-SPL-261126-" + Math.floor(100 + Math.random() * 899);

              const newTx = {
                ref,
                time: "Just now",
                payer: isInd ? client.name : `${estate.name} (${state.estateUnits} units)`,
                facilityId: isInd ? client.id : estate.id,
                track: isInd ? "Industrial 60/40" : "Estate/CDC 80/20",
                psp: isInd ? client.assignedPsp : estate.assignedPsp,
                gross,
                pspShare,
                ogwamaShare,
                platformFee,
                settlementTime: "39 sec",
                escrowVerified: state.escrowGuard,
                status: "Settled Instantly"
              };

              state.transactions.unshift(newTx);
              state.activityFeed.unshift({
                color: "#16a34a",
                title: `Instant ${isInd ? "60/40" : "80/20"} Split — ${newTx.payer}`,
                sub: `${fmtNaira(pspShare)} to ${newTx.psp} • ${fmtNaira(ogwamaShare)} to OGWAMA Treasury`
              });

              render();
              showToast(`Settled! ${fmtNaira(pspShare)} credited to PSP & ${fmtNaira(ogwamaShare)} to OGWAMA.`);
              showReceiptModal(ref);
            } else {
              render();
            }
          }, (idx + 1) * 300);
        });
      });
    }

    document.querySelectorAll("[data-tx-filter]").forEach((b) => {
      b.addEventListener("click", () => {
        state.txFilter = b.dataset.txFilter;
        render();
      });
    });
    document.querySelectorAll("[data-receipt]").forEach((r) => {
      r.addEventListener("click", () => showReceiptModal(r.dataset.receipt));
    });

    document.querySelectorAll("[data-lic-tab]").forEach((b) => {
      b.addEventListener("click", () => {
        state.licensingTab = b.dataset.licTab;
        render();
      });
    });
    document.querySelectorAll("[data-apply-track]").forEach((b) => {
      b.addEventListener("click", () => {
        state.applyTrack = b.dataset.applyTrack;
        render();
      });
    });

    const licForm = document.getElementById("licApplyForm");
    if (licForm) {
      licForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const company = document.getElementById("appCompany").value.trim();
        const rc = document.getElementById("appRc").value.trim().toUpperCase();
        const scope = document.getElementById("appScope").value;
        const trucks = document.getElementById("appTrucks").value;
        const bank = document.getElementById("appBank") ? document.getElementById("appBank").value : "N/A";

        const conflict = state.licenses.find(
          (l) => l.rcNumber.toUpperCase() === rc && l.status === "VALID" &&
          ((state.applyTrack.includes("PSP") && l.type.includes("Vendor")) ||
           (state.applyTrack.includes("Vendor") && l.type.includes("PSP")))
        );
        if (conflict) {
          showToast(`Blocked: ${rc} already holds a ${conflict.type}. Dual operation is prohibited.`);
          return;
        }

        const fee = state.applyTrack.includes("PSP") ? 350000 : state.applyTrack.includes("Vendor") ? 200000 : 150000;
        const appId = "APP-2027-" + Math.floor(1000 + Math.random() * 8999);
        state.pendingApplications.unshift({
          appId,
          type: state.applyTrack,
          company,
          rcNumber: rc,
          wardOrScope: scope,
          feePaid: fee,
          submittedAt: "Just now",
          trucks,
          bankAccount: bank,
          checks: { cac: true, tcc3yr: true, procurement: true, truckProof: true, wardOverlapPass: true, conflictPass: true }
        });

        state.activityFeed.unshift({
          color: "#d4a017",
          title: `2027 ${state.applyTrack} Submitted`,
          sub: `${company} (${rc}) routed to Operations Review Queue.`
        });

        state.licensingTab = "queue";
        render();
        showToast(`Application ${appId} submitted to Operations Review Queue.`);
      });
    }

    document.querySelectorAll("[data-approve-app]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = state.pendingApplications.findIndex((a) => a.appId === btn.dataset.approveApp);
        if (idx === -1) return;
        const app = state.pendingApplications.splice(idx, 1)[0];

        const prefix = app.type.includes("PSP") ? "OGW-PSP-2027-" : app.type.includes("Vendor") ? "OGW-VND-2027-" : "OGW-PRM-2027-";
        const licId = prefix + String(Math.floor(200 + Math.random() * 799));

        state.licenses.unshift({
          licenseId: licId,
          type: app.type,
          company: app.company,
          rcNumber: app.rcNumber,
          status: "VALID",
          scope: app.type.includes("Vendor") ? "Recyclables Only (Designated Factories)" : "General Solid Waste Collection",
          assignedArea: app.wardOrScope,
          trucks: app.trucks,
          validUntil: "31 Dec 2027",
          warningNote: app.type.includes("Vendor")
            ? "RECYCLABLES ONLY — Do not release general solid waste."
            : "Verified 2027 OGWAMA Digital Pass. Active for instant QR checks."
        });

        state.transactions.unshift({
          ref: "OGW-LIC-261126-" + Math.floor(100 + Math.random() * 899),
          time: "Just now",
          payer: app.company,
          facilityId: licId,
          track: "2027 Licensing",
          psp: "OGWAMA Direct (100%)",
          gross: app.feePaid,
          pspShare: 0,
          ogwamaShare: app.feePaid,
          platformFee: 7500,
          settlementTime: "18 sec",
          escrowVerified: false,
          status: "Settled Instantly"
        });

        state.activityFeed.unshift({
          color: "#16a34a",
          title: `2027 QR Pass Issued — ${app.company}`,
          sub: `${licId} approved by Operations & active in Gate Verifier.`
        });

        render();
        showToast(`Approved! 2027 Digital Pass ${licId} is now live.`);
        showCertModal(licId);
      });
    });

    document.querySelectorAll("[data-view-cert]").forEach((btn) => {
      btn.addEventListener("click", () => showCertModal(btn.dataset.viewCert));
    });

    const verifyBtn = document.getElementById("verifyBtn");
    const verifyInput = document.getElementById("verifyInput");
    if (verifyBtn && verifyInput) {
      verifyBtn.addEventListener("click", () => {
        state.verifyQuery = verifyInput.value;
        render();
      });
      verifyInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          state.verifyQuery = verifyInput.value;
          render();
        }
      });
    }
    document.querySelectorAll("[data-quick-verify]").forEach((b) => {
      b.addEventListener("click", () => {
        state.verifyQuery = b.dataset.quickVerify;
        render();
      });
    });
    document.querySelectorAll("[data-flag-hse]").forEach((b) => {
      b.addEventListener("click", () => {
        const m = state.recyclingManifests.find((x) => x.id === b.dataset.flagHse);
        if (!m) return;
        m.hseStatus = "Audit Dispatched";
        m.lastAudit = "Just now";
        state.activityFeed.unshift({
          color: "#b42318",
          title: `HSE Audit Dispatched — ${m.factory}`,
          sub: `Commercial Officer alerted to inspect PSP vs. licensed vendor separation.`
        });
        render();
        showToast(`HSE Compliance Audit dispatched for ${m.factory}.`);
      });
    });

    document.querySelectorAll("[data-ward]").forEach((b) => {
      b.addEventListener("click", () => {
        state.selectedWardId = b.dataset.ward;
        render();
      });
    });

    const wardForm = document.getElementById("wardTicketForm");
    if (wardForm) {
      wardForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = document.getElementById("ticketType").value;
        const loc = document.getElementById("ticketLocation").value.trim();
        const w = state.wards.find((x) => x.id === state.selectedWardId);
        if (w) {
          w.openTickets += 1;
          state.activityFeed.unshift({
            color: "#b54708",
            title: `${type} — ${w.ward}`,
            sub: `${loc} • Routed to ${w.psp} & Waste Police.`
          });
        }
        render();
        showToast(`Dispatched! ${type} routed to ${w.psp} & Waste Police.`);
      });
    }
  }

  document.querySelectorAll("#mainNav .nav-tab").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });
  document.getElementById("brandHome").addEventListener("click", (e) => {
    e.preventDefault();
    switchView("dashboard");
  });
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "modalBackdrop") closeModal();
  });

  render();
})();
