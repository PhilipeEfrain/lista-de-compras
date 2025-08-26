export const lightTheme = {
  // Main colors
  primary: '#1976d2',
  success: '#4caf50',
  danger: '#dc3545',
  warning: '#ff9800',
  
  // Background colors
  background: '#ffffff',
  surface: '#f5f5f5',
  card: '#ffffff',
  modal: '#ffffff',
  
  // Text colors
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
    inverse: '#ffffff',
  },
  
  // Border colors
  border: '#e0e0e0',
  divider: '#eeeeee',
  
  // States
  states: {
    got: '#c8e6c9',
    missing: '#ffcdd2',
    disabled: '#eeeeee',
  },
  
  // Shadows
  shadow: {
    color: '#000000',
    opacity: 0.25,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },

};



export const darkTheme = {
    // Main colors
  primary: '#80b3ff', // Pastel blue
  success: '#98d8bf', // Pastel green
  danger: '#ffb3b3',  // Pastel red
  warning: '#ffd4a0', // Pastel orange
  
  // Background colors
  background: '#2a2d3d', // Softer dark background
  surface: '#363b4f',    // Softer surface
  card: '#3f445c',       // Softer cards
  modal: '#3f445c',      // Softer modals
  
  // Text colors
  text: {
    primary: '#e6e6fa',    // Softer main text
    secondary: '#b8b8d1',  // Softer secondary text
    disabled: '#808099',   // Softer disabled text
    inverse: '#2a2d3d',    // Inverse text
  },
  
  // Border colors
  border: '#4a4f68',     // Softer border
  divider: '#4a4f68',    // Softer divider
  
  // States
  states: {
    got: '#334d40',      // Softer dark green
    missing: '#4d3333',  // Softer dark red
    disabled: '#3f445c', // Softer disabled
  },
  
  // Shadows
  shadow: {
    color: '#000000',
    opacity: 0.5,
  },

    spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

export type Theme = typeof lightTheme;
