document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById('loading-screen');
    const confirmScreen = document.getElementById('confirm-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const doneBtn = document.getElementById('done-btn');
    const timerElement = document.getElementById('timer');
    
    // Ensure only loading screen is visible initially
    loadingScreen.classList.add('active');

    // Stage 1: Simulate Loading Screen
    setTimeout(() => {
        loadingScreen.classList.remove('active');
        confirmScreen.classList.add('active');
    }, 3000); // Loading screen lasts for 3 seconds

    // Stage 2: Start Game
    startGameBtn.addEventListener('click', () => {
        confirmScreen.classList.remove('active');
        gameScreen.classList.add('active');
        startTimer(1); // 5 minutes timer
    });

    //New code starts here
    const cards = document.querySelectorAll('.card');
    const dropBoxes = document.querySelectorAll('.drop-box');

    // Add dragstart event listener to all cards
    cards.forEach(card => {
        card.addEventListener('dragstart', dragStart);
    });

    // Add dragover and drop event listeners to all drop boxes
    dropBoxes.forEach(box => {
        box.addEventListener('dragover', dragOver);
        box.addEventListener('drop', drop);
    });

    function dragStart(e) {
        // Store the ID of the card being dragged
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    function dragOver(e) {
        e.preventDefault(); // Necessary to allow dropping
        e.target.classList.add('drag-over');
    }

    function drop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');

        const cardId = e.dataTransfer.getData('text/plain');
        const card = document.getElementById(cardId);

        // Check if the drop box is already occupied
        if (!e.target.classList.contains('locked')) {
            // Append the card to the drop box
            e.target.appendChild(card);
            e.target.classList.add('locked'); // Lock the drop zone
            e.target.textContent = ''; // Remove 'Drop here' text
        }
    }
    //New code ends here

    // Stage 3: Timer Logic
    function startTimer(minutes) {
        let time = minutes * 60;
        const interval = setInterval(() => {
            let minutes = Math.floor(time / 60);
            let seconds = time % 60;
            timerElement.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            time--;

            if (time < 0) {
                clearInterval(interval);
                freezeScreen();
            }
        }, 1000);
    }

    function freezeScreen() {
        doneBtn.classList.remove('hidden');
        // Freeze the game screen here, e.g., by preventing further drag-and-drop
    }

    doneBtn.addEventListener('click', () => {
        gameScreen.classList.remove('active');
        gameOverScreen.classList.add('active');
    });
});
