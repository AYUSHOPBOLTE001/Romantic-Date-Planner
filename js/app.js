/**
 * Dev Meme Date Proposal & Planner
 * Main Application Logic & Event Handlers
 */

// Global State
window.plannerState = {
  phone: '919811323875', // Ayush's phone number with India country code
  selectedDate: null,
  formattedDate: '',
  selectedTime: '06:30 PM',
  selectedPlace: 'Connaught Place (CP), Delhi 🏛️',
  selectedFoods: ['Golgappe', 'Dosa', 'Brownie'], // Default selections
  surpriseFood: false,
  secretNote: '',
  dodgeCount: 0
};

document.addEventListener('DOMContentLoaded', () => {
  initHeartsBackground();
  initProposalDodge();
  initStepNavigation();
  initPlaceSelection();
  initFoodSelection();
  initCalendarAndClock();
  initExportActions();
});

/* ==========================================================================
   1. FLOATING HEARTS BACKGROUND CANVAS
   ========================================================================== */
function initHeartsBackground() {
  const canvas = document.getElementById('hearts-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const hearts = [];
  const heartColors = ['#fda4af', '#f43f5e', '#fbcfe8', '#f472b6'];

  for (let i = 0; i < 22; i++) {
    hearts.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 14 + 10,
      speed: Math.random() * 0.7 + 0.3,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      opacity: Math.random() * 0.4 + 0.2,
      swing: Math.random() * 2,
      swingSpeed: Math.random() * 0.02 + 0.01
    });
  }

  function drawHeart(x, y, size, color, opacity) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.scale(size / 20, size / 20);
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -10, -20, 5, 0, 20);
    ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    hearts.forEach(h => {
      h.y -= h.speed;
      h.x += Math.sin(h.swing) * 0.4;
      h.swing += h.swingSpeed;

      if (h.y < -30) {
        h.y = height + 30;
        h.x = Math.random() * width;
      }
      drawHeart(h.x, h.y, h.size, h.color, h.opacity);
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. INTERACTIVE "NO" BUTTON DODGE (No 404 Error, Smooth screen reposition)
   ========================================================================== */
function initProposalDodge() {
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const dodgeFeedback = document.getElementById('dodge-feedback');
  const dodgeMessage = document.getElementById('dodge-message');
  const arena = document.getElementById('action-arena');

  const playfulMessages = [
    "Wrong button! Try the other one 👉👈",
    "Are you sure? Think again! 🥺",
    "Oops! Too fast for you! 🏃‍♀️💨",
    "Nice try, but resistance is futile! ❤️",
    "The YES button is waiting for you ✨",
    "Nope! Can't click that one 😉",
    "Hey! That button doesn't work! 🙈"
  ];

  let isDodging = false;

  function spawnPoof(x, y) {
    const emojis = ['💨', '✨', '💨'];
    emojis.forEach((emoji) => {
      const p = document.createElement('div');
      p.className = 'poof-particle';
      p.textContent = emoji;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      const tx = (Math.random() - 0.5) * 60;
      const ty = (Math.random() - 0.5) * 60 - 20;
      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 420);
    });
  }

  function dodge(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isDodging) return;
    isDodging = true;

    window.plannerState.dodgeCount++;

    // Playful sound
    if (window.soundEffects) {
      window.soundEffects.playDodge();
    }

    // Spawn cute poof particles at current location before it vanishes
    const currentRect = btnNo.getBoundingClientRect();
    spawnPoof(currentRect.left + currentRect.width / 2, currentRect.top + currentRect.height / 2);

    // Show funny tease badge
    const randomMsg = playfulMessages[window.plannerState.dodgeCount % playfulMessages.length];
    dodgeMessage.textContent = randomMsg;
    dodgeFeedback.classList.remove('visible');
    void dodgeFeedback.offsetWidth; // Force re-flow for animation
    dodgeFeedback.classList.add('visible');

    // Grow the YES button bigger each time
    const currentScale = 1 + window.plannerState.dodgeCount * 0.08;
    btnYes.style.transform = `scale(${Math.min(currentScale, 1.45)})`;

    // 1. VANISH / DISAPPEAR
    btnNo.classList.remove('bounce-in');
    btnNo.classList.add('vanish');

    // 2. WAIT A MOMENT (110ms), REPOSITION SAFELY & BOUNCE BACK IN
    setTimeout(() => {
      btnNo.style.position = 'fixed';

      const btnWidth = btnNo.offsetWidth || 90;
      const btnHeight = btnNo.offsetHeight || 44;

      // Safe margins so button strictly NEVER leaves the screen boundaries
      const padding = 20;
      const maxX = Math.max(padding, window.innerWidth - btnWidth - padding);
      const maxY = Math.max(padding, window.innerHeight - btnHeight - padding);

      let newX = Math.random() * (maxX - padding) + padding;
      let newY = Math.random() * (maxY - padding) + padding;

      // Prevent placing directly on top of the YES button
      const yesRect = btnYes.getBoundingClientRect();
      const buffer = 30;
      if (
        newX < yesRect.right + buffer &&
        newX + btnWidth > yesRect.left - buffer &&
        newY < yesRect.bottom + buffer &&
        newY + btnHeight > yesRect.top - buffer
      ) {
        newY = newY > window.innerHeight / 2 ? newY - 130 : newY + 130;
      }

      // Strict boundary clamp (guarantees it stays 100% visible on screen)
      newX = Math.max(padding, Math.min(newX, maxX));
      newY = Math.max(padding, Math.min(newY, maxY));

      btnNo.style.left = `${newX}px`;
      btnNo.style.top = `${newY}px`;

      // 3. REAPPEAR WITH ELASTIC BOUNCE
      btnNo.classList.remove('vanish');
      btnNo.classList.add('bounce-in');

      setTimeout(() => {
        isDodging = false;
      }, 220);
    }, 110);
  }

  // Hover on desktop
  btnNo.addEventListener('mouseenter', dodge);
  btnNo.addEventListener('mouseover', dodge);

  // Touch on mobile
  btnNo.addEventListener('touchstart', dodge, { passive: false });
  btnNo.addEventListener('pointerdown', dodge);

  // Click on YES button
  btnYes.addEventListener('click', () => {
    if (window.soundEffects) {
      window.soundEffects.playCelebrationFanfare();
    }

    // Confetti burst
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Switch to step 2 after brief celebration
    setTimeout(() => {
      goToStep('step-calendar');
    }, 450);
  });
}

/* ==========================================================================
   3. STEP NAVIGATION & PROGRESS (Date -> Time -> Place -> Food -> Pass)
   ========================================================================== */
const steps = ['step-proposal', 'step-calendar', 'step-time', 'step-place', 'step-food', 'step-boarding-pass'];

function goToStep(stepId) {
  steps.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  const target = document.getElementById(stepId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update top progress bar
  const stepProgress = document.getElementById('step-progress');
  const progressFill = document.getElementById('progress-fill');
  const stepIndicator = document.getElementById('step-indicator');

  const currentIndex = steps.indexOf(stepId);

  // Index 1 = Calendar (Step 1), Index 2 = Time (Step 2), Index 3 = Place (Step 3), Index 4 = Food (Step 4)
  if (currentIndex >= 1 && currentIndex <= 4) {
    stepProgress.style.display = 'flex';
    const percent = (currentIndex / 4) * 100;
    progressFill.style.width = `${percent}%`;
    stepIndicator.textContent = `Step ${currentIndex} of 4`;
  } else {
    stepProgress.style.display = 'none';
  }

  if (stepId === 'step-boarding-pass') {
    populateBoardingPass();
  }
}

function initStepNavigation() {
  // Calendar -> Time (Mandatory check: must pick a date)
  document.getElementById('btn-to-time')?.addEventListener('click', () => {
    if (!window.plannerState.selectedDate) {
      if (window.soundEffects) window.soundEffects.playDodge();
      const calCard = document.querySelector('.calendar-card');
      calCard?.classList.remove('shake-element');
      void calCard?.offsetWidth;
      calCard?.classList.add('shake-element');
      showToast('Please pick our special date on the calendar first! 🗓️💕');
      return;
    }
    if (window.soundEffects) window.soundEffects.playPop();
    goToStep('step-time');
  });

  // Time -> Calendar
  document.getElementById('btn-back-to-calendar')?.addEventListener('click', () => {
    if (window.soundEffects) window.soundEffects.playPop();
    goToStep('step-calendar');
  });

  // Time -> Place
  document.getElementById('btn-to-place')?.addEventListener('click', () => {
    if (window.soundEffects) window.soundEffects.playPop();
    goToStep('step-place');
  });

  // Place -> Time
  document.getElementById('btn-back-to-time')?.addEventListener('click', () => {
    if (window.soundEffects) window.soundEffects.playPop();
    goToStep('step-time');
  });

  // Place -> Food (Mandatory check: must choose place; if custom, must not be empty)
  document.getElementById('btn-to-food')?.addEventListener('click', () => {
    const checkedRadio = document.querySelector('input[name="place_choice"]:checked');
    if (!checkedRadio) {
      if (window.soundEffects) window.soundEffects.playDodge();
      showToast('Please choose where we should go! 📍');
      return;
    }

    if (checkedRadio.value === 'Custom') {
      const customInput = document.getElementById('custom-place-input');
      const customVal = customInput ? customInput.value.trim() : '';

      if (!customVal) {
        if (window.soundEffects) window.soundEffects.playDodge();
        customInput?.classList.remove('input-error');
        void customInput?.offsetWidth;
        customInput?.classList.add('input-error');
        customInput?.focus();
        showToast('Please type your dream spot or pick one of the options above! ✍️📍');
        return;
      }
      window.plannerState.selectedPlace = customVal;
    } else {
      window.plannerState.selectedPlace = checkedRadio.value;
    }

    if (window.soundEffects) window.soundEffects.playPop();
    goToStep('step-food');
  });

  // Food -> Place
  document.getElementById('btn-back-to-place')?.addEventListener('click', () => {
    if (window.soundEffects) window.soundEffects.playPop();
    goToStep('step-place');
  });

  // Food -> Final VIP Boarding Pass (Mandatory check: must pick at least 1 food or Surprise Me)
  document.getElementById('btn-finish-plan')?.addEventListener('click', () => {
    if (!window.plannerState.surpriseFood && window.plannerState.selectedFoods.length === 0) {
      if (window.soundEffects) window.soundEffects.playDodge();
      const foodSection = document.getElementById('step-food');
      foodSection?.classList.remove('shake-element');
      void foodSection?.offsetWidth;
      foodSection?.classList.add('shake-element');
      showToast('Please pick at least one craving or choose "Surprise Me"! 😋🍕');
      return;
    }

    // Read secret demands
    const notesInput = document.getElementById('secret-demands');
    if (notesInput) {
      window.plannerState.secretNote = notesInput.value.trim();
    }

    if (window.soundEffects) {
      window.soundEffects.playFinalSuccess();
    }

    // Big celebratory confetti shower!
    if (typeof confetti === 'function') {
      const end = Date.now() + 1500;
      const colors = ['#f43f5e', '#ec4899', '#fb7185', '#ffd166', '#06d6a0'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }

    goToStep('step-boarding-pass');
  });
}

/* ==========================================================================
   4. PLACE SELECTION & CUSTOM INPUT
   ========================================================================== */
function initPlaceSelection() {
  const cards = document.querySelectorAll('.place-card');
  const customContainer = document.getElementById('custom-place-container');
  const customInput = document.getElementById('custom-place-input');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      if (window.soundEffects) window.soundEffects.playChime();

      if (radio.value === 'Custom') {
        customContainer.style.display = 'block';
        customInput.focus();
      } else {
        customContainer.style.display = 'none';
        customInput.classList.remove('input-error');
      }
    });
  });

  customInput?.addEventListener('input', () => {
    customInput.classList.remove('input-error');
  });
}

/* ==========================================================================
   5. FOOD & CRAVINGS SELECTION (Multi-select Chips + Surprise Me)
   ========================================================================== */
function initFoodSelection() {
  const chips = document.querySelectorAll('.food-item-chip');
  const surpriseBtn = document.getElementById('btn-surprise-food');

  // Set default initial active chips
  chips.forEach(chip => {
    const foodName = chip.dataset.name;
    if (window.plannerState.selectedFoods.includes(foodName)) {
      chip.classList.add('selected');
    }

    chip.addEventListener('click', () => {
      if (window.soundEffects) window.soundEffects.playPop();

      chip.classList.toggle('selected');
      const isSelected = chip.classList.contains('selected');

      if (isSelected) {
        if (!window.plannerState.selectedFoods.includes(foodName)) {
          window.plannerState.selectedFoods.push(foodName);
        }
      } else {
        window.plannerState.selectedFoods = window.plannerState.selectedFoods.filter(f => f !== foodName);
      }

      // If user manually toggled, turn off Surprise Me toggle
      window.plannerState.surpriseFood = false;
      if (surpriseBtn) surpriseBtn.classList.remove('active');
    });
  });

  // Surprise Me Button
  surpriseBtn?.addEventListener('click', () => {
    if (window.soundEffects) window.soundEffects.playChime();
    window.plannerState.surpriseFood = !window.plannerState.surpriseFood;

    if (window.plannerState.surpriseFood) {
      surpriseBtn.classList.add('active');
      surpriseBtn.querySelector('span').textContent = '✨ Surprise Me Activated! (Chef Ayush will decide!)';
    } else {
      surpriseBtn.classList.remove('active');
      surpriseBtn.querySelector('span').textContent = '🎁 Or Surprise Me with Your Favorites!';
    }
  });
}

/* ==========================================================================
   6. CALENDAR & SAMSUNG CLOCK DIAL INITIALIZATION
   ========================================================================== */
function initCalendarAndClock() {
  // Calendar
  new RomanticCalendar({
    gridId: 'calendar-days-grid',
    monthDisplayId: 'cal-month-display',
    prevBtnId: 'cal-prev',
    nextBtnId: 'cal-next',
    previewTextId: 'preview-date-text',
    chipsId: 'quick-date-chips',
    nextStepBtnId: 'btn-to-time',
    onDateSelected: (date, formatted) => {
      window.plannerState.selectedDate = date;
      window.plannerState.formattedDate = formatted;
    }
  });

  // Samsung Alarm Clock Dial
  window.clockDialInstance = new SamsungClockDial({
    faceId: 'clock-face',
    handId: 'clock-hand',
    numbersContainerId: 'clock-numbers',
    readoutHourId: 'readout-hour',
    readoutMinuteId: 'readout-minute',
    btnModeHourId: 'btn-mode-hour',
    btnModeMinuteId: 'btn-mode-minute',
    btnAmId: 'btn-am',
    btnPmId: 'btn-pm',
    onTimeChanged: (formatted) => {
      window.plannerState.selectedTime = formatted;
    }
  });
}

/* ==========================================================================
   7. POPULATE BOARDING PASS & WHATSAPP URL DISPATCH
   ========================================================================== */
function populateBoardingPass() {
  const passDate = document.getElementById('pass-date');
  const passTime = document.getElementById('pass-time');
  const passPlace = document.getElementById('pass-place');
  const passFood = document.getElementById('pass-food');
  const passNotesRow = document.getElementById('pass-notes-row');
  const passNotes = document.getElementById('pass-notes');

  // Fallback date if not picked
  const dateStr = window.plannerState.formattedDate || 'This Weekend 💕';
  passDate.textContent = dateStr;
  passTime.textContent = window.plannerState.selectedTime;
  passPlace.textContent = window.plannerState.selectedPlace;

  // Format Food String
  let foodString = '';
  if (window.plannerState.surpriseFood) {
    foodString = 'Surprise Me! (Chef Ayush Choice 🎁)';
  } else if (window.plannerState.selectedFoods.length > 0) {
    foodString = window.plannerState.selectedFoods.join(', ') + ' 😋';
  } else {
    foodString = 'Delicious Street Bites & Desserts 🍕🍰';
  }
  if (passFood) passFood.textContent = foodString;

  if (window.plannerState.secretNote) {
    passNotesRow.style.display = 'flex';
    passNotes.textContent = `"${window.plannerState.secretNote}"`;
  } else {
    passNotesRow.style.display = 'none';
  }

  // Build WhatsApp URL directed to Ayush's phone: +91 9811323875
  const waBtn = document.getElementById('btn-whatsapp-dispatch');

  let waText = `✨ *YAAAY! IT'S AN OFFICIAL DATE!* 🎉❤️\n`;
  waText += `━━━━━━━━━━━━━━━━━━━━\n`;
  waText += `_Our romantic rendezvous is officially sealed!_\n\n`;
  waText += `🗓️ *DATE:* ${dateStr}\n`;
  waText += `⏰ *TIME:* ${window.plannerState.selectedTime}\n`;
  waText += `📍 *DESTINATION:* ${window.plannerState.selectedPlace}\n`;
  waText += `🍽️ *CRAVINGS:* ${foodString}\n`;

  if (window.plannerState.secretNote) {
    waText += `━━━━━━━━━━━━━━━━━━━━\n`;
    waText += `💌 *SECRET NOTE FOR AYUSH:*\n`;
    waText += `_“${window.plannerState.secretNote}”_\n`;
  }

  waText += `━━━━━━━━━━━━━━━━━━━━\n`;
  waText += `🌹 *STATUS:* Confirmed with pure love!\n`;
  waText += `Counting down every single second... 🥰\n`;
  waText += `See you soon, Ayush! 💕✨`;

  const encodedUrl = `https://wa.me/${window.plannerState.phone}?text=${encodeURIComponent(waText)}`;
  waBtn.setAttribute('href', encodedUrl);
}

/* ==========================================================================
   8. EXPORT ACTIONS (Calendar .ICS & Clipboard Copy)
   ========================================================================== */
function initExportActions() {
  // Add to Calendar (.ics)
  document.getElementById('btn-download-ics')?.addEventListener('click', () => {
    if (window.soundEffects) window.soundEffects.playPop();
    downloadCalendarFile();
  });

  // Copy Itinerary to Clipboard
  document.getElementById('btn-copy-itinerary')?.addEventListener('click', () => {
    if (window.soundEffects) window.soundEffects.playPop();
    copyItineraryToClipboard();
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

function copyItineraryToClipboard() {
  const dateStr = window.plannerState.formattedDate || 'Upcoming Weekend';
  const foodStr = window.plannerState.surpriseFood 
    ? 'Surprise Me! 🎁' 
    : (window.plannerState.selectedFoods.join(', ') || 'Good Food 😋');

  let text = `✨ *YAAAY! IT'S AN OFFICIAL DATE!* 🎉❤️\n`;
  text += `━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🗓️ *DATE:* ${dateStr}\n`;
  text += `⏰ *TIME:* ${window.plannerState.selectedTime}\n`;
  text += `📍 *PLACE:* ${window.plannerState.selectedPlace}\n`;
  text += `🍽️ *CRAVINGS:* ${foodStr}\n`;
  if (window.plannerState.secretNote) {
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💌 *SECRET NOTE:*\n_${window.plannerState.secretNote}_\n`;
  }
  text += `━━━━━━━━━━━━━━━━━━━━\n`;
  text += `Can't wait to see you! 🥰💕`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Itinerary copied to clipboard! 📋');
    });
  } else {
    showToast('Plan details ready! 💕');
  }
}

function downloadCalendarFile() {
  const targetDate = window.plannerState.selectedDate || new Date();
  
  // Format iCalendar DTSTART / DTEND
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');

  // Parse time
  const [timePart, period] = window.plannerState.selectedTime.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const startHourStr = String(hours).padStart(2, '0');
  const startMinStr = String(minutes).padStart(2, '0');

  const endHour = (hours + 3) % 24; // Default 3 hours date
  const endHourStr = String(endHour).padStart(2, '0');

  const dtStart = `${year}${month}${day}T${startHourStr}${startMinStr}00`;
  const dtEnd = `${year}${month}${day}T${endHourStr}${startMinStr}00`;

  const foodStr = window.plannerState.surpriseFood 
    ? 'Surprise Food' 
    : window.plannerState.selectedFoods.join(', ');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Our Special Date//Ayush Date Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:Special Date with Ayush 💕`,
    `DESCRIPTION:Our official date! Venue: ${window.plannerState.selectedPlace}. Food: ${foodStr}. Secret Note: ${window.plannerState.secretNote || 'None'}`,
    `LOCATION:${window.plannerState.selectedPlace}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'our_special_date.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Calendar event downloaded! 📅');
}
