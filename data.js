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
  
      if (Array.isArray(eventsArray)) {
        const container = document.getElementById('syllabusContainer');
        
        eventsArray.forEach(eventItem => {
          const pItem = document.createElement('p');
          pItem.innerHTML = `<strong class="d-block text-gray-dark">${eventItem.event_name || ''} <small>(${eventItem.event_date || ''})</small></strong> ${eventItem.event_description || ''}`;
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
  
