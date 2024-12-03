<!-- Include Font Awesome (Add this in your main layout or header.php if used globally) -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">

<div class="navigation-footer">
    <button onclick="goBack()" class="nav-btn">
        <i class="fas fa-arrow-left"></i> <!-- Back Icon -->
    </button>
    <button onclick="goHome()" class="nav-btn">
        <i class="fas fa-home"></i> <!-- Home Icon -->
    </button>
</div>

<script>
    function goBack() {
        window.history.back(); // Navigate to the previous page
    }

    function goHome() {
        window.location.href = 'home.php'; // Redirect to home.php
    }
</script>

<style>
    .navigation-footer {
        position: fixed; /* Fixed position at the bottom-left corner */
        bottom: 20px; /* Spacing from the bottom of the page */
        left: 20px; /* Spacing from the left of the page */
        z-index: 9999; /* Ensure it is on top of all elements */
        display: flex; /* Display buttons side by side */
        gap: 10px; /* Spacing between buttons */
        background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent background */
        padding: 10px;
        border-radius: 10px;
    }

    .nav-btn {
        background-color: #fff;
        color: #53442f;
        border: 2px solid #53442f;
        border-radius: 50%; /* Circular button */
        padding: 10px;
        width: 50px;
        height: 50px;
        font-size: 20px; /* Icon size */
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.3s ease;
    }

    .nav-btn:hover {
        background-color: #53442f;
        color: #fff;
        transform: scale(1.1);
    }

    .nav-btn i {
        font-size: 20px; /* Size of the Font Awesome icon */
    }
</style>
