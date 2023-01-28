const RANDOM_ID = "__d94f8999-0b3d-471a-85d8-35da4da8b32f__";
function findRightBracket({
  classes,
  brackets,
  start = 0,
  end = classes.length,
}) {
  let stack = 0;
  for (let index = start; index < end; index++) {
    if (classes[index] === brackets[0]) {
      stack += 1;
    } else if (classes[index] === brackets[1]) {
      if (stack === 0) return -1;
      if (stack === 1) return index;
      stack -= 1;
    }
  }

  return -1;
}

function parse({ classes, brackets, context = "", start = 0, end }) {
  if (classes === "") return [];

  const results = [];
  classes = classes.slice(start, end).trim();

  const reg = RegExp(
    `([\\w-]+:)|([\\w-./[\\]]+!?)|\\${brackets[0]}|(\\S+)`,
    "g"
  );

  let match;
  const baseContext = context;

  while ((match = reg.exec(classes))) {
    const [, variant, className, weird] = match;

    if (variant) {
      context += variant;

      // Skip empty classes
      if (/\s/.test(classes[reg.lastIndex])) {
        context = baseContext;
        continue;
      }

      if (classes[reg.lastIndex] === brackets[0]) {
        const closeBracket = findRightBracket({
          classes,
          brackets,
          start: reg.lastIndex,
        });
        results.push(
          ...parse({
            classes,
            brackets,
            context,
            start: reg.lastIndex + 1,
            end: closeBracket,
          })
        );
        reg.lastIndex = closeBracket + 1;
        context = baseContext;
      }
    } else if (className && className.includes("[")) {
      const closeBracket = findRightBracket({
        classes,
        brackets: ["[", "]"],
        start: match.index,
        end: classes.length,
      });
      const cssClass = classes.slice(match.index, closeBracket + 1);
      // Convert spaces in classes to a temporary string so the css won't be
      // split into multiple classes
      const spaceReplacedClass = cssClass
        // Normalise the spacing - single spaces only
        // Replace spaces with the space id stand-in
        // Remove newlines within the brackets to allow multiline values
        .replace(/\s+/g, RANDOM_ID);

      results.push(context + spaceReplacedClass);

      reg.lastIndex = closeBracket + 1;
      context = baseContext;
    } else if (className) {
      results.push(context + className);
      context = baseContext;
    } else if (weird) {
      results.push(context + weird);
    } else {
      const closeBracket = findRightBracket({
        classes,
        brackets,
        start: match.index,
      });
      results.push(
        ...parse({
          classes,
          brackets,
          context,
          start: match.index + 1,
          end: closeBracket,
        })
      );
      reg.lastIndex = closeBracket + 1;
    }
  }

  return results;
}

export default parse;
