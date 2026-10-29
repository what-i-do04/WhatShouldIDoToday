/* =========================================================
   임시 사운드 생성기
   - 소리가 들어가는 작품(sound 필드)을 실제로 들을 수 있게, 브라우저(Web Audio)로 소리를 만들어요.
   - 실제 음원이 생기면 data.js 의 sound 를 { gen: ... } 대신 'https://...mp3' 같은 주소로 바꾸면
     그 파일을 그대로 재생해요.
   - 브라우저 정책상 소리는 버튼을 누른 뒤에만 시작돼요.
   ========================================================= */
window.OS_SOUND = (function () {
  var ctx = null, cur = null; // cur: { key, stop }

  function ac() { if (!ctx) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); } if (ctx.state === 'suspended') ctx.resume(); return ctx; }

  /* 잡음 버퍼: white / pink / brown */
  var bufs = {};
  function noise(type) {
    if (bufs[type]) return bufs[type];
    var len = ctx.sampleRate * 4, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0), last = 0, p = [0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1;
      if (type === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      else if (type === 'pink') { p[0] = 0.99886 * p[0] + w * 0.0555179; p[1] = 0.99332 * p[1] + w * 0.0750759; p[2] = 0.969 * p[2] + w * 0.153852; p[3] = 0.8665 * p[3] + w * 0.3104856; p[4] = 0.55 * p[4] + w * 0.5329522; p[5] = -0.7616 * p[5] - w * 0.016898; d[i] = (p[0] + p[1] + p[2] + p[3] + p[4] + p[5] + p[6] + w * 0.5362) * 0.11; p[6] = w * 0.115926; }
      else d[i] = w; }
    return (bufs[type] = b);
  }
  function src(type, out, filt, freq, q, vol) {
    var s = ctx.createBufferSource(); s.buffer = noise(type); s.loop = true;
    var f = ctx.createBiquadFilter(); f.type = filt; f.frequency.value = freq; if (q) f.Q.value = q;
    var g = ctx.createGain(); g.gain.value = vol; s.connect(f); f.connect(g); g.connect(out); s.start(); return { s: s, f: f, g: g };
  }
  function lfo(param, rate, depth) { var o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = rate; g.gain.value = depth; o.connect(g); g.connect(param); o.start(); return o; }
  function tone(out, freq, vol, type) { var o = ctx.createOscillator(), g = ctx.createGain(); o.type = type || 'sine'; o.frequency.value = freq; g.gain.value = vol; o.connect(g); g.connect(out); o.start(); return o; }
  /* 짧은 소리 하나 (새소리, 핑 등) */
  function blip(out, t, f1, f2, dur, vol, type) { var o = ctx.createOscillator(), g = ctx.createGain(); o.type = type || 'sine';
    o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur * 0.8);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.05); }
  function every(ms, fn) { var id = setInterval(fn, ms); fn(); return id; }

  /* 소리 종류별 구성. 각 함수는 정리용 함수 목록을 돌려줘요. */
  var GEN = {
    /* 숲: 바람(갈색 잡음) + 나뭇잎(분홍 잡음) + 새소리 + 풀벌레 */
    forest: function (out) { var wind = src('brown', out, 'lowpass', 500, 0, 0.5), lf = lfo(wind.g.gain, 0.08, 0.25), leaves = src('pink', out, 'bandpass', 3200, 0.8, 0.05), lf2 = lfo(leaves.g.gain, 0.3, 0.04);
      var cr = tone(out, 4300, 0.004), cg = lfo(cr.frequency, 18, 60);
      var id = every(900, function () { if (Math.random() < 0.55) { var t = ctx.currentTime + Math.random() * 0.5, f = 2200 + Math.random() * 1800, n = 1 + (Math.random() * 4 | 0);
        for (var i = 0; i < n; i++) blip(out, t + i * 0.13, f, f * (1.2 + Math.random() * 0.4), 0.11, 0.05); } });
      return [function () { clearInterval(id); }, wind.s, leaves.s, lf, lf2, cr, cg]; },
    /* 나뭇잎 위 마이크: 바스락거리는 잡음 + 가끔 먼 새소리 */
    canopy: function (out) { var a = src('pink', out, 'bandpass', 2000, 0.6, 0.18), l = lfo(a.g.gain, 0.6, 0.12), b = src('white', out, 'highpass', 6000, 0, 0.015), l2 = lfo(b.g.gain, 1.7, 0.012);
      var id = every(2200, function () { if (Math.random() < 0.4) blip(out, ctx.currentTime + 0.2, 1800, 2600, 0.25, 0.025); });
      return [function () { clearInterval(id); }, a.s, b.s, l, l2]; },
    /* 빈 방의 소음: 전기 험(60Hz) + 낮은 공기 소리 + 가끔 냉장고 딸깍 */
    roomtone: function (out) { var h1 = tone(out, 60, 0.05), h2 = tone(out, 120, 0.03), h3 = tone(out, 180, 0.012), air = src('brown', out, 'lowpass', 300, 0, 0.35), l = lfo(air.g.gain, 0.05, 0.1);
      var id = every(5000, function () { if (Math.random() < 0.35) blip(out, ctx.currentTime + 0.1, 900, 400, 0.05, 0.06, 'square'); });
      return [function () { clearInterval(id); }, h1, h2, h3, air.s, l]; },
    /* 저주파: 32Hz 진동 (작은 스피커에서도 들리도록 배음을 조금 더함) */
    lowfreq: function (out) { var g = ctx.createGain(); g.gain.value = 0.6; g.connect(out); var a = tone(g, 32, 0.5), b = tone(g, 64, 0.18), c = tone(g, 96, 0.06), p = lfo(g.gain, 0.25, 0.45);
      return [a, b, c, p]; },
    /* 수신자 없는 신호: 일정한 간격의 핑 + 메아리 */
    pings: function (out) { var d = ctx.createDelay(2), fb = ctx.createGain(), wet = ctx.createGain(); d.delayTime.value = 0.6; fb.gain.value = 0.45; wet.gain.value = 0.5; d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(out);
      var bus = ctx.createGain(); bus.connect(out); bus.connect(d); var k = 0, base = src('pink', out, 'lowpass', 400, 0, 0.03);
      var id = every(1600, function () { var t = ctx.currentTime + 0.05, f = [880, 1320, 880, 1760][k++ % 4]; blip(bus, t, f, f, 1.2, 0.12); });
      return [function () { clearInterval(id); }, base.s]; },
    /* 방송 사고: 라디오 잡음 6초 → 완전한 정적 7초 반복 */
    deadair: function (out) { var g = ctx.createGain(); g.connect(out); var st = src('white', g, 'bandpass', 1800, 0.7, 0.12), hum = tone(g, 440, 0.01, 'sawtooth');
      var on = true, id; (function flip() { id = setTimeout(function () { on = !on; g.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.02); flip(); }, on ? 6000 : 7000); })();
      return [function () { clearTimeout(id); }, st.s, hum]; },
    /* 파도: 천천히 밀려왔다 빠지는 잡음 */
    waves: function (out) { var a = src('brown', out, 'lowpass', 700, 0, 0.3), l = lfo(a.g.gain, 0.12, 0.28), b = src('pink', out, 'lowpass', 2500, 0, 0.05), l2 = lfo(b.g.gain, 0.12, 0.05), lf = lfo(a.f.frequency, 0.12, 300);
      return [a.s, b.s, l, l2, lf]; }
  };

  function play(key, spec, onEnd) {
    stop();
    if (typeof spec === 'string') { /* 실제 음원 주소 */
      var au = new Audio(spec); au.loop = true; au.play().catch(function () { if (onEnd) onEnd('fail'); });
      cur = { key: key, stop: function () { au.pause(); } }; return true;
    }
    if (!ac() || !GEN[spec.gen]) return false;
    var master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.6);
    var parts = GEN[spec.gen](master);
    cur = { key: key, stop: function () { master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      setTimeout(function () { parts.forEach(function (p) { try { typeof p === 'function' ? p() : p.stop(); } catch (e) {} }); master.disconnect(); }, 600); } };
    return true;
  }
  function stop() { if (cur) { cur.stop(); cur = null; } }
  function playing(key) { return !!(cur && (!key || cur.key === key)); }
  return { play: play, stop: stop, playing: playing };
})();
