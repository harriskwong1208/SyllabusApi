document.addEventListener('DOMContentLoaded', (event) => {
  const url = new URL("https://courses.ianapplebaum.com/api/syllabus/1");

  const headers = {
    "Authorization": "Bearer YOUR_AUTH_KEY",
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

    if (Array.isArray(eventsArray)) {
      const container = document.getElementById('syllabusContainer');

      eventsArray.forEach(eventItem => {
        const eventDate = new Date(eventItem.event_date);
        const pItem = document.createElement('div');
        pItem.classList.add('event-item');

        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';

        const pastDueSpan = document.createElement('span'); 

        checkBox.addEventListener('change', function() {
          updateEventBackgroundColor(pItem, eventDate, checkBox, pastDueSpan);
        });

        pItem.appendChild(checkBox);
        pItem.appendChild(pastDueSpan);  

        const eventDescription = document.createElement('p');
        eventDescription.innerHTML = `<strong class="d-block text-gray-dark">${eventItem.event_name || ''} <small>(${eventItem.event_date || ''})</small></strong> ${eventItem.event_description || ''}`;
        pItem.appendChild(eventDescription);

        container.appendChild(pItem);

        updateEventBackgroundColor(pItem, eventDate, checkBox, pastDueSpan);
      });
    } else {
      console.error('eventsArray is not an array:', eventsArray);
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
});

function updateEventBackgroundColor(pItem, eventDate, checkBox, pastDueSpan) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(today.getDate() + 7);

  if (checkBox.checked) {
    pItem.style.backgroundColor = 'lightgreen';
    pastDueSpan.innerHTML = ''; 
  } else if (eventDate > today && eventDate <= oneWeekFromNow) {
    pItem.style.backgroundColor = 'lightyellow';
    pastDueSpan.innerHTML = ''; 
  } else if (eventDate <= today) {
    pItem.style.backgroundColor = 'red';
    pastDueSpan.innerHTML = 'Past Due: '; 
  } else {
    pItem.style.backgroundColor = ''; 
    pastDueSpan.innerHTML = ''; 
  }
}
