const base = {
  font: 'Saira Condensed',
  fill: '#ffffff',
  fontSize: 16,
  lineHeight: 20
};

export default {
  header: {
    ...base,
    fontSize: 48,
    lineHeight: 58
  },
  subheader: {
    ...base,
    fontSize: 32,
    lineHeight: 40
  },
  title: {
    ...base,
    fontSize: 24,
    lineHeight: 28
  },
  subtitle: {
    ...base,
    fontSize: 20,
    lineHeight: 24
  },
  subtitleAlt: {
    ...base,
    fontSize: 18,
    lineHeight: 22
  },
  body: {
    ...base
  },
  caption: {
    ...base,
    fontSize: 16,
    lineHeight: 20
  },
  em: {
    fontStyle: 'italic'
  },
  strong: {
    fontWeight: 'bold'
  }
};
