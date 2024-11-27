document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById('loading-screen');
    const confirmScreen = document.getElementById('confirm-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const timerElement = document.getElementById('timer');
    const doneBtn = document.getElementById('done-btn');
    const restartBtn = document.getElementById('restart-btn');

    const cards = document.querySelectorAll('.card');
    const dropBoxes = document.querySelectorAll('.drop-box');
    const dropBoxesRow2 = document.querySelectorAll('#boxes-row2 .drop-box');

    // Ensure only loading screen is visible initially
    // Note: 'active' class is already set in HTML for loading screen

    // Stage 1: Simulate Loading Screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        confirmScreen.classList.remove('hidden');
        confirmScreen.classList.add('active');
    }, 2000); // Loading screen lasts for 2 seconds

    // Stage 2: Start Game
    startGameBtn.addEventListener('click', () => {
        confirmScreen.classList.remove('active');
        confirmScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameScreen.classList.add('active');
        startTimer(0.5); // 3 minutes timer
    });

    function assignGradientColors() {
        const firstRowBoxes = document.querySelectorAll('#boxes .drop-box');
        //const secondRowBoxes = document.querySelectorAll('#boxes-row2 .drop-box');
        
        // Define gradient ranges
        const firstRowColors = [
        'rgba(255, 255, 255, 0.6)',    // Bright green
        'rgba(240, 240, 240, 0.6)',  // Light green-yellow
        'rgba(220, 220, 220, 0.6)',  // Yellowish-orange
        'rgba(200, 200, 200, 0.6)',  // Light orange
        'rgba(180, 180, 180, 0.6)'    // Orange
        ];

        const secondRowColors = [
            'rgba(80, 80, 80, 0.6)',   // Bright red
            'rgba(100, 100, 100, 0.6)',  // Orange-red
            'rgba(120, 120, 120, 0.6)', // Soft red-orange
            'rgba(140, 140, 140, 0.6)',// Light red-orange
            'rgba(160, 160, 160, 0.6)'   // Orange
        ];
        
        // Assign colors to the first row
        firstRowBoxes.forEach((box, index) => {
            box.style.backgroundColor = firstRowColors[index];
        });
    
        // Assign colors to the second row
        secondRowBoxes.forEach((box, index) => {
            box.style.backgroundColor = secondRowColors[index];
        });
    }

    // Add dragstart and dragend event listeners to all cards
    cards.forEach(card => {
        card.addEventListener('dragstart', dragStart);
        card.addEventListener('dragend', dragEnd);
    });

    // Add dragover and drop event listeners to all drop boxes
    dropBoxes.forEach(box => {
        box.addEventListener('dragover', dragOver);
        box.addEventListener('dragleave', dragLeave);
        box.addEventListener('drop', drop);
    });

    // Add event listeners to the second row of drop boxes
    dropBoxesRow2.forEach(box => {
        box.addEventListener('dragover', dragOver);
        box.addEventListener('dragleave', dragLeave);
        box.addEventListener('drop', drop);
    });


    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.style.opacity = '0.5';
        e.target.style.cursor = 'grabbing';
    }

    function dragEnd(e) {
        e.target.style.opacity = '1';
        e.target.style.cursor = 'grab';
    }

    function dragOver(e) {
        e.preventDefault();
        if (e.target.classList.contains('drop-box')) {
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
                draggedCard.parentElement.removeChild(draggedCard);
                dropTarget.appendChild(draggedCard);
            }
    
            // Remove only the "Drop Here" text if it exists
            const dropText = dropTarget.querySelector('.drop-text');
            if (dropText) {
                dropTarget.removeChild(dropText);
            }
        }
    
        dropTarget.classList.remove('drag-over');
    }
      

    // Stage 3: Timer Logic
    function startTimer(minutes) {
        let time = minutes * 60;
        const interval = setInterval(() => {
            let minutesLeft = Math.floor(time / 60);
            let secondsLeft = time % 60;
            timerElement.textContent = `Time Left: ${minutesLeft}:${secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}`;
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
        overlay.textContent = 'Game Paused for 1 Minute';
        gameScreen.appendChild(overlay);
    
        setTimeout(() => {
            gameScreen.removeChild(overlay);
            enableDragAndDrop();
            doneBtn.classList.remove('hidden');
        }, 60000); // Freeze for 1 minute (60,000 milliseconds)
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
        // Add event listeners to the second row of drop boxes
        dropBoxesRow2.forEach(box => {
            box.addEventListener('dragover', dragOver);
            box.addEventListener('dragleave', dragLeave);
            box.addEventListener('drop', drop);
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
        // Add event listeners to the second row of drop boxes
        dropBoxesRow2.forEach(box => {
            box.addEventListener('dragover', dragOver);
            box.addEventListener('dragleave', dragLeave);
            box.addEventListener('drop', drop);
        });
    }

    enableDragAndDrop();

    assignGradientColors();

    doneBtn.addEventListener('click', () => {
        gameScreen.classList.remove('active');
        gameScreen.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
        gameOverScreen.classList.add('active');
    });

    // Restart game functionality
    restartBtn.addEventListener('click', () => {
        // Reset game state
        gameOverScreen.classList.remove('active');
        gameOverScreen.classList.add('hidden');
        confirmScreen.classList.remove('hidden');
        confirmScreen.classList.add('active');
        timerElement.style.display = 'block';
        timerElement.textContent = '';

        doneBtn.classList.add('hidden');

        // Move cards back to carousel
        const carousel = document.getElementById('carousel');
        cards.forEach(card => {
            if (card.parentElement.classList.contains('drop-box')) {
                card.parentElement.removeChild(card);
                carousel.appendChild(card);
            }
        });
    });
});
