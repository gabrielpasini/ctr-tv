function removeAccents(value: string): string {
  const accentsDictionary = [
    { char: "A", base: /[\300-\306]/g },
    { char: "a", base: /[\340-\346]/g },
    { char: "E", base: /[\310-\313]/g },
    { char: "e", base: /[\350-\353]/g },
    { char: "I", base: /[\314-\317]/g },
    { char: "i", base: /[\354-\357]/g },
    { char: "O", base: /[\322-\330]/g },
    { char: "o", base: /[\362-\370]/g },
    { char: "U", base: /[\331-\334]/g },
    { char: "u", base: /[\371-\374]/g },
    { char: "N", base: /[\321]/g },
    { char: "n", base: /[\361]/g },
    { char: "C", base: /[\307]/g },
    { char: "c", base: /[\347]/g },
  ];

  return accentsDictionary.reduce(
    (previousValue, currentValue) =>
      previousValue.replace(currentValue.base, currentValue.char),
    value
  );
}

export function trim(value: string): string {
  return value.replace(/^\s+|\s+$/g, "");
}

function removeInvalidChars(value: string): string {
  return value
    .replaceAll("/", "-")
    .replace(/[^a-zA-Z0-9 -]/g, "")
    .replace(/ - /g, " ");
}

export function convertToSlug(value: string, isRoute?: boolean): string {
  if (value === "/") return "inicio";

  const text = removeAccents(trim(value));
  const slug = removeInvalidChars(text)
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return isRoute ? slug.substring(1, slug.length) : slug;
}

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function calculateAge(birthDate: string): number {
  const dateArr = birthDate.split("/").reverse();
  const dateBirthDate = new Date(
    Number(dateArr[0]),
    Number(dateArr[1]) - 1,
    Number(dateArr[2])
  );

  const diffMs = Date.now() - dateBirthDate.getTime();
  const ageDate = new Date(diffMs);

  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
