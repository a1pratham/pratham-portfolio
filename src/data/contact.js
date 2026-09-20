import { getEmailAddress, getHandle } from '../utils/social';
import site from './site';
import socialJson from './social.json';

const hrefOf = (network) => socialJson.social.find((item) => item.network === network).href;

export const mailto = hrefOf('email');
export const email = getEmailAddress(mailto);

export const profileLinks = [
  { network: 'linkedin', label: 'LinkedIn' },
  { network: 'github', label: 'GitHub' },
].map(({ network, label }) => ({
  network, label, href: hrefOf(network), handle: getHandle(hrefOf(network)),
}));

export const resumeLink = { label: site.resume.label, href: site.resume.href, handle: 'PDF' };
