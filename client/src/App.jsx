import React, { useState, useEffect } from 'react';
import { Spinner, Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  // Auto-fetch weather by user's current location
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoading(true);
          const apiKey = '11b6dff054f6ed602a0d3e67e7249a65';
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );
          const data = await res.json();
          setWeather(data);
          setCity(data.name); // Show city name in input
        } catch (err) {
          console.error('Location weather fetch failed');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.warn('Geolocation denied:', error.message);
      }
    );
  } else {
    console.warn('Geolocation not supported');
  }
}, []);

  // Fetch city suggestions
  useEffect(() => {
    if (city.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const apiKey = '11b6dff054f6ed602a0d3e67e7249a65';
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
      );
      const data = await res.json();
      setSuggestions(data);
    };

    fetchSuggestions();
  }, [city]);

  // Get weather data
  const getWeather = async (selectedCity) => {
    const cityName = selectedCity?.name || city;
    if (!cityName) return;

    try {
      setLoading(true);
      setWeather(null);
      const res = await fetch(`/api/weather?city=${cityName}`);
      const data = await res.json();
      setWeather(data);
      setSuggestions([]);
      setCity(cityName);
    } catch (error) {
      alert('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

 return (
    <Container fluid className="App py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <div className="text-center mb-4">
            <h1 className="fw-bold text-primary">Weather App 🌦</h1>
            <p className="text-muted">Enter a city to get the current weather</p>
          </div>

          <Form.Group controlId="cityInput">
            <Form.Control
              type="text"
              placeholder="Enter city..."
              value={city}
              className="mb-2"
              onChange={(e) => setCity(e.target.value)}
            />
          </Form.Group>

          {suggestions.length > 0 && (
            <ListGroup className="mb-3 shadow-sm">
              {suggestions.map((s, index) => (
                <ListGroup.Item key={index} action onClick={() => getWeather(s)}>
                  {s.name}, {s.state ? s.state + ',' : ''} {s.country}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          <div className="d-grid mb-4">
            <Button onClick={() => getWeather()} variant="primary" size="lg">
              Get Weather
            </Button>
          </div>

          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" variant="info" />
              <p className="mt-2 text-info fw-semibold">Loading weather data...</p>
            </div>
          )}

          {weather && weather.main && (
            <Card className="weather-card shadow">
              <Card.Body>
                <Card.Title className="mb-3 text-center fs-3 fw-bold text-primary">
                  {weather.name}
                </Card.Title>
                <Card.Text><strong>Condition:</strong> {weather.weather[0].description}</Card.Text>
                <Card.Text><strong>Temperature:</strong> {weather.main.temp} °C</Card.Text>
                <Card.Text><strong>Feels Like:</strong> {weather.main.feels_like} °C</Card.Text>
                <Card.Text><strong>Humidity:</strong> {weather.main.humidity}%</Card.Text>
                <Card.Text><strong>Pressure:</strong> {weather.main.pressure} hPa</Card.Text>
                <Card.Text>
                  <strong>Wind Speed:</strong> {(weather.wind.speed * 3.6).toFixed(1)} km/h
                </Card.Text>
                <Card.Text><strong>Coordinates:</strong> {weather.coord.lat}, {weather.coord.lon}</Card.Text>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;