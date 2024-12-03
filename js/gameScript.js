document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const puzzleImage = document.getElementById('puzzle-image');
    const popupOverlay = document.getElementById('popup-overlay');
    const popupBox = document.getElementById('popup-box');
    const popupMessage = document.getElementById('popup-message'); // Title for popup
    const correctAnswerElement = document.getElementById('correct-answer'); // Correct answer placeholder
    const popupBtn = document.getElementById('popup-btn'); // Popup button
    const gameContainer = document.querySelector('.game-container');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('time');
    const buttons = document.querySelectorAll('.answer-btn');
    const levelElement = document.getElementById('level'); // Level display
    const muteIcon = document.getElementById('mute-icon'); // Mute/Unmute button

    // Settings and Info Popups
    const settingsIcon = document.getElementById('settings-icon');
    const infoIcon = document.getElementById('info-icon');
    const settingsPopupOverlay = document.getElementById('settings-popup-overlay');
    const infoPopupOverlay = document.getElementById('info-popup-overlay');
    const settingsPopupBox = document.getElementById('settings-popup-box');
    const infoPopupBox = document.getElementById('info-popup-box');
    const settingsCloseBtn = document.getElementById('settings-close-btn');
    const infoCloseBtn = document.getElementById('info-close-btn');

    // Game variables
    const proxyUrl = 'proxy.php';
    const updateScoreUrl = 'update_score.php';

    let score = 0;
    let correctAnswers = 0;
    let puzzlesCompleted = 0;

    const level = parseInt(levelElement.textContent);
    const puzzleLimits = [0, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26]; // Multiply each value by 2

    const totalPuzzles = puzzleLimits[level];
    const starThresholds = { 1: 50, 2: 80 }; // Average correctness thresholds for 2 and 3 stars
    let correctAnswer = null;

    let timer = null;
    let timeLeft = 30 - (level - 1) * 2; // Timer decreases by 2 seconds for each level
    let canAnswer = true;
    let isPaused = false; // Flag to check if the timer is paused
    let isMuted = false;


    // Audio
    const backgroundMusic = new Audio('audio/background_music.mp3'); // Path to your background music
    backgroundMusic.loop = true; // Enable looping
    backgroundMusic.play(); // Start playing music when the game loads

    // Initialize popups with the same background as login.png
const initializePopups = () => {
    const backgroundImage = "url('images/login.png') no-repeat center center";
    const backgroundSize = "cover";

    // Apply to Settings Popup
    settingsPopupBox.style.background = backgroundImage;
    settingsPopupBox.style.backgroundSize = backgroundSize;

    // Apply to Info Popup
    infoPopupBox.style.background = backgroundImage;
    infoPopupBox.style.backgroundSize = backgroundSize;

    // Dynamically set button background for settings and info popups
    const popupButtons = [settingsCloseBtn, infoCloseBtn]; // Include settings and info close buttons
    popupButtons.forEach(button => {
        button.style.backgroundImage = "url('images/button2.png')"; // Set button2.png as background
        button.style.backgroundSize = "contain"; // Ensure it fits within the button
        button.style.backgroundPosition = "center";
        button.style.backgroundRepeat = "no-repeat";
        button.style.width = "300px"; // Adjust width for visual consistency
        button.style.height = "150px"; // Adjust height for visual consistency
        button.style.border = "none"; // Remove any borders
        button.style.cursor = "pointer"; // Show pointer cursor
        button.style.outline = "none"; // Remove outline when focused
        button.style.marginTop = "20px"; // Add spacing between the button and other elements
    });
     // Ensure popups are hidden on load
     settingsPopupOverlay.style.display = "none";
     infoPopupOverlay.style.display = "none";
};


muteIcon.addEventListener('click', () => {
    if (isMuted) {
        backgroundMusic.play();
        muteIcon.src = 'images/mute_icon.png'; // Switch to unmute icon
    } else {
        backgroundMusic.pause();
        muteIcon.src = 'images/unmute_icon.png'; // Switch to mute icon
    }
    // Ensure size consistency
    muteIcon.style.width = "90px"; 
    muteIcon.style.height = "90px";
    isMuted = !isMuted; // Toggle mute state
});


    // Close all popups
    const closeAllPopups = () => {
        popupOverlay.style.display = 'none';
        settingsPopupOverlay.style.display = 'none';
        infoPopupOverlay.style.display = 'none';
    };

    // Pause the timer
    const pauseTimer = () => {
        if (!isPaused) {
            clearInterval(timer);
            isPaused = true;
        }
    };

    // Resume the timer
    const resumeTimer = () => {
        if (isPaused) {
            startTimer();
            isPaused = false;
        }
    };
    const finishLevel = async () => {
        // Calculate the average correctness
        const averageCorrectness = (correctAnswers / totalPuzzles) * 100 * 2;
        let stars = 1;
        if (averageCorrectness >= starThresholds[2]) stars = 3;
        else if (averageCorrectness >= starThresholds[1]) stars = 2;
    
        try {
            const response = await fetch(updateScoreUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUserId, // Replace this with the actual user ID
                    level,
                    stars,
                    score,
                    average_correctness: averageCorrectness.toFixed(2),
                }),
            });
            showFinalPopup(stars);
            const result = await response.json();
    
            if (result.success) {
                console.log("Data saved successfully. Displaying final popup...");
                showFinalPopup(stars); // Pass the stars to the final popup
            } else {
                console.error("Failed to save data:", result.error);
                alert("An error occurred while saving your progress. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            
        }
    };
    
   // Function to show the final popup
const showFinalPopup = (stars) => {
    closeAllPopups(); // Ensure all other popups are closed

    // Set popup background
    popupBox.style.background = "url('images/login.png') no-repeat center center";
    popupBox.style.backgroundSize = "cover";

    // Set the popup header
    popupMessage.innerHTML = `<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 90px;">Level Complete!</h1>`;

    // Add the score as a paragraph
    const scoreParagraph = document.createElement('p');
    scoreParagraph.textContent = `Score: ${score}`;
    scoreParagraph.style.fontSize = '20px';
    scoreParagraph.style.marginBottom = '20px';
    scoreParagraph.style.textAlign = 'center';
    popupMessage.appendChild(scoreParagraph);

    // Add stars dynamically as images
    const starsContainer = document.createElement('div');
    starsContainer.style.display = 'flex';
    starsContainer.style.justifyContent = 'center';
    starsContainer.style.gap = '10px';
    starsContainer.style.marginBottom = '20px';

    for (let i = 0; i < stars; i++) {
        const starImage = document.createElement('img');
        starImage.src = 'images/star.png'; // Path to your star image
        starImage.alt = 'Star';
        starImage.style.width = '50px'; // Adjust size as needed
        starImage.style.height = '50px';
        starsContainer.appendChild(starImage);
    }
    const bunnyContainer = document.createElement('div');
    bunnyContainer.style.display = 'flex';
    bunnyContainer.style.justifyContent = 'center';
    bunnyContainer.style.marginBottom = '20px';

    for (let i = 0; i < stars; i++) {
        const bunnyImage = document.createElement('img');
        bunnyImage.src = 'images/rabbit.png'; // Path to your star image
        bunnyImage.alt = 'Star';
        bunnyImage.style.width = '100px'; // Adjust size as needed
        bunnyImage.style.height = '100px';
        bunnyContainer.appendChild(bunnyImage);
    }
    popupMessage.appendChild(starsContainer);

    // Update the button text and functionality
    popupBtn.textContent = "Home";
    popupBtn.style.backgroundImage = "url('images/button2.png')";
    popupBtn.style.backgroundSize = "contain";
    popupBtn.style.backgroundPosition = "center";
    popupBtn.style.backgroundRepeat = "no-repeat";
    popupBtn.style.width = "300px";
    popupBtn.style.height = "150px";

    popupBtn.onclick = () => {
        window.location.href = 'home.php'; // Redirect to home when the button is clicked
    };

    popupOverlay.style.display = 'flex'; // Show the popup
    gameContainer.classList.add('blur'); // Blur the game container
};

    
    
    
    const loadPuzzle = async () => {
        try {
            closeAllPopups();
            gameContainer.classList.remove('blur');
    
             // Set the background for the entire website based on the level
        const backgrounds = {
            1: 'images/back1.jpg',
            2: 'images/back2.jpg',
            3: 'images/back3.jpg',
            4: 'images/back4.jpg',
            5: 'images/back5.jpg',
            6: 'images/back1.jpg',
            7: 'images/back2.jpg',
            8: 'images/back3.jpg',
            9: 'images/back4.jpg',
            10: 'images/back5.jpg'
        };

        if (backgrounds[level]) {
            document.body.style.backgroundImage = `url('${backgrounds[level]}')`;
            document.body.style.backgroundSize = 'cover'; // Cover the full viewport
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.height = '100%'; // Ensure it applies to the full height
            document.body.style.margin = '0'; // Remove any extra margin
            document.body.style.padding = '0';
            document.body.style.overflowX = 'hidden'; // Prevent horizontal scrolling
        }
            const response = await fetch(`${proxyUrl}?action=fetch`);
            const data = await response.json();
    
            if (data.question && data.solution) {
                puzzleImage.src = `data:image/png;base64,${data.question}`;
                correctAnswer = atob(data.solution); // Decode the solution
                resetTimer();
                canAnswer = true;
    
                attachButtonListeners(); // Ensure buttons are set up correctly
            } else {
                throw new Error('Invalid puzzle data');
            }
        } catch (error) {
            console.error('Error loading puzzle:', error);
        }
    };

    // Show popup with background, correct answer, and button image
    const showPopup = (message, isCorrect) => {
        closeAllPopups(); // Close other popups before showing this one

        // Set popup background
        popupBox.style.background = "url('images/login.png') no-repeat center center";
        popupBox.style.backgroundSize = "cover"; // Ensure background fills the popup

        // Set the popup message content
        popupMessage.textContent = message;

        // Update the correct answer text
        correctAnswerElement.textContent = `Correct Answer: ${correctAnswer}`;
        if (isCorrect) correctAnswers++;
        puzzlesCompleted++;
        // Change button background image dynamically
        if (isCorrect) {
            popupBtn.style.backgroundImage = "url('images/button2.png')"; // Path to correct button image
        } else {
            popupBtn.style.backgroundImage = "url('images/button2.png')"; // Path to incorrect button image
        }

        // Set button styles for proper image alignment and size
        popupBtn.style.backgroundSize = "contain"; // Ensure image fits within the button
        popupBtn.style.backgroundPosition = "center";
        popupBtn.style.backgroundRepeat = "no-repeat";
        popupBtn.style.width = "300px"; // Button width
        popupBtn.style.height = "150px"; // Button height

        popupOverlay.style.display = 'flex'; // Show the popup
        gameContainer.classList.add('blur'); // Blur the game container
    };

    // Close popup and proceed to the next level
    const closePopup = () => {
        popupOverlay.style.display = 'none'; // Hide the popup
        gameContainer.classList.remove('blur'); // Remove blur effect
        
        loadPuzzle(); // Load the next puzzle
    };

   // Check answer function with debugging
const checkAnswer = (answer) => {
    console.log('checkAnswer called');
    if (!canAnswer) {
        console.log('Already answered, skipping duplicate call');
        return;
    }

    canAnswer = false;

    if (answer === correctAnswer) {
        score += 10;
        scoreElement.textContent = score;
        showPopup('Correct!', true);
    } else {
        showPopup('Incorrect!', false);
    }

    puzzlesCompleted++;

    console.log(`Level: ${level}, Total Puzzles: ${totalPuzzles}, Puzzles Completed: ${puzzlesCompleted}`);

    // Check if the level is completed
    if (puzzlesCompleted >= totalPuzzles) {
        popupBtn.addEventListener('click', () => {
            closeAllPopups();
            finishLevel();
        }, { once: true }); // Add listener to close popup and finish level
    } else {
        popupBtn.addEventListener('click', () => {
            closeAllPopups();
            loadPuzzle();
        }, { once: true }); // Add listener to close popup and load next puzzle
    }
};
const attachButtonListeners = () => {
    buttons.forEach(button => {
        button.replaceWith(button.cloneNode(true)); // Clear existing listeners
    });

    const newButtons = document.querySelectorAll('.answer-btn');
    newButtons.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.getAttribute('data-value');
            checkAnswer(answer);
        });
    });
};

    // Timer functions
    const startTimer = () => {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timerElement.textContent = timeLeft;
            } else {
                clearInterval(timer);
                showPopup('Time is Up!', false); // Show "Time is Up!" popup
                canAnswer = false;
                if (puzzlesCompleted >= totalPuzzles) {
                    finishLevel();
                }
            }
        }, 1000);
    };

    const resetTimer = () => {
        clearInterval(timer);
        timeLeft = 30 - (level - 1) * 2;
        timerElement.textContent = timeLeft;
        startTimer();
    };

    // Open settings popup
    settingsIcon.addEventListener('click', () => {
        closeAllPopups(); // Close other popups
        pauseTimer(); // Pause the timer
        settingsPopupOverlay.style.display = 'flex';
    });

    // Close settings popup
    settingsCloseBtn.addEventListener('click', () => {
        settingsPopupOverlay.style.display = 'none';
        resumeTimer(); // Resume the timer
    });

    // Open info popup
    infoIcon.addEventListener('click', () => {
        closeAllPopups(); // Close other popups
        pauseTimer(); // Pause the timer
        infoPopupOverlay.style.display = 'flex'; // Show info popup
    });

    // Close info popup
    infoCloseBtn.addEventListener('click', () => {
        infoPopupOverlay.style.display = 'none'; // Hide info popup
        resumeTimer(); // Resume the timer
    });

    // Close popups when clicking outside the popup box
    settingsPopupOverlay.addEventListener('click', (e) => {
        if (e.target === settingsPopupOverlay) {
            settingsPopupOverlay.style.display = 'none';
            resumeTimer(); // Resume the timer
        }
    });

    infoPopupOverlay.addEventListener('click', (e) => {
        if (e.target === infoPopupOverlay) {
            infoPopupOverlay.style.display = 'none';
            resumeTimer(); // Resume the timer
        }
    });

    // Event listeners for answer buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.getAttribute('data-value');
            checkAnswer(answer);
        });
    });

    // Event listener for popup button
    popupBtn.addEventListener('click', closePopup);

    // Initialize and load the game
    initializePopups();
    loadPuzzle();
});
