export function splitAccentHeading(input: string) {
  const match = input.match(/^(.*?)\[(.+?)\](.*)$/);

  if (!match) {
    return {
      before: input,
      accent: "",
      after: "",
    };
  }

  return {
    before: match[1],
    accent: match[2],
    after: match[3],
  };
}

