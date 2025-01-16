document.addEventListener("DOMContentLoaded", () => {
    // Screen elements
    const loadingScreen = document.getElementById('loading-screen');
    const confirmScreen = document.getElementById('confirm-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');

    // Buttons
    const startGameBtn = document.getElementById('start-game-btn');
    const resetBtn = document.getElementById('reset-btn');
    const doneBtn = document.getElementById('done-btn');
    const restartBtn = document.getElementById('restart-btn');

    // Carousels & drop boxes
    const carousel1 = document.getElementById('carousel1');
    const carousel2 = document.getElementById('carousel2');
    const dropBoxes = document.querySelectorAll('#boxes .drop-box');
    const dropBoxesRow2 = document.querySelectorAll('#boxes-row2 .drop-box');

    // Cards
    const cards = Array.from(document.querySelectorAll('.card'));

    // Multiple carousels array
    const carousels = [carousel1, carousel2];

    // Initial Loading Screen Simulation
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        confirmScreen.classList.remove('hidden');
        confirmScreen.classList.add('active');
    }, 2000);

    // Start Game
    startGameBtn.addEventListener('click', () => {
        confirmScreen.classList.remove('active');
        confirmScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameScreen.classList.add('active');
        enableDragAndDrop();
        assignGradientColors();
    });

    // Assign gradient colors to drop boxes
    function assignGradientColors() {
        const firstRowBoxes = document.querySelectorAll('#boxes .drop-box');
        const secondRowBoxes = document.querySelectorAll('#boxes-row2 .drop-box');

        const firstRowColors = [
            'rgba(255, 255, 255, 0.6)',
            'rgba(240, 240, 240, 0.6)',
            'rgba(220, 220, 220, 0.6)',
            'rgba(200, 200, 200, 0.6)',
            'rgba(180, 180, 180, 0.6)'
        ];

        const secondRowColors = [
            'rgba(160, 160, 160, 0.6)',
            'rgba(140, 140, 140, 0.6)',
            'rgba(120, 120, 120, 0.6)',
            'rgba(100, 100, 100, 0.6)',
            'rgba(80, 80, 80, 0.6)'
        ];

        firstRowBoxes.forEach((box, index) => {
            box.style.backgroundColor = firstRowColors[index];
        });

        secondRowBoxes.forEach((box, index) => {
            box.style.backgroundColor = secondRowColors[index];
        });
    }

    // Drag functions
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
        if (e.target.classList.contains('drop-box') || e.target.classList.contains('carousel')) {
            e.target.classList.add('drag-over');
        }
    }

    function dragLeave(e) {
        if (e.target.classList.contains('drop-box') || e.target.classList.contains('carousel')) {
            e.target.classList.remove('drag-over');
        }
    }

    function drop(e) {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain');
        const draggedCard = document.getElementById(cardId);
        let dropTarget = e.target;

        // Climb up DOM to find carousel or drop-box if we dropped onto a nested element
        while (dropTarget && !dropTarget.classList.contains('carousel') && !dropTarget.classList.contains('drop-box') && !dropTarget.classList.contains('card')) {
            dropTarget = dropTarget.parentElement;
        }

        // If we landed on another card, move up one level
        if (dropTarget && dropTarget.classList.contains('card')) {
            dropTarget = dropTarget.parentElement;
        }

        if (!draggedCard || !dropTarget) return;

        if (dropTarget.classList.contains('drop-box')) {
            const existingCard = dropTarget.querySelector('.card');
            if (existingCard) {
                // Swap cards
                draggedCard.parentElement.appendChild(existingCard);
            }
            dropTarget.appendChild(draggedCard);
        } else if (dropTarget.classList.contains('carousel')) {
            dropTarget.appendChild(draggedCard);
        }

        draggedCard.setAttribute('draggable', 'true');
        dropTarget.classList.remove('drag-over');
    }

    // Enable drag-and-drop
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
        dropBoxesRow2.forEach(box => {
            box.addEventListener('dragover', dragOver);
            box.addEventListener('dragleave', dragLeave);
            box.addEventListener('drop', drop);
        });
        carousels.forEach(carousel => {
            carousel.addEventListener('dragover', dragOver);
            carousel.addEventListener('dragleave', dragLeave);
            carousel.addEventListener('drop', drop);
        });
    }

    // Disable drag-and-drop
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

        dropBoxesRow2.forEach(box => {
            box.removeEventListener('dragover', dragOver);
            box.removeEventListener('dragleave', dragLeave);
            box.removeEventListener('drop', drop);
        });

        carousels.forEach(carousel => {
            carousel.removeEventListener('dragover', dragOver);
            carousel.removeEventListener('dragleave', dragLeave);
            carousel.removeEventListener('drop', drop);
        });
    }

    // Reset the game
    function resetGame() {
        // Clear all cards back to a neutral state
        cards.forEach(card => {
            if (card.parentElement && card.parentElement !== carousel1 && card.parentElement !== carousel2) {
                card.parentElement.removeChild(card);
            }
        });

        // Split the cards equally between carousel1 and carousel2
        const half = Math.ceil(cards.length / 2);
        const firstHalf = cards.slice(0, half);
        const secondHalf = cards.slice(half);

        // Clear carousels first
        while (carousel1.firstChild) carousel1.removeChild(carousel1.firstChild);
        while (carousel2.firstChild) carousel2.removeChild(carousel2.firstChild);

        // Append first half to carousel1
        firstHalf.forEach(card => carousel1.appendChild(card));
        // Append second half to carousel2
        secondHalf.forEach(card => carousel2.appendChild(card));

        // Re-enable drag and drop
        enableDragAndDrop();
        assignGradientColors();
    }

    // Freeze the cards in place
    function freezeCards() {
        disableDragAndDrop();
    }

    function displayFinalSequence() {
        const finalSequenceContainer = document.getElementById('final-sequence');
        finalSequenceContainer.innerHTML = ''; // Clear previous content
    
        // Get all drop boxes in order (top row first, then bottom row)
        const allBoxes = [
            ...document.querySelectorAll('#boxes .drop-box'), // Top row (1-5)
            ...document.querySelectorAll('#boxes-row2 .drop-box') // Bottom row (6-10)
        ];
    
        // Create a grid container for the final sequence
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid-container'); // Optional: Add a class for styling
    
        // For each box, if there's a card, clone it and add it to the grid
        allBoxes.forEach(box => {
            const card = box.querySelector('.card');
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item'); // Optional: Add a class for styling
    
            if (card) {
                const cardClone = card.cloneNode(true);
                cardClone.setAttribute('draggable', 'false');
    
                // Remove event listeners from clone if any
                cardClone.removeEventListener('dragstart', dragStart);
                cardClone.removeEventListener('dragend', dragEnd);
    
                gridItem.appendChild(cardClone);
            } else {
                // If no card, add a placeholder
                const placeholder = document.createElement('div');
                placeholder.textContent = 'Empty';
                placeholder.style.textAlign = 'center';
                placeholder.style.color = '#ccc';
                gridItem.appendChild(placeholder);
            }
    
            finalSequenceContainer.appendChild(gridItem);
        });
    }

    // Reset button logic
    resetBtn.addEventListener('click', () => {
        resetGame();
    });

    // Done button logic
    doneBtn.addEventListener('click', () => {
        // Freeze the cards
        freezeCards();

        // Hide carousels
        carousel1.style.display = 'none';
        carousel2.style.display = 'none';

        // Show final sequence (actual card images)
        displayFinalSequence();

        // Show thank you message
        gameScreen.classList.remove('active');
        gameScreen.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
        gameOverScreen.classList.add('active');
    });

    // Restart button logic if you want to play again
    restartBtn.addEventListener('click', () => {
        // Show carousels again
        carousel1.style.display = '';
        carousel2.style.display = '';

        gameOverScreen.classList.remove('active');
        gameOverScreen.classList.add('hidden');
        confirmScreen.classList.remove('hidden');
        confirmScreen.classList.add('active');

        resetGame();
    });
});
