export async function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeWords(str: string) {
    // Split the string into words
    const words = str.split(' ');
  
    // Capitalize the first letter of each word
    const capitalizedWords = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
  
    // Join the words back together into a string
    const capitalizedString = capitalizedWords.join(' ');
  
    return capitalizedString;
  }