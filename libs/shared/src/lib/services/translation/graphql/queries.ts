import { gql } from 'apollo-angular';

/**
 *
 */
export const TRANSLATE_TEXT_QUERY = gql`
  query TranslateText($text: String!, $from: String, $to: String!) {
    translateText(text: $text, from: $from, to: $to)
  }
`;
