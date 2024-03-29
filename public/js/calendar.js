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
   * @param {string} id
   * @param {string} title
   * @param {string} from
   * @param {string} to
   * @param {string} color
   * @param {string} url
   */
  function createDayCalendarActivity(id, title, from, to, color, url) {
    return $(`
    <div class="calendar-activity">
      <div class="calendar-activity-color background-${color}"></div>
      <div class="calendar-activity-title"><a class="text-reset text-decoration-none" href="${url}">${title}</a></div>
      <div class="calendar-activity-from">${from}</div>
      <div class="calendar-activity-to">${to}</div>
    </div>`);
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
        console.log(json);
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
              createDayCalendarActivity(
                a.id,
                a.title,
                a.from,
                a.to,
                a.color,
                a.url
              )
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

  enableCalendarDayClick();

  panelBGDiv.on("click", closeSidePanel);

  function enableCalendarDayClick() {
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
  }

  function disableCalendarDayClick() {
    const daysElements = $(".app-calendar-month .calendar-day");

    if (daysElements.length != 0) {
      daysElements.each((_, el) => {
        const o = $(el);
        if (!o.hasClass("calendar-day-off")) {
          o.off("click");
        }
      });
    }
  }
})();
