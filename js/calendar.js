/**
 * Interactive Calendar Component
 * Renders monthly calendar, past dates disabled, quick weekend chips
 */

class RomanticCalendar {
  constructor(options) {
    this.container = document.getElementById(options.gridId);
    this.monthDisplay = document.getElementById(options.monthDisplayId);
    this.prevBtn = document.getElementById(options.prevBtnId);
    this.nextBtn = document.getElementById(options.nextBtnId);
    this.previewText = document.getElementById(options.previewTextId);
    this.chipsContainer = document.getElementById(options.chipsId);
    this.nextStepBtn = document.getElementById(options.nextStepBtnId);
    this.onDateSelected = options.onDateSelected || (() => {});

    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.currentMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.selectedDate = null;

    this.init();
  }

  init() {
    this.prevBtn.addEventListener('click', () => {
      if (window.soundEffects) window.soundEffects.playPop();
      this.navigateMonth(-1);
    });
    this.nextBtn.addEventListener('click', () => {
      if (window.soundEffects) window.soundEffects.playPop();
      this.navigateMonth(1);
    });
    this.renderQuickChips();
    this.render();
  }

  renderQuickChips() {
    this.chipsContainer.innerHTML = '';
    const upcomingWeekend = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Find next Friday, Saturday, Sunday
    for (let i = 0; i <= 14; i++) {
      const d = new Date(this.today);
      d.setDate(this.today.getDate() + i);
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
        upcomingWeekend.push(d);
        if (upcomingWeekend.length >= 4) break;
      }
    }

    upcomingWeekend.forEach(date => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'quick-chip';
      const dayName = dayNames[date.getDay()];
      const monthName = date.toLocaleString('default', { month: 'short' });
      chip.textContent = `${dayName.slice(0, 3)}, ${monthName} ${date.getDate()}`;

      chip.addEventListener('click', () => {
        document.querySelectorAll('.quick-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectDate(date);
        // Switch to the month of the chip if needed
        this.currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        this.render();
      });

      this.chipsContainer.appendChild(chip);
    });
  }

  navigateMonth(delta) {
    const newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + delta, 1);
    const minMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);

    if (newMonth < minMonth) return; // Cannot go before current month

    this.currentMonth = newMonth;
    this.render();
  }

  selectDate(date) {
    this.selectedDate = new Date(date);
    const formatted = this.selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (this.previewText) {
      this.previewText.textContent = formatted;
    }

    if (this.nextStepBtn) {
      this.nextStepBtn.disabled = false;
    }

    if (window.soundEffects) {
      window.soundEffects.playClockTick();
    }

    this.onDateSelected(this.selectedDate, formatted);
    this.render();
  }

  render() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    // Display title
    const monthString = this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    this.monthDisplay.textContent = monthString;

    // Check prev button state
    const minMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.prevBtn.style.opacity = this.currentMonth <= minMonth ? '0.35' : '1';
    this.prevBtn.style.pointerEvents = this.currentMonth <= minMonth ? 'none' : 'auto';

    // Clear days
    this.container.innerHTML = '';

    // First day of month (convert Sunday=0 to Monday=0 format)
    const firstDayIndex = new Date(year, month, 1).getDay();
    const startingOffset = (firstDayIndex + 6) % 7; // Monday = 0, Sunday = 6

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty lead cells
    for (let i = 0; i < startingOffset; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-day disabled';
      this.container.appendChild(emptyCell);
    }

    // Days cells
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      cellDate.setHours(0, 0, 0, 0);

      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cal-day';
      cell.textContent = day;

      const isPast = cellDate < this.today;
      const isToday = cellDate.getTime() === this.today.getTime();
      const isSelected = this.selectedDate && cellDate.getTime() === this.selectedDate.getTime();

      if (isPast) {
        cell.classList.add('disabled');
      } else {
        if (isToday) cell.classList.add('today');
        if (isSelected) cell.classList.add('selected');

        cell.addEventListener('click', () => {
          this.selectDate(cellDate);
        });
      }

      this.container.appendChild(cell);
    }
  }
}

window.RomanticCalendar = RomanticCalendar;
