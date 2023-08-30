document.addEventListener('DOMContentLoaded', (event) => {
  const url = new URL("https://courses.ianapplebaum.com/api/syllabus/1");

  const headers = {
    "Authorization": "Bearer eIGqgatYQzkNIksq6GHXpCPbG0Ra1M2JkXKSJStb",
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  fetch(url, {
    method: "GET",
    headers,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {

      const eventsArray = data.events || [];

      eventsArray.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

      const today = new Date();
      const oneWeekFromNow = new Date(today);
      oneWeekFromNow.setDate(today.getDate() + 7);

      if (Array.isArray(eventsArray)) {
        const container = document.getElementById('syllabusContainer');

        eventsArray.forEach(eventItem => {
          const eventDate = new Date(eventItem.event_date);

          const pItem = document.createElement('div');
          pItem.classList.add('event-item');

          const checkBox = document.createElement('input');
          checkBox.type = 'checkbox';

          checkBox.addEventListener('change', function() {
            updateEventBackgroundColor(pItem, eventDate, checkBox);
          });

          pItem.appendChild(checkBox);

          const eventDescription = document.createElement('p');
          eventDescription.innerHTML = `<strong class="d-block text-gray-dark">${eventItem.event_name || ''} <small>(${eventItem.event_date || ''})</small></strong> ${eventItem.event_description || ''}`;
          pItem.appendChild(eventDescription);

          container.appendChild(pItem);

          updateEventBackgroundColor(pItem, eventDate, checkBox);
        });
      } else {
        console.error('eventsArray is not an array:', eventsArray);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
});

function updateEventBackgroundColor(pItem, eventDate, checkBox) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the beginning of the day to ensure accurate comparison
  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(today.getDate() + 7);

  if (checkBox.checked) {
    pItem.style.backgroundColor = 'lightgreen';
  } else if (eventDate > today && eventDate <= oneWeekFromNow) {
    pItem.style.backgroundColor = 'lightyellow';
  } else if (eventDate <= today) {
    pItem.style.backgroundColor = 'red';
    pItem.innerHTML = '<strong class="d-block text-gray-dark">Past Due</strong> ' + pItem.innerHTML;
  } else {
    pItem.style.backgroundColor = ''; // No background color for other cases
  }
}