(() => {
  const sidePanelDiv = document.querySelector("body .sidepanel");
  const panelBGDiv = document.querySelector("body .panel-bg");
  const appCalendarDayDiv = sidePanelDiv.querySelector(".app-calendar-day");
  const calendarEventsDiv = sidePanelDiv.querySelector(".calendar-events");
  const calendarEventsErrorDiv =
    calendarEventsDiv.querySelector(".calendar-error");
  const calendarEventsErrorButton =
    calendarEventsErrorDiv.querySelector("button");
  const calendarEventsLoadingDiv =
    calendarEventsDiv.querySelector(".calendar-loading");

  /**
   * @param {string} title
   * @param {string} from
   * @param {string} to
   * @param {string} color
   */
  function createDayCalendarActivity(title, from, to, color) {
    const activityDiv = document.createElement("div");
    activityDiv.classList.add("calendar-activity");
    const activityColorDiv = document.createElement("div");
    activityColorDiv.classList.add(
      "calendar-activity-color",
      `background-${color}`
    );
    const activityTitleDiv = document.createElement("div");
    activityTitleDiv.classList.add("calendar-activity-title");
    activityTitleDiv.innerText = title;
    const activityFromDiv = document.createElement("div");
    activityFromDiv.classList.add("calendar-activity-from");
    activityFromDiv.innerText = from;
    const activityToDiv = document.createElement("div");
    activityToDiv.classList.add("calendar-activity-to");
    activityToDiv.innerText = to;
    activityDiv.append(
      activityColorDiv,
      activityTitleDiv,
      activityFromDiv,
      activityToDiv
    );
    return activityDiv;
  }

  let loading = 0;

  /** @type {() => any} */
  let calendarErrorButtonListener;

  let sidePanelShowing = false;
  /**
   * @param {string} year
   * @param {string} month
   * @param {string} day
   */
  function loadCalendarDay(year, month, day) {
    const id = ++loading;
    if (calendarErrorButtonListener) {
      calendarEventsErrorButton.removeEventListener(
        "click",
        calendarErrorButtonListener
      );
    }
    appCalendarDayDiv.classList.add("hidden");
    calendarEventsErrorDiv.classList.add("d-none");
    calendarEventsLoadingDiv.classList.remove("d-none");
    appCalendarDayDiv.classList.add("opacity-hidden");
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
        const panelDiv = appCalendarDayDiv.querySelector(".calendar-panel");
        const dateDiv = panelDiv.querySelector(".calendar-date");
        dateDiv.innerText = `${day} de ${json["monthName"]} de ${year}`;
        const activitiesDiv = appCalendarDayDiv.querySelector(
          ".calendar-activities"
        );
        while (activitiesDiv.firstChild) {
          activitiesDiv.removeChild(activitiesDiv.firstChild);
        }
        const activities = json["activities"];
        if (activities.length != 0) {
          activitiesDiv.append(
            ...activities.map((a) =>
              createDayCalendarActivity(a.title, a.from, a.to, a.color)
            )
          );
        } else {
          const div = document.createElement("div");
          div.classList.add("calendar-no-activities");
          div.innerText = "No hay actividades";
          activitiesDiv.append(div);
        }
        appCalendarDayDiv.classList.remove("hidden");
        appCalendarDayDiv.classList.remove("opacity-hidden");
      })
      .catch(() => {
        if (id != loading) return;
        if (!sidePanelShowing) return;
        calendarErrorButtonListener = () => {
          loadCalendarDay(year, month, day);
        };
        calendarEventsErrorButton.addEventListener(
          "click",
          calendarErrorButtonListener
        );
        calendarEventsLoadingDiv.classList.add("d-none");
        calendarEventsErrorDiv.classList.remove("d-none");
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
    sidePanelDiv.classList.add("active");
    panelBGDiv.classList.remove("hidden");
    panelBGDiv.classList.add("active");
    loadCalendarDay(year, month, day);
  }

  function closeSidePanel() {
    if (!sidePanelShowing) return;
    sidePanelShowing = false;
    sidePanelDiv.classList.remove("active");
    panelBGDiv.classList.remove("active");
    setTimeout(() => {
      panelBGDiv.classList.add("hidden");
      appCalendarDayDiv.classList.add("opacity-hidden");
      appCalendarDayDiv.classList.add("hidden");
    }, 200);
  }

  panelBGDiv.addEventListener("click", closeSidePanel);

  /** @type {HTMLDivElement[]} */
  const daysElements = document.querySelectorAll(
    ".app-calendar-month .calendar-day"
  );

  if (daysElements.length != 0) {
    daysElements.forEach((el) => {
      if (!el.classList.contains("calendar-day-off")) {
        el.addEventListener("click", (ev) => {
          /** @type {HTMLDivElement} */
          const div = ev.currentTarget;
          if (!div) return;
          const year = div.dataset.year;
          const month = div.dataset.month;
          const day = div.dataset.day;
          openSidePanel(year, month, day);
        });
      }
    });
  }
})();
