# Graphic Calculator App

The Graphic Calculator app is a web-based tool designed to plot mathematical equations on a graph. It provides an interactive interface where users can input equations in terms of the variable x and visualize the corresponding graph on a canvas element.

## How It Works

### User Interface

- The app's interface is built using HTML and styled with CSS. It includes an input field for entering equations and a button to plot the graph.
- The graph is displayed on an HTML `<canvas>` element, which allows for dynamic rendering of graphics.

### Equation Input

- Users can enter mathematical equations in the input field provided. The equations should be in terms of x (e.g., x^2 + x^3).

### Graph Plotting

- Upon clicking the **"Plot Graph"** button, the `drawGraph` function is triggered.
- This function retrieves the equation from the input field and compiles it using the Math.js library, which is included via a CDN.

### Canvas Rendering

- The app uses the canvas's 2D context to draw the graph.
- It calculates scale factors based on the defined x and y ranges to ensure the graph fits within the canvas dimensions.

### Gridlines and Axes

- The `drawGridlines` and `drawAxes` functions are responsible for rendering the grid and axes on the canvas, providing a reference framework for the plotted graph.

### Graph Plotting Logic

- The app iterates over each pixel along the x-axis, converts it to a mathematical x-coordinate, evaluates the equation, and plots the corresponding y-coordinate.
- It handles non-finite values and ensures that points outside the canvas are not drawn.

This setup allows users to visualize mathematical functions interactively, making it a useful tool for educational purposes or quick graphing needs.
