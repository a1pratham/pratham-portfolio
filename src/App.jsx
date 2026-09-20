import Background from './components/layout/Background/Background';
import Footer from './components/layout/Footer/Footer';
import Navbar from './components/layout/Navbar/Navbar';
import SkipLink from './components/ui/SkipLink/SkipLink';
import sections from './sections';

const navLinks = sections.filter((section) => section.inNav);

export default function App() {
  return (
    <>
      <SkipLink />
      <Background />
      <Navbar links={navLinks} />
      <main id="main">
        {sections.map(({ id, Component }) => <Component key={id} />)}
      </main>
      <Footer links={navLinks} />
    </>
  );
}
