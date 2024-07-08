document.addEventListener("DOMContentLoaded", function() {

    // Dynamically construct the URL based on BASE_URL and username
    const getMoodUrl = BASE_URL + "/getMood/" + username;
    const saveMoodUrl = BASE_URL + "/saveMood/" + username;
    const checkMoodUrl = BASE_URL + "/checkMood/" + username;
    const deleteMoodUrl = BASE_URL + "/deleteMood/" + username;

    const calendarEl = document.getElementById('calendar');
    const emojiPicker = document.getElementById('emoji-picker');
    const emojis = document.querySelectorAll(".emoji");
    let selectedDate = null;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        dateClick: function(info) {
            if (info.date <= new Date()) {
                selectedDate = info.dateStr;
                showEmojiPicker(info.jsEvent.pageX, info.jsEvent.pageY);
            } else {
                selectedDate = null; // Clear selectedDate if a future date is clicked
                emojiPicker.classList.add('hidden');
                alert("Future dates cannot be modified.");
            }
        },
        events: function(fetchInfo, successCallback, failureCallback) {
            fetch(getMoodUrl)
                .then(response => response.json())
                .then(data => {
                    const events = data.map(item => ({
                        title: item.emoji,
                        start: item.date,
                        id: item.id
                    }));
                    successCallback(events);
                })
                .catch(failureCallback);
        },
        eventClick: function(info) {
            if (confirm("Do you want to remove this mood?")) {
                deleteMood(info.event.id);
                info.event.remove();
            }
        }
    });

    calendar.render();

    emojis.forEach(emoji => {
        emoji.addEventListener('click', () => {
            if (selectedDate) {
                checkMoodExists(selectedDate).then(exists => {
                    if (exists) {
                        alert("A mood already exists for this date. Please remove it first.");
                    } else {
                        saveMood(selectedDate, emoji.textContent).then(() => {
                            emojiPicker.classList.add('hidden');
                            calendar.refetchEvents();
                        });
                    }
                });
            }
        });
    });

    function showEmojiPicker(x, y) {
        emojiPicker.style.left = `${x}px`;
        emojiPicker.style.top = `${y}px`;
        emojiPicker.classList.remove('hidden');
    }

    function saveMood(date, emoji) {
        return fetch(saveMoodUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date: date, emoji: emoji })
        }).then(response => response.json())
          .then(data => console.log(data));
    }

    function checkMoodExists(date) {
        return fetch(checkMoodUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date: date })
        }).then(response => response.json())
          .then(data => data.exists);
    }

    function deleteMood(id) {
        fetch(deleteMoodUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        }).then(response => response.json())
          .then(data => console.log(data));
    }
});