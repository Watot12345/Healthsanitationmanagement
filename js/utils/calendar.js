export class Calendar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.calendar = null;
    this.init();
  }

  init() {
    if (!this.container) return;

    this.calendar = new FullCalendar.Calendar(this.container, {
      initialView: this.options.initialView || 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: this.options.headerRight || 'dayGridMonth,timeGridWeek,listWeek'
      },
      height: 'auto',
      events: this.options.events || [],
      editable: this.options.editable || false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      // Event click handler
      eventClick: (info) => {
        if (this.options.onEventClick) {
          this.options.onEventClick(info.event);
        }
      },
      // Date click handler
      dateClick: (info) => {
        if (this.options.onDateClick) {
          this.options.onDateClick(info.dateStr);
        }
      },
      // Event drag & drop
      eventDrop: (info) => {
        if (this.options.onEventDrop) {
          this.options.onEventDrop(info.event);
        }
      },
      // Event resize
      eventResize: (info) => {
        if (this.options.onEventResize) {
          this.options.onEventResize(info.event);
        }
      },
      // Loading state
      loading: (isLoading) => {
        if (this.options.onLoading) {
          this.options.onLoading(isLoading);
        }
      },
      // Custom styling for dark mode
      eventDidMount: (info) => {
        if (this.options.eventClassNames) {
          info.el.classList.add(...this.options.eventClassNames(info.event));
        }
      }
    });

    this.calendar.render();
  }

  // Add events
  addEvent(event) {
    this.calendar.addEvent(event);
  }

  // Add multiple events
  addEvents(events) {
    events.forEach(event => this.calendar.addEvent(event));
  }

  // Update event source
  setEvents(events) {
    this.calendar.removeAllEvents();
    this.calendar.addEventSource(events);
  }

  // Remove event by ID
  removeEvent(eventId) {
    const event = this.calendar.getEventById(eventId);
    if (event) event.remove();
  }

  // Get all events
  getEvents() {
    return this.calendar.getEvents();
  }

  // Navigate to date
  goToDate(date) {
    this.calendar.gotoDate(date);
  }

  // Change view
  changeView(view) {
    this.calendar.changeView(view);
  }

  // Refresh calendar
  refresh() {
    this.calendar.refetchEvents();
  }

  // Update size
  updateSize() {
    this.calendar.updateSize();
  }

  // Destroy calendar
  destroy() {
    if (this.calendar) {
      this.calendar.destroy();
      this.calendar = null;
    }
  }
}