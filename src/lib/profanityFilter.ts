/**
 * Profanity filter for The Final Reel application
 * Provides utilities for checking and filtering inappropriate content
 */

// List of words to filter - intentionally using common patterns and variations
const PROFANITY_LIST: string[] = [
  'anal', 'anus', 'arse', 'ass', 'a55', 
  'ballsack', 'balls', 'bastard', 'bitch', 'b1tch',
  'blowjob', 'blow', 'boob', 'buttplug', 'butt',
  'c0ck', 'cock', 'coon', 'cunt', 'cum', 'damn',
  'd1ck', 'dick', 'dildo', 'dyke', 'f4nny', 'fag',
  'feck', 'felching', 'fellate', 'fellatio', 
  'fuck', 'f u c k', 'fudgepacker', 'fudge', 'flange',
  'homo', 'jerk', 'jizz', 'knobend', 'knob', 
  'labia', 'muff', 'n1gga', 'n1gger', 'nigger', 
  'penis', 'piss', 'poop', 'pussy', 'p*ssy', 'porn', 
  'pube', 'pussy', 'queer', 'retard', 'scrotum', 
  'sex', 'sh1t', 'shit', 's hit', 'sht', 'sh!t', 'slut', 
  'smegma', 'spunk', 'tit', 'turd', 'twat', 'vagina', 
  'wank', 'whore', 
];

// Words that might be allowed in certain contexts (common words that could be part of profanity)
const CONTEXTUAL_EXCEPTIONS = [
  'assign', 'assassin', 'cocktail', 'cockerel', 'document', 'shitake', 
  'analysis', 'analytics', 'assess', 'assets', 'basement', 'assist', 'associate',
  'class', 'classic', 'pass', 'passion', 'passport', 'construction', 'hello'
];

// Characters that are often used to substitute letters to bypass filters
const SUBSTITUTION_MAP: Record<string, string> = {
  '0': 'o', '1': 'i', '2': 'z', '3': 'e', '4': 'a', '5': 's', '6': 'b', 
  '7': 't', '8': 'b', '9': 'g', '@': 'a', '$': 's', '*': 'i', '!': 'i',
  '+': 't', '(': 'c', ')': 'o', '#': 'h', '%': 'x'
};

/**
 * Normalizes text to make filter evasion more difficult 
 * @param text The text to normalize
 * @returns Normalized text
 */
const normalizeText = (text: string): string => {
  // Convert to lowercase
  let normalized = text.toLowerCase();
  
  // Remove diacritics (accents)
  normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Replace character substitutions
  for (const [substitute, original] of Object.entries(SUBSTITUTION_MAP)) {
    normalized = normalized.split(substitute).join(original);
  }
  
  // Remove repeated characters (e.g., "fuuuuck" -> "fuck")
  normalized = normalized.replace(/(.)\1+/g, '$1$1');
  
  // Remove spaces between letters (e.g., "f u c k" -> "fuck")
  normalized = normalized.replace(/\s+/g, '');
  
  // Remove non-alphanumeric characters
  normalized = normalized.replace(/[^a-z0-9]/g, '');
  
  return normalized;
};

/**
 * Checks if a word is profane
 * @param word The word to check
 * @returns True if the word is profane
 */
const isProfaneWord = (word: string): boolean => {
  // Don't check very short words (less than 3 chars)
  if (word.length < 3) return false;
  
  // Check against normalized profanity list
  const normalizedWord = normalizeText(word);
  
  // Exact matches
  if (PROFANITY_LIST.includes(normalizedWord)) {
    // Check if it's a contextual exception
    return !CONTEXTUAL_EXCEPTIONS.some(exception => 
      normalizedWord === normalizeText(exception)
    );
  }
  
  // Check for profanity with characters in between
  return PROFANITY_LIST.some(profanity => {
    const profanityNormalized = normalizeText(profanity);
    
    // Avoid very short profanity words to prevent false positives
    if (profanityNormalized.length < 4) {
      return normalizedWord === profanityNormalized;
    }
    
    // Check if profanity is embedded in the word
    return (
      normalizedWord.includes(profanityNormalized) &&
      !CONTEXTUAL_EXCEPTIONS.some(exception => 
        normalizedWord.includes(normalizeText(exception))
      )
    );
  });
};

/**
 * Checks if text contains profanity
 * @param text The text to check
 * @returns True if the text contains profanity
 */
export const containsProfanity = (text: string): boolean => {
  if (!text || typeof text !== 'string') return false;
  
  // Split into words and check each word
  const words = text.split(/\s+/);
  return words.some(isProfaneWord);
};

/**
 * Checks if a username is appropriate
 * @param username The username to check
 * @returns True if the username is acceptable (no profanity)
 */
export const isValidUsername = (username: string): boolean => {
  if (!username || username.length < 3) return false;
  
  // Check for profanity in the username
  if (containsProfanity(username)) return false;
  
  // Ensure username contains only allowed characters
  const validUsernameRegex = /^[a-zA-Z0-9_.-]+$/;
  return validUsernameRegex.test(username);
};

/**
 * Removes profanity from text by replacing it with asterisks
 * @param text The text to filter
 * @returns Filtered text with profanity replaced by asterisks
 */
export const filterProfanity = (text: string): string => {
  if (!text || typeof text !== 'string') return text;
  
  let filteredText = text;
  
  // Split into words and censor profane words
  const words = text.split(/(\s+)/);
  
  for (let i = 0; i < words.length; i++) {
    if (words[i].trim().length === 0) continue;
    
    if (isProfaneWord(words[i])) {
      const firstChar = words[i][0];
      const lastChar = words[i][words[i].length - 1];
      const middleLength = words[i].length - 2;
      
      // Replace middle characters with asterisks
      if (middleLength > 0) {
        words[i] = firstChar + '*'.repeat(middleLength) + lastChar;
      } else {
        words[i] = '*'.repeat(words[i].length);
      }
    }
  }
  
  return words.join('');
}; 