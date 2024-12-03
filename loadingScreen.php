<?php

session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Loading Screen</title>
    <style>
        
        body {
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden; 
        }

        video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover; 
            z-index: -1; 
        }

       
        .start-button {
            position: absolute;
            bottom: 50px; 
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 40px; 
            font-size: 24px; 
            font-weight: bold;
            color: #fff; 
            background-color: #23df33; 
            border: none;
            border-radius: 10px; 
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        
        .start-button:hover {
            background-color: #1eb82b; 
           
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); 
            
        }
    </style>
</head>
<body>
    
    <video autoplay muted loop>
        <source src="images/loadingscreen.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>

    
    <button class="start-button" onclick="navigateToLogin()">START</button>

    <script>
        
        function navigateToLogin() {
            window.location.href = 'login.php';
        }
    </script>
</body>
</html>
