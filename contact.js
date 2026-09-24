const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const statusEl = document.getElementById('form-status');

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrpbkdbv';

const params = new URLSearchParams(window.location.search);
const service = params.get('service');

if (service) {
  document.getElementById('message').value = `I'm interested in a quote for: ${service}\n\n`;
}


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  statusEl.textContent = '';
  statusEl.className = '';

  const formData = new FormData(form);

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    const data = await response.json();

    if (response.ok) {
      statusEl.textContent = 'Message sent! I\'ll get back to you soon.';
      statusEl.className = 'success';
      form.reset();
    } else {
      const reason = data.errors
        ? data.errors.map((err) => err.message).join(', ')
        : 'Unknown error';
      statusEl.textContent = 'Error: ' + reason;
      statusEl.className = 'error';
      console.log('Formspree response:', data);
    }
  } catch (error) {
    statusEl.textContent = 'Network error. Check your connection and try again.';
    statusEl.className = 'error';
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Send Message';
});