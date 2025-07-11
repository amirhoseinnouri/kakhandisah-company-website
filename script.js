document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scrolling for Navigation Links ---
    // This feature enhances user experience by smoothly scrolling the page to the target section
    // when a navigation link (an anchor tag with an href starting with '#') is clicked.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent the default browser jump behavior.

            const targetId = this.getAttribute('href'); // Get the ID of the target section (e.g., "#services").
            const targetElement = document.querySelector(targetId); // Find the actual DOM element for that ID.

            if (targetElement) {
                // Calculate the offset to account for the fixed header.
                // This prevents the target section's title from being hidden behind the header.
                const headerOffset = document.querySelector('.main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                // Scroll to the calculated position with a smooth animation.
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Service Details Modal Logic ---
    // This section manages the pop-up modal that displays detailed information about each service.
    // When a service item is clicked, the modal is populated with specific content and shown.
    const serviceItems = document.querySelectorAll('.service-item'); // All clickable service items on the page.
    const modal = document.getElementById('serviceDetailModal'); // The modal overlay element.
    const closeButton = document.querySelector('.close-button'); // The 'X' button to close the modal.
    const modalServiceTitle = document.getElementById('modalServiceTitle'); // Element to display the service title.
    const modalServiceImage = document.getElementById('modalServiceImage'); // Element to display the service image.
    const modalServiceDescription = document.getElementById('modalServiceDescription'); // Element to display the service description.
    const modalContactButton = document.querySelector('.modal-contact-btn'); // The "Contact for this service" button within the modal.

    // Define the data for each service.
    // This object acts as a centralized data source for service details.
    // You should replace placeholder image URLs with your actual image paths.
    const servicesData = {
        moblshooyi: {
            title: 'مبل شویی و تشک شویی',
            image: './5.jpg',
            description: 'خدمات تخصصی شستشوی انواع مبلمان راحتی، استیل، فرش و تشک با استفاده از دستگاه‌های پیشرفته و مواد شوینده نانو، بدون آسیب به بافت پارچه و با خشک‌کنندگی بالا. با ما مبلمان و تشک‌های خود را مانند روز اول نو کنید. این خدمات شامل لکه‌برداری عمیق، ضدعفونی و خوشبو کننده نیز می‌باشد.'
        },
        nazafatmanzel: {
            title: 'نظافت کامل منزل و ارگان‌ها',
            image: './13.jpg',
            description: 'ارائه خدمات نظافت عمومی و تخصصی برای منازل، آپارتمان‌ها، شرکت‌ها، ادارات و سازمان‌های دولتی و خصوصی. شامل نظافت کف، دیوارها، پنجره‌ها، سرویس‌های بهداشتی، آشپزخانه، گردگیری کامل، شستشوی پرده و پتو. ما با دقت و سرعت، محیطی درخشان برای شما فراهم می‌کنیم.'
        },
        rahpelle: {
            title: 'نظافت راه پله',
            image: './7.jpg',
            description: 'نظافت و شستشوی کامل راه پله‌ها و مشاعات ساختمان شامل دیوارها، نرده‌ها، درب ورودی، آسانسور، حیاط و پارکینگ. استفاده از مواد شوینده مناسب برای سطوح مختلف و تضمین تمیزی و درخشش طولانی مدت. تیم ما با رعایت پروتکل‌های بهداشتی، محیطی پاکیزه را به ارمغان می‌آورد.'
        },
        nanonama: {
            title: 'نانو شویی و نما شویی',
            image: './3.jpg',
            description: 'شستشوی نماهای ساختمان با روش‌های نانو و واترجت، بدون آسیب به مصالح و با دوام بالا در برابر آلودگی و باران. بازگرداندن زیبایی و جلوه اولیه به نمای ساختمان شما با استفاده از تکنیک‌های روز دنیا که محافظت در برابر آلودگی‌های آتی را نیز فراهم می‌کند.'
        },
        kafsabi: {
            title: 'کف سابی',
            image: './15.jpg',
            description: 'ساب زدن و پولیش انواع کفپوش‌های سنگی، موزاییکی، بتنی و سرامیکی برای رفع کدری، خط و خش و ایجاد سطحی صاف و براق. مناسب برای کف‌های قدیمی و فرسوده که نیاز به احیا دارند. این کار به افزایش طول عمر کفپوش‌ها نیز کمک می‌کند.'
        },
        takhribbazsazi: {
            title: 'تخریب و بازسازی',
            image: './31.webp',
            description: 'انجام خدمات تخریب جزئی و کلی و بازسازی بخش‌های مختلف منازل از جمله آشپزخانه، حمام، سرویس بهداشتی، اتاق‌ها و دکوراسیون داخلی. طراحی و اجرای بازسازی مطابق با سلیقه شما و استانداردهای روز، با نظارت کامل بر پروژه.'
        },
        asbbar: {
            title: 'اسباب کشی و باربری',
            image: './18.jpg',
            description: 'خدمات کامل اسباب‌کشی شامل بسته‌بندی حرفه‌ای، حمل و نقل ایمن با ماشین‌های مخصوص و مسقف، و چیدمان وسایل در مقصد. جابجایی بدون دغدغه و استرس برای شما، با بیمه بار و کارگران مجرب.'
        },
        sampashi: {
            title: 'سم پاشی',
            image: './6.jpg',
            description: 'سم‌پاشی تخصصی منازل و محیط‌های اداری برای از بین بردن انواع حشرات موذی (سوسک، مورچه، ساس، مگس، پشه و...). استفاده از سموم بهداشتی و بی‌خطر برای انسان و حیوانات خانگی، با ضمانت ریشه‌کنی و جلوگیری از بازگشت آفات.'
        },
        paziraei: {
            title: 'پذیرایی در مراسمات',
            image: './33.jpg',
            description: 'ارائه نیروی متخصص و مجرب جهت پذیرایی در انواع مراسمات شادی و غم (عقد، عروسی، تولد، ترحیم، همایش و...). شامل پذیرایی از مهمانان، سرو غذا و نوشیدنی، و نظافت محل برگزاری مراسم با بهترین کیفیت و رعایت کامل آداب پذیرایی.'
        },
        bastabandi: {
            title: 'بسته‌بندی و چیدمان',
            image: './20.jpg',
            description: 'خدمات حرفه‌ای بسته‌بندی وکیوم و استاندارد انواع وسایل منزل و اداری با استفاده از بهترین متریال بسته‌بندی. همچنین چیدمان تخصصی لوازم در مقصد جدید، طبق سلیقه و نیاز شما، برای ایجاد فضایی دلنشین و منظم.'
        },
        parastar: {
            title: 'پرستار نوزاد، کودک، سالمند',
            image: './34.webp',
            description: 'اعزام پرستار مجرب و متعهد برای مراقبت از نوزادان، کودکان و سالمندان در منزل. شامل مراقبت‌های روزانه، کمک در امور شخصی، دادن دارو، و همراهی در تمامی نیازها با رعایت کامل اصول بهداشتی و اخلاقی. ما آرامش خاطر را برای خانواده شما به ارمغان می‌آوریم.'
        },
        // NEW SERVICE DATA ADDED HERE
        amlak: {
            title: 'املاک و رهن و اجاره',
            image: './50.webp', // You can replace this with a relevant image
            description: 'ارائه خدمات جامع در زمینه مشاوره، رهن، اجاره، خرید و فروش انواع ملک مسکونی، تجاری و اداری. تیم ما با دانش تخصصی بازار و مجوزهای لازم، بهترین فرصت‌ها را برای شما فراهم می‌کند و در تمام مراحل قانونی همراه شماست.'
        },
        kafinet: {
            title: 'خدمات کافی‌نت',
            image: './56.jpg', // تصویر مربوطه رو باید اضافه کنی
            description: `ارائه تمامی خدمات کافی‌نت شامل:
            - تایپ و پرینت
            - ثبت‌نام اینترنتی
            - تکمیل فرم‌ها و رزومه
            - اسکن و کپی مدارک
            - ارسال ایمیل و درخواست اداری
            - اتصال به سامانه‌های دولتی و خدمات دیجیتال
            - و هرگونه خدمات مرتبط با فضای مجازی و رایانه‌ای با بهترین کیفیت و قیمت مناسب.`
}

    };

    // Add a click event listener to each service item.
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            const serviceKey = item.dataset.service; // Get the 'data-service' attribute value (e.g., "moblshooyi").
            const service = servicesData[serviceKey]; // Retrieve the corresponding service data from our object.

            if (service) {
                // Populate the modal's elements with the service data.
                modalServiceTitle.textContent = service.title;
                modalServiceImage.src = service.image;
                modalServiceImage.alt = service.title;
                modalServiceDescription.textContent = service.description;

                // Ensure the "Contact for this service" button links to the contact section.
                modalContactButton.href = '#contact';

                // Display the modal. We use 'flex' to enable centering via CSS.
                modal.style.display = 'flex';
                // Add a class to the body to prevent scrolling of the main content while the modal is open.
                document.body.classList.add('modal-open');
            }
        });
    });

    // Event listener for the modal's close button.
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Hide the modal.
        document.body.classList.remove('modal-open'); // Re-enable background scrolling.
    });

    // Event listener to close the modal when the overlay (outside the modal content) is clicked.
    window.addEventListener('click', (event) => {
        if (event.target == modal) { // Check if the click occurred directly on the modal overlay.
            modal.style.display = 'none'; // Hide the modal.
            document.body.classList.remove('modal-open'); // Re-enable background scrolling.
        }
    });

    // Handle smooth scroll for the modal's "Contact for this service" button.
    modalContactButton.addEventListener('click', function(e) {
        // This is a special case of smooth scrolling where the modal needs to close first.
        e.preventDefault(); // Prevent default anchor behavior (jumping directly).
        modal.style.display = 'none'; // Close the modal.
        document.body.classList.remove('modal-open'); // Re-enable background scrolling.

        // Re-use the smooth scroll logic to navigate to the contact section.
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            const headerOffset = document.querySelector('.main-header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });


    // --- Iranian Date and Time Display ---
    // This function updates the date and time display at the top of the page
    // using the Persian (Shamsi) calendar. It updates every second.
    const currentDatetimeSpan = document.getElementById('current-datetime');

    function updateIranianDateTime() {
        // Create a new Date object for the current time.
        const now = new Date();

        // Format the date and time using 'fa-IR' locale for Persian calendar.
        // options for a full date with weekday, day, month, and year.
        const dateOptions = {
            weekday: 'long', // e.g., "شنبه"
            year: 'numeric', // e.g., "۱۴۰۳"
            month: 'long',   // e.g., "تیر"
            day: 'numeric'   // e.g., "۱۷"
        };
        // options for hour and minute with 2-digit formatting.
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Use 24-hour format
        };

        const formattedDate = new Intl.DateTimeFormat('fa-IR', dateOptions).format(now);
        const formattedTime = new Intl.DateTimeFormat('fa-IR', timeOptions).format(now);

        // Update the content of the span element.
        currentDatetimeSpan.textContent = `تاریخ: ${formattedDate} - ساعت: ${formattedTime}`;
    }

    // Call the function once immediately to display the date/time on load.
    updateIranianDateTime();
    // Set an interval to update the date and time every second.
    setInterval(updateIranianDateTime, 1000);


    // --- Contact Form Submission Handling ---
    // This section handles the submission of the contact form.
    // In a real-world application, this data would be sent to a backend server.
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the default form submission which reloads the page.
            alert('پیام شما با موفقیت ارسال شد! به زودی با شما تماس خواهیم گرفت.'); // User feedback.
            contactForm.reset(); // Clear all input fields in the form.
            // Placeholder for actual AJAX submission (e.g., using fetch API):
            /*
            const formData = new FormData(contactForm);
            fetch('/api/contact', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('پیام شما با موفقیت ارسال شد!');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('خطایی در ارسال پیام رخ داد.');
            });
            */
        });
    }
});
