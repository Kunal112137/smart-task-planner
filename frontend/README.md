# Smart Task Planner - Frontend

Modern React application for submitting goals and viewing AI-generated task plans.

## 🎨 Features

- **Beautiful UI** - Gradient backgrounds and smooth animations
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Feedback** - Loading states and error messages
- **Task Visualization** - Card-based layout with priority indicators
- **Easy Input** - Textarea with character counter and validation

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 🛠 Available Scripts

### `npm start`
Runs the app in development mode with hot reload.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Runs the test suite (if configured).

## 📁 Project Structure

```
src/
├── App.js                           # Main application component
├── App.css                          # App styles
├── components/
│   ├── GoalInput.js                # Goal input form component
│   ├── GoalInput.css               # Form styles
│   ├── TaskPlan.js                 # Task display component
│   └── TaskPlan.css                # Task display styles
├── services/
│   └── apiService.js               # Backend API integration
├── index.js                        # React entry point
└── index.css                       # Global styles
```

## 🔌 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Change this if your backend is running on a different URL.

## 🎯 Components

### GoalInput Component
- Text area for goal input
- Character counter (max 1000)
- Submit button with loading state
- Example goals for reference
- Input validation (min 10 characters)

### TaskPlan Component
- Displays generated tasks in grid layout
- Shows task priority with color coding
- Timeline and deadline information
- Dependency visualization
- Reset button to create new plan

## 🎨 Styling

The app uses CSS with:
- **CSS Grid** - Responsive task layout
- **Flexbox** - Component layout
- **Gradients** - Modern backgrounds
- **Animations** - Smooth transitions
- **CSS Variables** - Easy theme customization

### Color Scheme
- **Primary**: #667eea (Purple-blue)
- **Secondary**: #764ba2 (Dark purple)
- **High Priority**: #c33 (Red)
- **Medium Priority**: #997600 (Orange)
- **Low Priority**: #2e7d32 (Green)

## 🔄 Component Flow

```
App
├── GoalInput (when no plan)
│   ├── Form input
│   └── Validation
└── TaskPlan (when plan generated)
    ├── Task cards
    ├── Stats display
    └── Reset button
```

## 🧪 Testing the Frontend

1. Start the development server: `npm start`
2. Open `http://localhost:3000` in your browser
3. Make sure backend is running on `http://localhost:5000`
4. Try entering a goal like "Build a website in 2 weeks"
5. View the generated tasks

## 📱 Responsive Design

The app is fully responsive with breakpoints for:
- **Desktop**: Full grid layout (3 columns)
- **Tablet**: 2 columns
- **Mobile**: Single column with optimized spacing

## 🐛 Common Issues

### API Connection Error
```
Error: Failed to generate plan
```
**Solution**: 
- Check if backend is running on port 5000
- Verify REACT_APP_API_URL in .env
- Check CORS settings in backend

### Blank Screen
```
No tasks displayed after submission
```
**Solution**:
- Check browser console for errors
- Ensure API key is configured in backend
- Verify network tab for API response

### Styling Issues
```
CSS not loading or styles look broken
```
**Solution**:
- Clear browser cache (Ctrl+Shift+R)
- Restart development server
- Check CSS files are in correct locations

## 🚀 Production Build

```bash
# Create optimized production build
npm run build

# Serve production build locally (requires serve package)
npx serve -s build
```

## 📦 Dependencies

- **react** - UI library
- **react-dom** - React DOM utilities
- **axios** - HTTP client for API calls
- **react-scripts** - Create React App build tools

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [Axios Docs](https://axios-http.com/)
- [CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Create React App Docs](https://create-react-app.dev/)

## 🤝 Development Tips

- Use React DevTools browser extension for debugging
- Check Network tab in DevTools to see API requests
- Use Console for error messages and debugging
- Edit components and see changes instantly (Hot Reload)

## 📞 Support

For frontend-specific issues:
1. Check browser console for error messages
2. Verify backend API is running
3. Check environment configuration
4. Review component props and state

---

**Frontend for Smart Task Planner**  
*Created with React and styled for modern UX*
