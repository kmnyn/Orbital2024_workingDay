document.addEventListener("DOMContentLoaded", function() {
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
            fetch('/get_mood')
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
                saveMood(selectedDate, emoji.textContent).then(() => {
                    emojiPicker.classList.add('hidden');
                    calendar.refetchEvents();
                });
            }
        });
    });

    /*
    emojis.forEach(emoji => {
        emoji.addEventListener('click', () => {
            if (selectedDate) {
                saveMood(selectedDate, emoji.textContent);
                emojiPicker.classList.add('hidden');
                calendar.addEvent({ title: emoji.textContent, start: selectedDate });
            }
        });
    });
    */

    function showEmojiPicker(x, y) {
        emojiPicker.style.left = `${x}px`;
        emojiPicker.style.top = `${y}px`;
        emojiPicker.classList.remove('hidden');
    }

    function saveMood(date, emoji) {
        fetch('/save_mood', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date: date, emoji: emoji })
        }).then(response => response.json())
          .then(data => console.log(data));
    }

    function deleteMood(id) {
        fetch('/delete_mood', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        }).then(response => response.json())
          .then(data => console.log(data));
    }
});