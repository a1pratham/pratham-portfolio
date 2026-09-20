import Section from '../../components/layout/Section/Section';
import certificates from '../../data/certificates';
import CertificateCarousel from './CertificateCarousel';

export default function Certifications() {
  return (
    <Section id="certifications" eyebrow="05 / Certifications" title="Certifications.">
      <CertificateCarousel items={certificates} />
    </Section>
  );
}
