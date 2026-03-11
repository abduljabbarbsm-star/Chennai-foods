// Animation reveal on scroll
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

async function initDashboard() {
    try {
        const response = await fetch('/api/analytics');
        const data = await response.json();

        renderTopRestaurantsChart(data.top_restaurants);
        renderCategoryDistChart(data.veg_dist);
        renderPriceComparisonChart(data.avg_price);
        renderTopDishes(data.top_dishes);
    } catch (error) {
        console.error('Error loading analytics data:', error);
    }
}

function renderTopRestaurantsChart(resData) {
    const ctx = document.getElementById('topRestaurantsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: resData.map(r => r.restaurant_name),
            datasets: [{
                label: 'Composite Quality Score',
                data: resData.map(r => r.composite_score.toFixed(2)),
                backgroundColor: 'rgba(252, 128, 25, 0.7)',
                borderColor: '#fc8019',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function renderCategoryDistChart(vegDist) {
    const ctx = document.getElementById('categoryDistChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(vegDist),
            datasets: [{
                data: Object.values(vegDist),
                backgroundColor: ['#e43b3b', '#48c479'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff' } }
            }
        }
    });
}

function renderPriceComparisonChart(priceData) {
    const ctx = document.getElementById('priceComparisonChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(priceData),
            datasets: [{
                label: 'Avg Price (₹)',
                data: Object.values(priceData),
                borderColor: '#2b6cb0',
                backgroundColor: 'rgba(43, 108, 176, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function renderTopDishes(dishes) {
    const container = document.getElementById('topDishesList');
    dishes.forEach(dish => {
        const div = document.createElement('div');
        div.className = 'stats-card';
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong>${dish.food_item}</strong>
                <span style="color: var(--primary)">${dish.popularity_score}% Popularity</span>
            </div>
            <div style="width: 100%; height: 6px; background: #333; border-radius: 3px; margin-top: 10px;">
                <div style="width: ${dish.popularity_score}%; height: 100%; background: var(--primary); border-radius: 3px;"></div>
            </div>
        `;
        container.appendChild(div);
    });
}
