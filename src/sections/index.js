import About from './About/About';
import Certifications from './Certifications/Certifications';
import Contact from './Contact/Contact';
import Education from './Education/Education';
import Hero from './Hero/Hero';
import Projects from './Projects/Projects';
import Skills from './Skills/Skills';

/**
 * Single source of truth for page sections: render order, anchor ids and
 * whether a section appears in the navigation.
 */
const sections = [
  {
    id: 'top', label: 'Home', Component: Hero, inNav: false,
  },
  {
    id: 'about', label: 'About', Component: About, inNav: true,
  },
  {
    id: 'projects', label: 'Projects', Component: Projects, inNav: true,
  },
  {
    id: 'skills', label: 'Skills', Component: Skills, inNav: true,
  },
  {
    id: 'education', label: 'Education', Component: Education, inNav: true,
  },
  {
    id: 'certifications', label: 'Certifications', Component: Certifications, inNav: true,
  },
  {
    id: 'contact', label: 'Contact', Component: Contact, inNav: true,
  },
];

export default sections;
