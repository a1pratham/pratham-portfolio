/** "mailto:me@x.com?subject=Hi" -> "me@x.com" */
export function getEmailAddress(mailto) {
  return mailto.replace(/^mailto:/, '').split('?')[0];
}

/** "https://github.com/a1pratham" -> "a1pratham"; "https://linkedin.com/in/x" -> "in/x" */
export function getHandle(href) {
  return new URL(href).pathname.replace(/^\/|\/$/g, '');
}
