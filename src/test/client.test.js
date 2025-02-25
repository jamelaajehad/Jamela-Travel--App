// Mock the DOM
document.body.innerHTML = `
  <form id="travel-form">
    <input id="destination" value="Paris" />
    <input id="departure-date" value="2025-01-01" />
    <button type="submit">Submit</button>
  </form>
  <div id="results"></div>
`;

// Mock the fetch API
global.fetch = jest.fn((url) => {
  if (url.includes('/api/location')) {
    return Promise.resolve({
      json: () => Promise.resolve({ geonames: [{ lat: "48.8566", lng: "2.3522" }] }),
    });
  } else if (url.includes('/api/weather')) {
    return Promise.resolve({
      json: () => Promise.resolve({ data: [{ temp: 20, weather: { description: "Sunny" } }] }),
    });
  } else if (url.includes('/api/image')) {
    return Promise.resolve({
      json: () => Promise.resolve({ hits: [{ webformatURL: "https://example.com/image.jpg" }] }),
    });
  }
  return Promise.reject(new Error("API Not Found"));
});

// Import the function to test
const { handleFormSubmit } = require('../client/js/app');

describe('Client JavaScript', () => {
  it('✅ Should handle form submission and update the DOM', async () => {
    document.getElementById('travel-form').dispatchEvent(new Event('submit'));

    await new Promise((resolve) => setTimeout(resolve, 100));

    const results = document.getElementById('results').innerHTML;
    expect(results).toContain("Weather: Sunny");
    expect(results).toContain("Temperature: 20°C");
    expect(results).toContain('<img src="https://example.com/image.jpg"');
  });
});
