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
          pItem.classList.add('event-item', 'rounded', 'user-select-none', 'p-2', 'border');

          const tags = document.createElement('div');
          tags.classList.add('d-flex', 'justify-content-between')

          const overdueTag = document.createElement('p');
          if (isOverdue(eventDate)) {
            overdueTag.innerHTML = '<strong class="text-danger">Past Due</strong>'
          }
          overdueTag.classList.add('m-0', 'p-0')
          tags.appendChild(overdueTag);

          const statusTag = document.createElement('p');
          statusTag.innerHTML = '<strong class="text-primary">Not Started</strong>'
          statusTag.classList.add('m-0', 'p-0')
          tags.appendChild(statusTag);
          pItem.appendChild(tags);

          pItem.addEventListener('click', function() {
            updateEventBackgroundColor(pItem, statusTag);
          });

          const eventDescription = document.createElement('p');
          eventDescription.innerHTML = `<strong class="d-block text-gray-dark">${eventItem.event_name || ''} <small>(${eventItem.event_date || ''})</small></strong> ${eventItem.event_description || ''}`;
          pItem.appendChild(eventDescription);

          container.appendChild(pItem);
        });
      } else {
        console.error('eventsArray is not an array:', eventsArray);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
});

function updateEventBackgroundColor(pItem, statusTag) {
  const bgColor = pItem.style.backgroundColor
  if(bgColor === 'lightgreen') {
    pItem.style.backgroundColor = 'white';
    statusTag.innerHTML = '<strong class="text-primary">Not Started</strong>'
  } else if (bgColor === 'lightyellow') {
    pItem.style.backgroundColor = 'lightgreen'
    statusTag.innerHTML = '<strong class="text-gray-dark">Completed</strong>'
  } else {
    pItem.style.backgroundColor = 'lightyellow'
    statusTag.innerHTML = '<strong class="text-gray-dark">In Progress</strong>'
  }
}

function isOverdue(eventDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the beginning of the day to ensure accurate comparison
  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(today.getDate() + 7);

  if(eventDate <= today) {
    return true;
  }
  return false;
}