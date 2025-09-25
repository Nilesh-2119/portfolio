import React, { Suspense, lazy } from "react";
import Navbar from "./Components/Navbar";
import "./App.css";

const About = lazy(() => import("./Components/About"));
const Projects = lazy(() => import("./Components/Projects"));
const Skills = lazy(() => import("./Components/Skills"));
const Resume = lazy(() => import("./Components/Resume"));
const Contact = lazy(() => import("./Components/Contact"));

function App() {
  return (
    <div className="App">
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <About />
        <Projects />
        <Skills />
        <Resume />
        <Contact />
      </Suspense>
    </div>
  );
}

export default App;
