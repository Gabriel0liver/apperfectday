(() => {
  const sidePanelDiv = $("body .sidepanel");
  const panelBGDiv = $("body .panel-bg");
  const appCalendarDayDiv = sidePanelDiv.children(".app-calendar-day");
  const calendarEventsDiv = sidePanelDiv.children(".calendar-events");
  const calendarEventsErrorDiv = calendarEventsDiv.children(".calendar-error");
  const calendarEventsErrorButton = calendarEventsErrorDiv.children("button");
  const calendarEventsLoadingDiv =
    calendarEventsDiv.children(".calendar-loading");

  /**
   * @param {string} title
   * @param {string} from
   * @param {string} to
   * @param {string} color
   */
  function createDayCalendarActivity(title, from, to, color) {
    const activityDiv = $("<div>");
    activityDiv.addClass("calendar-activity");
    const activityColorDiv = $("<div>");
    activityColorDiv.addClass("calendar-activity-color", `background-${color}`);
    const activityTitleDiv = $("<div>");
    activityTitleDiv.addClass("calendar-activity-title");
    activityTitleDiv.text(title);
    const activityFromDiv = $("<div>");
    activityFromDiv.addClass("calendar-activity-from");
    activityFromDiv.text(from);
    const activityToDiv = $("<div>");
    activityToDiv.addClass("calendar-activity-to");
    activityToDiv.text(to);
    activityDiv.append(
      activityColorDiv,
      activityTitleDiv,
      activityFromDiv,
      activityToDiv
    );
    return activityDiv;
  }

  let loading = 0;

  let sidePanelShowing = false;
  /**
   * @param {string} year
   * @param {string} month
   * @param {string} day
   */
  function loadCalendarDay(year, month, day) {
    const id = ++loading;
    calendarEventsErrorButton.off("click");
    appCalendarDayDiv.addClass("hidden");
    calendarEventsErrorDiv.addClass("d-none");
    calendarEventsLoadingDiv.removeClass("d-none");
    appCalendarDayDiv.addClass("opacity-hidden");
    waitAtLeast({
      ms: 200,
      promise: fetch(
        new URL(`/calendar/${year}/${month}/${day}`, window.location.origin)
      ),
    })
      .then((res) => {
        if (id != loading) return;
        if (!sidePanelShowing) return;
        if (res.status != 200) throw new Error();
        return res.json();
      })
      .then((json) => {
        const panelDiv = appCalendarDayDiv.children(".calendar-panel");
        const dateDiv = panelDiv.children(".calendar-date");
        dateDiv.text(`${day} de ${json["monthName"]} de ${year}`);
        const activitiesDiv = appCalendarDayDiv.children(
          ".calendar-activities"
        );
        activitiesDiv.children().remove();
        const activities = json["activities"];
        if (activities.length != 0) {
          activitiesDiv.append(
            ...activities.map((a) =>
              createDayCalendarActivity(a.title, a.from, a.to, a.color)
            )
          );
        } else {
          const div = $("<div>");
          div.addClass("calendar-no-activities");
          div.text("No hay actividades");
          activitiesDiv.append(div);
        }
        appCalendarDayDiv.removeClass("hidden");
        appCalendarDayDiv.removeClass("opacity-hidden");
      })
      .catch(() => {
        if (id != loading) return;
        if (!sidePanelShowing) return;
        calendarEventsErrorButton.on("click", () => {
          loadCalendarDay(year, month, day);
        });
        calendarEventsLoadingDiv.addClass("d-none");
        calendarEventsErrorDiv.removeClass("d-none");
      });
  }

  /**
   * @param {string} year
   * @param {string} month
   * @param {string} day
   */
  function openSidePanel(year, month, day) {
    if (sidePanelShowing) return;
    sidePanelShowing = true;
    sidePanelDiv.addClass("active");
    panelBGDiv.removeClass("hidden");
    panelBGDiv.addClass("active");
    loadCalendarDay(year, month, day);
  }

  function closeSidePanel() {
    if (!sidePanelShowing) return;
    sidePanelShowing = false;
    sidePanelDiv.removeClass("active");
    panelBGDiv.removeClass("active");
    setTimeout(() => {
      panelBGDiv.addClass("hidden");
      appCalendarDayDiv.addClass("opacity-hidden");
      appCalendarDayDiv.addClass("hidden");
    }, 200);
  }

  panelBGDiv.on("click", closeSidePanel);

  const daysElements = $(".app-calendar-month .calendar-day");

  if (daysElements.length != 0) {
    daysElements.each((_, el) => {
      const o = $(el);
      if (!o.hasClass("calendar-day-off")) {
        o.on("click", (ev) => {
          const div = $(ev.currentTarget);
          if (!div) return;
          const year = div.data("year");
          const month = div.data("month");
          const day = div.data("day");
          openSidePanel(year, month, day);
        });
      }
    });
  }
})();
