/**
 * OrbitSat-AI: Autonomous Self-Modulating Satellite Payload Engine (Port 8085)
 */

document.addEventListener('DOMContentLoaded', () => {
    const state = {
        reflectorDeWarp: 99.4,        // %
        modCod: '256-APSK',           // Modulation Mode
        downlinkGbps: 2.4,            // Gbps
        snrDb: 24.2,                  // dB
        solarIntegrity: 97.8,         // %
        islSpeed: 10.0,               // Gbps
        evmPct: 1.8,                  // %
        audioEnabled: true,
        impactActive: false,
        snrHistory: Array(30).fill(24.2),
        reflectorHistory: Array(30).fill(99.4)
    };

    const elements = {
        statDewarp: document.getElementById('stat-dewarp'),
        statDewarpBadge: document.getElementById('stat-dewarp-badge'),
        statModcod: document.getElementById('stat-modcod'),
        statSolar: document.getElementById('stat-solar'),
        statIsl: document.getElementById('stat-isl'),
        statReroute: document.getElementById('stat-reroute'),
        headerModcod: document.getElementById('header-modcod'),
        headerReflectorState: document.getElementById('header-reflector-state'),
        globalSwarmStatus: document.getElementById('global-swarm-status'),
        satImpactBadge: document.getElementById('sat-impact-badge'),
        satImpactText: document.getElementById('sat-impact-text'),
        constellationModeText: document.getElementById('constellation-mode-text'),
        constellationEvm: document.getElementById('constellation-evm'),
        constellationRate: document.getElementById('constellation-rate'),
        meshLinkPrimary: document.getElementById('mesh-link-primary'),
        meshLinkBackup: document.getElementById('mesh-link-backup'),
        chartSnrVal: document.getElementById('chart-snr-val'),
        chartReflectorVal: document.getElementById('chart-reflector-val'),
        logStream: document.getElementById('sat-log-stream'),
        btnSolarFlare: document.getElementById('btn-solar-flare'),
        btnDebrisStrike: document.getElementById('btn-debris-strike'),
        btnScintillation: document.getElementById('btn-scintillation'),
        btnTriggerReconfig: document.getElementById('btn-trigger-reconfig'),
        audioToggle: document.getElementById('audio-toggle'),
        audioLabel: document.getElementById('audio-label')
    };

    // --- Web Audio Synthesizer ---
    let audioCtx = null;
    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSound(type) {
        if (!state.audioEnabled) return;
        initAudio();
        if (!audioCtx) return;

        try {
            const now = audioCtx.currentTime;

            if (type === 'solar') {
                // High-Energy Solar Flare Alarm Siren
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(1400, now + 0.25);
                osc.frequency.exponentialRampToValueAtTime(700, now + 0.5);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.5);

            } else if (type === 'debris') {
                // Heavy Kinetic Impact Explosion Crunch & Sub-Bass Drop
                const osc1 = audioCtx.createOscillator();
                const osc2 = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc1.type = 'sawtooth';
                osc1.frequency.setValueAtTime(400, now);
                osc1.frequency.exponentialRampToValueAtTime(30, now + 0.45);

                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(120, now);
                osc2.frequency.exponentialRampToValueAtTime(20, now + 0.45);

                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(audioCtx.destination);

                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 0.45);
                osc2.stop(now + 0.45);

            } else if (type === 'scintillation') {
                // Atmospheric RF Scintillation Interference Wave
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(1200, now);
                osc.frequency.linearRampToValueAtTime(300, now + 0.35);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.35);

            } else if (type === 'reconfig') {
                // Self-Modulating De-Warping Resonant Morph Sound
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
                gain.gain.setValueAtTime(0.35, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.35);

            } else if (type === 'complete') {
                // Harmonic Reconfiguration Success Chime (C5 - E5 - G5 - C6)
                const freqs = [523.25, 659.25, 783.99, 1046.50];
                freqs.forEach((f, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now + idx * 0.08);
                    gain.gain.setValueAtTime(0.2, now + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.3);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + idx * 0.08);
                    osc.stop(now + idx * 0.08 + 0.3);
                });

            } else if (type === 'click') {
                // Button Click Crisp Tone
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1100, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.06);
            } else if (type === 'laser') {
                // Rocket Nano-Laser Plasma Welding Sawtooth Sweep
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.linearRampToValueAtTime(1560, now + 0.5);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.5);
            }
        } catch(e) {}
    }

    // --- 1. Three.js 3D Satellite & Heavy Rocket Models ---
    let scene, camera, renderer, satelliteGroup;
    let satMeshGroup, rocketMeshGroup, solarLeft, solarRight, reflectorMesh;
    let currentModelMode = 'sat';

    function init3DSatellite() {
        const container = document.getElementById('sat-canvas-container');
        if (!container) return;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 3, 12);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0x00f3ff, 1.4);
        dirLight.position.set(10, 15, 10);
        scene.add(dirLight);

        // Satellite Bus Group
        satelliteGroup = new THREE.Group();
        scene.add(satelliteGroup);

        build3DModels();

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            if (satelliteGroup) satelliteGroup.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    function build3DModels() {
        // 1. Satellite Mesh Group
        satMeshGroup = new THREE.Group();

        // Satellite Gold-Foil Core Body
        const bodyGeo = new THREE.BoxGeometry(2, 2.8, 2);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        satMeshGroup.add(bodyMesh);

        // Gold-Foil Multi-Layer Insulation Plate
        const goldGeo = new THREE.BoxGeometry(2.05, 1.8, 2.05);
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.1 });
        const goldMesh = new THREE.Mesh(goldGeo, goldMat);
        satMeshGroup.add(goldMesh);

        // Solar Array Wings
        const wingGeo = new THREE.BoxGeometry(6.5, 1.4, 0.08);
        const wingMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.2 });
        solarLeft = new THREE.Mesh(wingGeo, wingMat);
        solarLeft.position.set(-4.5, 0, 0);
        satMeshGroup.add(solarLeft);

        solarRight = new THREE.Mesh(wingGeo, wingMat);
        solarRight.position.set(4.5, 0, 0);
        satMeshGroup.add(solarRight);

        // Parabolic Dish Reflector (Nitinol SMA)
        const dishGeo = new THREE.CylinderGeometry(2.2, 0.2, 0.6, 32, 1, true);
        const dishMat = new THREE.MeshStandardMaterial({ color: 0x00f3ff, wireframe: true, side: THREE.DoubleSide });
        reflectorMesh = new THREE.Mesh(dishGeo, dishMat);
        reflectorMesh.position.set(0, 2.2, 0);
        reflectorMesh.rotation.x = Math.PI / 3;
        satMeshGroup.add(reflectorMesh);

        // 2. Heavy-Lift Rocket Mesh Group
        rocketMeshGroup = new THREE.Group();

        // Nose Cone Fairing
        const noseGeo = new THREE.ConeGeometry(1.2, 2.2, 32);
        const noseMat = new THREE.MeshStandardMaterial({ color: 0x00f3ff, metalness: 0.8, roughness: 0.2 });
        const noseMesh = new THREE.Mesh(noseGeo, noseMat);
        noseMesh.position.set(0, 2.6, 0);
        rocketMeshGroup.add(noseMesh);

        // Fuselage Main Stage 1 & 2 Cylinder Body
        const fuseGeo = new THREE.CylinderGeometry(1.2, 1.2, 5.0, 32);
        const fuseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.25 });
        const fuseMesh = new THREE.Mesh(fuseGeo, fuseMat);
        fuseMesh.position.set(0, -1.0, 0);
        rocketMeshGroup.add(fuseMesh);

        // Carbon Nanotube Self-Healing Stage Rings
        const ringGeo = new THREE.TorusGeometry(1.22, 0.08, 16, 32);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0x00ffaa, metalness: 0.9, roughness: 0.1 });
        const r1 = new THREE.Mesh(ringGeo, ringMat); r1.position.set(0, 0.8, 0); r1.rotation.x = Math.PI/2; rocketMeshGroup.add(r1);
        const r2 = new THREE.Mesh(ringGeo, ringMat); r2.position.set(0, -1.0, 0); r2.rotation.x = Math.PI/2; rocketMeshGroup.add(r2);
        const r3 = new THREE.Mesh(ringGeo, ringMat); r3.position.set(0, -2.6, 0); r3.rotation.x = Math.PI/2; rocketMeshGroup.add(r3);

        // Rocket Quad Engine Thrusters
        const nozzleGeo = new THREE.ConeGeometry(0.35, 0.7, 16);
        const nozzleMat = new THREE.MeshStandardMaterial({ color: 0xff0055, metalness: 0.9, roughness: 0.1 });
        const offsets = [[-0.45, 0], [0.45, 0], [0, -0.45], [0, 0.45]];
        offsets.forEach(([ox, oz]) => {
            const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
            nozzle.position.set(ox, -3.8, oz);
            nozzle.rotation.x = Math.PI;
            rocketMeshGroup.add(nozzle);
        });

        // Add both to main satelliteGroup, toggle visibility based on mode
        satelliteGroup.add(satMeshGroup);
        satelliteGroup.add(rocketMeshGroup);
        rocketMeshGroup.visible = false;
    }

    function setModelMode(mode) {
        currentModelMode = mode;
        playSound('click');
        const btnSat = document.getElementById('btn-view-sat');
        const btnRocket = document.getElementById('btn-view-rocket');
        const img = document.getElementById('vehicle-img');
        const vName = document.getElementById('vehicle-name');
        const vDesc = document.getElementById('vehicle-desc');
        const vLabel = document.getElementById('canvas-overlay-label');
        const vSub = document.getElementById('canvas-overlay-sub');

        if (mode === 'sat') {
            if (satMeshGroup) satMeshGroup.visible = true;
            if (rocketMeshGroup) rocketMeshGroup.visible = false;
            if (btnSat) btnSat.className = "px-2.5 py-1 text-xs font-mono font-bold rounded bg-cyan-500 text-space-950 shadow-glow-cyan";
            if (btnRocket) btnRocket.className = "px-2.5 py-1 text-xs font-mono rounded bg-space-900 text-slate-300 border border-slate-700 hover:text-cyan-400";
            if (img) img.src = "satellite_render.jpg";
            if (vName) vName.textContent = "AegisSat-09 Spacecraft";
            if (vDesc) vDesc.textContent = "Nitinol Shape-Memory Alloy Reflector + Perovskite Self-Repair Solar Wings";
            if (vLabel) vLabel.textContent = "AegisSat-09 Satellite Vehicle";
            if (vSub) vSub.textContent = "3D Bus + Solar Array Wings + Nitinol Dish";
            logTelemetry('SWITCHED VIEW: 3D Satellite Vehicle & Nitinol Reflector Active.', 'CYAN');
        } else {
            if (satMeshGroup) satMeshGroup.visible = false;
            if (rocketMeshGroup) rocketMeshGroup.visible = true;
            if (btnRocket) btnRocket.className = "px-2.5 py-1 text-xs font-mono font-bold rounded bg-cyan-500 text-space-950 shadow-glow-cyan";
            if (btnSat) btnSat.className = "px-2.5 py-1 text-xs font-mono rounded bg-space-900 text-slate-300 border border-slate-700 hover:text-cyan-400";
            if (img) img.src = "rocket_render.jpg";
            if (vName) vName.textContent = "Orion Heavy Rocket Launch Vehicle";
            if (vDesc) vDesc.textContent = "Multi-Stage Titanium Fuselage + Carbon Nanotube Self-Healing Tiles + Plasma Arc";
            if (vLabel) vLabel.textContent = "Orion Star-Lifter Rocket Vehicle";
            if (vSub) vSub.textContent = "Stage 1/2 Tanks + Quad Plumes + Plasma Laser Repair Arc";
            logTelemetry('SWITCHED VIEW: 3D Heavy Rocket Vehicle & Plasma Repair Active.', 'CYAN');
        }
    }

    // --- 2. ModCod Constellation Diagram Canvas ---
    let constCanvas, constCtx;
    function initConstellationCanvas() {
        constCanvas = document.getElementById('constellation-canvas');
        if (!constCanvas) return;
        constCtx = constCanvas.getContext('2d');

        function resize() {
            constCanvas.width = constCanvas.clientWidth;
            constCanvas.height = constCanvas.clientHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        function drawConstellation() {
            requestAnimationFrame(drawConstellation);
            const w = constCanvas.width;
            const h = constCanvas.height;
            if (w === 0 || h === 0) return;

            constCtx.fillStyle = '#02040a';
            constCtx.fillRect(0, 0, w, h);

            // Axes
            constCtx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
            constCtx.lineWidth = 1;
            constCtx.beginPath();
            constCtx.moveTo(w/2, 0); constCtx.lineTo(w/2, h);
            constCtx.moveTo(0, h/2); constCtx.lineTo(w, h/2);
            constCtx.stroke();

            // Concentric Rings
            constCtx.beginPath();
            constCtx.arc(w/2, h/2, 40, 0, Math.PI * 2);
            constCtx.arc(w/2, h/2, 80, 0, Math.PI * 2);
            constCtx.stroke();

            // Render Constellation Points based on state.modCod
            let points = 256;
            if (state.modCod === '64-APSK') points = 64;
            if (state.modCod === '16-APSK') points = 16;
            if (state.modCod === 'QPSK') points = 4;

            const noise = state.impactActive ? 8.0 : 1.2;
            ctxPointDraw(w/2, h/2, points, noise);
        }

        function ctxPointDraw(cx, cy, numPoints, noise) {
            const rings = numPoints === 256 ? 4 : (numPoints === 64 ? 3 : (numPoints === 16 ? 2 : 1));
            let pCount = 0;

            for (let r = 1; r <= rings; r++) {
                const radius = r * 22;
                const ptsInRing = Math.floor(numPoints / rings);
                for (let i = 0; i < ptsInRing; i++) {
                    const angle = (i / ptsInRing) * Math.PI * 2;
                    const nx = (Math.random() - 0.5) * noise;
                    const ny = (Math.random() - 0.5) * noise;
                    const x = cx + Math.cos(angle) * radius + nx;
                    const y = cy + Math.sin(angle) * radius + ny;

                    constCtx.fillStyle = state.impactActive ? '#ff2a6d' : '#00ffaa';
                    constCtx.beginPath();
                    constCtx.arc(x, y, 2.5, 0, Math.PI * 2);
                    constCtx.fill();
                    pCount++;
                    if (pCount >= numPoints) break;
                }
            }
        }

        drawConstellation();
    }

    // --- 3. Telemetry Charts (Chart.js) ---
    let snrChart, reflectorChart;

    function initCharts() {
        const snrCtx = document.getElementById('snr-chart').getContext('2d');
        snrChart = new Chart(snrCtx, {
            type: 'line',
            data: {
                labels: Array(30).fill(''),
                datasets: [{
                    data: state.snrHistory,
                    borderColor: '#00f3ff',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { min: 0, max: 30 } },
                animation: false
            }
        });

        const refCtx = document.getElementById('reflector-chart').getContext('2d');
        reflectorChart = new Chart(refCtx, {
            type: 'line',
            data: {
                labels: Array(30).fill(''),
                datasets: [{
                    data: state.reflectorHistory,
                    borderColor: '#00ffaa',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { min: 50, max: 100 } },
                animation: false
            }
        });
    }

    // Telemetry Loop
    setInterval(() => {
        let currentSnr = state.impactActive ? 8.4 + Math.random() * 2 : 24.2 + (Math.random() - 0.5) * 0.4;
        state.snrHistory.shift();
        state.snrHistory.push(currentSnr);
        if (snrChart) {
            snrChart.data.datasets[0].data = state.snrHistory;
            snrChart.update();
        }
        elements.chartSnrVal.textContent = `${currentSnr.toFixed(1)} dB`;

        state.reflectorHistory.shift();
        state.reflectorHistory.push(state.reflectorDeWarp);
        if (reflectorChart) {
            reflectorChart.data.datasets[0].data = state.reflectorHistory;
            reflectorChart.update();
        }
        elements.chartReflectorVal.textContent = `${state.reflectorDeWarp.toFixed(1)}%`;
    }, 150);

    // --- 4. Simulation Handlers ---

    function triggerAnomaly(type) {
        state.impactActive = true;

        if (type === 'SOLAR') {
            playSound('solar');
            state.solarIntegrity = 64.2;
            state.snrDb = 9.4;
            state.modCod = 'QPSK';
            state.downlinkGbps = 0.35;
            state.evmPct = 12.4;
            elements.satImpactText.textContent = 'SOLAR FLARE DETUNING DETECTED';
            logTelemetry('SOLAR FLARE IMPACT: Array voltage dropped. Carrier degraded to QPSK (350 Mbps).', 'ROSE');
        } else if (type === 'DEBRIS') {
            playSound('debris');
            state.reflectorDeWarp = 62.1;
            state.snrDb = 7.8;
            state.modCod = '16-APSK';
            state.downlinkGbps = 0.8;
            state.evmPct = 9.8;
            elements.satImpactText.textContent = 'MMOD DEBRIS PUNCTURE DETECTED';
            logTelemetry('KINETIC DEBRIS STRIKE: Dish de-warped by 37.9%. Reflector morphing triggered.', 'ROSE');
        } else {
            playSound('scintillation');
            state.snrDb = 11.2;
            state.modCod = '64-APSK';
            state.downlinkGbps = 1.2;
            state.evmPct = 6.4;
            elements.satImpactText.textContent = 'IONOSPHERIC SCINTILLATION ATTENUATION';
            logTelemetry('SCINTILLATION ATTENUATION: RF phase jitter elevated. Re-routing ISL link.', 'AMBER');
        }

        elements.satImpactBadge.classList.remove('hidden');
        updateUI();
    }

    function triggerReconfig() {
        if (!state.impactActive) return;
        playSound('reconfig');
        logTelemetry('AI SELF-MODULATION INITIATED: Actuating shape-memory parabolic dish & tuning ModCod.', 'CYAN');

        let progress = 0;
        let timer = setInterval(() => {
            progress += 20;
            state.reflectorDeWarp = Math.min(99.4, state.reflectorDeWarp + 7.5);
            state.snrDb = Math.min(24.2, state.snrDb + 3.2);
            updateUI();

            if (progress >= 100) {
                clearInterval(timer);
                state.impactActive = false;
                state.modCod = '256-APSK';
                state.downlinkGbps = 2.4;
                state.solarIntegrity = 97.8;
                state.evmPct = 1.8;
                elements.satImpactBadge.classList.add('hidden');
                playSound('complete');
                logTelemetry('RECONFIGURATION COMPLETE: Parabolic array de-warped 100%. 256-APSK re-locked (2.4 Gbps).', 'EMERALD');
                updateUI();
            }
        }, 300);
    }

    function triggerRocketLaserHeal() {
        playSound('laser');
        logTelemetry('🚀 ROCKET NANO-LASER SELF-HEALING: Plasma Arc welding carbon nanotube composite hull tiles!', 'CYAN');
        
        let progress = 0;
        const timer = setInterval(() => {
            progress += 25;
            playSound('laser');
            if (progress >= 100) {
                clearInterval(timer);
                playSound('complete');
                state.impactActive = false;
                state.reflectorDeWarp = 100.0;
                elements.satImpactBadge.classList.add('hidden');
                logTelemetry('✅ ROCKET HULL REPAIR COMPLETE: Orion Star-Lifter restored to 100% Structural Integrity!', 'EMERALD');
                updateUI();
            }
        }, 400);
    }

    function updateUI() {
        elements.statDewarp.textContent = `${state.reflectorDeWarp.toFixed(1)}%`;
        elements.statModcod.textContent = `${state.downlinkGbps} Gbps`;
        elements.statSolar.textContent = `${state.solarIntegrity.toFixed(1)}%`;
        elements.headerModcod.textContent = `${state.modCod} (${state.downlinkGbps} Gbps)`;
        elements.constellationModeText.textContent = state.modCod;
        elements.constellationEvm.textContent = `${state.evmPct.toFixed(1)}% (${state.impactActive ? 'ELEVATED' : 'EXCELLENT'})`;
        
        const badge = document.getElementById('vehicle-heal-badge');
        const bar = document.getElementById('vehicle-integrity-bar');
        if (badge) {
            badge.textContent = `${state.impactActive ? 'REPAIRING (' : 'NOMINAL ('}${state.reflectorDeWarp.toFixed(1)}%)`;
            badge.className = state.impactActive ? 
                'px-2 py-0.5 text-[10px] rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold' : 
                'px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold';
        }
        if (bar) {
            bar.style.width = `${state.reflectorDeWarp}%`;
            bar.className = state.impactActive ? 'bg-rose-400 h-full transition-all duration-300' : 'bg-emerald-400 h-full transition-all duration-300';
        }
    }

    function logTelemetry(msg, type = 'CYAN') {
        const entry = document.createElement('div');
        const now = new Date();
        const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
        
        let badgeColor = 'text-cyan-400';
        if (type === 'EMERALD') badgeColor = 'text-emerald-400 font-bold';
        if (type === 'ROSE') badgeColor = 'text-rose-400 font-bold';
        if (type === 'AMBER') badgeColor = 'text-amber-400 font-bold';

        entry.className = 'log-entry text-slate-300';
        entry.innerHTML = `<span class="text-slate-500">${timeStr}</span> <span class="${badgeColor}">ORBITSAT-AI:</span> ${msg}`;
        elements.logStream.appendChild(entry);
        elements.logStream.scrollTop = elements.logStream.scrollHeight;
    }

    // Controls
    elements.btnSolarFlare.addEventListener('click', () => triggerAnomaly('SOLAR'));
    elements.btnDebrisStrike.addEventListener('click', () => triggerAnomaly('DEBRIS'));
    elements.btnScintillation.addEventListener('click', () => triggerAnomaly('SCINTILLATION'));

    const btnSatHeal = document.getElementById('btn-sat-heal');
    if (btnSatHeal) btnSatHeal.addEventListener('click', () => triggerReconfig());

    const btnRocketHeal = document.getElementById('btn-rocket-heal');
    if (btnRocketHeal) btnRocketHeal.addEventListener('click', () => triggerRocketLaserHeal());

    const btnViewSat = document.getElementById('btn-view-sat');
    if (btnViewSat) btnViewSat.addEventListener('click', () => setModelMode('sat'));

    const btnViewRocket = document.getElementById('btn-view-rocket');
    if (btnViewRocket) btnViewRocket.addEventListener('click', () => setModelMode('rocket'));

    // Audio Toggle
    elements.audioToggle.addEventListener('click', () => {
        state.audioEnabled = !state.audioEnabled;
        elements.audioLabel.textContent = `AUDIO: ${state.audioEnabled ? 'ON' : 'OFF'}`;
    });

    // Initialize
    init3DSatellite();
    initConstellationCanvas();
    initCharts();
});
