import Section from '../../components/layout/Section/Section';
import Button from '../../components/ui/Button/Button';
import Reveal from '../../components/ui/Reveal/Reveal';
import { projects, social } from '../../data';
import ProjectCard from './ProjectCard';
import styles from './Projects.module.css';

const githubProfile = social.find((item) => item.network === 'github')?.href;

export default function Projects() {
  return (
    <Section id="projects" eyebrow="02 / Projects" title="Selected projects.">
      <div className={styles.list}>
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
      {githubProfile && (
        <Reveal className={styles.more}>
          <Button href={`${githubProfile}?tab=repositories`} variant="ghost" icon="arrow" external>
            More on GitHub
          </Button>
        </Reveal>
      )}
    </Section>
  );
}
