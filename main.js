document.body.addEventListener('click', async function (event) {
    if (event.target && event.target.classList.contains('btn-wholesale')) {
        event.preventDefault();
        const discountCode = event.target.dataset.discountCode;
        const form = event.target.closest('form');

        if (discountCode) {
            await applyDiscountCode(form, discountCode);
        }
    }
});

async function applyDiscountCode(form, discountCode) {
    if (!form) {
        console.error('Form not found');
        return;
    }

    const formData = new FormData(form);

    try {
        // Add product to cart
        const response = await fetch('/cart/add.js', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (discountCode) {
            // Save the discount code as a session cookie
            document.cookie = `discount_code=${discountCode}; path=/`;

            try {
                await fetch(`/discount/${discountCode}`);
            } catch (error) {
                console.error('Error applying discount:', error);
            }
        }

        window.location.href = '/cart';
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
}
