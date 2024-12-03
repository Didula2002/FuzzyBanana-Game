document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');

    // Set map image as the background dynamically
    const mapImagePath = 'images/map.png'; // Replace with the actual path
    const mapHeight = 8750; // Actual height of the image
    const mapWidth = 1400; // Actual width of the image

    // Dynamically set background and container dimensions
    gameContainer.style.backgroundImage = `url('${mapImagePath}')`;
    gameContainer.style.backgroundSize = 'cover'; // Cover full width
    gameContainer.style.backgroundRepeat = 'no-repeat';
    gameContainer.style.backgroundPosition = 'top center';
    gameContainer.style.height = `${mapHeight}px`; // Match container height to image height

    // Ensure the body height allows scrolling
    document.body.style.height = `${mapHeight}px`;
    document.body.style.overflowY = 'scroll';

    // Level button positions (adjust for your map layout)
    const levelPositions = [
        { top: 1030, left: '38%' },   // Level 1 
        { top: 1280, left: '57%' },  // Level 2
        { top: 1630, left: '46%' },  // Level 3
        { top: 2030, left: '46%' },  // Level 4
        { top: 2270, left: '68%' },  // Level 5
        { top: 2670, left: '57%' },   // Level 6 
        { top: 3070, left: '72%' },  // Level 7
        { top: 3470, left: '55%' },  // Level 8
        { top: 3870, left: '44%' },  // Level 9
        { top: 4270, left: '30%' },  // Level 10
    ];

    // Select level buttons and wrappers
    const levelButtonWrappers = document.querySelectorAll('.level-button-wrapper');

    levelButtonWrappers.forEach((wrapper, index) => {
        const position = levelPositions[index];

        // Position the wrapper for each level
        wrapper.style.position = 'absolute';
        wrapper.style.top = `${position.top}px`;
        wrapper.style.left = position.left;
        wrapper.style.transform = 'translateX(-50%)'; // Center align the wrapper

        // Select the button inside the wrapper
        const button = wrapper.querySelector('.level-btn');
        if (button) {
            // Dynamically set the button image using JS
            const buttonImagePath = 'images/levelbutton.png'; // Replace with the actual button image path
            button.style.backgroundImage = `url('${buttonImagePath}')`;
            button.style.backgroundSize = 'cover'; // Scale the image properly
            button.style.backgroundPosition = 'center';
            button.style.width = '150px'; // Ensure button dimensions match the image
            button.style.height = '150px';
            button.style.borderRadius = '50%'; // Keep the circular shape
            button.style.border = 'none'; // Remove any borders
            button.style.cursor = 'pointer'; // Set the pointer on hover
            button.style.transition = 'transform 0.3s ease'; // Add hover animation
            button.style.fontSize = '50px'; // Bigger font size for the text
            button.style.color = '#53442f'; // Set the font color
            button.style.fontWeight = 'bold'; // Make the text bold
            button.style.display = 'flex'; // Ensure text is centered
            button.style.justifyContent = 'center';
            button.style.alignItems = 'center';
            button.style.lineHeight = '0.9'; // Adjust text position upwards
            button.style.paddingBottom = '35px'; // Fine-tune text placement upwards
        }

        // Position stars above the button
        const starsContainer = wrapper.querySelector('.stars');
        if (starsContainer) {
            starsContainer.style.position = 'absolute';
            starsContainer.style.top = '-70px'; // Stars above the button
            starsContainer.style.left = '50%';
            starsContainer.style.transform = 'translateX(-50%)';
            starsContainer.style.display = 'flex'; // Ensure the stars are visible
            starsContainer.style.gap = '7px'; // Add spacing between stars
        }

        // Add click event listener for redirecting to game.php
        button.addEventListener('click', () => {
            const level = button.getAttribute('data-level');
            window.location.href = `game.php?level=${level}`;
        });
    });
});