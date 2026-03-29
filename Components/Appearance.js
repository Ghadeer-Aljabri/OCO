import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { useSelector } from 'react-redux';

const Appearance = () => {
  const { changeTheme } = useTheme();
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState("light");
  const user = useSelector((state) => state.user.userInfo);
  const userId = user?._id;

  // Load saved preferences
  useEffect(() => {
    if (!userId) return; // Skip if user is not yet loaded
  
    const loadPreferences = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const userData = await res.json();
        if (userData.preferences) {
          setFontSize(userData.preferences.fontSize || 16);
          setTheme(userData.preferences.theme || "light");
          changeTheme(userData.preferences.theme || "light");
        }
      } catch (err) {
        console.error("Failed to load preferences", err);
      }
    };
  
    loadPreferences();
  }, [userId, changeTheme]);
  
  // Apply font size globally
  useEffect(() => {
    document.body.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Save preferences to server
  const savePreferences = async (newTheme, newFontSize) => {
    if (!userId) return;
    try {
      await fetch(`/api/users/${userId}/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme, fontSize: newFontSize }),
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    setTheme(newTheme);
    savePreferences(newTheme, fontSize);
  };

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    savePreferences(theme, newSize);
  };

  return (
    <div style={{ color: 'var(--text-color)', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ fontWeight: 'bold', fontSize: '2rem' }}>Appearance Settings</h3>
      <p style={{ fontSize: '1.1rem' }}>Click to change the theme:</p>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => handleThemeChange("light")} style={themeButtonStyle("#ffffff", "#000000")} />
        <button onClick={() => handleThemeChange("dark")} style={themeButtonStyle("#121212", "#ffffff")} />
        <button onClick={() => handleThemeChange("blue")} style={themeButtonStyle("#1e88e5", "#ffffff")} />
        <button onClick={() => handleThemeChange("green")} style={themeButtonStyle("#388e3c", "#ffffff")} />
      </div>

      <div style={{ marginTop: "3rem" }}>
        <label htmlFor="fontSizeSlider" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          Adjust Text Size:
        </label>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
          <input
            type="range"
            id="fontSizeSlider"
            min="12"
            max="28"
            value={fontSize}
            onChange={handleFontSizeChange}
            style={sliderStyle}
          />
          <span style={{ marginLeft: "1rem", fontSize: '1.5rem', fontWeight: 'bold' }}>{fontSize}px</span>
        </div>
      </div>
    </div>
  );
};

// Theme button style
const themeButtonStyle = (bgColor, textColor) => ({
  padding: "30px",
  backgroundColor: bgColor,
  color: textColor,
  borderRadius: "50%",
  border: `3px solid ${textColor}`,
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out",
  display: "inline-block",
  boxShadow: `0px 6px 15px rgba(0, 0, 0, 0.15)`,
  fontSize: '1.2rem',
  width: '80px',
  height: '80px',
});

const sliderStyle = {
  width: '300px',
  height: '12px',
  appearance: 'none',
  background: '#ddd',
  borderRadius: '8px',
  outline: 'none',
  transition: 'background 0.3s ease-in-out',
  cursor: 'pointer',
};

export default Appearance;
