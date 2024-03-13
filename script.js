//-----API
const COHORT = "2401-FTB-ET-WEB-AM";
const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-ET-WEB-AM/events";

//--------------state
const state = {
  events: [],
};

//---------------querySelectors
const eventsList = document.querySelector("#events");
const addEventForm = document.querySelector("#addEvent");

//------------------listeners
addEventForm.addEventListener("submit", addEvent);

//------------------------sync state & ReRender Events
async function render() {
  await getEvents();
  renderEvents();
}
render();

//-------------------------------------------functions------------------------------------
//---------------------------get Events
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log(data.data);
    state.events = data.data;
  } catch (error) {}
}

//------------------render from state----------
function renderEvents() {
  if (!state.events.length) {
    eventsList.innerHTML = "<li> No events found.</li>";
    return;
  }

  //---------- load the cards to show on the page
  const eventCards = state.events.map((event) => {
    const eventCard = document.createElement("li");
    eventCard.classList.add("events");
    eventCard.innerHTML = `<h2>${event.name}</h2>
    <p>${event.date}</p>
    <h3>${event.location}</h2>
    <p>${event.description}</p> <br>
    `;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    eventCard.append(deleteButton);

    //------pass ID to deleteEvent
    deleteButton.addEventListener("click", () => deleteEvent(event.id));
    return eventCard;
  });
  eventsList.replaceChildren(...eventCards);
}
//---------------------------add Events
async function addEvent(event) {
  event.preventDefault();
  //------------------------------wrapper for "createEvent"
  await createEvent(
    addEventForm.name.value,
    addEventForm.location.value,
    addEventForm.description.value,
    new Date(addEventForm.date.value)
  );
}

//-----------Have the API create event and rerender
async function createEvent(name, location, description, date) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location, description, date }),
    });
    const json = await response.json();
    console.log("new event", json);

    if (json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

//-------------do the work to send the API the delete request
async function deleteEvent(id) {
  try {
    console.log(id);
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Cannot delete event at this time.");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}
