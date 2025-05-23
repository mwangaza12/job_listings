let data = [];
let activeFilters = [];

async function getData() {
    const response = await fetch("./data.json");
    data = await response.json();
    renderJobs(data);
}

function mapToHtml(job) {
  return `
    <div class="job-card ${job.featured ? 'featured' : ''}">
        <div class="left">
            <img src="${job.logo}" alt="${job.company} logo" />
            <div class="extras">
                <p>${job.company} ${job.new ? '<span class="badge new">NEW!</span>' : ''} ${job.featured ? '<span class="badge featured">FEATURED</span>' : ''}</p>
                <strong>${job.position}</strong>
                <p class="meta">${job.postedAt} • ${job.contract} • ${job.location}</p></div>
            </div>
        <div class="job-tags">
            ${[job.role, job.level, ...(job.languages || []), ...(job.tools || [])]
            .map(tag => `<span class="tag">${tag}</span>`)
            .join('')}
        </div>
    </div>
  `;
}

function renderJobs(jobs) {
    const jobListings = document.getElementById("job-listings");
    jobListings.innerHTML = jobs.map(mapToHtml).join("");
    attachTagListeners();
}

function attachTagListeners() {
  document.querySelectorAll(".tag").forEach(tag => {
    tag.addEventListener("click", (event) => {
      if (!event.target.closest('.remove-icon')) {
        const tagText = tag.textContent.trim();
        if (!activeFilters.includes(tagText)) {
          activeFilters.push(tagText);
          updateFilterUI();
          applyFilters();
        }
      }
    });
  });
}

function updateFilterUI() {
    const filterTagsContainer = document.getElementById("filter-tags");
    filterTagsContainer.innerHTML = activeFilters
        .map(tag => `
            <span class="tag">
                ${tag}
                <span class="remove-icon" data-tag="${tag}"><img src="./images/icon-remove.svg" alt="Remove filter"></span>
            </span>
        `)
        .join("");

    document.getElementById("filter-bar").classList.toggle("hidden", activeFilters.length === 0);

    document.querySelectorAll('#filter-tags .remove-icon').forEach(icon => {
        icon.addEventListener('click', (event) => {
            const tagToRemove = event.target.closest('.remove-icon').dataset.tag;
            activeFilters = activeFilters.filter(filter => filter !== tagToRemove);
            updateFilterUI();
            applyFilters();
        });
    });
}

function applyFilters() {
    const filtered = data.filter(job =>
        activeFilters.every(tag =>
        [job.role, job.level, ...(job.languages || []), ...(job.tools || [])].includes(tag)
        )
    );
    renderJobs(filtered);
}

document.getElementById("clear-btn").addEventListener("click", () => {
    activeFilters = [];
    updateFilterUI();
    renderJobs(data);
});

getData();