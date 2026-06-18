/**
 * Recursively removes SurveyJS `pos` parser artifacts from a value.
 *
 * When SurveyJS deserializes form JSON, it attaches `pos` objects ( holding
 * `start` / `end` character offsets ) to the parsed nodes. For free-form object
 * properties such as `gridFieldsSettings`, these artifacts get serialized back
 * into the saved structure and nest one level deeper on every save cycle,
 * bloating the form definition by thousands of lines.
 *
 * `pos` is never a legitimate key in these settings, so it can be stripped
 * safely at any depth.
 *
 * Meant to run on plain, serialized JSON ( e.g. the output of `survey.toJSON()`
 * or `JSON.parse(survey.text)` ). A `WeakSet` guard is kept as a safety net so a
 * circular reference can never blow the call stack.
 *
 * @param value Value to clean ( object, array or primitive )
 * @param seen Internal set of already-visited objects ( cycle guard )
 * @returns A copy of the value without any `pos` key
 */
export const removePosArtifacts = <T>(value: T, seen = new WeakSet()): T => {
  if (!value || typeof value !== 'object') {
    return value;
  }
  if (seen.has(value as object)) {
    return value;
  }
  seen.add(value as object);
  if (Array.isArray(value)) {
    return value.map((item) => removePosArtifacts(item, seen)) as unknown as T;
  }
  return Object.entries(value as Record<string, any>).reduce(
    (acc, [key, val]) => {
      if (key !== 'pos') {
        acc[key] = removePosArtifacts(val, seen);
      }
      return acc;
    },
    {} as Record<string, any>
  ) as T;
};
