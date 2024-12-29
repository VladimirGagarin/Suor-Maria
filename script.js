document.addEventListener('DOMContentLoaded', function () {
    const hailMaryPrayerText = document.querySelector('.hail-mary-prayer');
    const PlayXmasvidBtn = document.querySelectorAll('.top-header-controls button')[0];
    const loveBtn = document.querySelectorAll('.top-header-controls button')[1];
    const timerElement = document.querySelector('.count-down-timer #timer');
    let currentLanguage = null;
    let prayerInterval;
    let quoteInterval;
    let cotInterval;
    let currentQuoteIndex = 0;
    let currentCottolengoQuoteindex = 0;
    let currentWish = null;
    let currentWishLanguge = null;
    let currentUser = localStorage.getItem('username') || null; // Set to null if not found
    let countdownInterval;
    let countdownYear;
    let currentNewYearWish =  null;
    let isPlayingHbd = false;
    let currentHbd = null;

    PlayXmasvidBtn.disabled = true;
    const hbdDiv = document.querySelector('.control-heartfelt');
    const enHbd = new Audio(hbdDiv.getAttribute('data-en-hbd'));
    const itHbd = new Audio(hbdDiv.getAttribute('data-it-hbd'));

    const hailMaryPrayer = [
        { text: "Hail Mary, full of grace, the Lord is with you", italian: "Ave Maria, piena di grazia, il Signore è con te" },
        { text: "Blessed are you among women, and blessed is the fruit of your womb, Jesus.", italian: "Benedetta sei tu fra le donne, e benedetto è il frutto del tuo seno, Gesù." },
        { text: "Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.", italian: "Santa Maria, Madre di Dio, prega per noi peccatori, adesso e nell'ora della nostra morte. Amen." }
    ];

    const quotes = [
        {
            quoteText: [
                {engQ: "Life is a sacred gift, to be cherished and honored in the light of divine grace."},
                {itQ: "La vita è un dono sacro, da custodire e onorare alla luce della grazia divina."}
            ],
            quoteAuthor: [
                {engQA: "Sr. Mary Japheth"},
                {itQA: "Suor Maria Japheth"}
            ],
            quoteImg: "quote7.jpg"
        },
        {
            quoteText: [
                {engQ: "Prayer is the soul's ascent to commune with the Creator, a bridge to the divine."},
                {itQ: "La preghiera è l'ascesa dell'anima per comunicare con il Creatore, un ponte verso il divino."}
            ],
            quoteAuthor: [
                {engQA: "Sr. Mary Japheth"},
                {itQA: "Suor Maria Japheth"}
            ],
            quoteImg: "quote1.jpg"
        },
        {
            quoteText: [
                { engQ: "Kindness is the language of the soul, a reflection of God's love." },
                { itQ: "La gentilezza è il linguaggio dell'anima, un riflesso dell'amore di Dio." }
            ],
            quoteAuthor: [
                {engQA: "Sr. Mary Japheth"},
                {itQA: "Suor Maria Japheth"}
            ],
            quoteImg: "quote2.jpg"
        },
        {
            quoteText: [
                {engQ: "Love, in its purest form, is an echo of God's unconditional embrace for all humanity."},
                {itQ: "L'amore, nella sua forma più pura, è un'eco dell'abbraccio incondizionato di Dio per tutta l'umanità."}
            ],
            quoteAuthor: [
                {engQA: "Sr. Mary Japheth"},
                {itQA: "Suor Maria Japheth"}
            ],
            quoteImg: "quote3.jpg"
        },
        {
            quoteText: [
                {engQ: "Charity is the hand extended by the heart of faith, sharing the blessings bestowed by the Creator."},
                {itQ: "La carità è la mano tesa dal cuore della fede, che condivide le benedizioni donate dal Creatore."}
            ],
            quoteAuthor: [
                {engQA: "Sr. Mary Japheth"},
                {itQA: "Suor Maria Japheth"}
            ],
            quoteImg: "quote4.jpg"
        },
        {
            quoteText: [
                { engQ: "Life is a divine journey, every step is guided by God's grace." },
                { itQ: "La vita è un viaggio divino, ogni passo è guidato dalla grazia di Dio." }
            ],
            quoteAuthor: [
                { engQA: "Sr. Mary Japheth" }, { itQA: "Suor Maria Japheth" }
            ],
            quoteImg: "quote5.jpg"
        },
        {
            quoteText: [
                { engQ: "Love in its truest form is sacrificial and boundless, just as Christ loved us." },
                { itQ: "L'amore nella sua forma più pura è sacrificiale e senza limiti, proprio come Cristo ci ha amato." }
            ],
            quoteAuthor: [
                { engQA: "Sr. Mary Japheth" }, { itQA: "Suor Maria Japheth" }
            ],
            quoteImg: "quote6.jpg"
        }
    ];

    const cottolengoQuotes = [
        {engCQ: "To serve the poor and the suffering is to serve God himself.", itCQ: "Servire i poveri e i sofferenti è servire Dio stesso.", Author: [{engAuthor:"St. Joseph Cottolengo"}, {itAuthour:"San Giuseppe Cottolengo"}]},
        {engCQ: "In every act of charity, we encounter Christ.", itCQ: "In ogni atto di carità, incontriamo Cristo.", Author: [{engAuthor:"St. Joseph Cottolengo"}, {itAuthour:"San Giuseppe Cottolengo"}]},
        {engCQ: "Let us be the hands and heart of God to those who suffer.", itCQ: "Siamo le mani e il cuore di Dio per coloro che soffrono.", Author: [{engAuthor:"St. Joseph Cottolengo"}, {itAuthour:"San Giuseppe Cottolengo"}]},
        {engCQ: "True charity is a reflection of God's love.", itCQ: "La vera carità è un riflesso dell'amore di Dio.", Author: [{engAuthor:"St. Joseph Cottolengo"}, {itAuthour:"San Giuseppe Cottolengo"}]},
        {engCQ: "We are all called to serve with love, without measure, without reserve.", itCQ: "Siamo tutti chiamati a servire con amore, senza misura, senza riserva.", Author: [{engAuthor:"St. Joseph Cottolengo"}, {itAuthour:"San Giuseppe Cottolengo"}]},
        {engCQ: "The love of Christ compels us to do the will of God.", itCQ: "L'amore di Cristo ci spinge a fare la volontà di Dio.", Author: [{engAuthor:"St. Joseph Cottolengo"}, {itAuthour:"San Giuseppe Cottolengo"}]},
    ];
    

    function createSnowflakes() {

        const existingSnowflakes = document.querySelectorAll('.snowflake');
        existingSnowflakes.forEach((snowflake) => snowflake.remove());

        // Generate a random number of snowflakes
        for (let i = 0; i < 30; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
    
            // Randomize size and position
            const size = Math.random() * 8 + 8; // Between 2px and 10px
            snowflake.style.width = `${size}px`;
            snowflake.style.height = `${size}px`;
            snowflake.style.left = `${Math.random() * 100}vw`; // Random horizontal position
            snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`; // Between 2s and 5s
            snowflake.style.animationDelay = `${Math.random() * 5}s`; // Stagger start time
    
            // Append to the body
            document.body.appendChild(snowflake);
    
            // Remove the snowflake after its animation
            snowflake.addEventListener('animationend', () => {
                snowflake.remove();
            });
        }
    }
    
    // Call the function periodically to keep the snowfall going
    setInterval(createSnowflakes, 28000);

    createSnowflakes(); // Initial snowflakes


     function shownotification(messsage) {
        const  div = document.querySelector('.notification-div');
        div.innerHTML = `<h3>${messsage}</h3>`;

        div.classList.add('in');

        setTimeout(function () {
            div.classList.remove('in');
        },4000);
    }

    function showCurrentLangugueStatus() {
        const browserLang = navigator.language.split("-")[0];
        const languageLabel = document.getElementById('language-label');

        if(browserLang === "it") {
            document.querySelector('.switch').classList.add('toggled');
            languageLabel.textContent = 'IT'; // Change text to Italian
            languageLabel.classList.add('active');
            translatePage('italian');
            currentLanguage = "italian";
        }
        else{
            document.querySelector('.switch').classList.remove('toggled');
            languageLabel.textContent = 'EN'; // Change text to Italian
            languageLabel.classList.remove('active');
            translatePage('english');
            currentLanguage = "english";
        }
    }

    showCurrentLangugueStatus();

     PlayXmasvidBtn.onclick  = function () {
        displayExmasvideo();
    }

    loveBtn.onclick = function () {
        displayLovemessage();
    }

    

    let currentLinePrayerIndex = 0; // This should be declared outside the function

    function displayPrayer() {
        if (currentLinePrayerIndex < hailMaryPrayer.length) {
            const currentLinePrayer = hailMaryPrayer[currentLinePrayerIndex];

             // Display the prayer text based on the current language
             if (currentLanguage === 'italian') {
                hailMaryPrayerText.innerHTML = `<h3>${currentLinePrayer.italian}</h3>`;
            } else {
                hailMaryPrayerText.innerHTML = `<h3>${currentLinePrayer.text}</h3>`;
            }

            currentLinePrayerIndex++; // Increment the index after displaying the text
        }

        // If the prayer is over, start over again
        if (currentLinePrayerIndex >= hailMaryPrayer.length) {
            currentLinePrayerIndex = 0;
        }
    }

    // Display the prayer and repeat every 5 seconds
    prayerInterval = setInterval(displayPrayer, 5000);

    // Start by displaying the first line
    displayPrayer();

    checkToday();
    
    function checkToday() {
        const today = new Date();
        const date = today.getDate();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const currentDay = today.getDate();
        
        // Check if hbdDiv exists
        if (!hbdDiv) return;
    
        const playbtn = hbdDiv.querySelector('button');
    
        // Check if playbtn exists
        if (!playbtn) return;      
    
        if (currentMonth >= 11 && date >= 27) {
            hbdDiv.style.display = "none";
            PlayXmasvidBtn.disabled = true;
        }

        

        if (currentMonth >= 0 && currentDay >= 1 && currentYear === 2025) {
            PlayXmasvidBtn.disabled = false;
        }
    
        playbtn.onclick = function () {
            currentHbd = (currentLanguage === 'italian') ? itHbd : enHbd;
            isPlayingHbd = !isPlayingHbd;
    
            if (isPlayingHbd) {
                currentHbd.play();
                playbtn.textContent = (currentLanguage === "italian") ? "Pausa" : "Pause";
            } else {
                currentHbd.pause();
                playbtn.textContent = (currentLanguage === "italian") ? "Gioca" : "Play"; // Corrected from "Gioci"
            }

            currentHbd.onended = function () {
                isPlayingHbd = false;
                playbtn.textContent = (currentLanguage === "italian") ? "Gioca" : "Play";
            }
        }
    }
    

    function updateCountdown() {
        // Set the target date for Christmas (midnight of December 25, 2024, UTC)
        const targetDate = new Date(Date.UTC(2024, 11, 25, 0, 0, 0)); // December is month 11 (0-indexed)
        
        const now = new Date();
        const timeRemaining = targetDate.getTime() - now.getTime(); // Time remaining in milliseconds
    
        if (timeRemaining <= 0) {
            timerElement.textContent = (currentLanguage === "italian") ? 
            "Buon Natale!!" : 
            "Merry Christmas!! Feliz Navidad";

            clearInterval(countdownInterval); // Stop the countdown
            displayExmasvideo();
            PlayXmasvidBtn.disabled = false;
            return;
        }
    
        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
         // Language-specific text
        const daysText = (currentLanguage === "italian") ? "Giorni" : "Days";
        const hoursText = (currentLanguage === "italian") ? "Ore" : "Hours";
        const minutesText = (currentLanguage === "italian") ? "Minuti" : "Minutes";
        const secondsText = (currentLanguage === "italian") ? "Secondi" : "Seconds";

        // Update the timer element with language logic
        timerElement.textContent = `${days} ${daysText} : ${formatTime(hours)} ${hoursText} : ${formatTime(minutes)} ${minutesText} : ${formatTime(seconds)} ${secondsText}`;
        

        const today = new Date();
        const date = today.getDate();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        if (currentMonth >= 11 && date >= 27 && currentYear === 2025) {
            hbdDiv.style.display = "none";
            PlayXmasvidBtn.disabled = true;
        }
    }
    

    // Function to format numbers (e.g., 5 -> 05)
    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }

    // Initial countdown update
    updateCountdown();

    // Update countdown every second
    countdownInterval = setInterval(updateCountdown, 1000);

    document.querySelector('.switch').addEventListener('click', function () {
        const switchElement = this;
        const languageLabel = document.getElementById('language-label');
        
        
        // Toggle the switch and update the label text
        switchElement.classList.toggle('toggled');
        clearInterval(prayerInterval); // Clear current prayer interval
        currentLinePrayerIndex = 0; // Reset prayer index to restart from the first line

        clearInterval(quoteInterval);
        currentQuoteIndex = 0;

        clearInterval(cotInterval);
        currentCottolengoQuoteindex = 0;

        if(currentWish && !currentWish.paused) {
            currentWish.pause();
            currentWish.currentTime = 0;
            document.querySelector('.user-card-wish button').innerHTML = '&#9654;';
            const userCardWish = document.querySelector('.user-card-wish');
            userCardWish.classList.remove('glowing');
        }

        if(currentNewYearWish && !currentNewYearWish.paused) {
            currentNewYearWish.pause();
            currentNewYearWish.currentTime = 0;
            document.querySelector('.hidden-message .center-message button').innerHTML = '&#9654;';
        }

        if(currentHbd && !currentHbd.paused) {
            currentHbd.pause();
            currentHbd.currentTime = 0;
            document.querySelector('.control-heartfelt button').textContent = (currentLanguage === "italian") ? "Gioca" : "Play";
            isPlayingHbd = false;
        }

       
        
        if (switchElement.classList.contains('toggled')) {
            languageLabel.textContent = 'IT'; // Change text to Italian
            languageLabel.classList.add('active'); // Optional: Add a color change when toggled
             // Translate all elements with data-translate-italian
            translatePage('italian');
            currentLanguage = "italian";
        } else {
            languageLabel.textContent = 'EN'; // Change text to English
            languageLabel.classList.remove('active');
             // Translate all elements with data-translate-english
            translatePage('english');
            currentLanguage = "english";
        }

        // Restart the prayer with the new language setting
        prayerInterval = setInterval(displayPrayer, 5000);
        displayPrayer();
         
        quoteInterval = setInterval( displayQuote,20000);
        displayQuote();

        cotInterval = setInterval(displaySecondQuote,20000);
        displaySecondQuote();
    });

    function translatePage(language) {
        const elements = document.querySelectorAll('[data-translate-english], [data-translate-italian]');
    
        elements.forEach(element => {
            if (language === 'italian') {
                element.textContent = element.getAttribute('data-translate-italian');
            } else {
                element.textContent = element.getAttribute('data-translate-english');
            }
        });
    }

    function displayQuote() {
        const quoteArea1  = document.querySelectorAll('main .hero-quotes .quote-area')[0];
        const quoteContent = quoteArea1.querySelector('.right-side p.quote-content');
        const authorContent = quoteArea1.querySelector('.right-side p.quote-author');
        const copyBtn = quoteArea1.querySelector('button')
    
        const currentQuote = quotes[currentQuoteIndex];

        quoteArea1.style.backgroundImage = `url('${currentQuote.quoteImg}')`;
        // Access the quote and author text based on the selected language
        quoteContent.textContent = (currentLanguage === "italian") ? currentQuote.quoteText[1].itQ : currentQuote.quoteText[0].engQ;
        authorContent.textContent = (currentLanguage === "italian") ? currentQuote.quoteAuthor[1].itQA : currentQuote.quoteAuthor[0].engQA;

        copyBtn.onclick = function () {
            const quoteToCopy = (currentLanguage === "italian") 
                ? currentQuote.quoteText[1].itQ + " - " + currentQuote.quoteAuthor[1].itQA 
                : currentQuote.quoteText[0].engQ + " - " + currentQuote.quoteAuthor[0].engQA;
    
            navigator.clipboard.writeText(quoteToCopy).then(() => {
                shownotification(currentLanguage === "italian" ? "Citazione copiata" : "Quote copied");
            }).catch(err => {
                shownotification(currentLanguage === "italian" ? "Copia non riuscita" : "Failed to copy");
            });

        };


        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    
    }

    quoteInterval = setInterval( displayQuote,20000);
    displayQuote();

    function displaySecondQuote () {
        const quoteArea2  = document.querySelectorAll('main .hero-quotes .quote-area')[1];
        const quoteContent = quoteArea2.querySelector('.right-side p.quote-content');
        const authorContent = quoteArea2.querySelector('.right-side p.quote-author');
        const copyBtn = quoteArea2.querySelector('button');

        const currentCottolengoQuote = cottolengoQuotes[currentCottolengoQuoteindex];
        quoteArea2.style.backgroundImage = 'url("coto2.jpg")';

        quoteContent.textContent = (currentLanguage === "italian") ? currentCottolengoQuote.itCQ : currentCottolengoQuote.engCQ;
        authorContent.textContent = (currentLanguage === "italian") ? currentCottolengoQuote.Author[1].itAuthour : currentCottolengoQuote.Author[0].engAuthor;

        copyBtn.onclick = function () {
            const quoteToCopy = (currentLanguage === "italian") 
                ? currentCottolengoQuote.itCQ + " - " + currentCottolengoQuote.Author[1].itAuthour
                : currentCottolengoQuote.engCQ + " - " + currentCottolengoQuote.Author[0].engAuthor

            navigator.clipboard.writeText(quoteToCopy).then(() => {
                shownotification(currentLanguage === "italian" ? "Citazione copiata" : "Quote copied");
            }).catch(err => {
                shownotification(currentLanguage === "italian" ? "Copia non riuscita" : "Failed to copy");
            });
        }

        currentCottolengoQuoteindex = (currentCottolengoQuoteindex + 1) % cottolengoQuotes.length;
    }

    cotInterval = setInterval(displaySecondQuote,20000);
    displaySecondQuote();


    function displayLovemessage () {
        const overlay = document.querySelector('.love-div-overlay');
        const closeOverlay = document.querySelector('.love-close');
        const loveContent = document.querySelector('.love-content');
        const nameUser = document.querySelector('.love-content #userToggled');
        const enlove = new Audio(document.querySelector('.love-content').getAttribute('data-enlove'));
        const itlove = new Audio(document.querySelector('.love-content').getAttribute('data-itlove'));
        const playLoveMsg = document.querySelector('.love-content .listen-button button');

        let currentLoveMsg = null;
        let isPlayinLovemsg = false;

        nameUser.textContent = currentUser;

        overlay.style.display = "flex";


        if(currentLanguage === "italian") {
            currentLoveMsg = itlove;
        }
        else{
            currentLoveMsg = enlove;
        }

        if(currentNewYearWish){
            currentNewYearWish.pause();
        }
        
        currentLoveMsg.play();
       
        playLoveMsg.innerHTML = "&#10074;&#10074;"
        loveContent.classList.add('glowing');
        isPlayinLovemsg = true;

        if(currentHbd && !currentHbd.paused) {
            currentHbd.pause();
            currentHbd.currentTime = 0;
            document.querySelector('.control-heartfelt button').textContent = (currentLanguage === "italian") ? "Gioca" : "Play";
            isPlayingHbd = false;
        }

        playLoveMsg.onclick = function () {

            if(currentLanguage === "italian") {
                currentLoveMsg = itlove;
            }
            else{
                currentLoveMsg = enlove;
            }

            isPlayinLovemsg = !isPlayinLovemsg;

            if(isPlayinLovemsg){
                currentLoveMsg.play();
                playLoveMsg.innerHTML = "&#10074;&#10074;"
                loveContent.classList.add('glowing');
            }
            else{
                currentLoveMsg.pause();
                playLoveMsg.innerHTML = "&#9654;"
                loveContent.classList.remove('glowing');
            }

            currentLoveMsg.onended = function () {
                playLoveMsg.innerHTML = "&#9654;"
                loveContent.classList.remove('glowing');
                isPlayinLovemsg = false;
            }
        }

        currentLoveMsg.onended = function () {
            playLoveMsg.innerHTML = "&#9654;"
            loveContent.classList.remove('glowing');
            isPlayinLovemsg = false;
        }

        closeOverlay.onclick = function () {
            overlay.style.display = "none";
            currentLoveMsg.pause();
            playLoveMsg.innerHTML = "&#9654;"
            isPlayinLovemsg = false;
        }
    }

    const cardContainer = document.querySelector('.chrismas-cards .card-container');
    const cards = cardContainer.querySelectorAll('.cards');

    Array.from(cards).forEach(card => {
        const engMerryXmasWish = card.querySelector('p').getAttribute('data-merryChristmasMessage-english');
        const itMerryXmasWish = card.querySelector('p').getAttribute('data-merryChristmasMessage-italian');
        const enReader = card.querySelector('p').getAttribute('data-en-read');
        const itReader = card.querySelector('p').getAttribute('data-it-read');
        const playIcon = card.querySelector('span');

        playIcon.onclick = function () {

            if(currentLanguage === "italian") {
                currentWishLanguge = { message:itMerryXmasWish, audio:new Audio(itReader)};
            }
            else{
                currentWishLanguge = {message:engMerryXmasWish, audio: new Audio(enReader)};
            }

            showMessageWish(currentWishLanguge);
        }
    });


    function showMessageWish(content) {
        const  overlay = document.querySelector('.wishing-overlay-div');
        const wishingContent = document.querySelector('.wishing-content');
        const textWishArea = document.querySelector('.wishing-content .text-wishes');
        const playBtn = document.querySelector('.wishing-control button');

        textWishArea.innerHTML = '';
        playBtn.innerHTML = '&#9654;';
        playBtn.disabled = true;

        let isPlayingReader = false;

        textWishArea.innerHTML = `<h3>${content.message}</h3>`;

        
        overlay.style.display = 'flex';
        document.querySelector('.wishing-close').style.display = 'none';

        if(currentWish && !currentWish.paused) {
            currentWish.pause();
            currentWish.currentTime = 0;
            document.querySelector('.user-card-wish button').innerHTML = '&#9654;';
            const userCardWish = document.querySelector('.user-card-wish');
            userCardWish.classList.remove('glowing');
        }

        if(currentNewYearWish && !currentNewYearWish.paused) {
            currentNewYearWish.pause();
            currentNewYearWish.currentTime = 0;
            document.querySelector('.hidden-message .center-message button').innerHTML = '&#9654;';
        }

        if(currentHbd && !currentHbd.paused) {
            currentHbd.pause();
            currentHbd.currentTime = 0;
            document.querySelector('.control-heartfelt button').textContent = (currentLanguage === "italian") ? "Gioca" : "Play";
            isPlayingHbd = false;
        }

        setTimeout(function() {
            // Ensure the audio is loaded before playing
            content.audio.addEventListener('loadedmetadata', () => {
                // Play the audio once metadata is loaded
                content.audio.play();
                isPlayingReader = true;
                playBtn.innerHTML = "&#10074;&#10074;"; // Change button to pause icon
                playBtn.disabled = false; // Enable the button when audio starts playing
                wishingContent.classList.add('glowing');
                document.querySelector('.wishing-close').style.display = 'flex';
            });
        
            // If the audio is already loaded, play immediately
            if (content.audio.readyState > 2) {
                content.audio.play();
                isPlayingReader = true;
                playBtn.innerHTML = "&#10074;&#10074;"; // Change button to pause icon
                playBtn.disabled = false; // Enable the button
                wishingContent.classList.add('glowing');
                document.querySelector('.wishing-close').style.display = 'flex';
            }
        
        }, 3000); // Delay of 3 seconds        

        playBtn.onclick = function (event) {
            event.stopPropagation();

            isPlayingReader = !isPlayingReader;

            playBtn.innerHTML = isPlayingReader ? "&#10074;&#10074;" :'&#9654;';

            if(isPlayingReader) {
                content.audio.play();
                wishingContent.classList.add('glowing');
            }
            else{
                content.audio.pause();
                wishingContent.classList.remove('glowing');
            }
        }

        content.audio.onended = function () {
            isPlayingReader = false;
            playBtn.innerHTML = isPlayingReader ? "&#10074;&#10074;" :'&#9654;';
            wishingContent.classList.remove('glowing');
        }
    }

    document.querySelector('.wishing-close').onclick = function () {
        if (currentWishLanguge && !currentWishLanguge.audio.paused) {
            currentWishLanguge.audio.pause();
            currentWishLanguge.audio.currentTime = 0;
            
        }
    
        document.querySelector('.wishing-overlay-div').style.display = 'none';
        document.querySelector('.wishing-control button').disabled = true;
        document.querySelector('.wishing-content').classList.remove('glowing');
    }

    function displayExmasvideo () {
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth(); // 0-based, so December is 11
        const currentYear = currentDate.getFullYear();

        const prefVid = document.querySelector('.video-content video');
        if (!prefVid) return; // Ensure the video element exists

        const playVidBtn = document.querySelector('.video-controls button.play');
        const muteVidBtn = document.querySelector('.video-controls button.mute');
        const looadingGiv = document.querySelector('.loading-spinner');
        let isplayinVid = false;
        let isMuted = false;

        if (currentMonth >= 0 && currentDay >= 1 && currentYear >= 2025) {
            prefVid.src =  (currentLanguage === "italian") ? "itnewyear2025.mp4" : "ennewyear2025.mp4"; // New video for Jan 1, 2025    
        }
        
        if(currentMonth === 11 &&  currentDay >= 27) {

            document.querySelector('.video-wish-merry-overlay').style.display = "none";
            //alert(currentLanguage === "italian" ? "Buon Natale e Felice Anno Nuovo!" : "Christmas is over. Wishing you a Happy New Year!");
            PlayXmasvidBtn.disabled = true;
            return;
        }
        


        if(currentHbd && !currentHbd.paused) {
            currentHbd.pause();
            currentHbd.currentTime = 0;
            document.querySelector('.control-heartfelt button').textContent = (currentLanguage === "italian") ? "Gioca" : "Play";
            isPlayingHbd = false;
        }


        prefVid.src = (currentLanguage === "italian") ? "itvid.mp4" : "envid.mp4";

        prefVid.addEventListener("loadedmetadata", () => {
            if(prefVid.readyState > 2) {
                document.querySelector('.video-wish-merry-overlay').style.display = "flex";
            }
           
        });

        if(currentWish && !currentWish.paused) {
            currentWish.pause();
            currentWish.currentTime = 0;
            document.querySelector('.user-card-wish button').innerHTML = '&#9654;';
            const userCardWish = document.querySelector('.user-card-wish');
            userCardWish.classList.remove('glowing');
        }

        if(currentNewYearWish && !currentNewYearWish.paused) {
            currentNewYearWish.pause();
            currentNewYearWish.currentTime = 0;
            document.querySelector('.hidden-message .center-message button').innerHTML = '&#9654;';
        }

        playVidBtn.onclick = function () {
            isplayinVid = !isplayinVid;

            if(isplayinVid) {
                prefVid.play();
                playVidBtn.innerHTML = "&#10074;&#10074;";
            }
            else {
                prefVid.pause();
                playVidBtn.innerHTML = "&#9654;";
            }
        }

        muteVidBtn.onclick = function () {
            isMuted = !isMuted;

            prefVid.muted = isMuted;
            muteVidBtn.innerHTML = isMuted ? "&#128266;" : "&#128263;";
        }

        prefVid.onended = function() {
            isplayinVid = false;
            playVidBtn.innerHTML = "&#9654;";
            looadingGiv.style.display = "none";
        }

        prefVid.addEventListener('waiting', function() {
            looadingGiv.style.display = "flex";
        });

        prefVid.addEventListener('error', function() {
            looadingGiv.style.display = "flex";
        });

        prefVid.addEventListener('stalled', function() {
            looadingGiv.style.display = "flex";
        });

        prefVid.addEventListener('playing', function() {
            looadingGiv.style.display = "none";
        });

        prefVid.addEventListener('canplay', function() {
            looadingGiv.style.display = "none";
        });


        prefVid.addEventListener('canplaythrough', function() {
            looadingGiv.style.display = "none";
        });

        prefVid.addEventListener('loadstart', function() {
            looadingGiv.style.display = "flex";
        });        

        document.querySelector('.close-video-overlay').onclick = function () {
            prefVid.pause();
            isplayinVid =false;
            isMuted = false;
            muteVidBtn.innerHTML = isMuted ? "&#128266;" : "&#128263;";
            playVidBtn.innerHTML = "&#9654;";
            prefVid.muted = isMuted;
            looadingGiv.style.display = "none";
            document.querySelector('.video-wish-merry-overlay').style.display = "none";
        }
    }


    function displayCardWish() {

        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth(); // 0-based, so December is 11
    
        // If the current date is December 27, remove the .personal-card-container
        if (currentMonth === 11 && currentDay >= 27) {
            const personalCardContainer = document.querySelector('.personal-card-container');
            if (personalCardContainer) {
                personalCardContainer.style.display = "none"; // Hide the container
            }

            showNewYearsCountdown();
            return; // Exit the function after hiding the container
        }

        document.querySelector('.personal-card-container').style.display = "flex";
        const engWish = new Audio(document.querySelector('.user-card-wish').getAttribute('data-en-wish'));
        const itWish = new Audio(document.querySelector('.user-card-wish').getAttribute('data-it-wish'));
        const playWish = document.querySelector('.user-card-wish button');
        const userCardWish = document.querySelector('.user-card-wish');


        let isPlayingWish = false;

        if(currentUser) {
            document.querySelector('.card-header #userName').textContent = currentUser;
        }


        playWish.onclick = function () {

            if(currentLanguage === "italian") {
                currentWish = itWish;
            }
            else{
                currentWish = engWish;
            }

            isPlayingWish = !isPlayingWish;
            playWish.innerHTML = isPlayingWish ? "&#10074;&#10074;" : "&#9654;";

            if(isPlayingWish) {
                currentWish.play();
                userCardWish.classList.add('glowing');
            }
            else{
                currentWish.pause();
                userCardWish.classList.remove('glowing');
            }

            currentWish.addEventListener("ended", function () {
                isPlayingWish = false;
                currentWish.currentTime = 0;
                userCardWish.classList.remove('glowing');
                playWish.innerHTML = isPlayingWish ? "&#10074;&#10074;" : "&#9654;";
    
            });
        }

    }

    const words = ['sempre', 'sia', 'lodato', 'deo', 'gratias'];
    const correctOrder = ['sempre','sia','lodato', 'deo', 'gratias'];
    const wordsList = document.querySelector('.words-list');
    const puzzleTarget = document.querySelector('.puzzle-target');
    const authPage = document.querySelector('.auth-page');

    // Shuffle the words array for random placement
    function shuffleWords(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // Function to create draggable words
    function createDraggableWords() {
        shuffleWords(words);  // Shuffle words before displaying them
        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.classList.add('word');
            wordElement.textContent = word;
            wordElement.draggable = true;

            // Add dragstart event to handle dragging
            wordElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', word);
            });

            // Add click event to allow click placement
            wordElement.addEventListener('click', () => {
                addWordToTarget(word);
            });

            wordsList.appendChild(wordElement);
        });

        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth(); // 0-based, so December is 11
        const currentYear = currentDate.getFullYear();

        if (currentMonth >= 0 && currentDay >= 1 && currentYear >= 2025) {
            document.querySelector('.auth-page').classList.add('newYear');
            document.querySelector('.auth-page').style.backgroundImage = `url('${(currentLanguage === "italian") ? "it_year.gif" : "new-year.gif"}')`;
        }
    }

    // Function to allow words to be dropped into the target
    puzzleTarget.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    puzzleTarget.addEventListener('drop', (e) => {
        e.preventDefault();
        const word = e.dataTransfer.getData('text');
        addWordToTarget(word);
    });

    // Function to add word to the target area
    function addWordToTarget(word) {
        const wordElement = document.createElement('div');
        wordElement.classList.add('word');
        wordElement.textContent = word;
        puzzleTarget.appendChild(wordElement);

        // Disable the word in the list after adding it to the target
        const wordInList = Array.from(wordsList.children).find(child => child.textContent.toLowerCase() === word);
        if (wordInList) {
            wordInList.style.pointerEvents = 'none'; // Disable click
            wordInList.style.opacity = 0.1; // Make it appear disabled
            
        }

        // Check if the user has arranged the words correctly
        checkPuzzleOrder();
    }

    // Function to check if the puzzle is solved
    function checkPuzzleOrder() {
        // Extract the words (text content) in the correct order
        const wordsInTarget = Array.from(puzzleTarget.children)
            .map(child => child.textContent.trim());  // .trim() to avoid extra spaces
    
        // Check if the order of the words matches the correct order
        if (JSON.stringify(wordsInTarget) === JSON.stringify(correctOrder)) {
            
            puzzleTarget.style.backgroundColor = 'green';  // Highlight the target zone

            setTimeout(() => {
                puzzleTarget.style.backgroundColor = '';  // Reset the background color
            }, 1000);

            // Hide the auth page after a short delay
            setTimeout(() => {
                authPage.style.display = 'none';
                window.scrollTo({top:0, behavior:"smooth"});

                if(!currentUser) {
                    showNameOverlay();
                }

                if(currentUser) {
                    displayCardWish();
                }

                shownotification((currentLanguage === "italian") ? `Bienvenuto! ${currentUser ?? "Amico/a"}` : `Welcome! ${currentUser ?? "Friend"}`);
                
            }, 1500);

        } else {
            // Provide feedback if the puzzle is not solved correctly
            puzzleTarget.style.backgroundColor = 'red';  // Highlight the target zone
    
            // Optionally: reset background color after a short period
            setTimeout(() => {
                puzzleTarget.style.backgroundColor = '';  // Reset the background color
            }, 1000);
    
            // Identify and remove the misplaced word
            const wordsInTargetOrder = Array.from(puzzleTarget.children)
                .map(child => child.textContent.trim());
    
            // Find the index of the first mismatch
            for (let i = 0; i < wordsInTargetOrder.length; i++) {
                if (wordsInTargetOrder[i] !== correctOrder[i]) {
                    // Find the element in puzzleTarget that matches the incorrect word
                    const mismatchedWordElement = Array.from(puzzleTarget.children)
                        .find(child => child.textContent.trim() === wordsInTargetOrder[i]); 
                    // If a mismatched word is found, remove it from puzzleTarget
                    if (mismatchedWordElement) {
                        mismatchedWordElement.remove();
                        const wordInList = Array.from(wordsList.children).find(child => child.textContent.toLowerCase() === mismatchedWordElement.textContent.toLowerCase());
                        if(wordInList) {
                            wordInList.style.pointerEvents = 'auto'; // Disable click
                            wordInList.style.opacity = 1; // Make it appear disabled
                        }
                    }
                    break;  // Remove only one word at a time
                }
            }
        }
    }
    


    // Initialize draggable words
    createDraggableWords();
   

    function showNameOverlay() {
        document.querySelector('.name-input-overlay').style.display = 'flex';
        const inputField = document.getElementById('nameInput');
        const button = document.getElementById('doneButton');
        
        inputField.oninput = function () {
            if (inputField.value.trim() !== "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        }
    
        button.onclick = function () {
            button.disabled = true;
            currentUser = inputField.value;
            
            // Save currentUser to localStorage
            localStorage.setItem('username', currentUser);
    
            document.querySelector('.name-input-overlay').style.display = 'none';
    
            shownotification((currentLanguage === "italian") ? `Bienvenuto! ${currentUser}` : `Welcome! ${currentUser}`);

            displayCardWish();
        }
    }


    let player;

    function initializePlayer() {
        player = new YT.Player('trailer-video', {
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onYouTubeIframeAPIReady() {
        initializePlayer();
    }

    // Detect when the video ends
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            alert('Video ended');
            document.querySelector('.waiting-overlay').style.display = 'flex';
        }
    }

    function showNewYearsCountdown() {
        // Start the countdown
        countdownYear = setInterval(startNewYearsCountDown, 1000);
        document.querySelector('.happy-new-year-message').style.display = 'flex';
        document.querySelector('.auth-page').classList.add('newYear');
    }
   
    function startNewYearsCountDown() {
        
        const countdownElement = document.querySelector('.displayed-message h3');
        document.querySelector('.auth-page').classList.add('newYear');

        // Ensure the DOM element exists
        if (!countdownElement) {
            console.error('Countdown element not found in the DOM.');
            return;
        }
        
        const now = new Date(); // Get the current time dynamically
        const targetDate = new Date(Date.UTC(2025, 0, 1, 0, 0, 0)); // January 1, 2025, 00:00:00 UTC
        const timeDifference = targetDate - now; // Calculate the remaining time
        
        if (timeDifference > 0) {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            
            // Multilingual support
            const daysText = (currentLanguage === "italian") ? "Giorni" : "Days";
            const hoursText = (currentLanguage === "italian") ? "Ore" : "Hours";
            const minutesText = (currentLanguage === "italian") ? "Minuti" : "Minutes";
            const secondsText = (currentLanguage === "italian") ? "Secondi" : "Seconds";
            
            // Update the countdown text
            countdownElement.textContent = 
                `${days < 10 ? "0" : ""}${days} ${daysText} : ` +
                `${hours < 10 ? "0" : ""}${hours} ${hoursText} : ` +
                `${minutes < 10 ? "0" : ""}${minutes} ${minutesText} : ` +
                `${seconds < 10 ? "0" : ""}${seconds} ${secondsText}`;
            
            timerElement.textContent = 
                `${days < 10 ? "0" : ""}${days} ${daysText} : ` +
                `${hours < 10 ? "0" : ""}${hours} ${hoursText} : ` +
                `${minutes < 10 ? "0" : ""}${minutes} ${minutesText} : ` +
                `${seconds < 10 ? "0" : ""}${seconds} ${secondsText}`;

                document.querySelector('.count-down-timer p').textContent = (currentLanguage === "italian") ? "Conto Alla Rovescia Per Il Nuovo Anno" : "CountDown To Happy New Year" ;
        } else {
            // Stop the countdown and display the New Year message
            clearInterval(countdownYear);

            // Fallback text after countdown ends
            countdownElement.textContent = 
                (currentLanguage === "italian") 
                    ? "Felice Anno Nuovo! Goditi la Giornata!" 
                    : "Happy New Year! Enjoy the Day!";

            timerElement.textContent = 
                (currentLanguage === "italian") 
                    ? "Felice Anno Nuovo! Goditi la Giornata!" 
                    : "Happy New Year! Enjoy the Day!";

            document.querySelector('.count-down-timer p').textContent = 
                (currentLanguage === "italian") 
                    ? "Il conto alla rovescia è finito." 
                    : "Countdown is over.";


            displayNewYearsMessage();
            displayExmasvideo();
        }
    }
    

    function  displayNewYearsMessage() {

        let isPlayingNewYearWish = false;
        document.querySelector('.happy-new-year-message').classList.add('festive');
        document.querySelector('.new-year-heartfelt-message').classList.toggle('glowing', isPlayingNewYearWish);
        const username = document.querySelector('.hidden-message .center-message h3');

        document.querySelector('.auth-page').classList.add('newYear');

        if (!currentUser) {
            username.textContent = (currentLanguage === "italian") ? "Amico/a" : "You";
        } else {
            username.textContent = currentUser;
        }
        
        const  enyear = new  Audio(document.querySelector('.new-year-heartfelt-message').getAttribute('data-enyearwish'));
        const ityear = new  Audio(document.querySelector('.new-year-heartfelt-message').getAttribute('data-ityearwish'));

        document.querySelector('.hidden-message .center-message button').onclick = function () {
        
            currentNewYearWish = (currentLanguage === 'italian') ? ityear : enyear;

            isPlayingNewYearWish = !isPlayingNewYearWish;
            document.querySelector('.new-year-heartfelt-message').classList.toggle('glowing', isPlayingNewYearWish);
            
            if(isPlayingNewYearWish) {
                currentNewYearWish.play();
                this.innerHTML = '&#10074;&#10074;';
            }
            else{
                currentNewYearWish.pause();
                this.innerHTML = '&#9654';
            }

            currentNewYearWish.onended = function () {
                isPlayingNewYearWish = false;
                document.querySelector('.new-year-heartfelt-message').classList.toggle('glowing', isPlayingNewYearWish);
                this.innerHTML = '&#9654';
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                  });                  
            }.bind(this);
        }

        timerElement.textContent = (currentLanguage === "italian") ? "Felice Anno Nuovo!" : "Happy New Year";
        document.querySelector('.top-lights').innerHTML = '';
        document.querySelector('.top-lights').innerHTML = `<h3>${(currentLanguage === "italian") ? "Felice Anno Nuovo!" : "Happy New Year"} ${(currentLanguage === "italian") ? (currentUser ?? "Amico/a") : (currentUser ?? "Friend")}</h3>`;
        document.querySelector('.top-lights').classList.add('year');
    }

    const newYearMsg = "As we step into this new year, let us reflect on the journey we've shared, the challenges we've overcome, and the blessings we\n've received. May this new year bring with it a renewal of hope, a deepening of faith, and a sense of peace that transcends all. May our hearts be open to love, kindness, and forgiveness, and may we be instruments of joy and compassion to all those we encounter. Let us walk forward in trust, knowing that with each new day, God walks with us. Wishing you all a blessed and joyous New Year, filled with His grace and endless blessings."
});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
