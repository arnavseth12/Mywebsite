const serviceItems = document.querySelectorAll('.service-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.3
});

serviceItems.forEach((item) => {
  observer.observe(item);
});