// Certifications Modal
const modalTestgilde = document.getElementById('pdfModal');
const pdfButton = document.querySelector('.education__pdf-button');
const closeButton = document.querySelector('.education__modal-close');

// Open modal when clicked
pdfButton.addEventListener('click', function() {
    console.log("Test");
    // Show modal
    modalTestgilde.style.display = 'block';

    // Disable scrolling
    body.style.overflow = 'hidden';

    // Close modal on close button click
    closeButton.addEventListener('click', function() {
        modalTestgilde.style.display = 'none';
        body.style.overflow = '';
    });

    // Close modal on outter click
    window.addEventListener('click', function(event) {
        if (event.target == modalTestgilde) {
            modalTestgilde.style.display = 'none';
            body.style.overflow = '';
        }
    })
})