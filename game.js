// game.js

let timer; 
let timeLeft = 90; // 90 seconds for the game
let gameOver = false;
let flickerInterval;
let scrollPosition = 0; // Track the current scroll position
const itemsToShow = 5; // Number of items to show in the view

// Start the timer when the page loads
window.onload = function() {
    startTimer();
    loadHistory(); // Load game history when the page loads
};

// Function to start the 90-second timer
function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame(); // End game if time is up
        } else {
            document.getElementById('timerDisplay').innerText = `Time left: ${timeLeft} seconds`;
            timeLeft--;
        }
    }, 1000);
}

// Function to make a choice (Dragon or Tiger)
function makeChoice(userChoice) {
    if (gameOver) return; // Prevent further input if the game is over

    clearInterval(timer); // Stop the timer once the user makes a choice
    gameOver = true; // Mark the game as over

    // Start flickering effect between Dragon and Tiger images
    startFlickerEffect();

    // Show the final result after 5 seconds
    setTimeout(() => {
        clearInterval(flickerInterval); // Stop flickering
        displayFinalResult(userChoice);
    }, 5000);
}

// Function to start flickering images between Dragon and Tiger
function startFlickerEffect() {
    const resultImage = document.getElementById('resultImage');
    const flickerChoices = ['dragon.jpg', 'tiger.jpg'];
    let index = 0;

    resultImage.style.display = 'block'; // Show the image
    flickerInterval = setInterval(() => {
        resultImage.src = flickerChoices[index];
        index = (index + 1) % flickerChoices.length; // Alternate between images
    }, 200); // Change image every 200 milliseconds for flickering effect
}

// Function to display the final game result
function displayFinalResult(userChoice) {
    const choices = ['Dragon', 'Tiger'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    const gameResult = choices[randomIndex];
    const resultImage = document.getElementById('resultImage');
    const resultDisplay = document.getElementById('resultDisplay');

    // Set the final image based on the result
    resultImage.src = gameResult === 'Dragon' ? 'dragon.jpg' : 'tiger.jpg';

    // Display the result text
    if (userChoice === gameResult) {
        resultDisplay.innerText = `Result: ${gameResult} - You Win!`;
        resultDisplay.style.color = 'green';
    } else {
        resultDisplay.innerText = `Result: ${gameResult} - You Lose!`;
        resultDisplay.style.color = 'red';
    }

    // Store the result in localStorage and update the history
    storeResult(gameResult);
}

// Function to handle game end due to timeout
function endGame() {
    gameOver = true;
    document.getElementById('resultDisplay').innerText = 'Time is up! No more choices allowed.';
    document.getElementById('resultDisplay').style.color = 'red';
}

// Function to store the game result in localStorage
function storeResult(result) {
    let history = JSON.parse(localStorage.getItem('gameHistory')) || [];
    history.push(result); // Add the latest result

    // Keep only the last 5 results
    if (history.length > 5) {
        history.shift(); // Remove the oldest result if there are more than 5
    }

    localStorage.setItem('gameHistory', JSON.stringify(history));
    updateHistoryDisplay(history);
}

// Function to load and display game history
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('gameHistory')) || [];
    updateHistoryDisplay(history);
}

// Function to update the game history display
function updateHistoryDisplay(history) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = ''; // Clear current history display

    history.forEach((result) => {
        const img = document.createElement('img');
        img.src = result === 'Dragon' ? 'dragon.jpg' : 'tiger.jpg';
        img.alt = result;
        img.classList.add('history-item');
        historyList.appendChild(img);
    });

    // Reset scroll position after updating history
    scrollPosition = 0;
    updateScrollPosition();
}

// Function to handle scrolling of history
function scrollHistory(direction) {
    const itemWidth = 65; // Width of a history item (adjust if needed)
    const totalItems = document.querySelectorAll('.history-item').length;
    const visibleItems = Math.floor(document.querySelector('.history-list-wrapper').clientWidth / itemWidth);
    const maxScroll = totalItems - visibleItems;

    scrollPosition += direction;

    if (scrollPosition < 0) {
        scrollPosition = 0;
    } else if (scrollPosition > maxScroll) {
        scrollPosition = maxScroll;
    }

    updateScrollPosition();
}

// Function to update the scroll position
function updateScrollPosition() {
    const historyListContainer = document.querySelector('.history-list-container');
    const itemWidth = 65; // Adjust width to match image size + margin
    historyListContainer.style.transform = `translateX(-${scrollPosition * itemWidth}px)`;
}
