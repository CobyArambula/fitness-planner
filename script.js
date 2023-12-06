const calendar = document.querySelector(".calendar"),
  container = document.querySelector(".container"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  monthClass = document.querySelector(".month"),
  weekdaysDaysContainer = document.querySelector(".weekdays-days-container"),
  calendarView = document.querySelector(".calendar-view"),
  activityView = document.querySelector(".activity-view"),
  addActivityView = document.querySelector(".add-activity-view"),
  addActivityForm = document.getElementById("addActivityForm"),
  plannedActivityContainer = document.querySelector(
    ".planned-activity-container"
  ),
  noPlannedActivitiesMessage = document.querySelector(
    ".no-planned-activities-message"
  ),
  recordedActivityToggle = document.getElementById(
    "recordedActivityExpandChevron"
  ),
  recordedActivityInnerInfo = document.getElementById(
    "recordedActivityInnerInfo"
  ),
  recordedActivityContainer = document.querySelector(
    ".recorded-activity-container"
  ),
  noRecordedActivitiesMessage = document.querySelector(
    ".no-recorded-activities-message"
  );

const plannedActivities = localStorage.getItem("plannedActivities");

let plannedActivitiesArray = JSON.parse(plannedActivities);

let selectedDate = new Date(); // Date that is selected by the user
let activities = new Array();
let activityDates = [[]];
let data;
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

window.onload = function () {
  var addActivityReloadStatus = sessionStorage.getItem("addActivityReload");
  var selectedYear = sessionStorage.getItem("selectedYear");
  var selectedMonth = sessionStorage.getItem("selectedMonth");
  var selectedDate = sessionStorage.getItem("selectedDate");

  if (addActivityReloadStatus) {
    viewActivity(selectedYear, selectedMonth, selectedDate);
    sessionStorage.removeItem("addActivityReload");
    sessionStorage.removeItem("selectedYear");
    sessionStorage.removeItem("selectedMonth");
    sessionStorage.removeItem("selectedDate");
  }
};

function initCalendar(activityDates) {
  const firstDay = new Date(year, month, 1); // First date of current month as Date object
  const lastDay = new Date(year, month + 1, 0); // Last date of current month as Date object
  const prevLastDay = new Date(year, month, 0); // Last date of prev month as Date object
  const prevDays = prevLastDay.getDate(); // Last date of prev month as number
  const lastDate = lastDay.getDate(); // Last date of current month
  const day = firstDay.getDay(); // How many days in the prev month to display
  const nextDays = 7 - lastDay.getDay() - 1; // How many days in the next month to display

  date.innerHTML = months[month] + " " + year;

  // if day contains event, then day should get event class, and corresponding event data should be attached
  let days = "";

  // for previous days
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  // current month days
  for (let i = 1; i <= lastDate; i++) {
    // if day is today add class today
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      days += `<div class="day today" onclick="viewActivity(${year}, ${
        month + 1
      }, ${i})">${i}</div>`;
    } else if (isActivity(new Date(year, month, i))) {
      // if activity is planned for day, add event class
      days += `<div class="day event" onclick="viewActivity(${year}, ${
        month + 1
      }, ${i})">${i}</div>`;
    } else {
      days += `<div class="day"  onclick="viewActivity(${year}, ${
        month + 1
      }, ${i})">${i}</div>`;
    }
  }

  // next month days
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
}

// previous month
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

// add event listener on prev and next
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// Call server to retrieve items from DynamoDB table and push them in activities array
async function loadActivityData() {
  try {
    const response = await fetch("http://localhost:3000/getDynamoData");
    data = await response.json();
    data.forEach((item) => {
      activities.push(item);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Need to parse days from activity array
// if activityArrayDate == day, add active class to day
function getActivityDates() {
  activities.forEach((activity) => {
    const activityString = activity.Id;
    // Uses a regex and capturing groups to extract year, month, and day
    const regex = /(\d{4})-(\d{2})-(\d{2})/;
    const match = regex.exec(activityString);
    const year = match[1];
    const month = match[2] - 1;
    const day = match[3];
    const activityDate = new Date(year, month, day);
    activityDates.push(activityDate);
  });
}

loadActivityData().then(() => {
  getActivityDates();
  initCalendar(activityDates);
  console.log(activityDates);
});

// Checks if date being rendered has a corresponding activity. If so, return true
function isActivity(renderedDate) {
  const renderedDateString = renderedDate.toString();
  return activityDates.some(
    (activityDate) => activityDate.toString() === renderedDateString
  );
}

// Navigates from the calendar view to the activity view for the selected date
function viewActivity(selectedYear, selectedMonth, selectedDay) {
  calendarView.style.display = "none";
  activityView.style.display = "block";
  if ((addActivityView.style.display = "block")) {
    addActivityView.style.display = "none";
  }
  // use arguments to store the date in the selectedDate object
  selectedDate.setFullYear(selectedYear, selectedMonth - 1, selectedDay);

  /* 
    Check if there is an activity (object) in local storage that has an activity date
    that equals the selectedDate. If so, insert corresponding activities into planned-activity-container.
    If not, display no planned activities message.
  */
  let plannedActivitiesHTML = "";

  plannedActivityContainer.style.display = "none";
  noPlannedActivitiesMessage.style.display = "block";
  if (plannedActivitiesArray) {
    plannedActivitiesArray.forEach((item) => {
      if (
        item.activityDate ==
        selectedDate.getFullYear() +
          "-" +
          selectedDate.getMonth() +
          "-" +
          selectedDate.getDate()
      ) {
        plannedActivityContainer.style.display = "flex";
        noPlannedActivitiesMessage.style.display = "none";
        plannedActivitiesHTML += `
        <div class="planned-activity-item">
          <img src="${getActivityIcon(item.activityType)}" />
          <div>
            <p>${item.activityType}&#10;${item.startTime} - ${item.endTime}</p>
          </div>
        </div>`;
        plannedActivityContainer.innerHTML = plannedActivitiesHTML;
      }
    });
  }

  /* 
    Check if there's an activity(ies) in the activies array (from database) that correspond with the current date
    If so, display activity(ies). If not, display no-recorded-activities-message
  */
  let recordedActivitiesHTML = "";
  recordedActivityContainer.style.display = "none";
  noRecordedActivitiesMessage.style.display = "block";
}

// Returns a string of the directory of the correct activity icon
function getActivityIcon(activityType) {
  switch (activityType) {
    case "Cooldown":
      return "/assets/cooldown.png";
    case "Core Training":
      return "/assets/core-training.png";
    case "Cycle":
      return "/assets/cycle.png";
    case "Dance":
      return "/assets/dance.png";
    case "Elliptical":
      return "/assets/elliptical.png";
    case "Functional Strength Training":
      return "/assets/functional-strength-training.png";
    case "HIIT":
      return "/assets/hiit.png";
    case "Hiking":
      return "/assets/hiking.png";
    case "Kickboxing":
      return "/assets/kickboxing.png";
    case "Multisport":
      return "/assets/multisport.png";
    case "Other":
      return "/assets/other.png";
    case "Pilates":
      return "/assets/pilates.png";
    case "Rower":
      return "/assets/rower.png";
    case "Run":
      return "/assets/run.png";
    case "Stair Stepper":
      return "/assets/stair-stepper.png";
    case "Swimming":
      return "/assets/swimming.png";
    case "Tai Chi":
      return "/assets/tai-chi.png";
    case "Walk":
      return "/assets/walk.png";
    case "Wheelchair":
      return "/assets/wheelchair.png";
    case "Yoga":
      return "/assets/yoga.png";
    default:
      return "/assets/functional-strength-training";
  }
}

// Navigates from the activity view to the calendar view
function viewCalendar() {
  calendarView.style.display = "block";
  activityView.style.display = "none";
}

// Navigates from the activity view to the add activity view
function viewAddActivity() {
  activityView.style.display = "none";
  addActivityView.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  addActivityForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    // Access form fields and log the data
    const activityType = document.getElementById("activitySelection").value;
    const startTime = document.getElementById("startTimeSelection").value;
    const endTime = document.getElementById("endTimeSelection").value;
    const activityDate =
      selectedDate.getFullYear() +
      "-" +
      selectedDate.getMonth() +
      "-" +
      selectedDate.getDate();

    const plannedActivities = getPlannedActivitiesFromStorage();
    plannedActivities.push({
      activityType: activityType,
      startTime: startTime,
      endTime: endTime,
      activityDate: activityDate,
    });
    savePlannedActivitiesToStorage(plannedActivities);
    /* After saving planned activity to localstorage, the container will appear empty unless you reload the page
       After add activity button is pressed, the page needs to reload, then return to the correct activity screen
       This will be done using session storage
    */
    sessionStorage.setItem("addActivityReload", "true");
    sessionStorage.setItem("selectedYear", selectedDate.getFullYear());
    sessionStorage.setItem("selectedMonth", selectedDate.getMonth() + 1);
    sessionStorage.setItem("selectedDate", selectedDate.getDate());
    location.reload();
  });
});

function getPlannedActivitiesFromStorage() {
  const storedActivities = localStorage.getItem("plannedActivities");
  return storedActivities ? JSON.parse(storedActivities) : [];
}

function savePlannedActivitiesToStorage(plannedActivities) {
  localStorage.setItem("plannedActivities", JSON.stringify(plannedActivities));
}
