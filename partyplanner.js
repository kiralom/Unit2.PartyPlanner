// Your friend is an event organizer and has asked you to build a website for them. They want to be able to keep track of all the parties they are organizing. They want to be able to see a list of all the parties, add new parties, and delete parties.

// Requirements
// Build your website according to this user story:

// A user enters the website and finds a list of the names, dates, times, locations, and descriptions of all the parties that are happening.
// Next to each party in the list is a delete button. The user clicks the delete button for one of the parties. That party is then removed from the list.
// There is also a form that allows the user to enter information about a new party that they want to schedule. After filling out the form and submitting it, the user observes their party added to the list of parties.

//API resources
// {
//     id: 1,
//     name: "Event Name",
//     description: "This is a description of the event.",
//     date: "2021-09-30T00:00:00.000Z", // Date ISO string
//     location: "123 Street"
//   }

const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-GHP-ET-WEB-FT-SF/events";
// "https://fsa-crud-2aa9294fe819.herokuapp.com/api/DEMO/events";
const state = {
  parties: [],
};

const partiesList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");

addPartyForm.addEventListener("submit", createParty);

async function render() {
  await getParties();
  renderParties();
}
render();

async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
    console.log(state.parties);
  } catch (error) {
    console.error(error);
  }
}

async function createParty(event) {
  event.preventDefault();

  const name = addPartyForm.title.value;
  const date = new Date(addPartyForm.date.value).toISOString();
  const description = addPartyForm.description.value;
  const location = addPartyForm.location.value;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        name,
        date,
        description,
        location,
      }),
    });

    const json = await response.json();
    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    render();
  } catch (error) {
    console.error(error);
  }
}

function renderParties() {
  if (state.parties.length < 1) {
    const newListItem = document.createElement("li");

    newListItem.textContent = "No event found";

    partiesList.append(newListItem);
  } else {
    partiesList.replaceChildren();

    state.parties.forEach((partyObj) => {
      const newListItem = document.createElement("li");
      newListItem.classList.add("party");

      const newHeading = document.createElement("h2");
      newHeading.textContent = partyObj.name;

      const newDate = document.createElement("p");
      newDate.textContent = partyObj.date;

      const newDescription = document.createElement("p");
      newDescription.textContent = partyObj.description;

      const newLocation = document.createElement("p");
      newLocation.textContent = partyObj.location;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteParty(partyObj.id));

      newListItem.append(
        newHeading,
        newDate,
        newDescription,
        newLocation,
        deleteButton
      );

      partiesList.append(newListItem);
    });
  }
}
