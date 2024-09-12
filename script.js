document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById('loading-screen');
    const confirmScreen = document.getElementById('confirm-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const timerElement = document.getElementById('timer');
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.style.display = 'none';
    gameScreen.appendChild(submitBtn);

    const cards = document.querySelectorAll('.card');
    const dropBoxes = document.querySelectorAll('.drop-box');

    // Ensure only loading screen is visible initially
    loadingScreen.classList.add('active');

    // Stage 1: Simulate Loading Screen
    setTimeout(() => {
        loadingScreen.classList.remove('active');
        confirmScreen.classList.add('active');
    }, 2000); // Loading screen lasts for 2 seconds

    // Stage 2: Start Game
    startGameBtn.addEventListener('click', () => {
        confirmScreen.classList.remove('active');
        gameScreen.classList.add('active');
        startTimer(0.3); // 3 minutes timer
    });

    // Add dragstart event listener to all cards
    cards.forEach(card => {
        card.addEventListener('dragstart', dragStart);
    });

    // Add dragover and drop event listeners to all drop boxes
    dropBoxes.forEach(box => {
        box.addEventListener('dragover', dragOver);
        box.addEventListener('dragleave', dragLeave);
        box.addEventListener('drop', drop);
    });

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.style.opacity = '0.5';
        e.target.style.cursor = 'grabbing';  // Change cursor to 'grabbing' when drag starts
    }

    function dragEnd(e) {
        e.target.style.opacity = '1';
    }

    function dragOver(e) {
        e.preventDefault();
        if (e.target.classList.contains('drop-box') && !e.target.classList.contains('occupied')) {
            e.target.classList.add('drag-over');
        }
    }

    function dragLeave(e) {
        if (e.target.classList.contains('drop-box')) {
            e.target.classList.remove('drag-over');
        }
    }
    
    function drop(e) {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain');
        const draggedCard = document.getElementById(cardId);
        let dropTarget = e.target;

        // If the drop target is a card, get its parent drop-box
        if (dropTarget.classList.contains('card')) {
            dropTarget = dropTarget.parentElement;
        }

        if (draggedCard && dropTarget.classList.contains('drop-box')) {
            const existingCard = dropTarget.querySelector('.card');
            
            if (existingCard) {
                // Swap the cards
                const draggedCardParent = draggedCard.parentElement;
                draggedCardParent.appendChild(existingCard);
                dropTarget.appendChild(draggedCard);
            } else {
                // Move the card to the empty drop-box
                dropTarget.appendChild(draggedCard);
            }
        }

        dropTarget.classList.remove('drag-over');
    }

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
        timerElement.style.display = 'none';
        disableDragAndDrop();
        
        const overlay = document.createElement('div');
        overlay.className = 'freeze-overlay';
        overlay.textContent = 'Game Frozen';
        gameScreen.appendChild(overlay);
        
        setTimeout(() => {
            gameScreen.removeChild(overlay);
            enableDragAndDrop();
            submitBtn.style.display = 'block';
        }, 10000); // 1 minute freeze
    }
    
    function disableDragAndDrop() {
        cards.forEach(card => {
            card.setAttribute('draggable', 'false');
            card.removeEventListener('dragstart', dragStart);
            card.removeEventListener('dragend', dragEnd);
        });
        dropBoxes.forEach(box => {
            box.removeEventListener('dragover', dragOver);
            box.removeEventListener('dragleave', dragLeave);
            box.removeEventListener('drop', drop);
        });
    }
    
    function enableDragAndDrop() {
        cards.forEach(card => {
            card.setAttribute('draggable', 'true');
            card.addEventListener('dragstart', dragStart);
            card.addEventListener('dragend', dragEnd);
        });
        dropBoxes.forEach(box => {
            box.addEventListener('dragover', dragOver);
            box.addEventListener('dragleave', dragLeave);
            box.addEventListener('drop', drop);
        });
    }

    enableDragAndDrop();

    submitBtn.addEventListener('click', () => {
        gameScreen.classList.remove('active');
        gameOverScreen.classList.add('active');
    });
});