/**
 * Samsung Alarm Style Circular Clock Dial Picker
 * Supports touch & mouse dragging, Hour & Minute modes, AM/PM toggles
 */

class SamsungClockDial {
  constructor(options) {
    this.face = document.getElementById(options.faceId);
    this.hand = document.getElementById(options.handId);
    this.numbersContainer = document.getElementById(options.numbersContainerId);
    this.readoutHour = document.getElementById(options.readoutHourId);
    this.readoutMinute = document.getElementById(options.readoutMinuteId);
    this.btnModeHour = document.getElementById(options.btnModeHourId);
    this.btnModeMinute = document.getElementById(options.btnModeMinuteId);
    this.btnAm = document.getElementById(options.btnAmId);
    this.btnPm = document.getElementById(options.btnPmId);

    this.onTimeChanged = options.onTimeChanged || (() => {});

    // State
    this.hour = 6;
    this.minute = 30;
    this.period = 'PM';
    this.mode = 'hour'; // 'hour' or 'minute'
    this.isDragging = false;

    this.init();
  }

  init() {
    // Mode toggles
    this.btnModeHour.addEventListener('click', () => {
      if (window.soundEffects) window.soundEffects.playPop();
      this.setMode('hour');
    });
    this.btnModeMinute.addEventListener('click', () => {
      if (window.soundEffects) window.soundEffects.playPop();
      this.setMode('minute');
    });

    // AM/PM buttons
    this.btnAm.addEventListener('click', () => {
      if (window.soundEffects) window.soundEffects.playPop();
      this.setPeriod('AM');
    });
    this.btnPm.addEventListener('click', () => {
      if (window.soundEffects) window.soundEffects.playPop();
      this.setPeriod('PM');
    });

    // Preset chips
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (window.soundEffects) window.soundEffects.playPop();
        document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active-preset'));
        chip.classList.add('active-preset');

        const [h, m] = chip.dataset.time.split(':').map(Number);
        const ampm = chip.dataset.ampm;
        this.setTime(h, m, ampm);
      });
    });

    // Touch & Pointer interaction on clock face
    this.face.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', () => this.onPointerUp());

    this.renderNumbers();
    this.updateDisplay();
  }

  setMode(mode) {
    this.mode = mode;
    if (mode === 'hour') {
      this.btnModeHour.classList.add('active');
      this.btnModeMinute.classList.remove('active');
    } else {
      this.btnModeMinute.classList.add('active');
      this.btnModeHour.classList.remove('active');
    }
    this.renderNumbers();
    this.updateHand();
  }

  setPeriod(period) {
    this.period = period;
    if (period === 'AM') {
      this.btnAm.classList.add('active');
      this.btnPm.classList.remove('active');
    } else {
      this.btnPm.classList.add('active');
      this.btnAm.classList.remove('active');
    }
    this.emitChange();
  }

  setTime(h, m, period) {
    this.hour = h;
    this.minute = m;
    if (period) this.period = period;
    this.updateDisplay();
    this.emitChange();
  }

  renderNumbers() {
    this.numbersContainer.innerHTML = '';
    const rect = this.face.getBoundingClientRect();
    const radius = 96; // radius in px inside dial
    const center = 125; // center x and y of 250px container

    if (this.mode === 'hour') {
      for (let i = 1; i <= 12; i++) {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        const el = document.createElement('div');
        el.className = `clock-number ${this.hour === i ? 'active' : ''}`;
        el.textContent = i;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          this.hour = i;
          this.updateDisplay();
          if (window.soundEffects) window.soundEffects.playClockTick();
          // After picking hour, smoothly advance to minute mode
          setTimeout(() => {
            if (this.mode === 'hour') this.setMode('minute');
          }, 250);
          this.emitChange();
        });

        this.numbersContainer.appendChild(el);
      }
    } else {
      // Minute mode: 00, 05, 10, 15, ..., 55
      for (let i = 0; i < 12; i++) {
        const minVal = i * 5;
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        const el = document.createElement('div');
        el.className = `clock-number ${this.minute === minVal ? 'active' : ''}`;
        el.textContent = String(minVal).padStart(2, '0');
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          this.minute = minVal;
          this.updateDisplay();
          if (window.soundEffects) window.soundEffects.playClockTick();
          this.emitChange();
        });

        this.numbersContainer.appendChild(el);
      }
    }

    this.updateHand();
  }

  updateHand() {
    let angle = 0;
    if (this.mode === 'hour') {
      angle = (this.hour % 12) * 30;
    } else {
      angle = this.minute * 6; // 360 deg / 60 min = 6 deg per minute
    }
    this.hand.style.transform = `rotate(${angle}deg)`;
  }

  updateDisplay() {
    this.readoutHour.textContent = String(this.hour).padStart(2, '0');
    this.readoutMinute.textContent = String(this.minute).padStart(2, '0');
    if (this.period === 'AM') {
      this.btnAm.classList.add('active');
      this.btnPm.classList.remove('active');
    } else {
      this.btnPm.classList.add('active');
      this.btnAm.classList.remove('active');
    }
    this.renderNumbers();
  }

  onPointerDown(e) {
    this.isDragging = true;
    this.calculateAngleFromEvent(e);
  }

  onPointerMove(e) {
    if (!this.isDragging) return;
    this.calculateAngleFromEvent(e);
  }

  onPointerUp() {
    if (this.isDragging) {
      this.isDragging = false;
      if (this.mode === 'hour') {
        // Auto-advance to minute mode like Samsung clock
        setTimeout(() => {
          if (this.mode === 'hour') this.setMode('minute');
        }, 250);
      }
    }
  }

  calculateAngleFromEvent(e) {
    const rect = this.face.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    let rad = Math.atan2(dy, dx);
    let deg = rad * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;

    if (this.mode === 'hour') {
      let h = Math.round(deg / 30);
      if (h === 0) h = 12;
      if (this.hour !== h) {
        this.hour = h;
        if (window.soundEffects) window.soundEffects.playClockTick();
        this.updateDisplay();
        this.emitChange();
      }
    } else {
      // Snap to nearest 5 minutes for clean dial experience, or nearest minute
      let m = Math.round(deg / 6);
      if (m >= 60) m = 0;
      // Snap to multiples of 5 for ease of use
      let snappedM = Math.round(m / 5) * 5;
      if (snappedM >= 60) snappedM = 0;

      if (this.minute !== snappedM) {
        this.minute = snappedM;
        if (window.soundEffects) window.soundEffects.playClockTick();
        this.updateDisplay();
        this.emitChange();
      }
    }
  }

  emitChange() {
    const formatted = `${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')} ${this.period}`;
    this.onTimeChanged(formatted, this.hour, this.minute, this.period);
  }

  getFormattedTime() {
    return `${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')} ${this.period}`;
  }
}

window.SamsungClockDial = SamsungClockDial;
