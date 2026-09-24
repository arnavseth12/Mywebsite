const resumeItems = document.querySelectorAll('.resume-item');

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

resumeItems.forEach((item) => {
  observer.observe(item);
});